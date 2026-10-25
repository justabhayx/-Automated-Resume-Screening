import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-obsidian bg-scanlines font-sans text-gray-200">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#e5e7eb',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </Router>
  )
}

export default App
