//this file contains the auth slice of the redux store, which manages user authentication state and sidebar visibility.

import {createSlice} from "@reduxjs/toolkit"; 
import { act } from "react";

// intiial state for the auth slice of the redux store. it contains user information and sidebar state.
const initialState = {
    user: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,

    isSidebarOpen: false,
};

// createSlice is a function that takes an object with name, initialState and reducers properties.
// name is the name of the slice.
// initialState is the initial state of the slice.
// reducers is an object that contains all the reducer functions for the slice. each reducer function takes state and action as arguments and returns the new state.
//setcredentials reducer will be used to set the user information in the redux store and also save it to local storage. state.user will hold the authenticated user's information once they log in. it will return the user info from local storage if it exists, otherwise it will be null.
//logout reducer will be used to clear the user information from the redux store and also remove it from local storage when the user logs out.
//setOpenSidebar reducer will be used to toggle the sidebar visibility state in the redux store. depending on the action payload, it will either open or close the sidebar. the action payload is expected to be a boolean value indicating whether the sidebar should be open (true) or closed (false).
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("userInfo");
        },
        setOpenSidebar: (state,action) => {
            state.isSidebarOpen = action.payload;
        },
        

    },
});

export const {setCredentials, logout, setOpenSidebar} = authSlice.actions; //exporting the actions to be used in the components.
export default authSlice.reducer; //exporting the reducer to be used in the store.