<div align="center">
  <img src="./gitpulse_social_preview_1775854265168.png" alt="GitPulse Banner" width="100%" />

  # ⚡ GitPulse
  ### Next-Generation Open-Source Infrastructure powered by AI
  
  [![Turbo](https://img.shields.io/badge/turbo-2.1.2-blueviolet?style=flat-square&logo=turborepo)](https://turbo.build/repo)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![tRPC](https://img.shields.io/badge/tRPC-v10-blue?style=flat-square&logo=trpc)](https://trpc.io/)
  [![Typescript](https://img.shields.io/badge/Typescript-5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-AGPL%203.0-green?style=flat-square)](./LICENSE)

  [Overview](#-overview) • [Key Features](#-key-features) • [Architecture](#-architecture) • [API Guide](#-api-guide) • [Setup](#-getting-started) • [Roadmap](#-roadmap)
</div>

---

## 📖 Overview

**GitPulse** is a revolutionary developer platform designed to accelerate open-source contributions. Traditionally, finding the right project and understanding if your skills match can take days. GitPulse leverages **AI-driven skill extraction** to match developers with projects that perfectly align with their expertise, making "First Good Issue" discovery instantaneous.

> **"Building 21st-century open-source infrastructure from the ground up."**

---

## ✨ Key Features

### 🧠 AI Skill Extraction
- **Resume Parsing**: Instantly analyze professional bios or full resumes to extract technical competencies.
- **Auto-Categorization**: Automatically classifies skills into Languages, Frameworks, Tools, and Specializations.
- **Dynamic Profiling**: Builds a living developer profile that evolves with your contributions.

### 🔍 Project Discovery & Intel
- **GitHub Deep Discovery**: Search and filter global repositories based on specific tech-stack requirements.
- **Issue Matching**: Highlights issues that specifically match your identified skills.
- **Contribution Tracking**: Real-time integration with GitHub to monitor pull requests and project activity.

### 🛠️ Developer Management
- **Universal Dashboard**: A sleek, dark-mode focused workspace for managing multiple projects and tasks.
- **Monorepo Workflow**: High-performance architecture ensuring lightning-fast development cycles.
- **Multi-tenant Community**: Dedicated sidebars and switchers for navigating different developer communities.

---

## 🏗️ Architecture

GitPulse is built as a highly modular **Turborepo** monorepo, ensuring code reusability and type safety from database to UI.

```text
gitpluse/
├── apps/
│   ├── web/               # Next.js 14 Frontend (App Router, tRPC Client)
│   └── api/               # Express.js + tRPC Backend (Prisma, AI Services)
├── packages/
│   ├── shared/            # Shared Types, Zod Schemas & Utilities
│   ├── ui/                # Internal Design System & Custom Components
│   ├── typescript-config/ # Global TS configuration
│   └── eslint-config/     # Global Linting rules
├── docker/                # Deployment and container orchestration
└── turbo.json             # Monorepo build pipeline configuration
```

### Technical Core
- **Type Safety**: End-to-end type safety using **tRPC** and **Zod**.
- **Database**: **PostgreSQL** with **Prisma** for robust relational data mapping.
- **Design System**: Built on **Tailwind CSS** with custom components and premium animations via **Framer Motion**.

---

## 📡 API Guide (tRPC)

The backend exposes a type-safe API via tRPC. Below are the primary namespaces:

| Namespace | Responsibility | Primary Actions |
| :--- | :--- | :--- |
| `auth` | Identity Management | `signup`, `login`, `verifySession` |
| `member` | AI Analysis | `analyzeSkills`, `getProfile`, `updateSettings` |
| `github` | OS Discovery | `exploreRepos`, `getRepoDetails`, `fetchIssues` |
| `projects`| Project Management | `createProject`, `listUserProjects`, `archive` |
| `task` | Collaboration | `assignTask`, `updateStatus`, `listTasks` |
| `user` | Administrative | `getMe`, `updateAvatar`, `toggleRole` |

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **PostgreSQL**: Running instance (Local or Cloud)
- **GitHub PAT**: Classic token with `public_repo` access

### 1️⃣ Clone & Install
```bash
git clone https://github.com/ali-imtiyazkhan/gitpluse.git
cd gitpluse
pnpm install
```

### 2️⃣ Environment Configuration
Create the following `.env` files based on the project root:

**`apps/api/.env`**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/gitpulse"
JWT_SECRET="generate-a-random-32-char-string"
GITHUB_PERSONAL_ACCESS_TOKEN="ghp_xxxxxxxxxxxx"
PORT=8080
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-another-random-string"
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"
```

### 3️⃣ Synchronize Database
```bash
# From the root directory
pnpm turbo db:push # This applies schema changes directly
```

### 4️⃣ Launch Development
```bash
pnpm dev
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:8080](http://localhost:8080)

---

## 🗺️ Roadmap

- [x] Initial Monorepo Setup (Turbo + pnpm)
- [x] AI Skill Extraction Service
- [x] GitHub Repository Explorer
- [ ] **Phase 2**: Redis Caching for GitHub API responses
- [ ] **Phase 3**: Real-time project collaboration chat
- [ ] **Phase 4**: Automated "First Good Issue" email notifications
- [ ] **Phase 5**: Mobile Companion App (React Native)

---

## 🤝 Contributing

We love builders! To contribute:

1. **Bug Report**: Open an [Issue](https://github.com/ali-imtiyazkhan/gitpulse/issues)
2. **Feature Request**: Open a [Discussion](https://github.com/ali-imtiyazkhan/gitpulse/discussions)
3. **Code Change**: 
   - Fork the repo
   - Create a branch (`feature/your-feature`)
   - Commit changes with descriptive messages
   - Open a Pull Request referencing the issue

---

## 📄 License

This project is licensed under the **AGPL 3.0 License**. See the `LICENSE` file for details.

<div align="center">
  <br />
  <strong>GitPulse — Forging the Future of Open Source</strong>
</div>