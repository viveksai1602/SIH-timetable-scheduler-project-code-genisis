# Smart Scheduler
**Smart Classroom & Automated Timetable Scheduler** — a proof-of-concept web application built for the [Smart India Hackathon (SIH)](https://www.sih.gov.in/) to automate university timetable creation, reduce scheduling conflicts, and provide role-based access for administrators, lecturers, and students.
**Repository:** [SIH-timetable-scheduler-project-code-genisis](https://github.com/Noah-sam/SIH-timetable-scheduler-project-code-genisis)

---
## Overview
Manual timetable scheduling at universities is time-consuming and error-prone. Smart Scheduler addresses this by:
- **Automating** timetable generation with configurable constraints (sections, min/max classes per day)
- **Detecting conflicts** — double-booked lecturers, classrooms, or overlapping slots
- **Optimizing resources** — classroom capacity and faculty availability
- **Balancing workload** — faculty preferences and weekly hour limits
- **Providing role-based dashboards** — tailored views for Admin, Lecturer, and Student
Data is persisted in the browser via **localStorage** through a mock API layer, making the app fully runnable without a backend server.
---
## Features
### Authentication & Roles
| Role | Capabilities |
|------|-------------|
| **Admin** | Generate timetables, approve/reject drafts, manage holidays, classrooms & faculty, send notifications, student & lecturer views |
| **Lecturer** | View schedules, manage subjects, cancel classes, submit timetables for review, send student notifications |
| **Student** | View approved timetable for their section, receive notifications |
### Timetable Management
- Auto-generate draft timetables with section and daily class constraints
- Versioned timetables with status workflow: `Draft` → `Pending Approval` → `Approved` / `Rejected`
- Conflict detection (lecturer, classroom, and slot clashes)
- Export timetables to **Excel** (.xlsx)
- Holiday management (exclude days from scheduling)
- Student view and lecturer view (Admin only)
### Resource Management
- **Classrooms** — add, edit, delete; track name and capacity
- **Faculty** — manage department, workload (hours/week), and day-wise availability
- **Subjects** — lecturers can add/remove their assigned subjects
### Notifications
- Role-targeted announcements (All, Students, Lecturers, Admins)
- Automatic alerts on timetable approval/rejection and class cancellations
- Mark-as-read notification inbox
---
## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS (CDN) |
| Export | SheetJS (xlsx) |
| Data | Mock API + browser localStorage |
| Font | Inter (Google Fonts) |
---
## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
### Installation
```bash
# Clone the repository
git clone https://github.com/Noah-sam/SIH-timetable-scheduler-project-code-genisis.git
cd SIH-timetable-scheduler-project-code-genisis
# Install dependencies
npm install
# Start the development server
npm run dev
```
The app runs at **http://localhost:3000** by default.
### Build for Production
```bash
npm run build
npm run preview
```
---
## Demo Login
Use any **12-digit User ID** and the password for your selected role:
| Role | Password |
|------|----------|
| Student | `student123` |
| Lecturer | `teacher123` |
| Admin | `admin123` |
> Password must contain at least one letter and one number.
---
## Project Structure
```
├── App.tsx              # Main app: auth, pages, routing logic
├── index.tsx            # React entry point
├── index.html           # HTML shell, Tailwind & SheetJS CDN
├── types.ts             # TypeScript interfaces and enums
├── components/
│   └── ui.tsx           # Reusable UI components (Header, Sidebar, Timetable, etc.)
├── services/
│   └── mockApi.ts       # Mock backend: CRUD, scheduling, localStorage persistence
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```
---
## Key Workflows
### 1. Generate a Timetable (Admin / Lecturer)
1. Go to **Scheduler** → **Generate Timetable**
2. Set sections (e.g. `A, B, C`) and min/max classes per day
3. Review the generated draft and run **Check Conflicts**
4. Click **Submit for Review**
### 2. Approve a Timetable (Admin)
1. Open **Scheduler** and select a `Pending Approval` version
2. Review conflicts and schedule
3. Click **Approve** or **Reject** (with optional notes)
### 3. Manage Resources (Admin)
1. Go to **Management**
2. Add/edit classrooms and faculty members
3. Set faculty availability and workload limits
---
## Objectives (SIH)
- Drastically reduce manual effort in creating complex university timetables
- Automatically generate clash-free schedules
- Optimize classroom and facility usage by capacity
- Balance faculty workload and availability
- Deliver a secure, role-based experience for all stakeholders
---
## License
This project was developed as part of the Smart India Hackathon. See the repository for license details.
---
## Author
**Noah Sam** — [GitHub](https://github.com/Noah-sam)
