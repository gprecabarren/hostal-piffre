export function BotanicalArtwork({ variant = 0 }: { variant?: number }) {
  return (
    <svg className={`botanical-art botanical-art--${variant}`} viewBox="0 0 600 650" fill="none" aria-hidden="true">
      <defs>
        <pattern id={`grain-${variant}`} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill="currentColor" opacity=".16" /></pattern>
        <linearGradient id={`arch-${variant}`} x1="300" y1="60" x2="300" y2="580" gradientUnits="userSpaceOnUse"><stop stopColor="#ebe9cd" /><stop offset="1" stopColor="#d1d5b2" /></linearGradient>
      </defs>
      <circle cx="304" cy="280" r="235" stroke="currentColor" strokeOpacity=".2" strokeDasharray="2 8" />
      <path d="M114 557V264C114 159 198 75 301 75s187 84 187 189v293H114Z" fill={`url(#arch-${variant})`} />
      <path d="M140 557V268c0-90 71-163 161-163s161 73 161 163v289H140Z" stroke="#5f7155" strokeOpacity=".45" />
      <path d="M198 557V291a103 103 0 0 1 206 0v266H198Z" fill="#38513b" />
      <path d="M214 541V291a87 87 0 0 1 174 0v250H214Z" stroke="#f4f0d9" strokeOpacity=".5" />
      <path d="M301 205v112M215 291h173M225 248l76 43 76-43" stroke="#f4f0d9" strokeOpacity=".5" />
      <path d="M231 338h140v169H231zM301 339v168" stroke="#f4f0d9" strokeOpacity=".3" />
      <circle cx="351" cy="424" r="5" fill="#d8ce99" />
      <path d="M174 557h253l24 23H150l24-23ZM150 580h301l26 24H126l24-24Z" fill="#b0bb91" stroke="#5f7155" strokeOpacity=".3" />
      <path d="M50 605h499" stroke="currentColor" strokeOpacity=".4" />
      <path d="M115 560c-8-59-28-118-23-174m22 157c-36-24-53-56-55-83m48 47c28-32 41-66 35-96m-33 74c-31-45-42-79-33-113m39 161c30-15 50-37 54-64" stroke="#526b43" strokeWidth="3" />
      <g fill="#6b7e4e"><ellipse cx="69" cy="471" rx="13" ry="29" transform="rotate(-35 69 471)" /><ellipse cx="86" cy="396" rx="12" ry="29" transform="rotate(-16 86 396)" /><ellipse cx="133" cy="432" rx="13" ry="31" transform="rotate(27 133 432)" /><ellipse cx="155" cy="490" rx="12" ry="27" transform="rotate(42 155 490)" /><ellipse cx="84" cy="521" rx="12" ry="25" transform="rotate(-45 84 521)" /></g>
      <path d="m82 554 8 49h49l8-49H82Z" fill="#c4b596" /><path d="M80 554h69v10H80z" fill="#d4c6a8" />
      <path d="M476 564c0-60 14-115 38-157m-33 125c31-21 51-47 57-73m-49 30c-19-24-23-55-18-83m11 138c-21-12-39-36-40-62" stroke="#526b43" strokeWidth="3" />
      <g fill="#7a8858"><ellipse cx="510" cy="420" rx="12" ry="29" transform="rotate(30 510 420)" /><ellipse cx="526" cy="480" rx="12" ry="29" transform="rotate(39 526 480)" /><ellipse cx="470" cy="427" rx="11" ry="28" transform="rotate(-10 470 427)" /><ellipse cx="452" cy="501" rx="11" ry="25" transform="rotate(-33 452 501)" /></g>
      <path d="m449 558 9 46h44l9-46h-62Z" fill="#8a9970" /><path d="M446 556h68v10h-68z" fill="#a3b188" />
      <circle cx="453" cy="123" r="32" fill="#c3b46f" />
      <path d="m463 49 5 13m38 11-10 10m31 33-14 3m-1 43-12-7M409 65l10 10" stroke="#9e965f" strokeWidth="1.7" />
      <path d="M72 227c7-8 15-8 22 0 7-8 15-8 22 0M473 282c7-8 15-8 22 0 7-8 15-8 22 0" stroke="#627253" strokeWidth="2" strokeLinecap="round" />
      <path d="M114 557V264C114 159 198 75 301 75s187 84 187 189v293H114Z" fill={`url(#grain-${variant})`} />
    </svg>
  );
}

export function RoomPlaceholder({ index, label }: { index: number; label: string }) {
  return <div className={`room-placeholder room-placeholder--${index % 3}`}>
    <svg viewBox="0 0 400 300" fill="none" aria-hidden="true">
      <path d="M95 259V135a105 105 0 0 1 210 0v124H95Z" stroke="currentColor" strokeOpacity=".25" />
      <path d="M113 259V135a87 87 0 0 1 174 0v124H113ZM200 48v211M113 135h174" stroke="currentColor" strokeOpacity=".25" />
      <circle cx={index % 2 ? 241 : 157} cy="100" r="22" fill="currentColor" opacity=".16" />
      <path d="M67 260h266M271 260c-4-50 1-79 17-107m-15 78c23-14 34-32 36-50m-36 34c-22-19-27-39-23-58" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" />
      <g fill="currentColor" opacity=".25"><ellipse cx="283" cy="165" rx="9" ry="20" transform="rotate(25 283 165)" /><ellipse cx="300" cy="195" rx="8" ry="20" transform="rotate(42 300 195)" /><ellipse cx="253" cy="171" rx="8" ry="20" transform="rotate(-14 253 171)" /></g>
      <path d="m253 245 5 29h31l5-29h-41Z" fill="currentColor" opacity=".22" />
    </svg>
    <span>{label}</span>
  </div>;
}
