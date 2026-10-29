import fs from 'node:fs/promises';

// Local, reproducible rendering of ODbL street geometry. No runtime map requests.
const choices = {
  providencia: ['Los Capitanes', 'Avenida Manuel Montt', 'Avenida Santa Isabel', 'Avenida Antonio Varas', 'Dalmacia', 'José Luis Aguilar', 'Eduardo de la Barra'],
  'santiago-centro': ['Avenida Vicuña Mackenna', 'Avenida General Bustamante', 'Argomedo', 'Virreinato', 'Avenida Santa Isabel', 'Fray Camilo Henríquez', 'Almirante Riveros', 'Almirante Grau'],
};
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const roadWidth = kind => /primary/.test(kind) ? 25 : /secondary/.test(kind) ? 21 : /tertiary/.test(kind) ? 16 : 10;
const intersects = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
await fs.mkdir('public/maps', { recursive: true });

for (const slug of Object.keys(choices)) {
  const data = JSON.parse(await fs.readFile(`scripts/map-data/${slug}.json`, 'utf8'));
  for (const variant of ['wide', 'square', 'mini']) {
    const width = variant === 'wide' ? 1000 : variant === 'square' ? 600 : 160;
    const height = variant === 'wide' ? 334 : width;
    const metresAcross = variant === 'wide' ? 1200 : variant === 'square' ? 800 : 650;
    const scale = width / metresAcross;
    const metresPerLongitude = 111320 * Math.cos(data.center[1] * Math.PI / 180);
    const project = ([longitude, latitude]) => [width/2 + (longitude-data.center[0])*metresPerLongitude*scale, height/2 - (latitude-data.center[1])*111320*scale];
    const paths = data.features.map(f => ({...f, points: f.coordinates.map(project)}));
    const path = points => points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('');
    const parks = paths.filter(f=>f.kind==='park').map(f=>`<path d="${path(f.points)}Z" fill="#b9cba2" stroke="#aec295" stroke-width="1"/>`).join('');
    const roads = paths.filter(f=>f.kind!=='park').sort((a,b)=>roadWidth(a.kind)-roadWidth(b.kind));
    const edges = roads.map(f=>`<path d="${path(f.points)}" stroke="#ccd5bc" stroke-width="${(roadWidth(f.kind)*scale+2).toFixed(1)}"/>`).join('');
    const streets = roads.map(f=>`<path d="${path(f.points)}" stroke="${/primary|secondary/.test(f.kind)?'#fffbed':'#f8f7ed'}" stroke-width="${(roadWidth(f.kind)*scale).toFixed(1)}"/>`).join('');
    const labelBoxes = [{x:width/2-30,y:height/2-45,w:60,h:65}];
    const labels = [];
    if (variant !== 'mini') {
      for (const name of choices[slug]) {
        const font = variant === 'wide' ? 15 : 17;
        const short = name.replace(/^Avenida Vicuña Mackenna$/,'Vicuña Mackenna').replace(/^Avenida /,'Av. ').replace('General Bustamante','Gral. Bustamante').replace('Fray Camilo Henríquez','Fray Camilo H.');
        const textWidth = short.length * font * .51;
        const candidates = [];
        for (const feature of roads.filter(f=>f.name===name)) {
          for (let i=1;i<feature.points.length;i++) {
            const [x1,y1]=feature.points[i-1], [x2,y2]=feature.points[Math.min(i+3,feature.points.length-1)];
            const distance=Math.hypot(x2-x1,y2-y1);
            if(distance<25)continue;
            let angle=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
            if(angle>90)angle-=180; if(angle< -90)angle+=180;
            for(const fraction of [.5,.3,.7]) {
              const x=x1+(x2-x1)*fraction, y=y1+(y2-y1)*fraction;
              const radians=angle*Math.PI/180;
              const w=Math.abs(Math.cos(radians))*textWidth+Math.abs(Math.sin(radians))*font;
              const h=Math.abs(Math.sin(radians))*textWidth+Math.abs(Math.cos(radians))*font;
              const box={x:x-w/2-5,y:y-h/2-5,w:w+10,h:h+10};
              if(box.x<14||box.y<14||box.x+box.w>width-14||box.y+box.h>height-14)continue;
              if(labelBoxes.some(b=>intersects(box,b)))continue;
              candidates.push({x,y,angle,box,score:distance});
            }
          }
        }
        const best=candidates.sort((a,b)=>b.score-a.score)[0];
        if(best){ labelBoxes.push(best.box); labels.push(`<text x="${best.x.toFixed(1)}" y="${best.y.toFixed(1)}" transform="rotate(${best.angle.toFixed(1)} ${best.x.toFixed(1)} ${best.y.toFixed(1)})" text-anchor="middle" dominant-baseline="central" font-size="${font}" fill="#4c6345" stroke="#faf9ef" stroke-width="4" paint-order="stroke" stroke-linejoin="round">${escape(short)}</text>`); }
      }
    }
    const pinScale=variant==='mini'?.75:1;
    const pin=`<g transform="translate(${width/2} ${height/2}) scale(${pinScale})"><circle r="30" fill="#233e2d" opacity=".08"/><circle r="18" fill="#233e2d" opacity=".09"/><path d="M0 0S-18-18-18-30a18 18 0 1 1 36 0C18-18 0 0 0 0Z" fill="#233e2d" stroke="#faf8ec" stroke-width="3"/><circle cy="-30" r="6" fill="#faf8ec"/></g>`;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${escape(slug==='providencia'?'Los Capitanes 1253, Providencia':'Av. Vicuña Mackenna 625, Santiago')}</title><desc>Street geometry © OpenStreetMap contributors, ODbL 1.0. https://www.openstreetmap.org/copyright. Data retrieved ${data.retrieved}.</desc><rect width="100%" height="100%" fill="#e2e7d5"/>${parks}<g fill="none" stroke-linecap="round" stroke-linejoin="round">${edges}${streets}</g><g font-family="Manrope,Arial,sans-serif" font-weight="500">${labels.join('')}</g>${pin}</svg>`;
    await fs.writeFile(`public/maps/${slug}-${variant}.svg`,svg);
    console.log(slug, variant, svg.length, 'bytes;',labels.length,'street labels');
  }
}
