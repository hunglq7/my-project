
import { configureStore } from '@reduxjs/toolkit'
import quatgioReducer from '../src/reducer/quatgioSlice'
import thongsoquatgioReducer from '../src/reducer/thongsoquatgioSlice'
import nhatkyquatgioReducer from '../src/reducer/nhatkyquatgioSlice'
import toidienReducer from '../src/reducer/toidienSlice'
const initialState = {
  sidebarShow: true,
  theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}
const store = configureStore({
  reducer: {
    Apps: changeState,
    quatgios: quatgioReducer,
    thongsoquatgios: thongsoquatgioReducer,
    nhatkyquatgios: nhatkyquatgioReducer,
    toidiens: toidienReducer
  }
})
export default store
