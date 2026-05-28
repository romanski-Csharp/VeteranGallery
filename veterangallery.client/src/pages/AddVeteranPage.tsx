import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AddVeteranForm from '../components/AddVeteranForm';

const AddVeteranPage = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/');
    };

    return (
        <div className="max-w-[600px] my-8 mx-auto px-4">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-transparent border-none cursor-pointer font-medium text-base transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Gallery
                </button>
            </div>
            <AddVeteranForm onSuccess={handleSuccess} />
        </div>
    );
};

export default AddVeteranPage;