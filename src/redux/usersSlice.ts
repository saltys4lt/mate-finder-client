import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import User from "../types/User";
import axios from "axios";


export const fetchUser = createAsyncThunk(
    'usersReducer/fetchUser',
    async (data,{rejectWithValue}) => {
        const response =axios.post<User>('http://localhost:8000/api/login')
        .then(res=>{
            console.log(res.data)
            return res.data
        })
        .catch(e=>{
            return rejectWithValue(e.message)
        })

        return response
        
    }
)

export const createUser = createAsyncThunk(
    'usersReducer/createUser',
    async (data:User,{rejectWithValue}) => {
        const response =axios.post('http://localhost:8000/api/registration',data)
        .then(res=>{
            console.log(res.data)
            return res.data
        })
        .catch(e=>{
            return rejectWithValue(e)
        })
        return response
    }
)

interface UserState{
    user:User | null
    status:'pending'|'fulfilled'|'error'|'idle'
    error: string | null;
}

const initialState:UserState ={
    user:null,
    status:'idle',
    error:null
    
}

const usersSlice= createSlice({
    name:'usersReducer',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state, action) => {
          state.status='pending'
        })
        builder.addCase(fetchUser.fulfilled, (state, action:PayloadAction<User>) => {
            state.user=action.payload
            state.status='fulfilled'
        })
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.status='error'
        })
        

        builder.addCase(createUser.pending, (state, action) => {
            state.status='pending'
        })
        builder.addCase(createUser.fulfilled, (state, action) => {
            state.status='fulfilled'
        })
        builder.addCase(createUser.rejected, (state, action) => {
            state.status='error'

        })
      },
})


export const {} =usersSlice.actions

export default usersSlice.reducer