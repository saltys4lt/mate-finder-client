import { createSlice } from "@reduxjs/toolkit";

interface ModalInitialState{
    regIsActive:boolean,
    loginIsActive:boolean,
    gameChoiceIsActive:boolean
}


const initialState:ModalInitialState={
    regIsActive:false,
    loginIsActive:false,
    gameChoiceIsActive:false
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
        },
        changeGameProfileState(state){
            state.gameChoiceIsActive=!state.gameChoiceIsActive
        }
        
    }
})


export const {changeLoginState,changeRegState,changeGameProfileState}=modalSlice.actions

export default modalSlice.reducer