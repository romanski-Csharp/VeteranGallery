import { X, Code2, Award } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl w-full max-w-[650px] flex overflow-hidden shadow-2xl relative"
                style={{ animation: 'aboutModalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-700 transition-all duration-200"
                >
                    <X size={16} />
                </button>

                <div className="w-[38%] shrink-0 bg-slate-900 relative">
                    <img
                        src="/developer.jpg"
                        alt="Developer"
                        className="w-full h-full object-cover aspect-[3/4]"
                        onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=500&fit=crop";
                        }}
                    />
                </div>

                <div className="flex-1 p-10 px-8">
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-slate-900 font-semibold text-[0.8rem] mb-4">
                        <Award size={16} color="#f59e0b" />
                        OOP Coursework 2026
                    </div>

                    <h3 className="m-0 mb-1 text-2xl font-extrabold text-slate-900 tracking-[-0.5px]">
                        Chub Roman
                    </h3>
                    <p className="m-0 mb-6 text-blue-600 text-[0.9rem] font-semibold">
                        Developer • Student of Group CS-24
                    </p>

                    <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
                        <div>
                            <h4 className="m-0 mb-1 text-[0.8rem] uppercase text-slate-400 font-bold tracking-[0.5px]">Project Theme</h4>
                            <p className="m-0 text-slate-700 text-[0.9rem] leading-relaxed font-medium">
                                Web-application "Veteran Gallery" is a modern web application designed to showcase the stories and achievements of our brave veterans.
                            </p>
                        </div>

                        <div>
                            <h4 className="m-0 mb-1.5 text-[0.8rem] uppercase text-slate-400 font-bold tracking-[0.5px]">Technology Stack</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {['.NET', 'SQL', 'React', 'TypeScript'].map(tech => (
                                    <span key={tech} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[0.75rem] font-semibold">
                                        <Code2 size={12} color="#94a3b8" /> {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                @keyframes aboutModalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                `}
            </style>
        </div>
    );
};

export default AboutModal;