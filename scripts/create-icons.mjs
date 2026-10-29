import fs from 'node:fs/promises';
import sharp from 'sharp';

// The official mark is framed by the SVG viewport, preserving the source logo.
// Remove the lettering only from the icon framing, where it is illegible at 16px.
const officialLogo = await sharp('public/brand/logo.webp').png().toBuffer();
const frame = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="127 70 464 464"><image width="720" height="906" href="data:image/png;base64,${officialLogo.toString('base64')}"/></svg>`;
const mark = await sharp(Buffer.from(frame)).png().toBuffer();
const stats = await sharp(mark).stats();
if (stats.channels[3]?.max === 0) throw new Error('The official mark did not render.');
const embeddedIcon = await sharp(mark).resize(192, 192).png({ palette: true, colours: 64, compressionLevel: 9 }).toBuffer();
await fs.writeFile('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192"><image width="192" height="192" href="data:image/png;base64,${embeddedIcon.toString('base64')}"/></svg>`);
for (const size of [48, 96, 192]) {
  await sharp(mark).resize(size, size).png({ palette: true, colours: 128, compressionLevel: 9 }).toFile(`public/favicon-${size}.png`);
}
await sharp(mark).resize(180, 180).png({ compressionLevel: 9 }).toFile('public/apple-touch-icon.png');

// ICO supports PNG frames; include the native sizes used by desktop browsers.
const sizes = [16, 32, 48, 64, 128, 256];
const frames = await Promise.all(sizes.map(size => sharp(mark).resize(size, size).png({ palette: true, colours: 128, compressionLevel: 9 }).toBuffer()));
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, index) => {
  const start = 6 + index * 16;
  header[start] = sizes[index] === 256 ? 0 : sizes[index];
  header[start + 1] = sizes[index] === 256 ? 0 : sizes[index];
  header.writeUInt16LE(1, start + 4);
  header.writeUInt16LE(32, start + 6);
  header.writeUInt32LE(frame.length, start + 8);
  header.writeUInt32LE(offset, start + 12);
  offset += frame.length;
});
await fs.writeFile('public/favicon.ico', Buffer.concat([header, ...frames]));
console.log('Official logo icons: SVG, ICO (16/32/48/64/128/256), PNG (48/96/192), Apple (180).');
