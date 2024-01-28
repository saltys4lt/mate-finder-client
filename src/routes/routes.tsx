import { lazy,Suspense } from "react"
import StartPage from "../pages/StartPage"
import Loader from "../components/Loader"
import PlayersPage from "../pages/PlayersPage"
import FriendsPage from "../pages/FriendsPage"
import TeamCreatorPage from "../pages/TeamCreatorPage"
import TeamsPage from "../pages/TeamsPage"
import MatchesPage from "../pages/MatchesPage"
import NewsPage from "../pages/NewsPage"
import ProfilePage from "../pages/ProfilePage"
import { Navigate } from "react-router-dom"
const HomePage=lazy(()=>import('../pages/HomePage'))

export const authorizedGameProfileRoutes=[
    {path:'/players', element:<PlayersPage/>},
    {path:'/friends', element:<Suspense fallback={<Loader/>}><FriendsPage/></Suspense> },
    {path:'/team-creator', element:<Suspense fallback={<Loader/>}><TeamCreatorPage/></Suspense> },
    {path:'/teams', element:<Suspense fallback={<Loader/>}><TeamsPage/></Suspense> },
    {path:'*',element:<Navigate to='/' replace={true}/>}
]

export const privateRoutes=[
    {path:'/', element:<Suspense fallback={<Loader/>}><HomePage/></Suspense> },
    {path:'/matches', element:<Suspense fallback={<Loader/>}><MatchesPage/></Suspense> },
    {path:'/news', element:<Suspense fallback={<Loader/>}><NewsPage/></Suspense> },
    {path:'/profile/:nickname', element:<Suspense fallback={<Loader/>}><ProfilePage/></Suspense> },
    {path:'*',element:<Navigate to='/' replace={true}/>}

]

export const publicRoutes=[
    {path:'/', element:<StartPage/> },
    {path:'*',element:<Navigate to='/' replace={true}/>}

]