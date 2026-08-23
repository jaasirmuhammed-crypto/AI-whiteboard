# 🎨 AI Whiteboard — Complete Project Codebase

> **"Transform Your Notes Into Smarter Study Materials"**  
> **Built by SAFA Developers**

AI Whiteboard is a multimodal AI-powered study workspace and competitive exam revision platform built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**.

---

## 🚀 Quick Start Instructions (How to Use in your IDE)

Follow these 3 quick steps to run this project in **VS Code**, **Cursor**, **Antigravity IDE**, or any IDE:

### 1. Open Project Folder in IDE
Extract `ai-whiteboard-ide-project.zip` and open the unzipped `ai-whiteboard` folder in your code editor.

### 2. Install Dependencies
Open your IDE terminal (`Ctrl + ~` or `Cmd + ~`) and run:
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📦 Build for Production / GitHub Pages
To create a production bundle:
```bash
npm run build
```
The output files will be generated inside the `dist/` directory.

---

## 📂 Project Architecture

```
ai-whiteboard/
├── index.html                  # HTML entry point (iOS/Android PWA ready)
├── promo_video.html            # 1080p HD Commercial Video Player & Exporter
├── package.json                # Project dependencies & scripts
├── vite.config.ts              # Vite bundler configuration (relative base support)
├── tailwind.config.js          # Tailwind styling configuration
├── public/                     # Public assets & video commercial player
└── src/
    ├── components/
    │   ├── ai/                 # AI Processing & Topic Confirm Modals
    │   ├── admin/              # Admin Portal (Real-time live analytics reset to 0)
    │   ├── auth/               # User Login & Registration Modals
    │   ├── common/             # Toast, Modal, TopicSearchGuideCard, Footer, Navbar
    │   ├── competitive/        # Competitive Exam Hub, MCQ Test Engine, Bookmarks
    │   ├── dashboard/          # Student Dashboard & Recent Projects
    │   ├── landing/            # Hero, HowItWorks, LiveStudentReviews, FAQ, CTA
    │   ├── study/              # 6-Slide PowerPoint Decks, Quizzes, Mind Maps
    │   └── whiteboard/         # Interactive Canvas, Tools Dock, Top Control Bar
    ├── context/                # Auth, Theme, Project, and Toast Contexts
    ├── services/               # aiService, competitiveService, storageService
    ├── types/                  # TypeScript interfaces for competitive, study, user
    ├── i18n/                   # 15-Language internationalization engine
    └── App.tsx                 # Main Application View Router
```

---

## ✨ Features Included

* **Interactive Multimodal Whiteboard**: Freehand pen, HB pencil, shapes, sticky notes, background patterns, pan/zoom.
* **AI Study Materials Generator**: Converts whiteboard notes into **6-Slide PowerPoint presentations (.pptx)**, **interactive MCQ quizzes**, and **concept mind maps**.
* **Automatic Math Formula Engine**: Automatically injects exact mathematical formulas for all math, physics, calculus, algebra, and geometry topics on Slide 6.
* **Student Feedback & Dual-Routing Review System**: Positive 4–5★ reviews auto-publish live on the site; 1–3★ feedback dispatches private email to admin inbox.
* **Real-time Live Analytics Portal**: Fresh sessions start at **0 real visits** with a 1-tap **Reset Analytics to 0** button.
* **Cross-Platform Responsive PWA**: Optimized for iOS, Android, Tablets, and Desktops.
* **1080p Commercial Video Player & Exporter**: `promo_video.html` included with MediaRecorder HD video export.

---

© 2026 AI Whiteboard. Crafted for Students & Educators • **Built by SAFA Developers**
