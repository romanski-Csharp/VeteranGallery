import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VeteranDetails from './pages/VeteranDetails';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/veteran/:id" element={<VeteranDetails />} />
        </Routes>
    );
}

export default App;