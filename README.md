# Assignly — Homework Tracker

## What is Assignly?

Assignly is a comprehensive homework management platform that streamlines the assignment workflow between teachers and students. Built with React and TypeScript, it provides a role-based system where teachers can create and manage homework assignments, while students can view, track, and complete their tasks with AI-powered assistance.

## Why Assignly?

Traditional homework management often relies on scattered communication channels, physical planners, or generic task management tools not designed for education. Assignly solves this by providing:

- **Centralized Assignment Management**: All homework in one place
- **AI-Powered Learning Assistance**: Instant explanations using Google Gemini
- **Real-time Tracking**: Students can monitor their progress and due dates
- **Seamless Communication**: Teachers post once, all students receive updates
- **Accessibility**: Great for absent learners who need to catch up on missed assignments

## When Do You Need Assignly?

Assignly is ideal for:

- **Schools and Classrooms**: Managing daily homework assignments across multiple classes
- **Remote/Hybrid Learning**: Ensuring students have access to assignments regardless of attendance
- **Tutoring Centers**: Tracking personalized assignments for individual students
- **Study Groups**: Collaborative homework tracking and completion
- **Absent Students**: Catching up on missed work efficiently
- **Parent-Teacher Communication**: Parents can track their children's assignments

## Problem Statement

This project addresses several critical challenges in modern education:

1. **Assignment Tracking**: Students often lose track of homework due to multiple subjects and varying due dates
2. **Communication Gap**: Teachers struggle to ensure all students (including absent ones) receive assignment details
3. **Learning Barriers**: Students need additional help understanding complex homework but may not have immediate access to teachers
4. **Progress Monitoring**: Both teachers and students lack a centralized system to monitor homework completion rates
5. **Data Persistence**: Traditional systems don't save student progress or notes effectively
6. **File Management**: Handling roster uploads (Excel files) and student data efficiently

## Google Technologies Used

This project leverages several Google technologies:

### 1. **Google Gemini AI (Generative AI)**
- **Purpose**: Provides AI-powered homework explanations
- **Model**: `gemini-1.5-flash` (with fallback to other available models)
- **SDK**: `@google/generative-ai`
- **Features**: Generates student-friendly explanations of homework assignments on demand

### 2. **Firebase Platform**
- **Firestore Database**: Cloud-based NoSQL database for storing homework and user data
- **Firebase Analytics**: Tracks user engagement and app performance
- **Firebase App**: Core Firebase SDK for app initialization
- **Features**: Real-time data synchronization, scalable cloud storage

## Features

- **Role-based Views**: Separate interfaces for Teachers, Students, and Admins
- **Teacher Dashboard**: Post homework with class, subject, description, and due dates
- **Student Dashboard**: View tasks, mark as completed, add personal notes
- **Admin Panel**: Upload rosters, manage classes, and view all assignments
- **AI Explanations**: Google Gemini-powered homework explanations for students
- **Status Tracking**: Visual badges showing pending/completed status
- **File Upload**: Excel (.xlsx) roster upload with drag-and-drop support
- **Data Persistence**: LocalStorage and Firebase Firestore integration
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first UI using Material-UI (MUI)
- **Date Management**: Date pickers for due date selection

## Project Setup

### Prerequisites

Before setting up Assignly, ensure you have the following installed:

- **Node.js**: Version 16 or higher ([Download](https://nodejs.org/))
- **pnpm**: Version 10.26.0 or higher
  ```bash
  npm install -g pnpm
  ```

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd assignly
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start the Development Server**
   ```bash
   pnpm start
   ```

## How to Run

### Development Mode

Start the development server:

```bash
pnpm start
```

The app will automatically open at [http://localhost:3000](http://localhost:3000) (or the next available port).

**First-Time Login:**

- **Teacher**: 
  1. Enter your name
  2. Select "Teacher" role
  3. Enter PIN
  
- **Student**: 
  1. Enter your name
  2. Select "Student" role
  3. Click Continue (no PIN required)

- **Admin**:
  1. Navigate to `/admin` route
  2. Enter PIN

### Production Build

Build the app for production:

```bash
pnpm run build
```

This creates an optimized production build in the `build/` folder with:
- Minified code
- Optimized assets
- Cache-busting file names

### Serve Production Build Locally

To test the production build locally:

```bash
# Install a static server (if not already installed)
pnpm add -g serve

# Serve the build folder
serve -s build -l 4000
```

Open [http://localhost:4000](http://localhost:4000) to view the production build.

## Configuration Details


### Port Configuration

By default, the app runs on port `3000`. To change the port:

**Windows (PowerShell):**
```powershell
$env:PORT=4000; pnpm start
```

**macOS/Linux:**
```bash
PORT=4000 pnpm start
```

### Package Manager

This project uses `pnpm` as the package manager. The version is locked to `10.26.0` in `package.json`:

```json
"packageManager": "pnpm@10.26.0"
```

**Why pnpm?**
- Faster installation
- Efficient disk space usage
- Strict dependency resolution

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm start` | Start development server |
| `pnpm build` | Build for production |
| `pnpm test` | Run tests in watch mode |
| `pnpm eject` | Eject from Create React App (irreversible) |

### Troubleshooting

**Issue: Port already in use**
```bash
# Kill the process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then restart
pnpm start
```

**Issue: Dependencies not installing**
```bash
# Clear pnpm cache
pnpm store prune

# Delete node_modules and lock file
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml

# Reinstall
pnpm install
```

## Deployment

The production build can be deployed to:

- **Firebase Hosting**: `firebase deploy`
- **Vercel**: Connect your repository
- **Netlify**: Drag and drop the `build/` folder
- **GitHub Pages**: Use the `gh-pages` package

For detailed deployment instructions, see the [Create React App deployment guide](https://facebook.github.io/create-react-app/docs/deployment).

## Technology Stack

### Frontend
- **React 18.2**: UI library
- **TypeScript 4.9**: Type-safe JavaScript
- **Material-UI (MUI) 7.3**: Component library
- **React Router 7.11**: Navigation and routing
- **Emotion**: CSS-in-JS styling

### Backend/Services
- **Firebase Firestore**: Cloud NoSQL database
- **Firebase Analytics**: Usage tracking
- **Google Gemini AI**: AI-powered explanations

### Build Tools
- **Create React App**: Project scaffolding
- **pnpm**: Fast package manager
- **TailwindCSS**: Utility-first CSS
- **PostCSS**: CSS processing

### Utilities
- **Day.js**: Date manipulation
- **React Dropzone**: File upload handling
- **XLSX**: Excel file parsing

## Using AI-Powered Homework Explanations

Students can access AI-powered explanations:

1. Navigate to the Student Dashboard
2. Find any homework card
3. Click "Explain Homework (AI)" button
4. The app calls Google Gemini (`gemini-1.5-flash`) and displays a student-friendly explanation

**Note**: AI features are currently in development and will be fully integrated in future releases.

## Data Storage

- **LocalStorage**: Saves user session, theme preferences, and temporary data
- **Firebase Firestore**: Cloud-based persistent storage for homework assignments and user data
- Data persists across browser sessions and devices (when using Firebase)

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)

## License

This project is built with Create React App and uses various open-source libraries. See respective package licenses for details.
