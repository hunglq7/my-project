import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { danhmuctoidienService } from '../service/toidien/danhmuctoidienService'
import { thongsotoidienService } from '../service/toidien/thongsotoidienService'
import { tonghoptoidienService } from '../service/toidien/tonghoptoidienService'
const initialState = {
    data: null,
    count: 0,
    loadding: false,
    error: null
}

export const readAllToidien = createAsyncThunk(
    "readAllToidien",
    async (args, { rejectWithValue }) => {
        try {
            const response = await tonghoptoidienService.getTonghoptoidien();
            function tinhTong(arr) {
                let count = 0;
                for (let i = 0; i < arr.length; i++) {
                    count += arr[i].soLuong;
                }
                return count
            }
            const countToidien = tinhTong(response.data)
            return countToidien;

        } // Returning only the data
        catch (error) {
            return rejectWithValue(error)
        }

    }
)

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



export const getThongsotoidienById = createAsyncThunk(
    "getThongsotoidienById",
    async (id, { rejectWithValue }) => {
        try {

            const response = await thongsotoidienService.getThongsotoidienById(id);
            return response.data

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
            .addCase(getThongsotoidienById.pending, (state) => {
                state.loadding = true
            })
            .addCase(getThongsotoidienById.fulfilled, (state, action) => {

                state.loadding = false
                state.data = action.payload
            })
            .addCase(getThongsotoidienById.rejected, (state, acion) => {
                state.loadding = false
                state.error = acion.payload
            })
            //Lấy dữ liệu bảng tổng hợp tời điện
            .addCase(readAllToidien.pending, (state) => {
                state.loadding = true
            })
            .addCase(readAllToidien.fulfilled, (state, action) => {

                state.loadding = false
                state.data = action.payload
                state.count = action.payload
            })
            .addCase(readAllToidien.rejected, (state, acion) => {
                state.loadding = false
                state.error = acion.payload
            })
    }
})


export default toidienSlice.reducer