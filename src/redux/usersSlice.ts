import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import User from "../types/User";
import axios from "axios";


export const fetchUser = createAsyncThunk(
    'usersReducer/fetchUser',
    async (nickname:string,{rejectWithValue}) => {
        const response =axios.get('http://localhost:3000/api/login')
        .then(res=>{
            console.log(res.data)
        })

        
    }
)

const initialState:User={
    nickname:'',
    email:'',
    password:'',
    description:'',
    user_avatar:'',
    gender:'',
    birthday:'',
    teams:[]
}

const usersSlice= createSlice({
    name:'usersReducer',
    initialState,
    reducers:{

    }
})


export const {} =usersSlice.actions

export default usersSlice.reducer