import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WatchlistState {
    items: string[];
}
const initialState: WatchlistState = {
    items: [],
}
const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState,
    reducers: {
        setWatchlist(state, action: PayloadAction<string[]>) {
            state.items = action.payload;
        },
        addToWatchlist(state, action: PayloadAction<string>) {
            if (!state.items.includes(action.payload)) {
                state.items.push(action.payload);
            }
        },
        removeFromWatchlist(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item !== action.payload)
        },

    }
})

export const { setWatchlist, addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;