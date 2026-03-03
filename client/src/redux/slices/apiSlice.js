import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
// this file contains the api slice of the redux store, which manages api calls and state related to them. api calls will be used to interact with the backend server for data fetching and manipulation.

const API_URI = "http://localhost:8800/api/" // base uri for the api calls. it points to the backend server's api endpoint (defined in vite.config.js). 

const baseQuery = fetchBaseQuery({
    baseUrl: API_URI});// fetchBaseQuery is a function that creates a base query function for making api calls. it takes an object with baseUrl property, which is the base url for all api calls.

export const apiSlice = createApi({
    baseQuery, // baseQuery is the base query function for making api calls.
    tagTypes: [], // tagTypes is an array of strings that represent the different types of data that can be cached by the api slice. it is used for cache invalidation and refetching data when needed.
    endpoints: (builder) => ({}), // endpoints is a function that takes a builder object and returns an object with all the api endpoints. each endpoint is defined using the builder object, which provides methods to define queries and mutations.
});