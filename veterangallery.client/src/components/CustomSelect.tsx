import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option<T> {
    label: string;
    value: T;
}

interface CustomSelectProps<T> {
    value: T;
    onChange: (value: T) => void;
    options: Option<T>[];
    placeholder?: string;
    disabled?: boolean;
    maxHeight?: string;
    borderRadius?: string;
}

export function CustomSelect<T extends string | number>({
    value,
    onChange,
    options,
    placeholder = 'Select option',
    disabled = false,
    maxHeight = '240px',
    borderRadius = '8px'
}: CustomSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleStyle = {
        width: '100%',
        padding: '10px 14px',
        border: '1px solid #cbd5e1',
        borderRadius: borderRadius,
        fontSize: '0.95rem',
        color: '#0f172a',
        outline: 'none',
        boxSizing: 'border-box' as const,
        transition: 'all 0.2s',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        borderColor: isOpen ? '#2563eb' : '#cbd5e1',
        boxShadow: isOpen ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none'
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                style={toggleStyle}
            >
                <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1, 
                    textAlign: 'left' 
                }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className="w-4 h-4"
                    style={{
                        color: '#64748b',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        flexShrink: 0,
                        marginLeft: '8px'
                    }}
                />
            </button>

            {isOpen && (
                <div
                    className="custom-select-dropdown"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        minWidth: '100%',
                        width: 'max-content',
                        maxWidth: '300px', 
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0',
                        padding: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        zIndex: 200,
                        maxHeight: maxHeight,
                        overflowY: 'auto'
                    }}
                >
                    {options.map(option => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: '10px 12px',
                                    textAlign: 'left',
                                    background: isSelected ? '#f1f5f9' : 'transparent',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem',
                                    color: isSelected ? '#0f172a' : '#475569',
                                    fontWeight: isSelected ? '600' : '500',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.15s',
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                    lineHeight: '1.4'
                                }}
                                onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}

            <style>
                {`
                .custom-select-dropdown::-webkit-scrollbar { width: 8px; }
                .custom-select-dropdown::-webkit-scrollbar-track { background: transparent; }
                .custom-select-dropdown::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; border: 2px solid white; }
                `}
            </style>
        </div>
    );
}