import ClientUser from '../types/ClientUser';

export const checkUserGameProfile = (user: ClientUser) => {
  if (user.cs2_data && user.valorant_data) return 2;
  else if (user.cs2_data && !user.valorant_data) return 1;
  else if (!user.cs2_data && user.valorant_data) return 0;
  else return -1;
};
