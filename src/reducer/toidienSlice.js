import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { danhmuctoidienService } from '../service/toidien/danhmuctoidien'

const initialState = {
    data: null,
    loadding: false,
    error: null
}
export const getAllDanhmuctoidien = createAsyncThunk(
    "getAllDanhmuctoidien",
    async (arg, { rejectWithValue }) => {
        try {
            const response = await danhmuctoidienService.getDanhmuctoidien();
            return response.data;
        } // Returning only the data
        catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateDanhmuctoidien = createAsyncThunk(
    "updateDanhmuctoidien ",
    async (data, { rejectWithValue }) => {
        try {
            const response = await danhmuctoidienService.updateDanhmuctoidien(data);
            return response.data;
        } // Returning only the data
        catch (error) {
            return rejectWithValue(error)
        }
    }
)


const toidienSlice = createSlice({
    name: 'toidienSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllDanhmuctoidien.pending, (state) => {
                state.loadding = true
            })
            .addCase(getAllDanhmuctoidien.fulfilled, (state, action) => {

                state.loadding = false
                state.data = action.payload
            })
            .addCase(getAllDanhmuctoidien.rejected, (state, acion) => {
                state.loadding = false
                state.error = acion.payload
            })
            .addCase(updateDanhmuctoidien.pending, (state) => {
                state.loadding = true
            })
            .addCase(updateDanhmuctoidien.fulfilled, (state, action) => {

                state.loadding = false
                state.data = action.payload
            })
            .addCase(updateDanhmuctoidien.rejected, (state, acion) => {
                state.loadding = false
                state.error = acion.payload
            })
    }
})


export default toidienSlice.reducer