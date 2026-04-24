import { Routes, Route } from 'react-router-dom'
import SelectionPage from './pages/SelectionPage'
import DrawPage from './pages/DrawPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SelectionPage />} />
      <Route path="/draw/:id" element={<DrawPage />} />
    </Routes>
  )
}
