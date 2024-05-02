import defaultAvatar from '../assets/images/default-avatar.png';

export default (userAvatar: string) => (userAvatar ? userAvatar : defaultAvatar);
