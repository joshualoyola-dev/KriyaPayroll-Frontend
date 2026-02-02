import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


// In producion, the strictmode is disregarded
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// To observe the behaviour during production, specially the fetching of data
createRoot(document.getElementById('root')).render(
  <App />
)
