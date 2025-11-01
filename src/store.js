import { legacy_createStore as createStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import chucvuReducer from './views/danhmuc/chucvu/chucvuSlice'
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
export const store = configureStore({
  reducer: {
    changeState: changeState,
    chucvus: chucvuReducer,
    // phongbans: phongbanReducer,
    // logins: loginReducer,
    // donvitinhs: donvitinhReducer
  },
})
// const store = createStore(changeState)
export default store
