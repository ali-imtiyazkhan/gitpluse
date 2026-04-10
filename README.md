# GitPulse | The Modular Commons 🧬

**GitPulse** is a unified, adaptive digital infrastructure designed for open-source communities. It addresses the fragmentation of identity, resources, and communication by providing a "Digital Ecosystem" where coordination is automated and engagement is real-time.

Built for **HackTheChain 4.0** under the **Full-Stack** track.

---

## 🏗️ Core Problem Dimensions

### 1. Dynamic Membership Management (Identity)
GitPulse provides a robust and flexible membership layer to handle the evolving roles in a community.
- **RBAC (Role-Based Access Control)**: Granular permissions for Owners, Maintainers, Contributors, and Guests.
- **AI Skill Extraction**: Automatic skill extraction from user bios and resumes using AI to build a rich contributor profile.
- **Auditable Records**: A live, verifiable audit trail of all membership transitions and administrative actions.
- **Onboarding Workflow**: Streamlined application process with administrative approval cycles.

### 2. Resource Orchestration (Assets)
How the community shares and manages its most valuable shared assets.
- **Community Inventory**: Catalogued projects (repositories) with clear ownership and status tracking.
- **Task Orchestration**: Unit-based resource allocation where members can "Claim" tasks, preventing conflict and ensuring transparency.
- **Resource Visibility**: Real-time visibility into project health and task allocation history.

### 3. Real-Time Community Interaction (The Heartbeat)
Fostering situational awareness and collective decision-making via a live interaction layer.
- **Real-Time PulseBox**: A low-latency chat infrastructure powered by WebSockets.
- **PulseBot AI Assistant**: Contextually relevant alerts and community health analysis at your fingertips.
- **Live Activity Feed**: Real-time notifications for joins, leaves, and shared resources without manual page refreshes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14/15, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express, tRPC (End-to-end type safety) |
| **Real-time** | Socket.io |
| **Database** | PostgreSQL, Prisma ORM |
| **State/Auth** | NextAuth.js, TanStack Query |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18)
- PNPM (>= 8)
- PostgreSQL Instance

### Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ali-imtiyazkhan/gitpluse.git
   cd gitpluse
   ```

2. **Install Workspace Dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in `apps/api` and `apps/web`:
   
   **API Setup (`apps/api/.env`):**
   ```env
   DATABASE_URL="postgresql://..."
   JWT_SECRET="your_secret"
   ```

   **Web Setup (`apps/web/.env`):**
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_secret"
   NEXT_PUBLIC_API_URL="http://localhost:4000"
   ```

4. **Initialize Database**:
   ```bash
   cd apps/api
   pnpm prisma db push
   ```

5. **Run Development Server**:
   From the root directory:
   ```bash
   pnpm dev
   ```

6. **Access the App**:
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Architecture Overview

- **`apps/web`**: Next.js client application with Shadcn/UI and Framer Motion aesthetics.
- **`apps/api`**: Express + tRPC server handling the core business logic and WebSocket events.
- **`packages/db`**: Shared Prisma schema and client.
- **`packages/config`**: Shared linting and TS configurations.

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

Built by Team Loki | HackTheChain 4.0