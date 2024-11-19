import { IUpbitThemes } from '../typings/db'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ThemeState {
    mappedThemes: IUpbitThemes[];
}

const initialState: ThemeState = {
    mappedThemes: [],
}

const upbitThemeSlice = createSlice({
    name: "upbittheme",
    initialState,
    reducers: {
        setUpbitThemes(state, action: PayloadAction<IUpbitThemes[]>) {
            state.mappedThemes = action.payload;
        }
    }
})

export const { setUpbitThemes } = upbitThemeSlice.actions;
export default upbitThemeSlice.reducer;

