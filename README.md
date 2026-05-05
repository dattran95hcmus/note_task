# Task Priority Board

A modern, feature-rich task management application built with React 18, TypeScript, and Tailwind CSS. Organize your tasks by priority with an intuitive drag-and-drop interface, offline support, and beautiful animations.

![Task Priority Board](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)

## ✨ Features

### Core Functionality
- **Priority-based Organization**: High, Medium, and Low priority columns with color-coded indicators
- **Drag & Drop**: Seamlessly move tasks between priorities and reorder within columns
- **Inline Editing**: Double-click tasks to edit titles and notes directly
- **Smart Search**: Filter tasks across all columns in real-time
- **Bulk Actions**: Select multiple tasks to mark done or delete at once

### Task Management
- **Rich Task Details**: 
  - Title and URL links
  - Optional notes/descriptions
  - Due dates with overdue highlighting
  - Created timestamps with relative time ("2h ago")
- **Completed Tasks**: Auto-grouped by completion date with collapsible sections
- **Undo Delete**: 5-second grace period with toast notification undo button
- **Restore Tasks**: Move completed tasks back to active

### UI/UX Excellence
- **Dark Mode**: System preference detection + manual toggle
- **Smooth Animations**: Framer Motion powers all transitions
  - Card entrance/exit animations
  - Drag previews with rotation tilt
  - Spring physics on drop
  - Confetti celebration on task completion 🎉
- **Glass Morphism Design**: Soft backdrop blur and elegant shadows
- **Progress Bar**: Visual completion percentage at the top
- **Toast Notifications**: Instant feedback for all actions
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + N`: Focus new task input
  - `Escape`: Close modals/blur inputs
- **Responsive**: Mobile-optimized with touch-friendly interactions

### Data & Persistence
- **IndexedDB Storage**: All data persists locally with the `idb` library
- **Export/Import**: Backup and restore tasks as JSON files
- **PWA Support**: Install as a standalone app, works offline
- **Auto-save**: Every change syncs to IndexedDB immediately

### Accessibility
- Radix UI primitives ensure keyboard navigation and screen reader support
- Proper ARIA labels throughout
- Focus management in dialogs and modals
- Tooltips on all icon buttons

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS v3 |
| **Animation** | Framer Motion |
| **Drag & Drop** | @dnd-kit |
| **UI Components** | Radix UI (Dialog, Dropdown, Tooltip, Checkbox) |
| **Icons** | Lucide React |
| **State Management** | Zustand |
| **Database** | IndexedDB via `idb` |
| **Date Utils** | date-fns |
| **Notifications** | Sonner |
| **Effects** | canvas-confetti |
| **Code Quality** | ESLint + Prettier |

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd task-priority-board

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Development

### Project Structure
```
src/
├── main.tsx                 # App entry point
├── App.tsx                  # Main app component
├── index.css                # Tailwind directives & global styles
├── types/
│   └── task.ts              # TypeScript interfaces
├── constants/
│   └── priorities.ts        # Priority configurations
├── lib/
│   ├── db.ts                # IndexedDB operations
│   └── utils.ts             # Utility functions (cn, generateId, etc)
├── stores/
│   └── useTaskStore.ts      # Zustand state management
├── hooks/
│   ├── useTheme.ts          # Dark mode hook
│   ├── useKeyboardShortcuts.ts
│   └── useImportExport.ts   # Export/import functionality
├── components/
│   ├── UI/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── EmptyState.tsx
│   ├── TaskForm/            # Task creation form
│   │   ├── TaskForm.tsx
│   │   └── PrioritySelect.tsx
│   ├── ActiveTasks/         # Active tasks board
│   │   ├── ActiveTasksPanel.tsx
│   │   ├── PriorityColumn.tsx
│   │   └── TaskCard.tsx
│   ├── CompletedTasks/      # Completed tasks section
│   │   ├── CompletedPanel.tsx
│   │   ├── DateGroup.tsx
│   │   └── CompletedTaskCard.tsx
│   └── Layout/
│       ├── Header.tsx       # App header with controls
│       └── Board.tsx        # Main board layout
```

### Available Scripts
- `npm run dev` - Start dev server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts` to customize priority colors:

```ts
colors: {
  priority: {
    high: { DEFAULT: '#ef4444', ... },
    medium: { DEFAULT: '#f59e0b', ... },
    low: { DEFAULT: '#10b981', ... },
  },
}
```

### Dark Mode
The app automatically detects system preference and allows manual toggle. Dark mode state persists in `localStorage`.

## 📱 PWA Features

The app is a Progressive Web App with:
- Offline functionality
- Install to home screen
- Service worker for caching
- App shortcuts for quick actions

To install: Click the install icon in your browser's address bar.

## 🔒 Privacy

All data is stored locally in IndexedDB. Nothing is sent to external servers. Your tasks never leave your device unless you explicitly export them.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI components by [Radix UI](https://www.radix-ui.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Drag & Drop by [@dnd-kit](https://dndkit.com/)

---

**Built with ❤️ using modern web technologies**
