import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VeteranDetails from './pages/VeteranDetails';
import AddVeteranPage from './pages/AddVeteranPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/veteran/:id" element={<VeteranDetails />} />
            <Route path="/add-veteran" element={<AddVeteranPage />} />
        </Routes>
    );
}

export default App;