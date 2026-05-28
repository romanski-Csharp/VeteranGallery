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

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3.5 py-2.5 border text-[0.95rem] text-slate-900 outline-none box-border transition-all duration-200 bg-white flex justify-between items-center ${
                    disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'
                } ${
                    isOpen 
                        ? 'border-blue-600 ring-3 ring-blue-600/15' 
                        : 'border-slate-300'
                }`}
                style={{ borderRadius }}
            >
                <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-slate-500 shrink-0 ml-2 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                />
            </button>

            {isOpen && (
                <div
                    className="custom-select-dropdown absolute left-0 w-max max-w-[300px] min-w-full bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 flex flex-col gap-0.5 z-[200] overflow-y-auto"
                    style={{
                        top: 'calc(100% + 6px)',
                        maxHeight: maxHeight
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
                                className={`px-3 py-2.5 text-left border-none rounded-md text-[0.9rem] cursor-pointer transition-colors duration-150 normal-case break-words leading-tight ${
                                    isSelected 
                                        ? 'bg-slate-100 text-slate-900 font-semibold' 
                                        : 'bg-transparent text-slate-600 font-medium hover:bg-slate-50'
                                }`}
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