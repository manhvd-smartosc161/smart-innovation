# Smart Innovation

Test Case Drafting Application built with React, TypeScript, and Vite.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check for linting errors:

```bash
npm run lint
```

Auto-fix linting errors:

```bash
npm run lint:fix
```

## 📁 Folder Structure

```
smart-innovation/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/         # React components (Atomic Design)
│   │   ├── atoms/          # Basic building blocks
│   │   │   ├── Badge/
│   │   │   │   ├── index.tsx
│   │   │   │   └── index.scss
│   │   │   ├── IconButton/
│   │   │   │   ├── index.tsx
│   │   │   │   └── index.scss
│   │   │   └── Tag/
│   │   │       └── index.tsx
│   │   ├── molecules/      # Simple component combinations
│   │   │   ├── ActionBar/
│   │   │   ├── ExpectedResultItem/
│   │   │   ├── FormField/
│   │   │   ├── FormSelect/
│   │   │   ├── ModeSwitch/
│   │   │   ├── StepHeader/
│   │   │   ├── StepItem/
│   │   │   ├── TagsContainer/
│   │   │   └── TreeItem/
│   │   ├── organisms/      # Complex component combinations
│   │   │   ├── DetailsForm/
│   │   │   ├── Sidebar/
│   │   │   └── StepsSection/
│   │   └── templates/      # Page-level layouts
│   │       └── MainLayout/
│   ├── pages/              # Page components
│   │   └── TestCaseDrafting.tsx
│   ├── styles/             # Global styles
│   │   └── global.scss
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Application entry point
│   └── index.scss         # Main stylesheet
├── eslint.config.js        # ESLint configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🏗️ Architecture

This project follows the **Atomic Design** methodology for component organization:

- **Atoms**: Basic, reusable UI elements (Badge, IconButton, Tag)
- **Molecules**: Simple combinations of atoms (FormField, ActionBar, StepHeader)
- **Organisms**: Complex UI sections (DetailsForm, Sidebar, StepsSection)
- **Templates**: Page-level layouts (MainLayout)

Each component has its own folder containing:

- `index.tsx` - Component implementation
- `index.scss` - Component styles (if needed)

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Ant Design** - UI component library
- **Sass** - CSS preprocessor
- **ESLint** - Code linting

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Auto-fix linting errors
