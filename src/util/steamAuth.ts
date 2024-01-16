import axios from "axios"
const baseUrl=import.meta.env.VITE_BASE_URL

export const SteamAuth=async() => {
  await axios.get(`${baseUrl}/auth/steam`,{withCredentials:true,params:{
    apiKey:'79390EF78BA23D14B5BB26BECEFFEB12'
  }})
}