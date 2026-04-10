<div align="center">
  <img src="./gitpulse_social_preview_1775854265168.png" alt="GitPulse Banner" width="100%" />

  # ⚡ GitPulse
  **Empowering the next generation of open-source contributors with AI.**

  [![Turbo](https://img.shields.io/badge/turbo-2.1.2-blueviolet?style=flat-square&logo=turborepo)](https://turbo.build/repo)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![tRPC](https://img.shields.io/badge/tRPC-v10-blue?style=flat-square&logo=trpc)](https://trpc.io/)
  [![Typescript](https://img.shields.io/badge/Typescript-5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-AGPL%203.0-green?style=flat-square)](./LICENSE)

  [Introduction](#-introduction) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Contributing](#-contributing)
</div>

---

## 🚀 Introduction

**GitPulse** is a state-of-the-art platform designed to bridge the gap between developers and open-source projects. By leveraging advanced AI analysis, GitPulse helps you discover relevant repositories, analyze your existing skills from your resume, and start contributing in seconds rather than days.

## ✨ Features

- 🧠 **AI Resume Analyzer**: Paste your bio or resume to instantly extract and categorize your technical expertise.
- 🔍 **Smart Discovery**: Find open-source projects that match your specific skill set and interests.
- ⚡ **Seamless Integration**: Connect with GitHub and track your contributions in real-time.
- 🛠️ **Developer Dashboard**: A premium, centralized hub for managing your open-source journey.

## 🛠️ Tech Stack

GitPulse is built with a modern, high-performance monorepo architecture:

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend API**: [Express.js](https://expressjs.com/) with [tRPC](https://trpc.io/) for end-to-end type safety
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Monorepo Tooling**: [Turborepo](https://turbo.build/repo) and [pnpm](https://pnpm.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Google & GitHub providers

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.0.0)
- [pnpm](https://pnpm.io/installation) (>= 8.0.0)
- [PostgreSQL](https://www.postgresql.org/download/) instance

### 1. Installation

Clone the repository and install dependencies from the root:

```bash
git clone https://github.com/yourusername/gitpulse.git
cd gitpulse
pnpm install
```

### 2. Environment Setup

You need to configure environment variables for both the API and Web applications.

#### Backend (`apps/api/.env`)
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/gitpulse?schema=public"
JWT_SECRET="your-super-secret-key"
PORT=8080
CORS_ORIGINS=http://localhost:3000
GITHUB_PERSONAL_ACCESS_TOKEN="your_github_pat"
```

#### Frontend (`apps/web/.env.local`)
```bash
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"
```

### 3. Database Migration

Run the migrations to set up your database schema:

```bash
pnpm turbo db:push # or use npx prisma migrate dev inside apps/api
```

### 4. Running Locally

Start the development servers for all applications using Turbo:

```bash
pnpm dev
```

The applications will be available at:
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:8080](http://localhost:8080)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the AGPL 3.0 License. See `LICENSE` for more information.

<div align="center">
  <br />
  Built with ❤️ for the Open Source Community
</div>