import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import{thongsomaycaoService} from '../service/maycao/thongsomaycaoService'
import api from '../Utils/Api'

const initialState = {
    data: [],
    loadding: false,
    error: null
}
export const getThongsomaycaoById = createAsyncThunk(
    "getThongsomaycaoById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await thongsomaycaoService.getThongsomaycaoById(id);
            return response.data;
        } // Returning only the data
        catch (error) {
            return rejectWithValue(error)
        }

    }
)

const thongsomaycaoSlice = createSlice({
    name: 'thongsomaycaoSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getThongsomaycaoById .pending, (state) => {
                state.loadding = true
            })
            .addCase(getThongsomaycaoById .fulfilled, (state, action) => {

                state.loadding = false
                state.data = action.payload
            })
            .addCase(getThongsomaycaoById .rejected, (state, acion) => {
                state.loadding = false
                state.error = acion.payload
            })
    }
})
export default thongsomaycaoSlice.reducer