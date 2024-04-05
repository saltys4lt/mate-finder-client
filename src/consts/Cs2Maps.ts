import Option from '../types/Option';
import mirage from '../assets/images/maps/mirage.webp';
import dust2 from '../assets/images/maps/dust2.webp';
import inferno from '../assets/images/maps/inferno.webp';
import overpass from '../assets/images/maps/overpass.webp';
import anubis from '../assets/images/maps/anubis.webp';
import nuke from '../assets/images/maps/nuke.webp';
import vertigo from '../assets/images/maps/vertigo.webp';

export default [
  { id: 1, value: 'Mirage', label: 'Mirage', image: mirage },
  { id: 2, value: 'Dust 2', label: 'Dust 2', image: dust2 },
  { id: 3, value: 'Inferno', label: 'Inferno', image: inferno },
  { id: 4, value: 'Overpass', label: 'Overpass', image: overpass },
  { id: 5, value: 'Anubis', label: 'Anubis', image: anubis },
  { id: 6, value: 'Nuke', label: 'Nuke', image: nuke },
  { id: 7, value: 'Vertigo', label: 'Vertigo', image: vertigo },
] as Option[];
