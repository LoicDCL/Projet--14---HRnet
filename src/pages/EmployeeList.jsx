import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table'
import { selectEmployees } from '../store/employeesSlice'

const columns = [
    { accessorKey: 'firstName',   header: 'First Name'    },
    { accessorKey: 'lastName',    header: 'Last Name'     },
    { accessorKey: 'startDate',   header: 'Start Date'    },
    { accessorKey: 'department',  header: 'Department'    },
    { accessorKey: 'dateOfBirth', header: 'Date of Birth' },
    { accessorKey: 'street',      header: 'Street'        },
    { accessorKey: 'city',        header: 'City'          },
    { accessorKey: 'state',       header: 'State'         },
    { accessorKey: 'zipCode',     header: 'Zip Code'      },
]

const EmployeeList = () => {
    const employees = useSelector(selectEmployees)
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])

    const data = useMemo(() => employees, [employees])

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel:       getCoreRowModel(),
        getSortedRowModel:     getSortedRowModel(),
        getFilteredRowModel:   getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    })

    return (
        <div className="container">
            <h1>Current Employees</h1>

            <div className="table-controls">
                <div>
                    Show{' '}
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                        {[10, 25, 50, 100].map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                    {' '}entries
                </div>

                <div>
                    Search:{' '}
                    <input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                    />
                </div>
            </div>

            <table className="employee-table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() === 'asc'  ? ' ▲' :
                                    header.column.getIsSorted() === 'desc' ? ' ▼' : ' ⇅'}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                No data available in table
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <span>
                    Showing{' '}
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                    {' '}to{' '}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}
                    {' '}of {table.getFilteredRowModel().rows.length} entries
                </span>

                <div>
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </button>
                    <span className="current-page">
                        {table.getState().pagination.pageIndex + 1}
                    </span>
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </button>
                </div>
            </div>

            <Link to="/">Home</Link>
        </div>
    )
}

export default EmployeeList