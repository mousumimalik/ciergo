import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { BookingsPage } from './pages/BookingsPage'
import { BookingCalendarPage } from './pages/BookingCalendarPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/finance/bookings" replace />} />
          <Route path="/finance/bookings" element={<BookingsPage />} />
          <Route path="/finance/bookings/calendar" element={<BookingCalendarPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
