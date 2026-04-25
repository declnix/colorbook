import { Routes, Route } from 'react-router-dom'
import SelectionPage from './pages/selectionPage'
import DrawPage from './pages/drawPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SelectionPage />} />
      <Route path="/draw/:id" element={<DrawPage />} />
    </Routes>
  )
}
