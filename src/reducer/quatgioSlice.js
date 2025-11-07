import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    data: [],
}
export const quatgioSlice = createSlice({
    name: 'quatgioSlice',
    initialState,
    reducers: {
        readAllQuatgio: (state, action) => {
            state.data = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { readAllQuatgio } = quatgioSlice.actions
export default quatgioSlice.reducer