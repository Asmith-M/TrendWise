# TrendWise – AI-Powered SEO Blog Generator

> **An AI-powered SEO blog generator that delivers trending content in seconds.**

---

##  Project Overview

TrendWise is a full-stack web application that uses AI to generate SEO-optimized blog articles instantly. Designed with modern UX and mobile responsiveness, it allows users to log in with Google, generate articles on demand, view them publicly, comment, and manage content via an admin dashboard.

---

##  Project Motivation

This project was built as part of a full-stack learning sprint to master:

* Next.js 14 App Router
* Authentication with NextAuth.js
* MongoDB integration
* AI-powered content generation
* SEO enhancements
* Scalable and responsive UI/UX

---

##  Core Features

*  AI-powered article generation via OpenRouter
*  Google OAuth authentication (NextAuth.js)
*  MongoDB for article and comment persistence
*  Public comment system (auth required)
*  Admin panel (protected route with username/password)
*  Search functionality
*  Responsive UI built with Tailwind CSS
*  SEO enhancements (sitemap + robots.txt)

---

##  Tech Stack & Tools

| Category   | Stack/Tool                          |
| ---------- | ----------------------------------- |
| Frontend   | Next.js 14 App Router, Tailwind CSS |
| Backend    | Next.js API Routes                  |
| Database   | MongoDB + Mongoose                  |
| Auth       | NextAuth.js (Google Login)          |
| AI Model   | OpenRouter (free-tier models)       |
| UI Tool    | V0.dev (UI prototyping)             |
| Deployment | Vercel                              |

---

##  Getting Started (Local Setup)

### 1. Clone Repository

```bash
git clone https://github.com/Asmith-M/trendwise.git
cd trendwise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file and add the following:

```env
MONGODB_URI=your-mongodb-uri
OPENROUTER_API_KEY=your-openrouter-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=your-admin@email.com
ADMIN_USERNAME=youradmin
ADMIN_PASSWORD=yourpassword
```

### 4. Run Locally

```bash
npm run dev
```

Then visit: `http://localhost:3000`

---

##  Screenshots

*Add screenshots here if available.*

---

##  Known Issues / Limitations

* 🔍 The search feature is not working properly and can be improved.
* 🧠 Uses OpenRouter for AI content generation due to OpenAI quota limits — easily swappable.

---

##  Future Improvements

* Better search indexing and filters
* Markdown editor for manual content
* Image support for blog posts
* Role-based admin controls

---

##  Deployment

Live: [https://trend-wise-nu.vercel.app](https://trend-wise-nu.vercel.app)

Environment Variables were set on Vercel Dashboard under **Project Settings → Environment Variables**.

---

##  License

This project is open-source and free to use.
