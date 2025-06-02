import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/UI/Navbar'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/Register'
import ProjectsDetails from './pages/ProjectsDetails'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <Navbar />
              <ProjectsDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
