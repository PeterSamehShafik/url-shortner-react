## URL Shortener Frontend 🌐

A sleek, responsive user interface built with **React**, **TypeScript**, and **Vite**, designed to pair seamlessly with the NestJS backend.

🔗 **[Live Demo](https://lin-k.up.railway.app/live)**

---

## 🛠️ Core Tech Stack

* **UI Components:** `shadcn/ui` (Radix Primitives + Tailwind CSS)
* **State Management:** `Zustand`
* **Data Fetching & Cache:** `@tanstack/react-query`
* **Theme:** Native **Dark Mode** support persisted via `localStorage`

---

## 🔑 Key Engineering Highlights

### 1. Silent Auth & Refresh Token Rotation

* **Axios Interceptors:** Automatically catches `401 Unauthorized` errors, fires a hidden request to `/auth/refresh` to rotate tokens via `HttpOnly` cookies, and retries the original request seamlessly.
* **Zustand Auth Store:** Syncs the global `user` and `isAuthenticated` states instantly across the app.

### 2. Dual-Mode UX (Guest vs. User)

* **Guests:** Quick URL shortening interface with visible reminders regarding the **7-day TTL** expiration and guest rate-limiting.
* **Users:** Full access to an interactive dashboard to manage links, use custom slugs, set optional expiries, and view advanced analytics.

---

## 🚀 Getting Started

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000

```

### 2. Installation & Run

```bash
npm install
npm run dev

```
