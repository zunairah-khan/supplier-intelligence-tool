// this is the redux store configuration file. a redux store is a centralized place to store the state of the application. it allows different components to access and update the state in a predictable way.
import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js'; // authreducer is a slice of the redux store that manages the state of authentication. it contains actions and reducers to handle login, logout and user state.
import {apiSlice} from './slices/apiSlice.js'; // apiSlice is a slice of the redux store that manages the state of the api calls. it contains actions and reducers to handle api requests and responses.

// configureStore is a function that takes an object with reducer and middleware properties. 
// reducer is an object that contains all the slices of the redux store. 
// middleware is an array of functions that can intercept actions before they reach the reducer. it runs between dispatching an acction and updating the state. it can be used to log actions, handle asynchronous actions and more.
//devtools is a boolean that enables the redux devtools extension for debugging the store.
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(apiSlice.middleware) , 
  devTools: true,
});

export default store;