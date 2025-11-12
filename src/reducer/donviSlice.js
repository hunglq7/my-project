import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { donviService } from '../service/donviService'
import api from '../Utils/Api'

const initialState = {
    data: [],
    loadding: false,
    error: null
}
export const getAllDonvi = createAsyncThunk(
    "getAllDonvi",
    async (id, { rejectWithValue }) => {
        try {
            const response = await donviService.getDonvi();
            return response.data;
        } // Returning only the data
        catch (error) {
            return rejectWithValue(error)
        }

    }
)

const donviSlice = createSlice({
    name: 'donviSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllDonvi.pending, (state) => {
                state.loadding = true
            })
            .addCase(getAllDonvi.fulfilled, (state, action) => {
                state.loadding = false
                state.data = action.payload
            })
            .addCase(getAllDonvi.rejected, (state, acion) => {
                state.loadding = false
                state.error = acion.payload
            })
    }
})


export default donviSlice.reducer