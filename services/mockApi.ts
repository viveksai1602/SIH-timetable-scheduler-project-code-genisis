import { UserRole, User, TimetableEntry, Classroom, Notification, Subject, NotificationTarget, Faculty, TimetableObject, TimetableStatus, Conflict } from '../types';

// --- MOCK DATABASE ---

const users: Record<string, User> = {
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
  'student01': { id: 'student01', name: 'John Doe', role: UserRole.Student, section: 'Section A' },
};

let subjects: Subject[] = [
  { id: 'sub01', name: 'Advanced React', code: 'CS401', lecturerId: 'lecturer01' },
  { id: 'sub02', name: 'Python for AI', code: 'AI302', lecturerId: 'lecturer02' },
  { id: 'sub03', name: 'Database Systems', code: 'DB201', lecturerId: 'lecturer02' },
  { id: 'sub04', name: 'UI/UX Design', code: 'DS101', lecturerId: 'lecturer03' },
  { id: 'sub05', name: 'Network Security', code: 'CS505', lecturerId: 'lecturer01' },
  { id: 'sub06', name: 'Cloud Computing', code: 'IT601', lecturerId: 'lecturer03' },
  { id: 'sub07', name: 'Machine Learning', code: 'AI401', lecturerId: 'lecturer02' },
];

let classrooms: Classroom[] = [
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

let faculty: Faculty[] = [
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
];

let notifications: Notification[] = [
    { id: 'n01', message: 'Timetable updated for Friday.', timestamp: '2024-07-29T10:00:00Z', isRead: false, target: NotificationTarget.All },
    { id: 'n02', message: 'CS401 class on Tuesday is cancelled.', timestamp: '2024-07-28T15:30:00Z', isRead: false, target: NotificationTarget.Student },
    { id: 'n03', message: 'Welcome to the new semester!', timestamp: '2024-07-25T09:00:00Z', isRead: true, target: NotificationTarget.All },
    { id: 'n04', message: 'Faculty meeting at 4 PM today.', timestamp: '2024-07-29T09:00:00Z', isRead: false, target: NotificationTarget.Lecturer },
    { id: 'n05', message: 'Timetable v2 is ready for review.', timestamp: '2024-07-29T11:00:00Z', isRead: false, target: NotificationTarget.Admin },
];

let timetables: TimetableObject[] = [
    {
        id: 'tt01', version: 1, status: 'Approved', createdAt: '2024-07-20T10:00:00Z',
        entries: [
            { day: 'Monday', timeSlot: '09:00-10:00', subject: 'Advanced React', lecturer: 'Prof. Smith', classroom: 'Room 101', section: 'Section A'},
            { day: 'Tuesday', timeSlot: '10:10-11:10', subject: 'Python for AI', lecturer: 'Dr. Jones', classroom: 'Lab A', section: 'Section B'},
            { day: 'Wednesday', timeSlot: '13:10-14:10', subject: 'Database Systems', lecturer: 'Dr. Jones', classroom: 'Room 203', section: 'Section A'},
        ],
    },
    {
        id: 'tt02', version: 2, status: 'Pending Approval', createdAt: '2024-07-28T14:00:00Z',
        entries: [
            { day: 'Monday', timeSlot: '09:00-10:00', subject: 'Advanced React', lecturer: 'Prof. Smith', classroom: 'Room 101', section: 'Section A'},
            { day: 'Wednesday', timeSlot: '11:10-12:10', subject: 'UI/UX Design', lecturer: 'Ms. Davis', classroom: 'Room 203', section: 'Section B'},
            { day: 'Friday', timeSlot: '14:10-15:10', subject: 'Network Security', lecturer: 'Prof. Smith', classroom: 'Hall B', section: 'Section A'},
        ],
    },
    {
        id: 'tt03', version: 3, status: 'Draft', createdAt: '2024-07-29T11:00:00Z', entries: [
            { day: 'Monday', timeSlot: '09:00-10:00', subject: 'Advanced React', lecturer: 'Prof. Smith', classroom: 'Room 101', section: 'Section A'},
            { day: 'Monday', timeSlot: '09:00-10:00', subject: 'Python for AI', lecturer: 'Dr. Jones', classroom: 'Room 101', section: 'Section B'}, // CONFLICT!
            { day: 'Tuesday', timeSlot: '10:10-11:10', subject: 'UI/UX Design', lecturer: 'Prof. Smith', classroom: 'Lab A', section: 'Section A'},
            { day: 'Tuesday', timeSlot: '10:10-11:10', subject: 'Database Systems', lecturer: 'Dr. Jones', classroom: 'Room 203', section: 'Section B'},
        ],
    }
];

let holidays: string[] = ['Saturday']; // Default holiday

// --- MOCK API FUNCTIONS ---

const delay = <T,>(data: T, duration = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), duration));

export const mockLogin = (role: UserRole): Promise<User> => {
  const user = Object.values(users).find(u => u.role === role);
  return delay(user || users['student01']);
};

export const getDashboardData = (user: User) => {
    let upcomingClasses: { subject: string, time: string, room: string, isMyClass?: boolean }[] = [];

    if (user.role !== UserRole.Admin) {
        const approvedTimetable = timetables.find(t => t.status === 'Approved');
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = dayNames[new Date().getDay()];
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        let upcomingClassesRaw = (approvedTimetable?.entries || [])
            .filter(entry => {
                const endTime = entry.timeSlot.split('-')[1];
                return entry.day === todayName && endTime > currentTime;
            })
            .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
        
        if (user.role === UserRole.Lecturer) {
            upcomingClassesRaw = upcomingClassesRaw.filter(entry => entry.lecturer === user.name);
        } else if (user.role === UserRole.Student && user.section) {
            upcomingClassesRaw = upcomingClassesRaw.filter(entry => entry.section === user.section);
        }

        upcomingClasses = upcomingClassesRaw.map(c => ({
            subject: c.subject,
            time: c.timeSlot,
            room: c.classroom,
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
  
  sectionsToGenerate.forEach(section => {
    scheduleDays.forEach(day => {
        // Determine how many classes to schedule for this section on this day
        const classCountForDay = Math.floor(Math.random() * (maxClasses - minClasses + 1)) + minClasses;
        
        // Shuffle available time slots to randomize class placement
        const shuffledSlots = [...timeSlots].sort(() => 0.5 - Math.random());
        const slotsForDay = shuffledSlots.slice(0, classCountForDay);

        slotsForDay.forEach(slot => {
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const classroom = classrooms[Math.floor(Math.random() * classrooms.length)];
            const lecturer = Object.values(users).find(u => u.id === subject.lecturerId) || users['lecturer01'];

            newTimetableEntries.push({
                day: day, 
                timeSlot: slot, 
                subject: subject.name, 
                lecturer: lecturer.name, 
                classroom: classroom.name, 
                section: `Section ${section}`
            });
        });
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
    return delay(newTimetable, 1000);
};

export const getTimetables = (): Promise<TimetableObject[]> => delay([...timetables]);

export const getHolidays = (): Promise<string[]> => delay([...holidays]);

export const setHolidays = (newHolidays: string[]): Promise<boolean> => {
    holidays = newHolidays;
    return delay(true);
};

export const getNotifications = (role: UserRole): Promise<Notification[]> => {
    const userRoleString = role as string;
    const filtered = notifications.filter(n =>
        n.target === NotificationTarget.All || n.target === userRoleString
    );
    return delay(filtered);
};

export const sendNotification = (message: string, target: NotificationTarget): Promise<boolean> => {
    const newNotif: Notification = {
        id: `n${Date.now()}`, message, timestamp: new Date().toISOString(), isRead: false, target,
    };
    notifications.unshift(newNotif);
    return delay(true);
};

export const saveTimetable = (timetableId: string, newEntries: TimetableEntry[]): Promise<boolean> => {
    const timetable = timetables.find(t => t.id === timetableId);
    if (timetable && (timetable.status === 'Draft' || timetable.status === 'Rejected')) {
        timetable.entries = newEntries;
        return delay(true, 300);
    }
    return delay(false, 300);
};

export const submitForReview = (timetableId: string): Promise<TimetableObject | undefined> => {
    const timetable = timetables.find(t => t.id === timetableId);
    if (timetable) {
        timetable.status = 'Pending Approval';
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
        sendNotification(`Timetable v${timetable.version} has been approved and is now active.`, NotificationTarget.All);
    }
    return delay(timetable);
};

export const rejectTimetable = (timetableId: string, notes: string): Promise<TimetableObject | undefined> => {
    const timetable = timetables.find(t => t.id === timetableId);
    if (timetable) {
        timetable.status = 'Rejected';
        timetable.notes = notes;
        sendNotification(`Timetable v${timetable.version} was rejected. Reason: ${notes}`, NotificationTarget.Admin);
    }
    return delay(timetable);
};

export const deleteTimetable = (timetableId: string): Promise<boolean> => {
    const initialLength = timetables.length;
    timetables = timetables.filter(t => t.id !== timetableId);
    return delay(timetables.length < initialLength);
};

export const markNotificationAsRead = (notificationId: string): Promise<Notification[]> => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) notification.isRead = true;
    return delay([...notifications]);
};

export const addSubject = (newSubject: Omit<Subject, 'id'>): Promise<Subject[]> => {
    const subject: Subject = { ...newSubject, id: `sub${Date.now()}` };
    subjects.push(subject);
    return delay([...subjects]);
};

export const deleteSubject = (subjectId: string): Promise<Subject[]> => {
    subjects = subjects.filter(s => s.id !== subjectId);
    return delay([...subjects]);
};

// --- New CRUD for Management ---
export const addClassroom = (classroom: Omit<Classroom, 'id' | 'isAvailable'>): Promise<Classroom[]> => {
    const newClassroom: Classroom = { ...classroom, id: `cr${Date.now()}`, isAvailable: true };
    classrooms.push(newClassroom);
    return delay([...classrooms]);
};

export const updateClassroom = (id: string, updatedData: Partial<Omit<Classroom, 'id' | 'isAvailable'>>): Promise<Classroom[]> => {
    const classroomIndex = classrooms.findIndex(c => c.id === id);
    if (classroomIndex > -1) {
        classrooms[classroomIndex] = { ...classrooms[classroomIndex], ...updatedData };
    }
    return delay([...classrooms]);
};

export const deleteClassroom = (id: string): Promise<Classroom[]> => {
    classrooms = classrooms.filter(c => c.id !== id);
    return delay([...classrooms]);
};

export const addFacultyMember = (facultyMember: Omit<Faculty, 'id'>): Promise<Faculty[]> => {
    const newFaculty: Faculty = { ...facultyMember, id: `lecturer${Date.now()}` };
    faculty.push(newFaculty);
    return delay([...faculty]);
}

export const updateFacultyMember = (id: string, updatedData: Partial<Omit<Faculty, 'id' | 'availability'>>): Promise<Faculty[]> => {
    const facultyIndex = faculty.findIndex(f => f.id === id);
    if (facultyIndex > -1) {
        faculty[facultyIndex] = { ...faculty[facultyIndex], ...updatedData };
    }
    return delay([...faculty]);
};

export const deleteFacultyMember = (id: string): Promise<Faculty[]> => {
    faculty = faculty.filter(f => f.id !== id);
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

    return delay(JSON.parse(JSON.stringify(timetable)), 1500);
};