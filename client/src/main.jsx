import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { register  } from 'swiper/element/bundle';
import { AuthProvider } from './context/store.jsx';

import { BrowserRouter } from "react-router-dom";
import './index.css'
register()

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
     <BrowserRouter>
       <App />
    </BrowserRouter>
    </StrictMode>,
  </AuthProvider>

)
