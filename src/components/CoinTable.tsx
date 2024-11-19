import React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { SevenDays } from './SevenDays'
interface CoinData {
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
export const Cointable = ({ data }: { data: CoinData[] }) => {
    const columns = React.useMemo<ColumnDef<CoinData>[]>(
        () => [
            {
                header: '#',
                accessorFn: (_: any, index: number) => index + 1,//Row index
                //uuid ? https://tanstack.com/table/latest/docs/guide/rows
            },
            {
                header: '코인명',
                accessorKey: 'shortname',
                cell: ({ row }) => (
                    <div className="flex flex-row items-center space-x-2">
                        <img src={row.original.image} className="w-7 h-7 rounded-full" alt="coin" />
                        <span className="font-medium">{row.original.shortname}</span>
                        <span className="text-xs text-gray-500 ml-2">{row.original.koreanname}</span>
                    </div>
                )

            },
            {
                header: '가격',
                accessorKey: 'trade_price',
                cell: ({ row, cell }) => {
                    const value = cell.getValue<number | undefined>();
                    return (<span className={row.original.change === 'RISE' ? 'text-red-500' : 'text-blue-600'}>
                        {/* {Number(cell.getValue<number>().toLocaleString('ko-KR'))} */}
                        {value !== undefined ? Number(value).toLocaleString('ko-KR') : 'N/A'}
                    </span>)
                }

            },
            {
                header: '등락폭(24h)',
                accessorKey: 'signed_change_rate',
                //cell에 관한건 column defs의  cell formating에 나와있음
                cell: ({ cell }) => (
                    <span className=''>
                        {(cell.getValue<number>() * 100).toFixed(2)}
                    </span>
                )
            },
            {
                header: '거래대금(24h)',
                accessorKey: 'acc_trade_price_24h',
                cell: ({ cell }) => (
                    <span>{cell.getValue<number>().toLocaleString('ko-KR')}</span>
                )
            },
            {
                header: '가격(30Days)',
                accessorKey: '30days_price',
                cell: ({ row }) => (
                    <SevenDays ticker={row.original.ticker} change={row.original.change} />
                )
            }
        ], [])
    const tableInstance = useReactTable<CoinData>({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        // getSortedRowModel: getSortedRowModel(), //order doesn't matter anymore!  
    })
    return (
        <table className='min-w-full bg-white table-auto'>
            <thead>
                {tableInstance.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} colSpan={header.colSpan}>
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {tableInstance.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>

                ))}
            </tbody>
        </table>
    )
}
