import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AllSpots from './pages/AllSpots';
import SpotDetails from './pages/SpotDetails';
import CreateSpot from './pages/CreateSpot';
import EditSpot from './pages/EditSpot';
import SavedSpots from './pages/SavedSpots';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/spots" element={<AllSpots />} />
          <Route
            path="/spots/new"
            element={
              <ProtectedRoute>
                <CreateSpot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/spots/:id/edit"
            element={
              <ProtectedRoute>
                <EditSpot />
              </ProtectedRoute>
            }
          />
          <Route path="/spots/:id" element={<SpotDetails />} />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedSpots />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        NYC Hidden Spots Explorer · Practical Web Development Final Project
      </footer>
    </div>
  );
}
