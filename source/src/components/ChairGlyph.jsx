// Line-drawn product glyphs with a dashed "stitch" accent. Placeholders until the full site gets real 3D models / new photography.
const base = (
  <g className="g-metal">
    <path d="M100 168 V196" />
    <path d="M100 196 L52 214 M100 196 L148 214 M100 196 L76 222 M100 196 L124 222" />
    <circle cx="52" cy="216" r="4" /><circle cx="148" cy="216" r="4" /><circle cx="76" cy="224" r="4" /><circle cx="124" cy="224" r="4" />
  </g>
)

const shapes = {
  exec: (
    <>
      <rect className="g-fab" x="56" y="34" width="88" height="104" rx="22" />
      <rect className="g-stitch" x="64" y="42" width="72" height="88" rx="16" />
      <rect className="g-fab" x="46" y="136" width="108" height="30" rx="14" />
      <path className="g-metal" d="M40 150 V118 H58 M160 150 V118 H142" />
      {base}
    </>
  ),
  head: (
    <>
      <rect className="g-fab" x="74" y="12" width="52" height="22" rx="10" />
      <rect className="g-fab" x="58" y="40" width="84" height="96" rx="18" />
      <path className="g-stitch" d="M66 60 H134 M66 88 H134 M66 116 H134" />
      <rect className="g-fab" x="48" y="136" width="104" height="28" rx="13" />
      <path className="g-metal" d="M42 148 V120 H60 M158 148 V120 H140" />
      {base}
    </>
  ),
  mesh: (
    <>
      <path className="g-metal" d="M62 40 Q100 26 138 40 L132 132 Q100 140 68 132 Z" />
      <path className="g-mesh" d="M70 52 L130 52 M69 64 L131 64 M68 76 L132 76 M68 88 L132 88 M68 100 L132 100 M69 112 L131 112 M70 124 L130 124 M80 44 V134 M92 40 V136 M104 39 V137 M116 40 V136 M126 44 V134" />
      <rect className="g-fab" x="50" y="138" width="100" height="26" rx="12" />
      <rect className="g-stitch" x="56" y="143" width="88" height="16" rx="8" />
      {base}
    </>
  ),
  sofa: (
    <>
      <rect className="g-fab" x="20" y="88" width="160" height="60" rx="8" />
      <path className="g-stitch" d="M100 96 V140" />
      <rect className="g-fab" x="10" y="110" width="24" height="70" rx="6" />
      <rect className="g-fab" x="166" y="110" width="24" height="70" rx="6" />
      <rect className="g-fab" x="30" y="146" width="140" height="30" rx="8" />
      <path className="g-metal" d="M22 180 V212 M178 180 V212 M22 212 H178" />
    </>
  ),
}

export default function ChairGlyph({ shape }) {
  return (
    <svg className="glyph" viewBox="0 0 200 232" role="img" aria-hidden="true">
      {shapes[shape]}
    </svg>
  )
}
