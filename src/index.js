import { StrictMode } from "react";
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import {BrowserRouter} from 'react-router-dom';
import { store, persistor } from "./redux/store";
import App from './components/App';
import './index.css';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);

// import { StrictMode } from "react";
// import ReactDOM from 'react-dom';
// import { Provider } from "react-redux";
// import { PersistGate } from 'redux-persist/integration/react';
// import {BrowserRouter} from 'react-router-dom';
// import { store, persistor } from "./redux/store";
// import App from './components/App';
// // import {BASE_NAME} from './constants';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//     <StrictMode>
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <BrowserRouter 
//           // basename={BASE_NAME}
//         >
//           <App />
//         </BrowserRouter>
//       </PersistGate>
//     </Provider>
//   </StrictMode>
// );