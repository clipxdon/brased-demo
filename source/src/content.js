export const STEPS = [
  { n: '01', title: 'Taglio', text: 'Ogni rivestimento viene tagliato in laboratorio a Bra, pezzo per pezzo, sulle misure della seduta.' },
  { n: '02', title: 'Cucito', text: 'Le cuciture sono fatte a mano dai nostri tappezzieri: è lì che si vede la differenza, anche dopo anni.' },
  { n: '03', title: 'Imbottitura', text: 'Poliuretano schiumato a freddo a densità differenziate. Su richiesta, imbottiture su misura.' },
  { n: '04', title: 'Assemblaggio', text: 'Basamento, pistone, meccanismo sincron e scocca: montati e collaudati prima di uscire dall’officina.' },
]

export const COLLECTIONS = [
  { name: 'Direzionali e semidirezionali', count: 22, models: 'Atlanta · Athena · Deimos · Master · Pegaso · Omega · Still', tag: 'Per chi guida' },
  { name: 'Operative', count: 14, models: 'Net · Grey · Gulliver · Spring · Smart · Linea · Bit', tag: 'Otto ore, bene' },
  { name: 'Sala riunione', count: 13, models: 'Lord · Wait · Friend · Jolly · Clip 300 · Top', tag: 'Attorno al tavolo' },
  { name: 'Attesa', count: 21, models: 'Quadria · Quadria Modulari · Lord · Wait · Euro · Poker', tag: 'Il primo benvenuto' },
  { name: 'Comunità', count: 11, models: 'Poker · Euro Faggio · Clip 300 · Arco · Selena · Shell · Six · Wind', tag: 'Mense e circoli' },
  { name: 'Panche e sgabelli', count: 10, models: 'Poker 501 · Selena · Six · Gulliver · Ergo · Quadria', tag: 'Laboratori e spazi comuni' },
  { name: 'Tavoli e tavolini', count: 6, models: 'Performance 3040 · Quadria · fissi e pieghevoli', tag: 'Completano lo spazio' },
]

export const MODELS = [
  {
    name: 'Atlanta', cat: 'Direzionale', shape: 'exec',
    text: 'Design raffinato, materiali preziosi e finiture accurate, per ambienti eleganti e per chi esige qualcosa in più.',
    specs: ['Sedile e schienale in pelle', 'Base girevole o cantilever cromata', 'Con o senza braccioli'],
  },
  {
    name: 'Deimos', cat: 'Direzionale con poggiatesta', shape: 'head',
    text: 'Struttura in multistrato e imbottitura a quote differenziate, per lunghe giornate di decisioni.',
    specs: ['Meccanismo sincron antiritorno', 'Schienale regolabile up-down', 'Braccioli cromati regolabili'],
  },
  {
    name: 'Net', cat: 'Operativa', shape: 'mesh',
    text: 'Schienale in rete traspirante e sedile schiumato a freddo: la seduta da lavoro, ripensata.',
    specs: ['Poggiareni regolabile', 'Syncron multiblock', 'Base 5 razze nera o cromata'],
  },
  {
    name: 'Quadria', cat: 'Attesa modulare', shape: 'sofa',
    text: 'Forma semplice e lineare che si compone: poltrona, divano a 2 o 3 posti, angolo, pouf, vis-à-vis.',
    specs: ['Ignifuga in classe 1', 'Con o senza tavolino', 'Telaio in tubo d’acciaio'],
  },
]
