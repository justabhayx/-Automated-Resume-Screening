# NEXUS AI Frontend Design Spec (2026-10-25)

## 1. Overview
The NEXUS AI Frontend is a high-performance, responsive, and futuristic recruitment dashboard. It is designed to look and feel like a professional AI analysis terminal, prioritizing technical data presentation, high usability, and a "cyber-premium" aesthetic.

## 2. Visual Language & "Techy" Vibe
- **Background:** Deep Obsidian (`#050505`) with a subtle `repeating-linear-gradient` scanline effect (transparency 0.05).
- **Accents:** Electric Cyan (`#00f3ff`) for primary data highlights, Neon Magenta (`#ff00ff`) for specialized status, Cyber-Green (`#00ff41`) for success/active states.
- **Typography:** JetBrains Mono for a technical, data-centric terminal aesthetic.
- **Glassmorphism:** Containers use `backdrop-blur-xl` and low-opacity borders (`rgba(255,255,255,0.1)`) to maintain a clean, layered structure.
- **Glow & Animation:** Framer Motion for subtle entry animations and number-ticker effects for live data.

## 3. Technology Stack
- **Framework:** React + Vite (TypeScript)
- **Styling:** Tailwind CSS (with custom Cyber-Neon configuration)
- **UI Components:** Headless UI (accessible primitives), Recharts/Table for data visualization.
- **Data Handling:** Axios (with Vite proxy for backend integration).

## 4. Architecture
### 4.1 Directory Layout
```
frontend/
│─ src/
│   ├─ app/               # Layout, Router, Theme Provider
│   ├─ components/        # UI primitives (Card, Loader, Input, Dropzone, Table, Modal)
│   ├─ pages/             # Dashboard.tsx, CandidateView.tsx
│   ├─ api/               # Axios client instance (proxy configured)
│   ├─ hooks/             # useScreen.ts (API lifecycle)
│   └─ utils/             # csvExport.ts, animation variants
```

### 4.2 Data Flow
1. **Input:** Candidate resumes and JD are uploaded via a custom Dropzone.
2. **Screening:** `useScreen` hook sends data to `POST /api/screen`.
3. **State Management:** Dashboard receives screening results, populates a sortable table.
4. **Detail View:** Clicking a table row triggers a side-panel modal displaying the explanation object.

## 5. Functional Requirements
1. **Dashboard:** KPI tiles for "Candidates Screened", "Avg Similarity", "Top Skill Match".
2. **Resume Uploader:** Drag-and-drop, client-side validation (.pdf/.docx, size limit).
3. **Screening Engine:** Loading states, immediate error handling/toasts.
4. **Ranked Candidate Table:** Sortable, searchable, monospace styling.
5. **Export:** Export functionality to CSV format.

## 6. Testing Strategy
- **Unit Tests:** Component-level testing (React Testing Library).
- **Integration:** API call mocks.
- **Visual:** Accessibility check (WCAG AA contrast).
