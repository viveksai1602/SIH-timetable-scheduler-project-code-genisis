
import React, { useState, createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import { User, UserRole, TimetableEntry, Classroom, Notification, Subject, NotificationTarget, TimetableObject, Faculty, Conflict } from './types.ts';
import { mockLogin, getDashboardData, createNewDraftTimetable, getTimetables, getClassrooms, getNotifications, getSubjects, saveTimetable, markNotificationAsRead, addSubject, deleteSubject, getHolidays, setHolidays as apiSetHolidays, sendNotification, submitForReview, approveTimetable, rejectTimetable, getFaculty, deleteTimetable, addClassroom, deleteClassroom, addFacultyMember, deleteFacultyMember, checkForConflicts, updateClassroom, updateFacultyMember, createDraftFromTimetable, autoArrangeTimetable, cancelClass } from './services/mockApi.ts';
import { Header, Footer, Sidebar, Card, Button, Timetable, Modal, TrashIcon, CheckIcon, XIcon, DownloadIcon, PlusIcon, EditIcon, AlertTriangleIcon, SparklesIcon, EyeIcon, EyeOffIcon } from './components/ui.tsx';

declare const XLSX: any;

// --- AUTHENTICATION CONTEXT ---
interface AuthContextType {
    user: User | null;
    login: (role: UserRole) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (role: UserRole) => {
        const userData = await mockLogin(role);
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


// --- PAGE COMPONENTS ---

// --- LOGIN PAGE (Combined with Home) ---
const LoginPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Student);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ userId: '', password: '' });
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = { userId: '', password: '' };
        let isValid = true;

        // User ID validation: must be exactly 12 digits
        if (!/^\d{12}$/.test(userId)) {
            newErrors.userId = 'User ID must be exactly 12 digits.';
            isValid = false;
        }

        // Password validation: must contain at least one letter and one number
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
            newErrors.password = 'Password must contain at least one letter and one number.';
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setIsLoading(true);
        await login(selectedRole);
        setIsLoading(false);
        onNavigate('dashboard');
    };

    const FeatureCard = ({ title, description }: { title: string, description: string }) => (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-bold text-cu-primary mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
    
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-cu-light to-blue-100">
            <header className="bg-white shadow-sm">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="https://sih.gov.in/img/logo.png" alt="SIH Logo" className="h-12 w-auto" />
                        <span className="text-2xl font-bold text-cu-primary ml-4">Smart Scheduler</span>
                    </div>
                </nav>
            </header>
            
            <main className="flex-grow flex flex-col items-center justify-center py-12 px-4">
                <div className="text-center max-w-2xl mb-10">
                    <h1 className="text-4xl font-bold text-cu-primary tracking-tight sm:text-5xl">Welcome to the Future of Scheduling</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Our intelligent platform automates timetable creation, optimizing classroom usage and balancing faculty workloads. Please log in to access your dashboard.
                    </p>
                </div>

                <Card className="w-full max-w-sm border-t-4 border-cu-secondary" title="Login to Your Account">
                    <form onSubmit={handleLogin} className="space-y-4">
                         <div>
                            <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">I am a...</label>
                            <select
                                id="role-select"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-cu-dark text-cu-light border border-gray-600 focus:outline-none focus:ring-cu-accent focus:border-cu-accent sm:text-sm rounded-md"
                            >
                                <option value={UserRole.Student}>Student</option>
                                <option value={UserRole.Lecturer}>Lecturer</option>
                                <option value={UserRole.Admin}>Admin</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="user-id" className="block text-sm font-medium text-gray-700">User ID</label>
                            <input
                                id="user-id"
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                                maxLength={12}
                                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base bg-transparent text-cu-light border border-gray-600 placeholder:text-gray-400 focus:outline-none sm:text-sm rounded-md [box-shadow:0_0_0_1000px_#212121_inset] ${errors.userId ? 'border-red-500 ring-red-500' : 'focus:ring-cu-accent focus:border-cu-accent'}`}
                                placeholder="Enter your 12-digit User ID"
                            />
                            {errors.userId && <p className="mt-1 text-xs text-red-600">{errors.userId}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base bg-transparent text-cu-light border border-gray-600 placeholder:text-gray-400 focus:outline-none sm:text-sm rounded-md [box-shadow:0_0_0_1000px_#212121_inset] ${errors.password ? 'border-red-500 ring-red-500' : 'focus:ring-cu-accent focus:border-cu-accent'}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                             {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                        </div>
                        
                        <p className="text-xs text-gray-500 text-center pt-2">For demo purposes, enter any valid data, select your role, and click login.</p>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : `Login as ${selectedRole}`}
                        </Button>
                    </form>
                </Card>

                <section className="w-full mt-20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center text-cu-primary mb-12">Our Features</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard title="Automated Scheduling" description="Generate clash-free, optimized timetables in minutes with our powerful algorithm." />
                            <FeatureCard title="Role-Based Access" description="Separate, secure dashboards for Students, Lecturers, and Administrators." />
                            <FeatureCard title="Review & Approval Workflow" description="Ensure quality with a formal review process by university authorities before publishing." />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};


// --- DASHBOARD LAYOUT (Authenticated) ---
const DashboardLayout = ({ children, currentPage, onNavigate }: { children: ReactNode, currentPage: string, onNavigate: (page: string) => void }) => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        onNavigate('login');
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-cu-light">
            <Header user={user} onLogout={handleLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex">
                <Sidebar user={user} currentPage={currentPage} onNavigate={onNavigate} isOpen={isSidebarOpen} />
                <main className={`flex-1 p-6 md:p-8 mt-16 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

// --- Manage Subjects Modal ---
const ManageSubjectsModal = ({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: User }) => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectCode, setNewSubjectCode] = useState('');

    useEffect(() => {
        if (isOpen) {
            getSubjects().then(allSubjects => {
                setSubjects(allSubjects.filter(s => s.lecturerId === user.id));
            });
        }
    }, [isOpen, user.id]);

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubjectName || !newSubjectCode) return;
        await addSubject({ name: newSubjectName, code: newSubjectCode, lecturerId: user.id });
        const allSubjects = await getSubjects();
        setSubjects(allSubjects.filter(s => s.lecturerId === user.id));
        setNewSubjectName('');
        setNewSubjectCode('');
    };

    const handleDeleteSubject = async (subjectId: string) => {
        await deleteSubject(subjectId);
        setSubjects(subjects.filter(s => s.id !== subjectId));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage My Subjects">
            <div className="space-y-4">
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {subjects.map(subject => (
                        <li key={subject.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                            <span className="text-cu-dark font-medium">{subject.name} ({subject.code})</span>
                            <button onClick={() => handleDeleteSubject(subject.id)} className="text-red-500 hover:text-red-700">
                                <TrashIcon />
                            </button>
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleAddSubject} className="space-y-2 border-t pt-4">
                    <h4 className="font-semibold text-cu-dark">Add New Subject</h4>
                    <input 
                        type="text" 
                        value={newSubjectName} 
                        onChange={e => setNewSubjectName(e.target.value)} 
                        placeholder="Subject Name" 
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cu-secondary" 
                    />
                    <input 
                        type="text" 
                        value={newSubjectCode} 
                        onChange={e => setNewSubjectCode(e.target.value)} 
                        placeholder="Subject Code" 
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cu-secondary" 
                    />
                    <Button type="submit" className="w-full">Add Subject</Button>
                </form>
            </div>
        </Modal>
    );
};

// --- Send Notification Modal ---
const SendNotificationModal = ({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: User }) => {
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState<NotificationTarget>(
        user.role === UserRole.Lecturer ? NotificationTarget.Student : NotificationTarget.All
    );
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMessage('');
            setTarget(user.role === UserRole.Lecturer ? NotificationTarget.Student : NotificationTarget.All);
            setIsSending(false);
        }
    }, [isOpen, user.role]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message) return;
        setIsSending(true);
        await sendNotification(message, target);
        setIsSending(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Send Notification">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea 
                        id="message"
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-cu-accent focus:border-cu-accent"
                        placeholder="Enter your announcement..."
                    />
                </div>
                
                {user.role === UserRole.Admin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Send To</label>
                        <div className="mt-2 space-y-2">
                            {[NotificationTarget.All, NotificationTarget.Student, NotificationTarget.Lecturer, NotificationTarget.Admin].map(role => (
                                <label key={role} className="flex items-center">
                                    <input 
                                        type="radio"
                                        name="targetRole"
                                        value={role}
                                        checked={target === role}
                                        onChange={() => setTarget(role)}
                                        className="form-radio h-4 w-4 text-cu-primary focus:ring-cu-accent"
                                    />
                                    <span className="ml-3 text-sm text-gray-700">{role === 'All' ? 'All Users' : `${role}s`}</span>
                                 </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSending || !message}>
                        {isSending ? 'Sending...' : 'Send Notification'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};


// --- Dashboard Page ---
const DashboardPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    const { user } = useAuth();
    const [data, setData] = useState<any | null>(null);
    const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [classToCancel, setClassToCancel] = useState<(TimetableEntry & { isMyClass: boolean }) | null>(null);

    const fetchDashboardData = () => {
        if (user) {
            getDashboardData(user).then(setData);
        }
    };
    
    useEffect(() => {
        fetchDashboardData();
    }, [user, isSubjectsModalOpen]);

    if (!user) return null;

    const handleQuickAction = (action: {type: string, target: string}) => {
        if (action.type === 'navigate') {
            onNavigate(action.target);
        } else if (action.type === 'modal' && action.target === 'manageSubjects') {
            setIsSubjectsModalOpen(true);
        } else if (action.type === 'modal' && action.target === 'sendNotification') {
            setIsNotificationModalOpen(true);
        }
    };

    const handleCancelClass = async () => {
        if (classToCancel) {
            await cancelClass(classToCancel);
            fetchDashboardData(); // Refresh dashboard data
            setClassToCancel(null); // Close modal
        }
    };

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if (!data) return <div>Loading...</div>;

    const statusColors: {[key: string]: string} = {
        Approved: 'bg-green-100 text-green-800',
        'Pending Approval': 'bg-yellow-100 text-yellow-800',
        Draft: 'bg-blue-100 text-blue-800',
        Rejected: 'bg-red-100 text-red-800',
    };

    type UpcomingClass = TimetableEntry & { isMyClass: boolean };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2">
                <h1 className="text-3xl font-bold text-cu-dark">Dashboard</h1>
                <p className="text-md text-gray-500 font-medium">{currentDate}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {user.role === UserRole.Admin && data.pendingReviewCount > 0 && (
                    <Card title="Action Required" className="lg:col-span-3 bg-cu-secondary text-cu-dark">
                        <div className="flex items-center justify-between">
                            <p className="text-lg">You have <span className="font-bold">{data.pendingReviewCount}</span> timetable(s) pending your review.</p>
                            <Button variant="secondary" onClick={() => onNavigate('scheduler')}>Review Now</Button>
                        </div>
                    </Card>
                )}
                {user.role !== UserRole.Admin && (
                    <Card title={user.role === UserRole.Lecturer ? "Today's Upcoming Classes" : "Upcoming Classes (Approved Schedule)"} className="lg:col-span-2">
                        <ul className="space-y-4">
                            {data.upcomingClasses.length > 0 ? (
                                data.upcomingClasses.map((c: UpcomingClass, i: number) => (
                                    <li key={i} className={`flex justify-between items-center p-3 rounded-md transition-colors ${c.isMyClass ? 'bg-blue-50 border-l-4 border-cu-accent' : 'hover:bg-gray-100'}`}>
                                        <div>
                                            <p className="font-semibold text-cu-primary">{c.subject}</p>
                                            <p className="text-sm text-gray-500">{c.classroom}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <span className="text-gray-700 font-medium">{c.timeSlot}</span>
                                                {c.isMyClass && <span className="text-xs font-bold text-cu-accent block mt-1">MY CLASS</span>}
                                            </div>
                                            {user.role === UserRole.Lecturer && i === 0 && (
                                                <Button
                                                    variant="danger"
                                                    onClick={() => setClassToCancel(c)}
                                                    className="px-2 py-1 text-xs"
                                                    title="Cancel Next Class"
                                                >
                                                    <XIcon className="w-4 h-4" /> Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No upcoming classes for today.</p>
                            )}
                        </ul>
                    </Card>
                )}
                <Card title="Quick Actions" className={user.role === UserRole.Admin ? "lg:col-span-3" : ""}>
                    <div className={`flex flex-col space-y-3 ${user.role === UserRole.Admin ? 'sm:grid sm:grid-cols-3 sm:space-y-0 sm:gap-4' : ''}`}>
                         {data.quickActions.map((action: any, i: number) => <Button key={i} variant="secondary" onClick={() => handleQuickAction(action)}>{action.label}</Button>)}
                    </div>
                </Card>
                {user.role === UserRole.Admin && data.recentTimetables.length > 0 && (
                     <Card title="Recent Timetables" className="lg:col-span-3">
                        <ul className="space-y-2">
                           {data.recentTimetables.map((t: TimetableObject) => (
                               <li key={t.id} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
                                   <span className="font-medium text-cu-dark">Version {t.version}</span>
                                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[t.status]}`}>{t.status}</span>
                               </li>
                           ))}
                        </ul>
                    </Card>
                )}
            </div>
            {user.role === UserRole.Lecturer && <ManageSubjectsModal isOpen={isSubjectsModalOpen} onClose={() => setIsSubjectsModalOpen(false)} user={user} />}
            {(user.role === UserRole.Admin || user.role === UserRole.Lecturer) && <SendNotificationModal isOpen={isNotificationModalOpen} onClose={() => setIsNotificationModalOpen(false)} user={user} />}
            <Modal isOpen={!!classToCancel} onClose={() => setClassToCancel(null)} title="Confirm Class Cancellation">
                <p>Are you sure you want to cancel the following class? Students in this section will be notified.</p>
                {classToCancel && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
                        <p className="font-bold text-cu-primary text-lg">{classToCancel.subject}</p>
                        <p className="text-gray-600">{classToCancel.timeSlot} for {classToCancel.section}</p>
                        <p className="text-sm text-gray-500">in {classToCancel.classroom}</p>
                    </div>
                )}
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="secondary" onClick={() => setClassToCancel(null)}>Back</Button>
                    <Button variant="danger" onClick={handleCancelClass}>Confirm Cancellation</Button>
                </div>
            </Modal>
        </div>
    );
};

// --- Modals for SchedulerPage ---
const CreateTimetableModal = ({ isOpen, onClose, onCreate }: { 
    isOpen: boolean, 
    onClose: () => void, 
    onCreate: (constraints: { sections: string[], minClasses: number, maxClasses: number }) => void 
}) => {
    const [sections, setSections] = useState('A, B');
    const [minClasses, setMinClasses] = useState(2);
    const [maxClasses, setMaxClasses] = useState(4);
    const [error, setError] = useState('');

    const handleCreate = () => {
        if (minClasses > maxClasses) {
            setError('Minimum classes cannot be greater than maximum classes.');
            return;
        }
        setError('');
        onCreate({
            sections: sections.split(',').map(s => s.trim()).filter(Boolean),
            minClasses,
            maxClasses
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Generate New Timetable">
            <div className="space-y-4">
                <p className="text-sm text-gray-600">A new draft timetable will be generated. You can specify the sections and class constraints.</p>
                <div>
                    <label htmlFor="sections-input" className="block text-sm font-medium text-gray-700">Sections (comma-separated)</label>
                    <input
                        id="sections-input"
                        type="text"
                        value={sections}
                        onChange={e => setSections(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., A, B, C"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label htmlFor="min-classes" className="block text-sm font-medium text-gray-700">Min Classes per Day</label>
                         <input
                            id="min-classes"
                            type="number"
                            value={minClasses}
                            onChange={e => setMinClasses(Math.max(0, parseInt(e.target.value, 10)))}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                         />
                    </div>
                    <div>
                         <label htmlFor="max-classes" className="block text-sm font-medium text-gray-700">Max Classes per Day</label>
                         <input
                            id="max-classes"
                            type="number"
                            value={maxClasses}
                            onChange={e => setMaxClasses(Math.max(0, parseInt(e.target.value, 10)))}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                         />
                    </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end">
                    <Button onClick={handleCreate}>Generate</Button>
                </div>
            </div>
        </Modal>
    );
};

// --- Scheduler Page ---
const SchedulerPage = () => {
    const { user } = useAuth();
    // Component state
    const [timetables, setTimetables] = useState<TimetableObject[]>([]);
    const [selectedTimetable, setSelectedTimetable] = useState<TimetableObject | null>(null);
    const [holidays, setHolidays] = useState<string[]>([]);
    const [newHoliday, setNewHoliday] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [conflicts, setConflicts] = useState<Conflict[]>([]);
    const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
    const [conflictCheckRun, setConflictCheckRun] = useState(false);
    
    // View states
    const [selectedSection, setSelectedSection] = useState<string>('All');
    const [viewMode, setViewMode] = useState<'student' | 'lecturer'>('student'); // 'student' or 'lecturer' for admin view
    const [selectedLecturer, setSelectedLecturer] = useState<string>('');

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [timetableToDelete, setTimetableToDelete] = useState<TimetableObject | null>(null);
    const [rejectionNotes, setRejectionNotes] = useState('');
    
    // Data for modals
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [allClassrooms, setAllClassrooms] = useState<Classroom[]>([]);
    const [allFaculty, setAllFaculty] = useState<Faculty[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [timetablesData, holidaysData, subjectsData, classroomsData, facultyData] = await Promise.all([
                getTimetables(), getHolidays(), getSubjects(), getClassrooms(), getFaculty()
            ]);

            const sortedByVersion = [...timetablesData].sort((a, b) => b.version - a.version);
            setTimetables(sortedByVersion);
            setHolidays(holidaysData);
            setAllSubjects(subjectsData);
            setAllClassrooms(classroomsData);
            setAllFaculty(facultyData);

            if (user && sortedByVersion.length > 0) {
                let initialTimetable: TimetableObject | null = null;
                if (user.role === UserRole.Admin) {
                    initialTimetable = sortedByVersion.find(t => t.status === 'Pending Approval') ||
                                       sortedByVersion.find(t => t.status === 'Approved') ||
                                       sortedByVersion[0];
                } else if (user.role === UserRole.Lecturer) {
                    initialTimetable = sortedByVersion.find(t => t.status === 'Approved') ||
                                       sortedByVersion[0];
                } else { // Student
                    initialTimetable = sortedByVersion.find(t => t.status === 'Approved') || null;
                }
                setSelectedTimetable(initialTimetable);
            } else {
                setSelectedTimetable(null);
            }
        } catch (error) {
            console.error("Failed to fetch scheduler data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    useEffect(() => {
        setConflicts([]);
        setConflictCheckRun(false);
    }, [selectedTimetable]);

    const sections = useMemo(() => {
        const uniqueSections = [...new Set(timetables.flatMap(t => t.entries.map(e => e.section)))];
        return uniqueSections.sort();
    }, [timetables]);
    
    useEffect(() => {
        if (sections.length > 0 && selectedSection === 'All') {
           setSelectedSection(sections[0]);
        }
    },[sections, selectedSection]);

    useEffect(() => {
        if (allFaculty.length > 0 && selectedLecturer === '') {
            setSelectedLecturer(allFaculty[0].name);
        }
    }, [allFaculty]);

    const filteredEntries = useMemo(() => {
        if (!selectedTimetable) return [];
        
        if (user?.role === UserRole.Admin && viewMode === 'lecturer') {
            if (!selectedLecturer) return [];
            // Find all sections taught by the selected lecturer
            const lecturerSections = new Set(
                selectedTimetable.entries
                    .filter(e => e.lecturer === selectedLecturer)
                    .map(e => e.section)
            );
            // Show the lecturer's classes AND any non-academic classes for those sections
            return selectedTimetable.entries.filter(e =>
                e.lecturer === selectedLecturer ||
                ((e.subject === 'Library' || e.subject === 'Sports') && lecturerSections.has(e.section))
            );
        }

        return selectedTimetable.entries.filter(e => e.section === selectedSection);
    }, [selectedTimetable, selectedSection, user, viewMode, selectedLecturer]);

    const handleTimetableChange = (id: string) => setSelectedTimetable(timetables.find(t => t.id === id) || null);

    const handleCreateNewDraft = async (constraints: { sections: string[], minClasses: number, maxClasses: number }) => {
        setIsLoading(true);
        setIsCreateModalOpen(false);
        const apiConstraints = {
            sections: constraints.sections,
            minClassesPerDay: constraints.minClasses,
            maxClassesPerDay: constraints.maxClasses
        };
        const newDraft = await createNewDraftTimetable(apiConstraints);
        setTimetables([newDraft, ...timetables]);
        setSelectedTimetable(newDraft);
        setIsLoading(false);
    };
    
    const handleRunConflictCheck = async () => {
        if (!selectedTimetable) return;
        setIsCheckingConflicts(true);
        setConflictCheckRun(true);
        const foundConflicts = await checkForConflicts(selectedTimetable.id);
        setConflicts(foundConflicts);
        setIsCheckingConflicts(false);
    };

    const handleExportToExcel = () => {
        if (!selectedTimetable || filteredEntries.length === 0) return;

        const dataForExport = filteredEntries.map(entry => ({
            Day: entry.day,
            'Time Slot': entry.timeSlot,
            Subject: entry.subject,
            Lecturer: entry.lecturer,
            Classroom: entry.classroom,
            Section: entry.section
        }));

        const ws = XLSX.utils.json_to_sheet(dataForExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Timetable");

        const viewName = (user?.role === UserRole.Admin && viewMode === 'lecturer') 
            ? selectedLecturer.replace(/\s+/g, '_') 
            : `${selectedSection.replace(/\s+/g, '_')}`;
            
        const fileName = `Timetable_v${selectedTimetable.version}_${viewName}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };
    
    const updateTimetableStatus = (updated: TimetableObject | undefined) => {
        if (updated) {
            const newTimetables = timetables.map(t => t.id === updated.id ? updated : t);
            if(updated.status === 'Approved') {
                // If a timetable is approved, others that were approved are now superseded (rejected).
                // This logic is in the mock API, so we just need to refetch to see the side effects.
                fetchData(); 
            } else {
                setTimetables(newTimetables);
            }
            setSelectedTimetable(updated);
        }
    }

    const handleSubmitForReview = async () => {
        if (!selectedTimetable) return;
        updateTimetableStatus(await submitForReview(selectedTimetable!.id));
    };
    const handleApprove = async () => updateTimetableStatus(await approveTimetable(selectedTimetable!.id));
    const handleReject = async () => {
        updateTimetableStatus(await rejectTimetable(selectedTimetable!.id, rejectionNotes));
        setIsRejectModalOpen(false);
        setRejectionNotes('');
    };

    const handleDelete = async () => {
        if(timetableToDelete) {
            await deleteTimetable(timetableToDelete.id);
            const newTimetables = timetables.filter(t => t.id !== timetableToDelete.id);
            setTimetables(newTimetables);
            setSelectedTimetable(newTimetables[0] || null);
        }
        setIsDeleteModalOpen(false);
        setTimetableToDelete(null);
    }

    const handleAddHoliday = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedDay = newHoliday.trim();
        if (trimmedDay && !holidays.includes(trimmedDay)) {
            const newHolidaysList = [...holidays, trimmedDay].sort();
            setHolidays(newHolidaysList); // Optimistic update
            setNewHoliday('');
            await apiSetHolidays(newHolidaysList); // Persist
        }
    };

    const handleRemoveHoliday = async (dayToRemove: string) => {
        const newHolidaysList = holidays.filter(day => day !== dayToRemove);
        setHolidays(newHolidaysList); // Optimistic update
        await apiSetHolidays(newHolidaysList); // Persist
    };
    
    const statusPillClasses: {[key: string]: string} = {
        'Draft': 'bg-blue-100 text-blue-800',
        'Pending Approval': 'bg-yellow-100 text-yellow-800',
        'Approved': 'bg-green-100 text-green-800',
        'Rejected': 'bg-red-100 text-red-800'
    };

    if (isLoading) return <div className="text-center p-10">Loading Scheduler...</div>;
    if (!user) return null;
    
    const canManageTimetable = user && (user.role === UserRole.Admin || user.role === UserRole.Lecturer);

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Timetable Scheduler & Manager">
                        {user.role === UserRole.Admin && (
                            <div className="border-b border-gray-200 mb-4">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('student')}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                            viewMode === 'student'
                                            ? 'border-cu-primary text-cu-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Student View
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('lecturer')}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                            viewMode === 'lecturer'
                                            ? 'border-cu-primary text-cu-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Lecturer View
                                    </button>
                                </nav>
                            </div>
                        )}

                        <div className={`grid grid-cols-1 md:grid-cols-2 ${user.role === UserRole.Student ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4 items-end`}>
                            {/* Timetable selection */}
                            {user.role !== UserRole.Student && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700">Select Timetable Version</label>
                                    <select 
                                        value={selectedTimetable?.id || ''} 
                                        onChange={e => handleTimetableChange(e.target.value)}
                                        className="p-2 border rounded-md"
                                        disabled={timetables.length === 0}
                                    >
                                        {timetables.map(t => <option key={t.id} value={t.id}>Version {t.version} ({t.status})</option>)}
                                    </select>
                                </div>
                            )}

                            {/* Section / Lecturer selection */}
                            <div className="flex flex-col lg:col-span-2">
                                {user.role === UserRole.Admin && viewMode === 'lecturer' ? (
                                    <>
                                        <label className="text-sm font-medium text-gray-700">Select Lecturer</label>
                                        <select value={selectedLecturer} onChange={e => setSelectedLecturer(e.target.value)} className="p-2 border rounded-md">
                                            {allFaculty.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <label className="text-sm font-medium text-gray-700">Select Section</label>
                                        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="p-2 border rounded-md">
                                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </>
                                )}
                            </div>
                            
                            {selectedTimetable && (
                                <div className="flex justify-end items-center">
                                    <span className={`px-3 py-2 text-sm font-semibold rounded-full ${statusPillClasses[selectedTimetable.status]}`}>
                                        {selectedTimetable.status}
                                    </span>
                                </div>
                            )}
                        </div>
                        {selectedTimetable?.notes && <p className="text-sm text-red-600 mt-2">Note: {selectedTimetable.notes}</p>}
                        
                        <div className="flex flex-wrap items-start justify-between gap-2 mt-4 border-t pt-4">
                            {/* Left-aligned actions */}
                            <div className="flex flex-wrap gap-2">
                                {selectedTimetable?.status === 'Draft' && canManageTimetable && <Button onClick={handleSubmitForReview}>Submit for Review</Button>}
                                {selectedTimetable?.status === 'Pending Approval' && user.role === UserRole.Admin && (
                                    <>
                                        <Button variant="success" onClick={handleApprove}><CheckIcon /> Approve</Button>
                                        <Button variant="danger" onClick={() => setIsRejectModalOpen(true)}><XIcon/> Reject</Button>
                                    </>
                                )}

                                {user.role !== UserRole.Student && (
                                    <Button variant="secondary" onClick={handleRunConflictCheck} disabled={isCheckingConflicts}>
                                        <AlertTriangleIcon/> {isCheckingConflicts ? 'Checking...' : 'Check Conflicts'}
                                    </Button>
                                )}
                            </div>

                            {/* Right-aligned actions */}
                            <div className="flex flex-wrap gap-2">
                                <Button 
                                    variant="secondary" 
                                    onClick={handleExportToExcel} 
                                    disabled={!selectedTimetable || filteredEntries.length === 0}
                                >
                                    <DownloadIcon /> Export as Excel
                                </Button>
                                {user.role !== UserRole.Student && (
                                    <Button onClick={() => setIsCreateModalOpen(true)}><PlusIcon/> Generate Timetable</Button>
                                )}
                                {user.role !== UserRole.Student && selectedTimetable && (selectedTimetable.status === 'Draft' || selectedTimetable.status === 'Rejected') && canManageTimetable && (
                                <Button variant="danger" onClick={() => { setTimetableToDelete(selectedTimetable); setIsDeleteModalOpen(true); }}><TrashIcon /> Delete</Button>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
                {user.role === UserRole.Admin && (
                    <div className="lg:col-span-1">
                        <Card title="Manage Holidays">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">Active Holidays</h4>
                                    {holidays.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {holidays.map(day => (
                                                <span key={day} className="bg-cu-accent text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                                                    {day}
                                                    <button onClick={() => handleRemoveHoliday(day)} className="text-white hover:text-gray-200 transition-colors">
                                                        <XIcon className="w-4 h-4" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No custom holidays defined.</p>
                                    )}
                                </div>
                                <form onSubmit={handleAddHoliday} className="flex gap-2 border-t pt-4">
                                    <input
                                        type="text"
                                        value={newHoliday}
                                        onChange={e => setNewHoliday(e.target.value)}
                                        placeholder="e.g., Friday"
                                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-cu-accent focus:border-cu-accent"
                                    />
                                    <Button type="submit"><PlusIcon className="w-5 h-5"/> Add</Button>
                                </form>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {conflictCheckRun && (
                <div className={`mt-4 p-4 rounded-md ${conflicts.length > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                        <div className="flex justify-between items-start">
                        <div>
                            <h4 className={`font-bold ${conflicts.length > 0 ? 'text-red-800' : 'text-green-800'}`}>
                                {isCheckingConflicts ? 'Checking for conflicts...' : (conflicts.length > 0 ? `${conflicts.length} conflict(s) found:` : 'No conflicts found.')}
                            </h4>
                            {conflicts.length > 0 && !isCheckingConflicts && (
                                <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                                    {conflicts.slice(0, 5).map((c, i) => (
                                        <li key={i}>{c.message} on <strong>{c.day}</strong> at <strong>{c.timeSlot}</strong>.</li>
                                    ))}
                                    {conflicts.length > 5 && <li>...and {conflicts.length - 5} more.</li>}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {selectedTimetable ? (
                 <Timetable 
                    data={filteredEntries} 
                    isEditable={false}
                    holidays={holidays}
                    conflicts={conflicts}
                />
            ) : (
                <Card><p className="text-center text-gray-500 py-8">No timetable selected or available.</p></Card>
            )}

            {/* Modals */}
            <CreateTimetableModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateNewDraft} />
            <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Timetable">
                <div className="space-y-4">
                    <p>Please provide a reason for rejecting this timetable. This will be sent as a notification.</p>
                    <textarea value={rejectionNotes} onChange={e => setRejectionNotes(e.target.value)} rows={3} className="w-full p-2 border rounded-md"></textarea>
                    <div className="flex justify-end"><Button variant="danger" onClick={handleReject}>Reject</Button></div>
                </div>
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <p className="text-gray-700">Are you sure you want to permanently delete Version {timetableToDelete?.version}? This action cannot be undone.</p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </div>
            </Modal>
        </div>
    );
};

// --- Management Page ---
const ManagementPage = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // States for editing/adding
    const [editingClassroom, setEditingClassroom] = useState<Partial<Classroom> | null>(null);
    const [editingFaculty, setEditingFaculty] = useState<Partial<Faculty> | null>(null);
    const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);
    const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [classroomsData, facultyData] = await Promise.all([getClassrooms(), getFaculty()]);
            setClassrooms(classroomsData);
            setFaculty(facultyData);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleOpenClassroomModal = (classroom: Partial<Classroom> | null = null) => {
        setEditingClassroom(classroom || { name: '', capacity: 30 });
        setIsClassroomModalOpen(true);
    };

    const handleSaveClassroom = async () => {
        if (!editingClassroom) return;
        let updatedClassrooms;
        if(editingClassroom.id) {
            updatedClassrooms = await updateClassroom(editingClassroom.id, editingClassroom);
        } else {
            updatedClassrooms = await addClassroom({ name: editingClassroom.name || '', capacity: editingClassroom.capacity || 0 });
        }
        setClassrooms(updatedClassrooms);
        setIsClassroomModalOpen(false);
    };
    
    const handleDeleteClassroom = async (id: string) => {
        setClassrooms(await deleteClassroom(id));
    };

    const handleOpenFacultyModal = (member: Partial<Faculty> | null = null) => {
        setEditingFaculty(member || { name: '', department: '', workload: 12, availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] });
        setIsFacultyModalOpen(true);
    };

    const handleSaveFaculty = async () => {
        if (!editingFaculty) return;
        let updatedFaculty;
        if (editingFaculty.id) {
            updatedFaculty = await updateFacultyMember(editingFaculty.id, editingFaculty);
        } else {
            updatedFaculty = await addFacultyMember({
                name: editingFaculty.name || '',
                department: editingFaculty.department || '',
                workload: editingFaculty.workload || 0,
                availability: editingFaculty.availability || []
            });
        }
        setFaculty(updatedFaculty);
        setIsFacultyModalOpen(false);
    };

    const handleDeleteFaculty = async (id: string) => {
        setFaculty(await deleteFacultyMember(id));
    };


    if (isLoading) return <div>Loading Management Data...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Classroom Management">
                <Button onClick={() => handleOpenClassroomModal()} className="mb-4"><PlusIcon /> Add Classroom</Button>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {classrooms.map(c => (
                        <div key={c.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-semibold text-cu-dark">{c.name} <span className="text-sm font-normal text-gray-500">(Capacity: {c.capacity})</span></p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="p-2 h-8" onClick={() => handleOpenClassroomModal(c)}><EditIcon className="w-4 h-4" /></Button>
                                <Button variant="danger" className="p-2 h-8" onClick={() => handleDeleteClassroom(c.id)}><TrashIcon className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Faculty Management">
                <Button onClick={() => handleOpenFacultyModal()} className="mb-4"><PlusIcon /> Add Faculty Member</Button>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {faculty.map(f => (
                        <div key={f.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-semibold text-cu-dark">{f.name} <span className="text-sm font-normal text-gray-500">({f.department})</span></p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="p-2 h-8" onClick={() => handleOpenFacultyModal(f)}><EditIcon className="w-4 h-4" /></Button>
                                <Button variant="danger" className="p-2 h-8" onClick={() => handleDeleteFaculty(f.id)}><TrashIcon className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Classroom Modal */}
            <Modal isOpen={isClassroomModalOpen} onClose={() => setIsClassroomModalOpen(false)} title={editingClassroom?.id ? "Edit Classroom" : "Add Classroom"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" value={editingClassroom?.name || ''} onChange={e => setEditingClassroom({...editingClassroom, name: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                        <input type="number" value={editingClassroom?.capacity || ''} onChange={e => setEditingClassroom({...editingClassroom, capacity: parseInt(e.target.value)})} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div className="flex justify-end"><Button onClick={handleSaveClassroom}>Save</Button></div>
                </div>
            </Modal>

            {/* Faculty Modal */}
            <Modal isOpen={isFacultyModalOpen} onClose={() => setIsFacultyModalOpen(false)} title={editingFaculty?.id ? "Edit Faculty Member" : "Add Faculty Member"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" value={editingFaculty?.name || ''} onChange={e => setEditingFaculty({...editingFaculty, name: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <input type="text" value={editingFaculty?.department || ''} onChange={e => setEditingFaculty({...editingFaculty, department: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Workload (hours/week)</label>
                        <input type="number" value={editingFaculty?.workload || ''} onChange={e => setEditingFaculty({...editingFaculty, workload: parseInt(e.target.value)})} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                <label key={day} className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-gray-100">
                                    <input
                                        type="checkbox"
                                        checked={editingFaculty?.availability?.includes(day) || false}
                                        onChange={(e) => {
                                            const currentAvailability = editingFaculty?.availability || [];
                                            const newAvailability = e.target.checked
                                                ? [...currentAvailability, day]
                                                : currentAvailability.filter(d => d !== day);
                                            setEditingFaculty({ ...editingFaculty, availability: newAvailability });
                                        }}
                                        className="form-checkbox h-4 w-4 text-cu-primary rounded focus:ring-cu-accent"
                                    />
                                    <span className="text-sm">{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end"><Button onClick={handleSaveFaculty}>Save</Button></div>
                </div>
            </Modal>
        </div>
    );
};

// --- NOTIFICATIONS PAGE ---
const NotificationsPage = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    useEffect(() => {
        if(user) getNotifications(user).then(setNotifications);
    }, [user]);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        if (user) {
            getNotifications(user).then(setNotifications);
        }
    };

    return (
        <Card title="Notifications">
             {notifications.length > 0 ? (
                <ul className="space-y-4">
                    {notifications.map(n => (
                        <li key={n.id} className={`p-4 rounded-lg flex justify-between items-start gap-4 ${n.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
                            <div>
                                <p className="text-gray-800">{n.message}</p>
                                <span className="text-xs text-gray-500">{new Date(n.timestamp).toLocaleString()}</span>
                            </div>
                            {!n.isRead && <Button className="px-2 py-1 text-xs whitespace-nowrap" onClick={() => handleMarkAsRead(n.id)}>Mark as Read</Button>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 py-8">No notifications.</p>
            )}
        </Card>
    );
};

// --- ABOUT PAGE ---
const AboutPage = () => (
    <Card title="About the Smart Timetable Scheduler">
        <div className="space-y-4 text-gray-700">
            <p>This application is a proof-of-concept for the Smart India Hackathon (SIH), designed to demonstrate an intelligent, automated solution for university timetable scheduling.</p>
            <h4 className="font-semibold text-lg text-cu-primary pt-2">Key Objectives:</h4>
            <ul className="list-disc list-inside space-y-1">
                <li><strong>Automation:</strong> To drastically reduce the manual effort and time required to create a complex university timetable.</li>
                <li><strong>Conflict Resolution:</strong> To automatically generate clash-free schedules, ensuring no lecturer or classroom is double-booked.</li>
                <li><strong>Resource Optimization:</strong> To make the most efficient use of available classrooms and facilities based on capacity and type.</li>
                <li><strong>Fair Workload Distribution:</strong> To consider faculty preferences and workload constraints for a balanced schedule.</li>
                <li><strong>Role-Based Access:</strong> To provide a secure and tailored experience for administrators, lecturers, and students.</li>
            </ul>
            <p>This project leverages modern web technologies to provide a responsive, user-friendly interface for managing and viewing academic schedules.</p>
        </div>
    </Card>
);

// --- MAIN APP COMPONENT ---
const App = () => {
    const [currentPage, setCurrentPage] = useState('login');
    const { user } = useAuth();

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
    };
    
    useEffect(() => {
        if (!user) {
            setCurrentPage('login');
        }
    }, [user]);


    if (!user) {
        return <LoginPage onNavigate={handleNavigate} />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard': return <DashboardPage onNavigate={handleNavigate} />;
            case 'scheduler': return <SchedulerPage />;
            case 'management': return <ManagementPage />;
            case 'notifications': return <NotificationsPage />;
            case 'about': return <AboutPage />;
            default: return <DashboardPage onNavigate={handleNavigate} />;
        }
    };

    return (
        <DashboardLayout currentPage={currentPage} onNavigate={handleNavigate}>
            {renderPage()}
        </DashboardLayout>
    );
};

// --- RENDERER ---
const AppContainer = () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);

export default AppContainer;