import { configureStore, createSlice } from '@reduxjs/toolkit'

//useState역할
// let upbitcoins = createSlice({
//     name: "upbitcoins",
//     initialState: "값",
// })
export default configureStore({
    reducer: {
        // upbitcoins: upbitcoins.reducer,
    }
}) 
