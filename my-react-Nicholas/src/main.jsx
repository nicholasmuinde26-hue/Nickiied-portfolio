
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // <-- add this
import 'boxicons/css/boxicons.min.css'
import 'devicon/devicon.min.css'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>        {/* <-- Router goes here */}
      <ThemeProvider>     
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)