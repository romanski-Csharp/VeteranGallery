import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VeteranDetails from './pages/VeteranDetails';
import AddVeteranPage from './pages/AddVeteranPage';

function App() {
    const location = useLocation();
    const background = location.state && location.state.background;

    return (
        <>
            <Routes location={background || location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/add-veteran" element={<AddVeteranPage />} />
                <Route path="/veteran/:id" element={<VeteranDetails />} />
            </Routes>
            {background && (
                <Routes>
                    <Route path="/veteran/:id" element={<VeteranDetails />} />
                </Routes>
            )}
        </>
    );
}

export default App;