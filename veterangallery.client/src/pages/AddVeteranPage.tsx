import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AddVeteranForm from '../components/AddVeteranForm';

const AddVeteranPage = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#475569',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '1rem'
                    }}
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Gallery
                </button>
            </div>
            <AddVeteranForm onSuccess={handleSuccess} />
        </div>
    );
};

export default AddVeteranPage;