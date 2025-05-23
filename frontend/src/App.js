import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import OrganizerDashboard from './pages/organizerDashboard';
import ParticipantDashboard from './pages/participantDashboard';
import ProtectedRoute from './components/protectedRoute';

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/organizer-dashboard" element={ <ProtectedRoute> <OrganizerDashboard /> </ProtectedRoute> } />
        <Route path="/participant-dashboard" element={ <ProtectedRoute> <ParticipantDashboard /> </ProtectedRoute> } />
      </Routes>
    </Router>
  );
}

export default App;