import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { thongsoquatgioService } from '../service/quatgio/thongsoquatgioService'
import api from '../Utils/Api'

const initialState = {
    data: [],
    loadding: false,
    error: null
}
export const getThongsoquatgioById = createAsyncThunk(
    "getThongsoquatgioById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await thongsoquatgioService.getThongsoquatgioById(id);
            return response.data;
        } // Returning only the data
        catch (error) {
            return rejectWithValue(error)
        }

    }
)


const thongsoquatgioSlice = createSlice({
    name: 'thongsoquatgioSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getThongsoquatgioById.pending, (state) => {
                state.loadding = true
            })
            .addCase(getThongsoquatgioById.fulfilled, (state, action) => {

                state.loadding = false
                state.data = action.payload
            })
            .addCase(getThongsoquatgioById.rejected, (state, acion) => {
                state.loadding = false
                state.error = acion.payload
            })
    }
})


export default thongsoquatgioSlice.reducer