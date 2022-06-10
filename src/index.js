import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx'
import { client} from "./App.jsx"
import { Provider } from 'wagmi'


ReactDOM.render(
  <React.StrictMode>
     <Provider  client={client}>
      < App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals




