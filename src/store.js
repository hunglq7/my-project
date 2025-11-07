
import { configureStore } from '@reduxjs/toolkit'
import quatgioReducer from '../src/reducer/quatgioSlice'
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
    quatgios: quatgioReducer
  }
})
export default store
