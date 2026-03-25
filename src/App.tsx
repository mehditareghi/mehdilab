import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { Shell } from '@/components/layout/shell'
import { AboutPage } from '@/pages/about'
import { ExperimentDetailPage } from '@/pages/experiment-detail'
import { HomePage } from '@/pages/home'
import { LabPage } from '@/pages/lab'
import { NoteDetailPage } from '@/pages/note-detail'
import { NotesPage } from '@/pages/notes'
import { NotFoundPage } from '@/pages/not-found'
import { ShowcasePage } from '@/pages/showcase'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<HomePage />} />
          <Route path="lab" element={<LabPage />} />
          <Route path="lab/:slug" element={<ExperimentDetailPage />} />
          <Route path="showcase" element={<ShowcasePage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="notes/:slug" element={<NoteDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
