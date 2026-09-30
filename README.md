# 🏨 LuxuryStay Hospitality — Enterprise Hotel Management System (HMS)

> A modern, full-stack enterprise Hotel Management System built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) for high-end hospitality chains.

![LuxuryStay HMS](https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80)

---

## 📌 Executive Summary

**LuxuryStay Hospitality** is an enterprise-grade web application engineered to streamline hotel operations, enhance guest satisfaction, and maximize operational velocity across multi-departmental workflows. 

The platform features two unified environments:
1. **Guest-Facing Public Portal:** Multi-page luxury experience featuring real-time room catalogs, instant online bookings with confirmation codes, self-service reservation tracking, and concierge service requests.
2. **Internal HMS Staff Portal:** Role-Based Access Control (RBAC) cockpit with automated check-in/check-out synchronization, dynamic folios & tax invoicing, housekeeping task schedules, maintenance ticketing, and executive analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18 (Vite), React Router v6, Axios, Lucide Icons |
| **Styling** | Bespoke Luxury Glassmorphism Theme (Obsidian & Royal Gold) |
| **Backend** | Node.js, Express.js (Modular MVC Pattern) |
| **Database** | MongoDB (Mongoose ODM with indexing & schema hooks) |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt.js, RBAC Middleware |

---

## 👥 Role-Based Access Control (RBAC)

The system enforces strict permission layers across 4 employee roles:

| Role | Permissions & Access Scope |
| :--- | :--- |
| **Administrator** | Full system control: Staff provisioning & deactivation, room inventory CRUD, system settings & tax configurations. |
| **Manager** | Strategic oversight: Financial reports, occupancy velocity, operations review, guest feedback metrics. |
| **Receptionist** | Front desk daily operations: Guest registration, room assignments, 1-click Check-in / Check-out, billing folios & invoices. |
| **Housekeeping** | Physical operations: Room cleaning queue, marking sanitized rooms (auto-release to `Available`), reporting defect tickets. |
| **Guest / Customer** | Public access (Zero login required): Explore suites, online booking, track booking by reference code, submit reviews. |

---

## ⚙️ Core Operational Workflows

```text
[ Guest Browses Suites ] 
          │
          ▼
[ Instant Online Booking ] ───► Generates Reference Code (e.g. LS-2026-XXXX)
          │
          ▼
[ Guest Arrives at Hotel ] ───► Staff executes 1-Click Check-In (Room ➔ Occupied, Key Issued)
          │
          ▼
[ In-Stay Services ] ─────────► Room Service / Laundry added to Folio
          │
          ▼
[ Departure / Check-Out ] ────► Staff executes 1-Click Check-Out (Room ➔ Cleaning)
          │                      │
          │                      └─► Printable 5-Star Tax Invoice Generated
          ▼
[ Housekeeping Sanitizes ] ───► Marks Task "Completed" (Room ➔ Available in inventory)