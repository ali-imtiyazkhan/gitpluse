# GitPulse 🧬

GitPulse is a smart tool that helps developers find projects and helps communities work together better. It uses AI to match the right person with the right job.

## What can you do with GitPulse?

### 1. Smart Resume Analyzer 📄
Upload your resume or paste your bio. Our AI reads it and figures out exactly what you are good at (like Python, React, or Teamwork). It gives you a "Pulse Score" so you know where you stand.

### 2. Task Discovery & Pulse Match 🎯
We don't just show you a list of tasks. We use AI to compare your skills with the task requirements. We give you a **Pulse Match %**. If it says 95%, you are the perfect fit for that job! Just click **Claim Task** to start working.

### 3. Community Hub & AI Chatbot 💬
*   **PulseBox Chat**: Talk to other developers in real-time.
*   **PulseBot AI**: Our smart bot lives in the chat. Ask it a question or say "PulseBot" to get instant updates on community health.
*   **Live Activity**: See a live feed of who is joining, leaving, or sharing cool things.

### 4. Community Management (For Admins) 🛡️
If you run a community, GitPulse makes it easy:
*   **Approve Members**: Review new people who want to join.
*   **Roles**: Assign roles like Owner, Maintainer, or Contributor.
*   **Audit Trail**: See a history of every important action taken in the community.

---

## Technical Stuff (For Nerds 🤓)
*   **Front-end**: Next.js (React) + Tailwind CSS + Framer Motion.
*   **Back-end**: Node.js + Express + tRPC (for super-fast data).
*   **Real-time**: Socket.io (for the live chat and logs).
*   **Database**: PostgreSQL + Prisma.

---

## How to Start

1.  **Install dependencies**: `pnpm install`
2.  **Set up the database**: `pnpm prisma db push` (in `apps/api`)
3.  **Run the project**: `pnpm dev`
4.  **Visit**: `http://localhost:3000`

Built for the future of Open Source. 🚀