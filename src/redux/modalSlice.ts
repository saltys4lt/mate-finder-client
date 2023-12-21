import { createSlice } from "@reduxjs/toolkit";

interface ModalInitialState{
    regIsActive:boolean,
    loginIsActive:boolean
}


const initialState:ModalInitialState={
    regIsActive:false,
    loginIsActive:false
}


const modalSlice= createSlice({
    name:'usersReducer',
    initialState,

    reducers:{
        changeLoginState(state){
            state.loginIsActive=!state.loginIsActive
        },
        changeRegState(state){
            state.regIsActive=!state.regIsActive
            
        }
    }
})


export const {changeLoginState,changeRegState} =modalSlice.actions

export default modalSlice.reducer