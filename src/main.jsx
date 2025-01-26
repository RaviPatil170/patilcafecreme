import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import  store  from './store/store.js'
import { Provider } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
createRoot(document.getElementById('root')).render(
  // Added Provider component to wrap the App component
  <Provider store={store}>       
  <StrictMode>
    <App />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
  </StrictMode>,
  </Provider> // Added closing tag for Provider component
)
