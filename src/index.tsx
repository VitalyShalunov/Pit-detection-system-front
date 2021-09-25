import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { createGlobalStyle } from 'styled-components';
// import { ToastContainer } from 'react-toastify';
// import stylesForNotificationToasts from './styles/toastify';
// const GlobalStyle = createGlobalStyle`
//         ${stylesForNotificationToasts.map((i) => i)}
//     `;


ReactDOM.render(
  <React.StrictMode>
    {/* <GlobalStyle /> */}
    <App />
    {/* <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      draggable={false}
      closeOnClick={false}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      closeButton={false}
    /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
