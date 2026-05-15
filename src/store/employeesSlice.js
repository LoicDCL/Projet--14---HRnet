import { createSlice } from '@reduxjs/toolkit'
import { mockEmployees } from '../data/mockEmployees'

const employeesSlice = createSlice({
    name: 'employees',
    initialState: {
        list: mockEmployees,
    },
    reducers: {
        addEmployee: (state, action) => {
            state.list.push(action.payload)
        },
    },
})

export const { addEmployee } = employeesSlice.actions
export const selectEmployees = (state) => state.employees.list
export default employeesSlice.reducer