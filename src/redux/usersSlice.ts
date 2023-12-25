import { createSlice, createAsyncThunk, PayloadAction,AsyncThunkAction } from "@reduxjs/toolkit";
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
        .catch(error=>{
            if (axios.isAxiosError(error)) {

                return rejectWithValue(error.response?.data.message ?? 'Unknown error');

              } else if (error instanceof Error) {

                return rejectWithValue(error.message ?? 'Unknown error');

              } else {
                return rejectWithValue('Unknown error');
              }
        })
        return response
    }
)

interface UserState{
    user:User | null
    createUserStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    fetchUserStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';

    createUserError: string | null;
    fetchUserError: string | null;

}

const initialState:UserState ={
    user:null,

    createUserStatus:'idle',
    createUserError:null,

    fetchUserStatus:'idle',
    fetchUserError:null,
}

const usersSlice= createSlice({
    name:'usersReducer',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state, action) => {
          state.fetchUserStatus='pending'
        })
        builder.addCase(fetchUser.fulfilled, (state, action:PayloadAction<User>) => {
            state.user=action.payload
            state.fetchUserStatus='fulfilled'
        })
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.fetchUserStatus='rejected'
            
        })
        

        builder.addCase(createUser.pending, (state, action) => {
            state.createUserStatus='pending'
        })
        builder.addCase(createUser.fulfilled, (state, action:PayloadAction) => {
            state.createUserStatus='fulfilled'
        })
        builder.addCase(createUser.rejected, (state, action) => {
            state.createUserStatus='rejected'
            state.createUserError=action.payload as string
            console.log(action.payload)
           
        })
      },
})


export const {} =usersSlice.actions

export default usersSlice.reducer