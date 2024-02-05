const steamUrl = import.meta.env.VITE_STEAM_AUTH_URL;

export const SteamAuth = () => {
  window.open(`${steamUrl}/auth/steam`, '_self');
};
