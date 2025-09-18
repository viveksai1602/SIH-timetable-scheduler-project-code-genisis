import { UserRole, User, TimetableEntry, Classroom, Notification, Subject, NotificationTarget, Faculty, TimetableObject, TimetableStatus, Conflict } from '../types.ts';

// --- LOCAL STORAGE PERSISTENCE ---

const STORAGE_KEYS = {
    SUBJECTS: 'scheduler_subjects',
    CLASSROOMS: 'scheduler_classrooms',
    FACULTY: 'scheduler_faculty',
    NOTIFICATIONS: 'scheduler_notifications',
    TIMETABLES: 'scheduler_timetables',
    HOLIDAYS: 'scheduler_holidays',
    INITIALIZED: 'scheduler_initialized_v1'
};

const getFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, value: T) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error writing to localStorage key “${key}”:`, error);
    }
};


// --- MOCK DATABASE (Initial Default Data) ---

const DEFAULT_USERS: Record<string, User> = {
  'admin01': { id: 'admin01', name: 'Dr. Admin', role: UserRole.Admin },
  'lecturer01': { id: 'lecturer01', name: 'Prof. Smith', role: UserRole.Lecturer },
  'lecturer02': { id: 'lecturer02', name: 'Dr. Jones', role: UserRole.Lecturer },
  'lecturer03': { id: 'lecturer03', name: 'Ms. Davis', role: UserRole.Lecturer },
  'lecturer04': { id: 'lecturer04', name: 'Dr. Emily Carter', role: UserRole.Lecturer },
  'lecturer05': { id: 'lecturer05', name: 'Prof. David Chen', role: UserRole.Lecturer },
  'lecturer06': { id: 'lecturer06', name: 'Dr. Sarah Miller', role: UserRole.Lecturer },
  'lecturer07': { id: 'lecturer07', name: 'Prof. Michael Brown', role: UserRole.Lecturer },
  'lecturer08': { id: 'lecturer08', name: 'Dr. Linda Wilson', role: UserRole.Lecturer },
  'lecturer09': { id: 'lecturer09', name: 'Prof. Robert Taylor', role: UserRole.Lecturer },
  'lecturer10': { id: 'lecturer10', name: 'Dr. Jessica Martinez', role: UserRole.Lecturer },
  'lecturer11': { id: 'lecturer11', name: 'Prof. William Anderson', role: UserRole.Lecturer },
  'lecturer12': { id: 'lecturer12', name: 'Dr. Karen Thompson', role: UserRole.Lecturer },
  'lecturer13': { id: 'lecturer13', name: 'Prof. Charles White', role: UserRole.Lecturer },
  'lecturer14': { id: 'lecturer14', name: 'Dr. Patricia Harris', role: UserRole.Lecturer },
  'lecturer15': { id: 'lecturer15', name: 'Prof. Christopher Clark', role: UserRole.Lecturer },
  'lecturer16': { id: 'lecturer16', name: 'Dr. Nancy Rodriguez', role: UserRole.Lecturer },
  'lecturer17': { id: 'lecturer17', name: 'Prof. Daniel Lewis', role: UserRole.Lecturer },
  'lecturer18': { id: 'lecturer18', name: 'Dr. Betty Walker', role: UserRole.Lecturer },
  'lecturer_sports': { id: 'lecturer_sports', name: 'Sports Instructor', role: UserRole.Lecturer },
  'lecturer_library': { id: 'lecturer_library', name: 'Librarian', role: UserRole.Lecturer },
  'student01': { id: 'student01', name: 'John Doe', role: UserRole.Student, section: 'Section A' },
};

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub01', name: 'Advanced React', code: 'CS401', lecturerId: 'lecturer01' },
  { id: 'sub02', name: 'Python for AI', code: 'AI302', lecturerId: 'lecturer02' },
  { id: 'sub03', name: 'Database Systems', code: 'DB201', lecturerId: 'lecturer02' },
  { id: 'sub04', name: 'UI/UX Design', code: 'DS101', lecturerId: 'lecturer03' },
  { id: 'sub05', name: 'Network Security', code: 'CS505', lecturerId: 'lecturer01' },
  { id: 'sub06', name: 'Cloud Computing', code: 'IT601', lecturerId: 'lecturer03' },
  { id: 'sub07', name: 'Machine Learning', code: 'AI401', lecturerId: 'lecturer02' },
  { id: 'sub08', name: 'Thermodynamics', code: 'ME201', lecturerId: 'lecturer04' },
  { id: 'sub09', name: 'Circuit Theory', code: 'EE201', lecturerId: 'lecturer05' },
  { id: 'sub10', name: 'Structural Analysis', code: 'CE301', lecturerId: 'lecturer06' },
  { id: 'sub11', name: 'Biochemistry', code: 'BT202', lecturerId: 'lecturer07' },
  { id: 'sub12', name: 'Quantum Mechanics', code: 'PH301', lecturerId: 'lecturer08' },
  { id: 'sub13', name: 'Organic Chemistry', code: 'CH201', lecturerId: 'lecturer09' },
  { id: 'sub14', name: 'Linear Algebra', code: 'MA201', lecturerId: 'lecturer10' },
  { id: 'sub15', name: 'Modern Literature', code: 'EN205', lecturerId: 'lecturer11' },
  { id: 'sub16', name: 'Business Strategy', code: 'MG401', lecturerId: 'lecturer12' },
  { id: 'sub17', name: 'Microeconomics', code: 'EC101', lecturerId: 'lecturer13' },
  { id: 'sub18', name: 'World History', code: 'HS101', lecturerId: 'lecturer14' },
  { id: 'sub19', name: 'Social Theory', code: 'SO201', lecturerId: 'lecturer15' },
  { id: 'sub20', name: 'Cognitive Psychology', code: 'PS301', lecturerId: 'lecturer16' },
  { id: 'sub21', name: 'Data Structures', code: 'IT201', lecturerId: 'lecturer17' },
  { id: 'sub22', name: 'Ecology', code: 'ES201', lecturerId: 'lecturer18' },
  { id: 'sub_sports', name: 'Sports', code: 'PE101', lecturerId: 'lecturer_sports' },
  { id: 'sub_library', name: 'Library', code: 'LIB101', lecturerId: 'lecturer_library' },
];

const DEFAULT_CLASSROOMS: Classroom[] = [
  { id: 'cr01', name: 'Room 101', capacity: 50, isAvailable: true },
  { id: 'cr02', name: 'Lab A', capacity: 30, isAvailable: true },
  { id: 'cr03', name: 'Room 203', capacity: 60, isAvailable: false },
  { id: 'cr04', name: 'Hall B', capacity: 120, isAvailable: true },
  { id: 'cr05', name: 'Room 102', capacity: 50, isAvailable: true },
  { id: 'cr06', name: 'Lab B', capacity: 40, isAvailable: true },
  { id: 'cr07', name: 'Seminar Hall C', capacity: 150, isAvailable: true },
  { id: 'cr08', name: 'Room 301', capacity: 70, isAvailable: false },
  { id: 'cr09', name: 'Room 103', capacity: 50, isAvailable: true },
  { id: 'cr10', name: 'Room 104', capacity: 50, isAvailable: true },
  { id: 'cr11', name: 'Room 201', capacity: 60, isAvailable: true },
  { id: 'cr12', name: 'Room 202', capacity: 60, isAvailable: false },
  { id: 'cr13', name: 'Room 302', capacity: 70, isAvailable: true },
  { id: 'cr14', name: 'Room 303', capacity: 70, isAvailable: true },
  { id: 'cr15', name: 'Room 401', capacity: 80, isAvailable: true },
  { id: 'cr16', name: 'Room 402', capacity: 80, isAvailable: false },
  { id: 'cr17', name: 'Lab C', capacity: 40, isAvailable: true },
  { id: 'cr18', name: 'Lab D', capacity: 40, isAvailable: true },
  { id: 'cr19', name: 'Seminar Hall D', capacity: 150, isAvailable: false },
  { id: 'cr20', name: 'Auditorium A', capacity: 300, isAvailable: true },
  { id: 'cr21', name: 'Smart Room 1', capacity: 35, isAvailable: true },
  { id: 'cr22', name: 'Smart Room 2', capacity: 35, isAvailable: true },
  { id: 'cr23', name: 'E-Classroom 1', capacity: 60, isAvailable: false },
  { id: 'cr24', name: 'E-Classroom 2', capacity: 60, isAvailable: true },
  { id: 'cr25', name: 'Tutorial Room 1', capacity: 25, isAvailable: true },
  { id: 'cr26', name: 'Tutorial Room 2', capacity: 25, isAvailable: true },
  { id: 'cr27', name: 'Conference Hall', capacity: 100, isAvailable: false },
  { id: 'cr28', name: 'Drawing Hall', capacity: 90, isAvailable: true },
];

const DEFAULT_FACULTY: Faculty[] = [
    { id: 'lecturer01', name: 'Prof. Smith', department: 'Computer Science', workload: 12, availability: ['Monday', 'Wednesday', 'Friday'] },
    { id: 'lecturer02', name: 'Dr. Jones', department: 'Artificial Intelligence', workload: 15, availability: ['Tuesday', 'Thursday'] },
    { id: 'lecturer03', name: 'Ms. Davis', department: 'Design', workload: 10, availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 'lecturer04', name: 'Dr. Emily Carter', department: 'Mechanical Engineering', workload: 14, availability: ['Monday', 'Tuesday', 'Wednesday'] },
    { id: 'lecturer05', name: 'Prof. David Chen', department: 'Electrical Engineering', workload: 13, availability: ['Tuesday', 'Wednesday', 'Thursday'] },
    { id: 'lecturer06', name: 'Dr. Sarah Miller', department: 'Civil Engineering', workload: 16, availability: ['Monday', 'Wednesday', 'Friday'] },
    { id: 'lecturer07', name: 'Prof. Michael Brown', department: 'Biotechnology', workload: 11, availability: ['Thursday', 'Friday'] },
    { id: 'lecturer08', name: 'Dr. Linda Wilson', department: 'Physics', workload: 14, availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'] },
    { id: 'lecturer09', name: 'Prof. Robert Taylor', department: 'Chemistry', workload: 12, availability: ['Monday', 'Wednesday', 'Friday'] },
    { id: 'lecturer10', name: 'Dr. Jessica Martinez', department: 'Mathematics', workload: 15, availability: ['Tuesday', 'Thursday'] },
    { id: 'lecturer11', name: 'Prof. William Anderson', department: 'English', workload: 9, availability: ['Monday', 'Tuesday', 'Wednesday'] },
    { id: 'lecturer12', name: 'Dr. Karen Thompson', department: 'Management', workload: 13, availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 'lecturer13', name: 'Prof. Charles White', department: 'Economics', workload: 14, availability: ['Monday', 'Wednesday'] },
    { id: 'lecturer14', name: 'Dr. Patricia Harris', department: 'History', workload: 10, availability: ['Tuesday', 'Thursday', 'Friday'] },
    { id: 'lecturer15', name: 'Prof. Christopher Clark', department: 'Sociology', workload: 12, availability: ['Monday', 'Wednesday', 'Friday'] },
    { id: 'lecturer16', name: 'Dr. Nancy Rodriguez', department: 'Psychology', workload: 15, availability: ['Monday', 'Tuesday', 'Thursday'] },
    { id: 'lecturer17', name: 'Prof. Daniel Lewis', department: 'Information Technology', workload: 16, availability: ['Wednesday', 'Thursday', 'Friday'] },
    { id: 'lecturer18', name: 'Dr. Betty Walker', department: 'Environmental Science', workload: 11, availability: ['Tuesday', 'Wednesday'] },
    { id: 'lecturer_sports', name: 'Sports Instructor', department: 'Physical Education', workload: 10, availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 'lecturer_library', name: 'Librarian', department: 'Library', workload: 10, availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
    { id: 'n01', message: 'Timetable updated for Friday.', timestamp: '2024-07-29T10:00:00Z', isRead: false, target: NotificationTarget.All },
    { id: 'n02', message: 'CS401 class on Tuesday is cancelled.', timestamp: '2024-07-28T15:30:00Z', isRead: false, target: NotificationTarget.Student, section: 'Section A' },
    { id: 'n03', message: 'Welcome to the new semester!', timestamp: '2024-07-25T09:00:00Z', isRead: true, target: NotificationTarget.All },
    { id: 'n04', message: 'Faculty meeting at 4 PM today.', timestamp: '2024-07-29T09:00:00Z', isRead: false, target: NotificationTarget.Lecturer },
    { id: 'n05', message: 'Timetable v2 is ready for review.', timestamp: '2024-07-29T11:00:00Z', isRead: false, target: NotificationTarget.Admin },
];

const DEFAULT_TIMETABLES: TimetableObject[] = [
    {
        id: 'tt01', version: 1, status: 'Approved', createdAt: '2024-07-20T10:00:00Z',
        entries: [
            { day: 'Monday', timeSlot: '09:00-10:00', subject: 'Advanced React', lecturer: 'Prof. Smith', classroom: 'Room 101', section: 'Section A'},
            { day: 'Tuesday', timeSlot: '10:10-11:10', subject: 'Python for AI', lecturer: 'Dr. Jones', classroom: 'Lab A', section: 'Section B'},
            { day: 'Wednesday', timeSlot: '13:10-14:10', subject: 'Database Systems', lecturer: 'Dr. Jones', classroom: 'Room 203', section: 'Section A'},
            { day: 'Wednesday', timeSlot: '11:10-12:10', subject: 'UI/UX Design', lecturer: 'Ms. Davis', classroom: 'Room 102', section: 'Section B'},
            { day: 'Friday', timeSlot: '14:10-15:10', subject: 'Network Security', lecturer: 'Prof. Smith', classroom: 'Hall B', section: 'Section A'},
        ],
    }
];

const DEFAULT_HOLIDAYS: string[] = ['Saturday']; // Default holiday

// --- LIVE DATA (from localStorage or defaults) ---
const users: Record<string, User> = DEFAULT_USERS; // Users are static for now
let subjects: Subject[] = getFromStorage(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
let classrooms: Classroom[] = getFromStorage(STORAGE_KEYS.CLASSROOMS, DEFAULT_CLASSROOMS);
let faculty: Faculty[] = getFromStorage(STORAGE_KEYS.FACULTY, DEFAULT_FACULTY);
let notifications: Notification[] = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
let timetables: TimetableObject[] = getFromStorage(STORAGE_KEYS.TIMETABLES, DEFAULT_TIMETABLES);
let holidays: string[] = getFromStorage(STORAGE_KEYS.HOLIDAYS, DEFAULT_HOLIDAYS);

// Store cancelled classes for the current session. This is not persisted.
let cancelledClasses: TimetableEntry[] = [];

const initializePersistentData = () => {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
        console.log("First time setup: Seeding data into localStorage.");
        saveToStorage(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
        saveToStorage(STORAGE_KEYS.CLASSROOMS, DEFAULT_CLASSROOMS);
        saveToStorage(STORAGE_KEYS.FACULTY, DEFAULT_FACULTY);
        saveToStorage(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
        saveToStorage(STORAGE_KEYS.TIMETABLES, DEFAULT_TIMETABLES);
        saveToStorage(STORAGE_KEYS.HOLIDAYS, DEFAULT_HOLIDAYS);
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
};

initializePersistentData();


// --- MOCK API FUNCTIONS ---

const delay = <T,>(data: T, duration = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), duration));

export const mockLogin = (role: UserRole): Promise<User> => {
  const user = Object.values(users).find(u => u.role === role);
  // Reset cancellations on new login
  cancelledClasses = [];
  return delay(user || users['student01']);
};

export const getDashboardData = (user: User) => {
    let upcomingClasses: (TimetableEntry & { isMyClass: boolean })[] = [];

    if (user.role !== UserRole.Admin) {
        const approvedTimetable = timetables.find(t => t.status === 'Approved');
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = dayNames[new Date().getDay()];
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        let upcomingClassesRaw = (approvedTimetable?.entries || [])
            .filter(entry => {
                const endTime = entry.timeSlot.split('-')[1];
                const isToday = entry.day === todayName;
                const isUpcoming = endTime > currentTime;

                // Check if class is cancelled
                const isCancelled = cancelledClasses.some(cancelled => 
                    cancelled.day === entry.day &&
                    cancelled.timeSlot === entry.timeSlot &&
                    cancelled.section === entry.section &&
                    cancelled.subject === entry.subject
                );

                return isToday && isUpcoming && !isCancelled;
            })
            .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
        
        if (user.role === UserRole.Lecturer) {
            upcomingClassesRaw = upcomingClassesRaw.filter(entry => entry.lecturer === user.name);
        } else if (user.role === UserRole.Student && user.section) {
            upcomingClassesRaw = upcomingClassesRaw.filter(entry => entry.section === user.section);
        }

        upcomingClasses = upcomingClassesRaw.map(c => ({
            ...c,
            isMyClass: user.role === UserRole.Lecturer && c.lecturer === user.name,
        }));
    }
    
    // Correctly filter subjects based on the logged-in lecturer's ID
    const mySubjects = user.role === UserRole.Student 
        ? [] 
        : subjects.filter(s => s.lecturerId === user.id).map(s => s.name);
    
    const pendingReviewCount = timetables.filter(t => t.status === 'Pending Approval').length;
    const recentTimetables = timetables.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0,3);

    const quickActions = {
      [UserRole.Admin]: [
        { label: 'Generate Timetable', type: 'navigate', target: 'scheduler' },
        { label: 'Manage Classrooms & Faculty', type: 'navigate', target: 'management' },
        { label: 'Send Notification', type: 'modal', target: 'sendNotification' },
      ],
      [UserRole.Lecturer]: [
         { label: 'Generate Timetable', type: 'navigate', target: 'scheduler' },
         { label: 'Update My Subjects', type: 'modal', target: 'manageSubjects' },
         { label: 'Send Notification', type: 'modal', target: 'sendNotification' },
      ],
      [UserRole.Student]: [
         { label: 'View Full Timetable', type: 'navigate', target: 'scheduler' },
      ],
    }[user.role];


    return delay({ upcomingClasses, mySubjects, quickActions, pendingReviewCount, recentTimetables });
};

export const getSubjects = (): Promise<Subject[]> => delay(subjects);
export const getClassrooms = (): Promise<Classroom[]> => delay(classrooms);
export const getFaculty = (): Promise<Faculty[]> => delay(faculty);

export const createNewDraftTimetable = (constraints: { sections?: string[], minClassesPerDay?: number, maxClassesPerDay?: number }): Promise<TimetableObject> => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00-10:00', '10:10-11:10', '11:10-12:10', '13:10-14:10', '14:10-15:10', '15:20-16:20'];
    
    const scheduleDays = days.filter(d => !holidays.includes(d));
    const sectionsToGenerate = constraints.sections && constraints.sections.length > 0 ? constraints.sections : ['A'];
    const minClasses = constraints.minClassesPerDay ?? 2;
    const maxClasses = constraints.maxClassesPerDay ?? 4;
  
    const newTimetableEntries: TimetableEntry[] = [];
    // Bookings map tracks {lecturer, classroom} usage for a specific {day, timeSlot} across all sections
    const bookings = new Map<string, { lecturers: Set<string>, classrooms: Set<string> }>();
  
    sectionsToGenerate.forEach(section => {
        const sectionName = `Section ${section}`;
        const sportsSubject = subjects.find(s => s.name === 'Sports');
        const librarySubject = subjects.find(s => s.name === 'Library');
        
        // --- Stage 1: Schedule mandatory periods first to guarantee their placement ---
        const mandatorySubjects = [
            ...(sportsSubject ? Array(2).fill(sportsSubject) : []),
            ...(librarySubject ? Array(2).fill(librarySubject) : [])
        ];
        
        mandatorySubjects.forEach(subject => {
            let isScheduled = false;
            // Try to place the mandatory class, shuffling days and slots to randomize
            const shuffledDays = [...scheduleDays].sort(() => 0.5 - Math.random());
            for (const day of shuffledDays) {
                const lecturer = faculty.find(f => f.id === subject.lecturerId);
                // Check if lecturer is available on this day
                if (!lecturer || !lecturer.availability.includes(day)) continue;

                const shuffledSlots = [...timeSlots].sort(() => 0.5 - Math.random());
                for (const slot of shuffledSlots) {
                    // Check if section is already busy at this time
                    const isSectionBusy = newTimetableEntries.some(e => e.day === day && e.timeSlot === slot && e.section === sectionName);
                    if (isSectionBusy) continue;

                    const bookingKey = `${day}-${slot}`;
                    const slotBookings = bookings.get(bookingKey) || { lecturers: new Set(), classrooms: new Set() };
                    
                    // Check if lecturer is busy at this time (with another section)
                    if (slotBookings.lecturers.has(lecturer.name)) continue;
                    
                    const classroomName = subject.name === 'Sports' ? 'Ground' : 'Library';
                    
                    // Add the class to the timetable
                    newTimetableEntries.push({
                        day: day,
                        timeSlot: slot,
                        subject: subject.name,
                        lecturer: lecturer.name,
                        classroom: classroomName,
                        section: sectionName
                    });
                    
                    // Update bookings for this slot
                    slotBookings.lecturers.add(lecturer.name);
                    bookings.set(bookingKey, slotBookings);
                    isScheduled = true;
                    break; // Exit slots loop once scheduled
                }
                if (isScheduled) break; // Exit days loop once scheduled
            }
        });

        // --- Stage 2: Fill remaining slots with academic subjects ---
        scheduleDays.forEach(day => {
            const classesAlreadyScheduled = newTimetableEntries.filter(e => e.day === day && e.section === sectionName).length;
            const totalClassesForDay = Math.floor(Math.random() * (maxClasses - minClasses + 1)) + minClasses;
            const academicClassesToSchedule = Math.max(0, totalClassesForDay - classesAlreadyScheduled);

            if (academicClassesToSchedule === 0) return;

            const availableFacultyIds = faculty.filter(f => f.availability.includes(day)).map(f => f.id);
            const academicSubjects = subjects.filter(s => 
                availableFacultyIds.includes(s.lecturerId) && s.name !== 'Sports' && s.name !== 'Library'
            );
            
            const shuffledSlots = [...timeSlots].sort(() => 0.5 - Math.random());
            const availableClassrooms = classrooms.filter(c => c.isAvailable).sort(() => 0.5 - Math.random());
            let scheduledCount = 0;

            for (const slot of shuffledSlots) {
                if (scheduledCount >= academicClassesToSchedule) break;

                // Check if section is already busy
                const isSectionBusy = newTimetableEntries.some(e => e.day === day && e.timeSlot === slot && e.section === sectionName);
                if (isSectionBusy) continue;

                const bookingKey = `${day}-${slot}`;
                const slotBookings = bookings.get(bookingKey) || { lecturers: new Set(), classrooms: new Set() };
                
                // Try to find an available subject/lecturer/classroom for this slot
                for (const subject of [...academicSubjects].sort(() => 0.5 - Math.random())) {
                    const lecturer = Object.values(users).find(u => u.id === subject.lecturerId);
                    if (!lecturer || slotBookings.lecturers.has(lecturer.name)) continue;
                    
                    const classroom = availableClassrooms.find(cr => !slotBookings.classrooms.has(cr.name));
                    if (classroom) {
                        newTimetableEntries.push({
                            day: day,
                            timeSlot: slot,
                            subject: subject.name,
                            lecturer: lecturer.name,
                            classroom: classroom.name,
                            section: sectionName
                        });

                        slotBookings.lecturers.add(lecturer.name);
                        slotBookings.classrooms.add(classroom.name);
                        bookings.set(bookingKey, slotBookings);
                        
                        scheduledCount++;
                        break; // Exit subjects loop
                    }
                }
            }
        });
    });
  
    const newTimetable: TimetableObject = {
        id: `tt${Date.now()}`,
        version: timetables.length + 1,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        entries: newTimetableEntries,
    };
    timetables.push(newTimetable);
    saveToStorage(STORAGE_KEYS.TIMETABLES, timetables);
    return delay(newTimetable, 2000);
};


export const createDraftFromTimetable = (sourceTimetableId: string): Promise<TimetableObject | null> => {
    const source = timetables.find(t => t.id === sourceTimetableId);
    if (!source) return delay(null, 300);

    const newTimetable: TimetableObject = {
        id: `tt${Date.now()}`,
        version: Math.max(...timetables.map(t => t.version), 0) + 1, // Ensure new version is highest
        status: 'Draft',
        createdAt: new Date().toISOString(),
        entries: JSON.parse(JSON.stringify(source.entries)), // Deep copy
        notes: `Draft created from Version ${source.version}`,
    };
    timetables.push(newTimetable);
    saveToStorage(STORAGE_KEYS.TIMETABLES, timetables);
    return delay(newTimetable, 1000);
};

export const getTimetables = (): Promise<TimetableObject[]> => delay([...timetables]);

export const getHolidays = (): Promise<string[]> => delay([...holidays]);

export const setHolidays = (newHolidays: string[]): Promise<boolean> => {
    holidays = newHolidays;
    saveToStorage(STORAGE_KEYS.HOLIDAYS, holidays);
    return delay(true);
};

export const getNotifications = (user: User): Promise<Notification[]> => {
    const userRoleString = user.role as string;
    const filtered = notifications.filter(n => {
        // General role-based filtering
        const isTargeted = n.target === NotificationTarget.All || n.target === userRoleString;
        if (!isTargeted) return false;

        // Section-specific filtering for students
        if (user.role === UserRole.Student && n.section) {
            return n.section === user.section;
        }

        return true;
    });
    return delay(filtered.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
};

export const sendNotification = (message: string, target: NotificationTarget, section?: string): Promise<boolean> => {
    const newNotif: Notification = {
        id: `n${Date.now()}`, message, timestamp: new Date().toISOString(), isRead: false, target, section
    };
    notifications.unshift(newNotif);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return delay(true);
};

export const saveTimetable = (timetableId: string, newEntries: TimetableEntry[]): Promise<boolean> => {
    const timetable = timetables.find(t => t.id === timetableId);
    if (timetable && (timetable.status === 'Draft' || timetable.status === 'Rejected')) {
        timetable.entries = newEntries;
        saveToStorage(STORAGE_KEYS.TIMETABLES, timetables);
        return delay(true, 300);
    }
    return delay(false, 300);
};

export const submitForReview = (timetableId: string): Promise<TimetableObject | undefined> => {
    const timetable = timetables.find(t => t.id === timetableId);
    if (timetable) {
        timetable.status = 'Pending Approval';
        saveToStorage(STORAGE_KEYS.TIMETABLES, timetables);
        sendNotification(`Timetable v${timetable.version} has been submitted for your review.`, NotificationTarget.Admin);
    }
    return delay( timetable);
};

export const approveTimetable = (timetableId: string): Promise<TimetableObject | undefined> => {
    timetables.forEach(t => {
        if (t.status === 'Approved') {
            t.status = 'Rejected'; 
            t.notes = "Superseded by new approved version.";
        }
    });
    const timetable = timetables.find(t => t.id === timetableId);
    if (timetable) {
        timetable.status = 'Approved';
        saveToStorage(STORAGE_KEYS.TIMETABLES, timetables);
        sendNotification(`Timetable v${timetable.version} has been approved and is now active.`, NotificationTarget.All);
    }
    return delay(timetable);
};

export const rejectTimetable = (timetableId: string, notes: string): Promise<TimetableObject | undefined> => {
    const timetable = timetables.find(t => t.id === timetableId);
    if (timetable) {
        timetable.status = 'Rejected';
        timetable.notes = notes;
        saveToStorage(STORAGE_KEYS.TIMETABLES, timetables);
        sendNotification(`Timetable v${timetable.version} was rejected. Reason: ${notes}`, NotificationTarget.Admin);
    }
    return delay(timetable);
};

export const deleteTimetable = (timetableId: string): Promise<boolean> => {
    const initialLength = timetables.length;
    timetables = timetables.filter(t => t.id !== timetableId);
    saveToStorage(STORAGE_KEYS.TIMETABLES, timetables);
    return delay(timetables.length < initialLength);
};

export const markNotificationAsRead = (notificationId: string): Promise<Notification[]> => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) notification.isRead = true;
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return delay([...notifications]);
};

export const addSubject = (newSubject: Omit<Subject, 'id'>): Promise<Subject[]> => {
    const subject: Subject = { ...newSubject, id: `sub${Date.now()}` };
    subjects.push(subject);
    saveToStorage(STORAGE_KEYS.SUBJECTS, subjects);
    return delay([...subjects]);
};

export const deleteSubject = (subjectId: string): Promise<Subject[]> => {
    subjects = subjects.filter(s => s.id !== subjectId);
    saveToStorage(STORAGE_KEYS.SUBJECTS, subjects);
    return delay([...subjects]);
};

export const cancelClass = (classToCancel: TimetableEntry): Promise<boolean> => {
    cancelledClasses.push(classToCancel);
    const message = `CLASS CANCELLED: The ${classToCancel.subject} class (${classToCancel.section}) with ${classToCancel.lecturer} at ${classToCancel.timeSlot} in ${classToCancel.classroom} has been cancelled.`;
    sendNotification(message, NotificationTarget.Student, classToCancel.section);
    return delay(true);
};

// --- New CRUD for Management ---
export const addClassroom = (classroom: Omit<Classroom, 'id' | 'isAvailable'>): Promise<Classroom[]> => {
    const newClassroom: Classroom = { ...classroom, id: `cr${Date.now()}`, isAvailable: true };
    classrooms.push(newClassroom);
    saveToStorage(STORAGE_KEYS.CLASSROOMS, classrooms);
    return delay([...classrooms]);
};

export const updateClassroom = (id: string, updatedData: Partial<Omit<Classroom, 'id' | 'isAvailable'>>): Promise<Classroom[]> => {
    const classroomIndex = classrooms.findIndex(c => c.id === id);
    if (classroomIndex > -1) {
        classrooms[classroomIndex] = { ...classrooms[classroomIndex], ...updatedData };
        saveToStorage(STORAGE_KEYS.CLASSROOMS, classrooms);
    }
    return delay([...classrooms]);
};

export const deleteClassroom = (id: string): Promise<Classroom[]> => {
    classrooms = classrooms.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLASSROOMS, classrooms);
    return delay([...classrooms]);
};

export const addFacultyMember = (facultyMember: Omit<Faculty, 'id'>): Promise<Faculty[]> => {
    const newFaculty: Faculty = { ...facultyMember, id: `lecturer${Date.now()}` };
    faculty.push(newFaculty);
    saveToStorage(STORAGE_KEYS.FACULTY, faculty);
    return delay([...faculty]);
}

export const updateFacultyMember = (id: string, updatedData: Partial<Omit<Faculty, 'id'>>): Promise<Faculty[]> => {
    const facultyIndex = faculty.findIndex(f => f.id === id);
    if (facultyIndex > -1) {
        faculty[facultyIndex] = { ...faculty[facultyIndex], ...updatedData };
        saveToStorage(STORAGE_KEYS.FACULTY, faculty);
    }
    return delay([...faculty]);
};

export const deleteFacultyMember = (id: string): Promise<Faculty[]> => {
    faculty = faculty.filter(f => f.id !== id);
    saveToStorage(STORAGE_KEYS.FACULTY, faculty);
    return delay([...faculty]);
}

export const checkForConflicts = (timetableId: string): Promise<Conflict[]> => {
    const timetable = timetables.find(t => t.id === timetableId);
    if (!timetable) return delay([]);

    const conflicts: Conflict[] = [];
    const timeSlotMap = new Map<string, TimetableEntry[]>();

    timetable.entries.forEach(entry => {
        const key = `${entry.day}-${entry.timeSlot}`;
        if (!timeSlotMap.has(key)) {
            timeSlotMap.set(key, []);
        }
        timeSlotMap.get(key)!.push(entry);
    });

    for (const entries of timeSlotMap.values()) {
        if (entries.length > 1) {
            const lecturerCounts = new Map<string, number>();
            const classroomCounts = new Map<string, number>();
            entries.forEach(entry => {
                lecturerCounts.set(entry.lecturer, (lecturerCounts.get(entry.lecturer) || 0) + 1);
                classroomCounts.set(entry.classroom, (classroomCounts.get(entry.classroom) || 0) + 1);
            });

            entries.forEach(entry => {
                if ((lecturerCounts.get(entry.lecturer) || 0) > 1) {
                    conflicts.push({ day: entry.day, timeSlot: entry.timeSlot, message: `Lecturer ${entry.lecturer} is double-booked.` });
                }
                if ((classroomCounts.get(entry.classroom) || 0) > 1) {
                    conflicts.push({ day: entry.day, timeSlot: entry.timeSlot, message: `Classroom ${entry.classroom} is double-booked.` });
                }
            });
        }
    }
    // Return unique conflicts
    const uniqueConflicts = Array.from(new Set(conflicts.map(c => JSON.stringify(c)))).map(s => JSON.parse(s));
    return delay(uniqueConflicts, 1000);
}

export const autoArrangeTimetable = (timetableId: string): Promise<TimetableObject | null> => {
    const timetable = timetables.find(t => t.id === timetableId);
    if (!timetable) return delay(null, 300);

    const timeSlotMap = new Map<string, TimetableEntry[]>();
    timetable.entries.forEach(entry => {
        const key = `${entry.day}-${entry.timeSlot}`;
        if (!timeSlotMap.has(key)) timeSlotMap.set(key, []);
        timeSlotMap.get(key)!.push(entry);
    });

    const entriesToMove: TimetableEntry[] = [];
    for (const entriesInSlot of timeSlotMap.values()) {
        const lecturerSet = new Set<string>();
        const classroomSet = new Set<string>();
        for (const entry of entriesInSlot) {
            // If a lecturer or classroom is already booked in this slot, this entry is a conflict
            if (lecturerSet.has(entry.lecturer) || classroomSet.has(entry.classroom)) {
                if (!entriesToMove.find(e => e === entry)) entriesToMove.push(entry);
            } else {
                lecturerSet.add(entry.lecturer);
                classroomSet.add(entry.classroom);
            }
        }
    }
    
    // Remove the entries to be moved from the main list temporarily
    timetable.entries = timetable.entries.filter(e => !entriesToMove.includes(e));

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00-10:00', '10:10-11:10', '11:10-12:10', '13:10-14:10', '14:10-15:10', '15:20-16:20'];

    entriesToMove.forEach(entryToMove => {
        let moved = false;
        for (const day of days) {
            if (holidays.includes(day)) continue;
            
            // Check faculty availability for the new day
            const lecturerFaculty = faculty.find(f => f.name === entryToMove.lecturer);
            if (!lecturerFaculty || !lecturerFaculty.availability.includes(day)) {
                continue; // Lecturer is not available on this day
            }

            for (const slot of timeSlots) {
                // More robust check: Is this new slot free for this section, this lecturer, AND this classroom?
                const isLecturerBusy = timetable.entries.some(e => e.day === day && e.timeSlot === slot && e.lecturer === entryToMove.lecturer);
                const isClassroomBusy = timetable.entries.some(e => e.day === day && e.timeSlot === slot && e.classroom === entryToMove.classroom);
                const isSectionBusy = timetable.entries.some(e => e.day === day && e.timeSlot === slot && e.section === entryToMove.section);

                if (!isLecturerBusy && !isClassroomBusy && !isSectionBusy) {
                    // This is a valid slot. Move the entry here.
                    entryToMove.day = day;
                    entryToMove.timeSlot = slot;
                    timetable.entries.push(entryToMove); // Add it back to the entries list
                    moved = true;
                    break;
                }
            }
            if (moved) break;
        }
        if(!moved) {
            // If no suitable slot was found, add it back to its original (conflicting) position
            // In a real app, we might want to flag this as an "unsolvable" conflict
            timetable.entries.push(entryToMove);
        }
    });
    
    saveToStorage(STORAGE_KEYS.TIMETABLES, timetables);
    return delay(JSON.parse(JSON.stringify(timetable)), 1500);
};