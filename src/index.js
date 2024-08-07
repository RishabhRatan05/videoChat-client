import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import Home from "./pages/Home"
import Room from "./pages/Room"
import { SocketProvider } from "./context/SocketProvider"
import Error from "./pages/Error"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
)
reportWebVitals()
