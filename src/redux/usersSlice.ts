import { createSlice, createAsyncThunk, PayloadAction,AsyncThunkAction } from "@reduxjs/toolkit";
import User from "../types/User";
import axios from "axios";
import Swal from "sweetalert2";

interface IFormInput {
    password: string;
    nickname: string;
  }

export const fetchUser = createAsyncThunk(
    'usersReducer/fetchUser',
    async (data:IFormInput,{rejectWithValue}) => {
        const response =axios.post<User>('http://localhost:8000/api/login',data,{
            withCredentials:true
        })
        .then(res=>{
            
            return res.data
        })
        .catch(error=>{
            if (axios.isAxiosError(error)) {

                return rejectWithValue(error.response?.data ?? 'Unknown error');

              } else if (error instanceof Error) {

                return rejectWithValue(error.message ?? 'Unknown error');

              } else {
                return rejectWithValue('Unknown error');
              }
        })

        return response
        
    }
)

export const createUser = createAsyncThunk(
    'usersReducer/createUser',
    async (data:User,{rejectWithValue}) => {
        const response =axios.post<User>('http://localhost:8000/api/registration',data)
        .then(res=>{
            
            return res.data.nickname
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
        resetUserStatus(state){
            state.createUserStatus='idle'
            state.createUserError=null

        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
          state.fetchUserStatus='pending'
        })
        builder.addCase(fetchUser.fulfilled, (state) => {
            state.fetchUserStatus='fulfilled'
            Swal.fire({
                icon: "success",
                title: `Good luck!`,
                showConfirmButton: false,
                timer: 1500
              })
        })
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.fetchUserStatus='rejected'
            state.fetchUserError=action.payload as string
            Swal.fire({
                icon: "error",
                title: state.fetchUserError,
                showConfirmButton: false,
                timer: 1500
              })
        })
        

        builder.addCase(createUser.pending, (state, action) => {
            state.createUserStatus='pending'
        })
        builder.addCase(createUser.fulfilled, (state, action:PayloadAction<string>) => {
            state.createUserStatus='fulfilled'
            Swal.fire({
                icon: "success",
                title: `User ${action.payload} was created`,
                showConfirmButton: false,
                timer: 1500
              })
              
        })
        builder.addCase(createUser.rejected, (state, action) => {
            state.createUserStatus='rejected'
            state.createUserError=action.payload as string
            Swal.fire({
                icon: "error",
                title: state.createUserError,
                showConfirmButton: true,
                timer: 3000,
                confirmButtonText:'Get It'
              })
              
           
        })
      },
})


export const {resetUserStatus} =usersSlice.actions

export default usersSlice.reducer