import CsGoData from "./CsgoData";
import Team from "./Team";
import ValorantData from "./ValorantData";

export default interface User{
    nickname:string,
    email:string,
    password:string,
    user_avatar:string,
    description?:string,
    gender:string,
    birthday:string,
    valorant_data?:ValorantData | null,
    csgo_data?:CsGoData | null,
    teams:Team[]
}