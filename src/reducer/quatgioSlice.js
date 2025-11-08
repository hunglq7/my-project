import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../Utils/Api'

const initialState = {
    data: [],
    loadding: false,
    error: null
}
export const readAllQuatgio = createAsyncThunk(
    "readAllQuatgio",
    async (args, { rejectWithValue }) => {
        try {
            const response = await api.get('Tonghopquatgio/getAll');
            return response.data;
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

                state.loadding = false
                state.data = action.payload
            })
            .addCase(readAllQuatgio.rejected, (state, acion) => {
                state.loadding = false
                state.error = acion.payload
            })
    }
})


export default quatgioSlice.reducer