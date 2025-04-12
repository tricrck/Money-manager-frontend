import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';
import axios from 'axios';
import { logout } from './actions/userActions';

// Configure axios interceptor for handling 401 unauthorized errors
axios.interceptors.response.use(
  response => response, 
  error => {
    // Check if the error is an Unauthorized (401) error
    if (error.response && error.response.status === 401) {
      console.log('Session expired - logging out');
      // Dispatch the logout action to clear user data
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);