
import React, { ReactNode, useState } from 'react';
import { TimetableEntry, User, UserRole, Conflict } from '../types';

// --- SVG ICONS ---
const CalendarIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
);
const BookOpenIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
);
const BellIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
);
const LogoutIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);
const HomeIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
);
const MenuIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
);
export const TrashIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);
export const PlusIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
);
export const CheckIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);
export const XIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);
const ClipboardListIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
);
export const DownloadIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
);
export const EditIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
);
export const AlertTriangleIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
);
export const SparklesIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.586 2.586a2 2 0 012.828 0 2 2 0 010 2.828l-.793.793a1 1 0 00-1.414 1.414l.793-.793a2 2 0 012.828-2.828zM15 6a1 1 0 100-2 1 1 0 000 2zM5.414 2.586a2 2 0 00-2.828 0 2 2 0 000 2.828l.793.793a1 1 0 111.414-1.414L4 4.414A2 2 0 004 1.586l.793-.793a2 2 0 012.828-.001zM5 6a1 1 0 100-2 1 1 0 000 2zM2 13a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm14 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM9 4a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM9 16a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-5.414-2.586a2 2 0 002.828 0 2 2 0 000-2.828l-.793-.793a1 1 0 01-1.414 1.414l.793.793zm10.828 0a2 2 0 000 2.828 2 2 0 002.828 0l.793-.793a1 1 0 011.414 1.414l-.793.793a2 2 0 000-2.828z" clipRule="evenodd" />
    </svg>
);
export const EyeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
export const EyeOffIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.023 3.566-5.446 6.804-6.131M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.042 4.125l-2.022-2.022M3.958 5.875l-2.022-2.022" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
);


// --- COMPONENTS ---

export const Header = ({ user, onLogout, onToggleSidebar }: { user: User; onLogout: () => void; onToggleSidebar: () => void; }) => (
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <button onClick={onToggleSidebar} className="text-gray-500 mr-4 focus:outline-none hover:text-cu-primary">
                        <MenuIcon />
                    </button>
                    <img src="https://sih.gov.in/img/logo.png" alt="SIH Logo" className="h-10 w-auto" />
                    <span className="text-xl font-bold text-cu-primary ml-3 hidden sm:block">Centurion University Scheduler</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 hidden md:block">Welcome, {user.name} ({user.role})</span>
                    <button onClick={onLogout} className="text-gray-500 hover:text-cu-secondary transition duration-150 ease-in-out" title="Logout">
                        <LogoutIcon />
                    </button>
                </div>
            </div>
        </div>
    </header>
);

export const Footer = () => (
    <footer className="bg-cu-primary text-white py-6 mt-auto">
        <div className="container mx-auto text-center px-4">
            <p>&copy; {new Date().getFullYear()} Centurion University of Technology and Management. All Rights Reserved.</p>
            <p className="text-sm mt-2">Smart Classroom & Automated Timetable Scheduler for SIH</p>
        </div>
    </footer>
);

export const Sidebar = ({ user, currentPage, onNavigate, isOpen }: { user: User; currentPage: string; onNavigate: (page: string) => void; isOpen: boolean; }) => {
    const navItems = [
        { name: 'Dashboard', page: 'dashboard', icon: <HomeIcon />, roles: [UserRole.Admin, UserRole.Lecturer, UserRole.Student] },
        { name: 'Scheduler', page: 'scheduler', icon: <CalendarIcon />, roles: [UserRole.Admin, UserRole.Lecturer, UserRole.Student] },
        { name: 'Management', page: 'management', icon: <ClipboardListIcon />, roles: [UserRole.Admin] },
        { name: 'Notifications', page: 'notifications', icon: <BellIcon />, roles: [UserRole.Admin, UserRole.Lecturer, UserRole.Student] },
        { name: 'About', page: 'about', icon: <BookOpenIcon />, roles: [UserRole.Admin, UserRole.Lecturer, UserRole.Student] },
    ];

    return (
        <aside className={`bg-cu-primary text-white flex flex-col fixed h-full top-0 left-0 z-40 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'w-64' : 'w-0'}`}>
            <div className="h-16 flex-shrink-0"></div> {/* Spacer for header */}
            <nav className="flex-1 space-y-2 p-2">
                {navItems.filter(item => item.roles.includes(user.role)).map(item => (
                    <a
                        key={item.name}
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate(item.page); }}
                        className={`flex items-center p-3 rounded-lg transition duration-200 overflow-hidden ${
                            currentPage === item.page ? 'bg-cu-accent' : 'hover:bg-cu-accent/50'
                        } ${!isOpen && 'justify-center'}`}
                        title={item.name}
                    >
                        <div className="flex-shrink-0">{item.icon}</div>
                        <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'ml-4 opacity-100' : 'opacity-0'}`}>{item.name}</span>
                    </a>
                ))}
            </nav>
        </aside>
    );
};


export const Card = ({ title, children, className }: { title?: string; children: ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl ${className}`}>
        {title && <h3 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200">{title}</h3>}
        <div className="p-4">
            {children}
        </div>
    </div>
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
};

export const Button = ({ children, className = '', variant = 'primary', type = 'button', ...props }: ButtonProps) => {
    const baseClasses = "px-4 py-2 rounded-lg font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2";
    const variantClasses = {
        primary: 'bg-cu-secondary hover:bg-orange-700 focus:ring-cu-secondary',
        secondary: 'bg-cu-accent hover:bg-blue-700 focus:ring-cu-accent',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    };
    const disabledClasses = 'disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100';
    
    return (
        <button type={type} className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`} {...props}>
            {children}
        </button>
    );
};

interface TimetableProps {
    data: TimetableEntry[];
    isEditable: boolean;
    holidays: string[];
    conflicts: Conflict[];
    onEntryMove?: (draggedEntry: TimetableEntry, targetDay: string, targetSlot: string) => void;
    onEntryDelete?: (entryToDelete: TimetableEntry) => void;
    onEntryCreate?: (day: string, timeSlot: string) => void;
}

export const Timetable = ({ data, isEditable, holidays, conflicts, onEntryMove, onEntryDelete, onEntryCreate }: TimetableProps) => {
    const [dragOverCell, setDragOverCell] = useState<{ day: string; slot: string } | null>(null);
    if (data.length === 0 && !isEditable) {
        return <div className="text-center py-10 text-gray-500">No classes scheduled for this section.</div>;
    }
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const allSlots = [
        { time: '09:00-10:00', type: 'class' as const },
        { time: '10:00-10:10', type: 'break' as const, label: 'Break' },
        { time: '10:10-11:10', type: 'class' as const },
        { time: '11:10-12:10', type: 'class' as const },
        { time: '12:10-13:10', type: 'break' as const, label: 'Lunch Break' },
        { time: '13:10-14:10', type: 'class' as const },
        { time: '14:10-15:10', type: 'class' as const },
        { time: '15:10-15:20', type: 'break' as const, label: 'Break' },
        { time: '15:20-16:20', type: 'class' as const },
    ];

    const getEntries = (day: string, timeSlot: string) => data.filter(item => item.day === day && item.timeSlot === timeSlot);
    const getConflict = (day: string, timeSlot: string) => conflicts.find(c => c.day === day && c.timeSlot === timeSlot);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, entry: TimetableEntry) => {
        e.dataTransfer.setData('application/json', JSON.stringify(entry));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: string, slot: string) => {
        e.preventDefault();
        const entryData = e.dataTransfer.getData('application/json');
        if (entryData) {
            const draggedEntry = JSON.parse(entryData);
            onEntryMove?.(draggedEntry, day, slot);
        }
        setDragOverCell(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDragEnter = (day: string, slot: string) => setDragOverCell({ day, slot });

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-4">
            <div className="grid gap-px" style={{ gridTemplateColumns: `auto repeat(${days.length}, 1fr)`}}>
                <div className="p-3 font-semibold text-gray-600 bg-gray-50 sticky top-0 left-0 z-20">Time</div>
                {days.map(day => <div key={day} className={`p-3 font-semibold text-center text-gray-600 sticky top-0 ${holidays.includes(day) ? 'bg-gray-200' : 'bg-gray-50'}`}>{day}</div>)}
                
                {allSlots.map(slotInfo => {
                    if (slotInfo.type === 'break') {
                        return (
                            <React.Fragment key={slotInfo.time}>
                                <div className="p-2 font-semibold text-xs text-gray-600 bg-gray-100 sticky left-0 z-10 flex items-center justify-center">{slotInfo.time}</div>
                                <div className="p-2 border-t border-l border-gray-200 bg-gray-100 text-center font-semibold text-gray-500 flex items-center justify-center" style={{ gridColumn: `span ${days.length}` }}>
                                    {slotInfo.label}
                                </div>
                            </React.Fragment>
                        );
                    }

                    const slot = slotInfo.time;
                    return (
                        <React.Fragment key={slot}>
                            <div className="p-3 font-semibold text-sm text-gray-600 bg-gray-50 sticky left-0 z-10">{slot}</div>
                            {days.map(day => {
                                const isHoliday = holidays.includes(day);
                                if (isHoliday) {
                                    return <div key={`${day}-${slot}`} className="p-2 border-t border-l border-gray-200 min-h-[100px] bg-gray-100"></div>;
                                }

                                const entries = getEntries(day, slot);
                                const conflict = getConflict(day, slot);
                                const isDragOver = dragOverCell?.day === day && dragOverCell?.slot === slot;
                                const cellClasses = `relative p-2 border-t border-l border-gray-200 min-h-[100px] bg-white group transition-colors duration-200 ${isEditable ? 'hover:bg-blue-50' : ''} ${isDragOver ? 'bg-green-100' : ''} ${conflict ? 'border-2 border-red-500' : ''}`;

                                return (
                                    <div
                                        key={`${day}-${slot}`}
                                        onDrop={(e) => isEditable && handleDrop(e, day, slot)}
                                        onDragOver={isEditable ? handleDragOver : undefined}
                                        onDragEnter={() => isEditable && handleDragEnter(day, slot)}
                                        onDragLeave={() => isEditable && setDragOverCell(null)}
                                        className={cellClasses}
                                    >
                                        {conflict && (
                                            <div className="absolute top-1 left-1 text-red-500" title={conflict.message}>
                                                <AlertTriangleIcon className="w-4 h-4" />
                                            </div>
                                        )}
                                        {entries.length > 0 ? entries.map((entry, index) => {
                                            const isLibrary = entry.subject === 'Library';
                                            const isSports = entry.subject === 'Sports';
                                            let periodClasses = 'bg-transparent';
                                            if (isLibrary) {
                                                periodClasses = 'bg-red-50 text-red-800';
                                            } else if (isSports) {
                                                periodClasses = 'bg-green-50 text-green-800';
                                            }
                                            const entryContainerClasses = `relative text-xs h-full flex flex-col justify-between p-1 rounded-md transition-all ${isEditable ? 'cursor-move' : ''} ${periodClasses}`;
                                            const isSpecialPeriod = isLibrary || isSports;

                                            return (
                                                <div
                                                    key={index}
                                                    draggable={isEditable}
                                                    onDragStart={(e) => isEditable && handleDragStart(e, entry)}
                                                    className={entryContainerClasses}
                                                >
                                                    <div>
                                                        <p className={`font-bold ${isSpecialPeriod ? '' : 'text-cu-primary'}`}>{entry.subject}</p>
                                                        <p className="text-gray-600">{entry.lecturer}</p>
                                                        <p className="text-gray-500 italic">{entry.classroom}</p>
                                                        <p className="text-xs text-cu-accent font-semibold mt-1">{entry.section}</p>
                                                    </div>
                                                    {isEditable && (
                                                        <button onClick={() => onEntryDelete?.(entry)} className="absolute top-0 right-0 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        }) : (
                                          isEditable && (
                                            <div className="flex justify-center items-center h-full">
                                                <button onClick={() => onEntryCreate?.(day, slot)} className="text-gray-300 hover:text-cu-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <PlusIcon />
                                                </button>
                                            </div>
                                          )
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
                </div>
                <div className="p-4 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
