import defaultAvatar from '../assets/images/default-avatar.png';

export default (userAvatar: string | undefined) => (userAvatar ? userAvatar : defaultAvatar);
