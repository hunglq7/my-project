import React from 'react'
import { createRoot } from 'react-dom/client'

import { Provider } from 'react-redux'
import 'core-js'
import '@ant-design/v5-patch-for-react-19'
import App from './App'
import store from './store'

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <App />
  </Provider>,
)
