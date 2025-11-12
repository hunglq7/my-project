import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../Utils/Api'

const initialState = {
    data: null,
    count: null,
    loadding: false,
    error: null
}
export const readAllQuatgio = createAsyncThunk(
    "readAllQuatgio",
    async (args, { rejectWithValue }) => {
        try {
            const response = await api.get('Tonghopquatgio/getAll');
            return response.data
        } // Returning only the data
        catch (error) {
            return rejectWithValue(error)
        }

    }
)


const quatgioSlice = createSlice({
    name: 'quatgioSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(readAllQuatgio.pending, (state) => {
                state.loadding = true
            })
            .addCase(readAllQuatgio.fulfilled, (state, action) => {
                function tinhTong(arr) {
                    let count = 0;
                    for (let i = 0; i < arr.length; i++) {
                        count += arr[i].soLuong;
                    }
                    return count
                }
                const countToidien = tinhTong(action.payload)
                state.loadding = false
                state.data = action.payload
                state.count = countToidien
            })
            .addCase(readAllQuatgio.rejected, (state, acion) => {
                state.loadding = false
                state.error = acion.payload
            })
    }
})


export default quatgioSlice.reducer