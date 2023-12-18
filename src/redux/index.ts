import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import usersSlice from "./usersSlice";
export const store = configureStore({
    reducer:{
        userReducer:usersSlice
    }
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch:()=>AppDispatch = useDispatch
export type RootState = ReturnType <typeof store.getState>

