import { configureStore, createSlice } from '@reduxjs/toolkit'
import counterReducer, { counterSlice } from './upbitSlice'
import upbitThemeReducer from './upbitThemeSlice'
import watchlistReducer from './watchlistSlice'

interface UpbitCoin {
    koreanname: string,
    englishname: string,
    theme: string,
    ticker: string,
    shortname: string,
    image: string,
    cryptoExchange: string,
    trade_price: number,//가격
    acc_trade_price_24h: number,//거래대금
    signed_change_rate: number, //등락폭
    change: string,
}
interface UpbitState {
    coins: UpbitCoin[];
}
const initialState: UpbitState = {
    coins: [],
}
//useState역할
const upbitCoinSlice = createSlice({
    name: 'upbitcoins',
    initialState,
    reducers: {
        setUpbit: (state, action) => {//state는 위의 initial state말함
            state.coins = action.payload;
        },
        updateUpbitPrice: (state, action) => {
            const { upbitticker, upbitTradePrice, upbitacc, upbitchangerate, upbitchange } = action.payload;
            //state.coins.find((action.payload) => action.payload)
            const coin = state.coins.find(coin => coin.ticker === upbitticker);
            if (coin) {
                coin.trade_price = upbitTradePrice;
                coin.acc_trade_price_24h = upbitacc;
                coin.signed_change_rate = upbitchangerate;
                coin.change = upbitchange;
            }
        }
    }
})

//액션 및 리듀서 내보내기
export const { setUpbit, updateUpbitPrice } = upbitCoinSlice.actions;
export const upbitReducers = upbitCoinSlice.reducer;

export const store = configureStore({
    reducer: {
        //upbitcoins: upbitcoinsReducer,
        // counter: counterSlice,
        upbit: upbitReducers,
        //upbitTradePrice:  
        theme: upbitThemeReducer,
        watchlist: watchlistReducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch