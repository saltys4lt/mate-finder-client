import PlayersTable from '../components/PlayersTable';
import MapsTable from '../components/MapsTable';
type Tables = {
  [path: string]: React.ComponentType<any>;
};
const Table: Tables = {
  '/players': PlayersTable,
  '/maps': MapsTable,
};

export default Table;
