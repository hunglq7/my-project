import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { nhatkyquatgioService } from '../service/quatgio/nhatkyquatgioService'
import api from '../Utils/Api'

const initialState = {
    data: null,
    loadding: false,
    error: null
}
export const getNhatkyquatgioById = createAsyncThunk(
    "getNhatkyquatgioById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await nhatkyquatgioService.getNhatkyById(id);
            return response.data;
        } // Returning only the data
        catch (error) {
            return rejectWithValue(error)
        }
    }
)

const nhatkyquatgioSlice = createSlice({
    name: 'nhatkyquatgioSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getNhatkyquatgioById.pending, (state) => {
                state.loadding = true
            })
            .addCase(getNhatkyquatgioById.fulfilled, (state, action) => {

                state.loadding = false
                state.data = action.payload
            })
            .addCase(getNhatkyquatgioById.rejected, (state, acion) => {
                state.loadding = false
                state.error = acion.payload
            })
    }
})


export default nhatkyquatgioSlice.reducer