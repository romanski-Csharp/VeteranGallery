import { X, Code2, Award } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '650px',
                    display: 'flex',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                    position: 'relative',
                    animation: 'aboutModalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: '#f1f5f9',
                        border: 'none',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748b',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                >
                    <X className="w-4 h-4" />
                </button>

                <div style={{ width: '38%', flexShrink: 0, backgroundColor: '#0f172a', position: 'relative' }}>
                    <img
                        src="/developer.jpg"
                        alt="Developer"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '3/4' }}
                        onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=500&fit=crop";
                        }}
                    />
                </div>

                <div style={{ flex: 1, padding: '2.5rem 2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '9999px', color: '#0f172a', fontWeight: '600', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        <Award className="w-4 h-4 text-amber-500" />
                        OOP Coursework 2026
                    </div>

                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Chub Roman
                    </h3>
                    <p style={{ margin: '0 0 1.5rem 0', color: '#2563eb', fontSize: '0.9rem', fontWeight: '600' }}>
                        Developer • Student of Group CS-24
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' }}>Project Theme</h4>
                            <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '500' }}>
                                Web-application "Veteran Gallery" is a modern web application designed to showcase the stories and achievements of our brave veterans.
                            </p>
                        </div>

                        <div>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' }}>Technology Stack</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {['.NET', 'SQL', 'React', 'TypeScript'].map(tech => (
                                    <span key={tech} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                                        <Code2 className="w-3 h-3 text-slate-400" /> {tech}
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