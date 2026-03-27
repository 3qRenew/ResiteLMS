import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Editor } from './pages/Editor'
import { PublicView } from './pages/PublicView'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/project/:projectId" element={<Editor />} />
      <Route path="/view/:projectId" element={<PublicView />} />
    </Routes>
  )
}
