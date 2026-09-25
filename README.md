# ProResume Studio — Interactive Resume & CV Builder 🚀

A modern, fast, and responsive ReactJS application for crafting professional resumes and curriculum vitae (CVs) with real-time A4 live preview, multi-template switching, ATS-friendly designs, and high-fidelity PDF export.

---

## 🌟 Key Features

### 1. Multiple Resume Templates
- **Modern**: Sleek accents, contact badges, modern tech typography, and clean bullet formatting.
- **Classic**: Traditional serif design with centered headings, divider rules, and academic/corporate structure.
- **Minimalist**: Single-column ATS-optimized layout with high parseability, whitespace, and font-mono accents.
- **Executive**: Contemporary two-column sidebar layout displaying personal details, skills, education, and credentials alongside work achievements.

### 2. Comprehensive Section Management
- **Personal Details**: Name, target title/headline, email, phone, location, portfolio website, LinkedIn, GitHub, plus a photo uploader (supports file upload or image URLs with toggle).
- **Professional Summary**: Rich overview editor with AI-style inspiration presets for Tech, Product, and Data roles.
- **Work Experience**: Dynamic positions with company, role, location, date ranges, "Currently working here" toggle, and reorderable bullet points.
- **Education**: Degree, institution, field of study, graduation year, and GPA/honors.
- **Skills & Proficiencies**: Categorized skill groups (Frontend, Backend, Architecture, etc.) with tag chip pills and rapid entry (Enter / comma separated).
- **Projects**: Portfolio entries with stack tags, live demo links, and repository URLs.
- **Certifications & Credentials**: Certifications with issuing bodies, credential IDs, and dates.
- **Custom Sections**: Extensible sections (e.g. Publications, Volunteer Work, Awards, Languages).

### 3. Design & Styling Customization
- **Color Palettes**: Curated color themes (Modern Indigo, Emerald Green, Executive Navy, Crimson Ruby, Slate Charcoal, Nordic Teal).
- **Typography Options**: Inter (Modern Sans), Merriweather (Classic Serif), Poppins (Creative Display).
- **Live Zoom Controls**: 50% to 130% zoom with one-click reset for accurate desktop review.

### 4. Persistence & Export
- **One-Click PDF Export**: Uses vector `@media print` styling calibrated specifically for standard A4 portrait sheets.
- **JSON Backup & Restore**: Export your resume data to a `.json` backup file anytime and restore it with one click.
- **Sample Presets**: Preloaded with realistic Software Engineer and Product Manager profiles, plus a Blank Canvas option.
- **Auto-Save**: Changes are automatically synced to browser `localStorage`.

---

## 🛠️ Tech Stack

- **React 18**
- **Vite 5**
- **Tailwind CSS 3**
- **Lucide React** (modern iconography)
- **Google Fonts** (Inter, Merriweather, Poppins, Fira Code)

---

## 🚀 Getting Started

### 1. Development Server
Run the local Vite development server:
```bash
npm run dev
```
Open `http://localhost:3000` (or the port displayed in your terminal).

### 2. Production Build
Build optimized production assets:
```bash
npm run build
```

### 3. Preview Production Build
```bash
npm run preview
```
