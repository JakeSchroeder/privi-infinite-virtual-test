import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


const MessageInput = ({ onSubmit }) => {

  const [text, setText] = useState("");

  return (
    <>
      <input className="" value={text} onChange={(e) => {
        setText(e.target.value)
      }} onKeyDown={(e) => {
        if (e.keyCode === 13) {
          if (text.length > 0) {

            onSubmit(text)
          }
        }
      }} />
      <button onClick={() => {
        onSubmit(text);
      }}>Send</button>
    </>
  )
}


ReactDOM.render(
  <React.StrictMode>
    <App MessageInput={MessageInput} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
