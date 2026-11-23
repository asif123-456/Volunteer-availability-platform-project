# 🤝 The Volunteer Availability Problem (NGO Platform)
### Full-Stack Next.js 14 (App Router) + MongoDB Architecture

A verified, schedule-driven matchmaking platform connecting NGOs needing short-term volunteers with community helpers available at that exact date and time.

---

## 🎯 Syllabus Concepts Implemented

1. **App Router (`app/` directory):** File-system based nested routing with layout templates (`layout.jsx`).
2. **Route Handlers (`app/api/.../route.js`):** Modular REST API endpoints handling authentication, opportunities, availability, and applications.
3. **Server-Side Rendering (SSR):** Home Page (`app/page.jsx`) is an async Server Component directly fetching live statistics and featured drives from MongoDB on the server.
4. **Client Components (`'use client'`):** Interactive schedule matrices, filter bars, application modals, and 1-click login controls.
5. **Server Actions (`'use server'`):** Server mutations for volunteer availability saving (`app/actions/volunteerActions.js`) and NGO status updates (`app/actions/ngoActions.js`).
6. **Authentication & Password Security:** JWT (JSON Web Tokens) with HTTP-only cookies and `bcryptjs` password hashing.
7. **Database Integration:** MongoDB with Mongoose ODM featuring cached connection pooling (`lib/mongodb.js`).

---

## 📋 10-Step Development Order Implementation

| Step | Functionality | Implementation in Codebase |
| :---: | :--- | :--- |
| **1** | **MongoDB Database Connection** | Cached connection pooling in `lib/mongodb.js` |
| **2** | **User Registration API** | Route handler `app/api/auth/register/route.js` |
| **3** | **Password Hashing using bcrypt** | Mongoose pre-save hook in `models/User.js` using `bcrypt.genSalt` & `bcrypt.hash` |
| **4** | **Login API using JWT** | Route handler `app/api/auth/login/route.js` with `signToken` and HTTP-only cookie |
| **5** | **Role-based Authentication** | `lib/auth.js` (`getAuthUser`, `checkRole`) protecting volunteer, NGO & admin routes |
| **6** | **NGO Verification** | Super Admin route handler `app/api/admin/ngos/[id]/verify/route.js` |
| **7** | **Create & Manage Opportunities** | Route handler `app/api/opportunities/route.js` + `models/Opportunity.js` |
| **8** | **Volunteer Availability** | Route handler `app/api/volunteer/availability/route.js` + weekly time grid UI |
| **9** | **Smart Availability Matching** | Matchmaking algorithm in `lib/matching.js` & `app/api/volunteer/opportunities/route.js` |
| **10** | **Apply & Approve Applications** | Route handlers `app/api/applications/route.js` & `app/api/applications/[id]/status/route.js` |

---

## 🔑 Pre-Seeded Demo Accounts

You can test without registering by clicking the **1-Click Quick Demo Login** buttons on `/login`:

- **Volunteer:** `volunteer@gmail.com` / `volunteer123` (Rahul Sharma - Free on Sundays & Saturdays)
- **Verified NGO:** `ngo@greenearth.org` / `ngo12345` (Green Earth Foundation)
- **Pending NGO:** `ngo2@helpinghands.org` / `ngo12345` (Helping Hands Trust - in verification queue)
- **Super Admin:** `admin@volunteer.org` / `admin12345` (Platform governance & approvals)

---

## 🏃 Running The Project

```bash
# 1. Start MongoDB daemon (Ensure port 27017 is running)

# 2. Seed database records
npm run seed

# 3. Start Next.js App
npm run dev
# Or for optimized production build:
npm run build && npm start
```

Open [http://localhost:3001](http://localhost:3001) in your browser.
