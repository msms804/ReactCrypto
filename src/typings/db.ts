export interface IUpbit {
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

export interface IUpbitThemeCoins {
    ticker: string,
    image: string,
    shortname: string,
    signed_change_rate: number,
    change: string,
}
export interface IUpbitThemes {
    theme: string,
    name: string,
    description: string,
    coins: IUpbitThemeCoins[],
}