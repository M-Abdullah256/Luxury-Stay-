# LUXURYSTAY HOSPITALITY — ENTERPRISE HOTEL MANAGEMENT SYSTEM (HMS)
### Comprehensive Technical Architecture, System Documentation & Operational Manual

---

## 1. EXECUTIVE PROJECT OVERVIEW

LuxuryStay Hospitality is an enterprise-grade, cloud-ready Hotel Management System (HMS) engineered specifically for high-end luxury hotel chains and boutique resorts. 

Modern hospitality demands seamless coordination between guest-facing digital convenience and back-of-house operational execution. LuxuryStay unifies these paradigms into a cohesive, high-performance web platform featuring:
* A friction-free, public guest booking portal requiring zero login for customers.
* An executive internal management cockpit enforcing strict Role-Based Access Control (RBAC).
* Real-time automated state machines synchronizing Front Desk, Billing, Housekeeping, and Maintenance departments.

---

## 2. LEAD SOFTWARE ARCHITECT & DEVELOPER DOSSIER

* Lead Architect & Full Stack Engineer: Muhammad Abdullah
* Direct Contact: +92 300 2962350
* Official Inquiries: muhammadabdullah41950@gmail.com
* Specialization: Full Stack MERN Engineering • Enterprise Systems Architecture • Scalable Micro-architectures
* Role in Project: End-to-end architectural design, RESTful API implementation, database modeling, security layer enforcement, and bespoke luxury UI/UX engineering.

---

## 3. TECHNOLOGY STACK & SPECIFICATIONS

* Frontend Framework: React.js (Vite v18.x) — High-speed Single Page Application (SPA)
* Client Routing: React Router DOM (v6.x) — Dynamic client routing with protected role guards
* HTTP Transport: Axios (v1.x) — Interceptor-based API client with automatic JWT injection
* Iconography: Lucide React — Modern high-contrast luxury vector icons
* Styling Engine: Pure CSS3 & Glassmorphism — Obsidian Slate (#050811), Deep Navy, & Royal Gold (#d4af37)
* Backend Runtime: Node.js (v18.x / v20.x) — Non-blocking asynchronous event-driven runtime
* Application Server: Express.js (v4.x) — Modular MVC REST API Gateway
* Database Engine: MongoDB Community / Atlas — High-concurrency NoSQL document database
* ODM / Data Layer: Mongoose (v8.x) — Strict schema validation, hooks, and relationships
* Security & Auth: JSON Web Tokens (JWT) & Bcrypt.js — Cryptographic token sessions and password encryption

---

## 4. SYSTEM ARCHITECTURE & DATA FLOW

The application follows an enterprise-standard three-tier MVC architecture:

[ CLIENT TIER ]
Vite + React.js Client Application (Port 5173)
        |
        | Axios REST Calls (JWT / JSON)
        v
[ SERVER TIER ]
Node.js + Express.js API Gateway (Port 5000)
  ├── Authentication & RBAC Middleware
  ├── Controllers (Business Logic)
  └── Mongoose Models (Data Validation)
        |
        | TCP Connection via URI
        v
[ DATABASE TIER ]
MongoDB Database Engine (luxurystay_hms)
  └── 11 Normalized Collections with Indexes

---

## 5. ROLE-BASED ACCESS CONTROL (RBAC) SECURITY MATRIX

The system defines 4 internal staff roles and 1 public persona:

* Browse Suite Catalog:
  Public Guest: YES | Receptionist: YES | Housekeeper: NO | Manager: YES | Administrator: YES

* Instant Online Reservation:
  Public Guest: YES | Receptionist: YES | Housekeeper: NO | Manager: YES | Administrator: YES

* Track Booking by Reference:
  Public Guest: YES | Receptionist: YES | Housekeeper: NO | Manager: YES | Administrator: YES

* Submit Feedback & Concierge:
  Public Guest: YES | Receptionist: NO | Housekeeper: NO | Manager: NO | Administrator: NO

* 1-Click Front Desk Check-in:
  Public Guest: NO | Receptionist: YES | Housekeeper: NO | Manager: YES | Administrator: YES

* Check-out & Folio Billing:
  Public Guest: NO | Receptionist: YES | Housekeeper: NO | Manager: YES | Administrator: YES

* Sanitize Rooms & Clear Queue:
  Public Guest: NO | Receptionist: NO | Housekeeper: YES | Manager: YES | Administrator: YES

* Report Maintenance Defect:
  Public Guest: NO | Receptionist: NO | Housekeeper: YES | Manager: YES | Administrator: YES

* Review Financial Analytics:
  Public Guest: NO | Receptionist: NO | Housekeeper: NO | Manager: YES | Administrator: YES

* Modify Room Inventory Rates:
  Public Guest: NO | Receptionist: NO | Housekeeper: NO | Manager: YES | Administrator: YES

* Staff Provision & Deactivation:
  Public Guest: NO | Receptionist: NO | Housekeeper: NO | Manager: NO | Administrator: YES

* Fiscal Tax & Policy Settings:
  Public Guest: NO | Receptionist: NO | Housekeeper: NO | Manager: NO | Administrator: YES

---

## 6. DATABASE SCHEMAS & DATA MODELS (11 COLLECTIONS)

1. User.js (Employees & Administrators)
   - name (String, required): Staff full name.
   - email (String, unique, lowercase): Login identifier.
   - password (String, select: false): Bcrypt hashed cryptographic password.
   - role (Enum: 'admin', 'manager', 'receptionist', 'housekeeping').
   - phone (String): Contact number.
   - isActive (Boolean, default: true): Deactivation flag.

2. Room.js (Inventory Units)
   - roomNumber (String, unique): E.g., '101', '202', '301'.
   - roomType (Enum: 'Standard', 'Deluxe', 'Suite', 'Executive Suite', 'Presidential Suite').
   - pricePerNight (Number, min: 0): Base nightly tariff.
   - floor (Number): Building floor allocation.
   - capacity ({ adults: Number, children: Number }).
   - status (Enum: 'Available', 'Occupied', 'Cleaning', 'Maintenance', 'Reserved').
   - amenities (Array of Strings): WiFi, Jacuzzi, Mini Bar, Balcony.
   - lastCleanedAt (Date): Audit timestamp.

3. Guest.js (Customer CRM)
   - fullName (String, required).
   - email (String, unique, lowercase).
   - phone (String, required).
   - idType (Enum: 'National ID', 'Passport', 'Driving License').
   - idNumber (String, required).
   - address ({ city: String, country: String }).
   - preferences (Array of Strings): E.g., ['Non-smoking', 'High Floor'].

4. Reservation.js (Booking Engine)
   - bookingReference (String, unique): E.g., 'LS-7033-P6EN'.
   - guest (ObjectId, ref: 'Guest').
   - room (ObjectId, ref: 'Room').
   - checkInDate (Date): Scheduled arrival date.
   - checkOutDate (Date): Scheduled departure date.
   - actualCheckIn / actualCheckOut (Date): Real timestamps.
   - status (Enum: 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled').
   - roomCharges (Number): Nights * pricePerNight.
   - keyCardIssued (Boolean, default: false).

5. Bill.js (Fiscal Folios & Invoicing)
   - invoiceNumber (String, unique): E.g., 'INV-310951'.
   - reservation (ObjectId, ref: 'Reservation').
   - guest (ObjectId, ref: 'Guest').
   - roomCharges (Number): Base stay cost.
   - additionalServices (Array of { serviceName, amount, date }).
   - subtotal (Number): Room charges + added services.
   - taxRate (Number, default: 13%).
   - taxAmount (Number): (subtotal * taxRate) / 100.
   - totalAmount (Number): subtotal + taxAmount.
   - paymentStatus (Enum: 'Pending', 'Paid', 'Refunded').
   - paymentMethod (Enum: 'Credit Card', 'Cash', 'Debit Card', 'Online Transfer').
   - paidAt (Date): Payment settlement timestamp.

6. HousekeepingTask.js (Sanitation Tracking)
   - room (ObjectId, ref: 'Room').
   - taskType (Enum: 'Routine Cleaning', 'Deep Clean', 'Linen Change', 'Turn Down Service').
   - priority (Enum: 'Low', 'Medium', 'High').
   - status (Enum: 'Pending', 'In Progress', 'Completed').
   - completedAt (Date).

7. Maintenance.js (Defect Ticketing)
   - room (ObjectId, ref: 'Room').
   - issueTitle (String): E.g., 'Shower Pressure Low'.
   - description (String): Mechanical or electrical defect details.
   - priority (Enum: 'Low', 'Medium', 'High', 'Critical').
   - status (Enum: 'Pending', 'In Progress', 'Resolved').
   - reportedBy (String): E.g., 'Housekeeping Staff'.
   - resolvedAt (Date).

8. ServiceRequest.js (Concierge Operations)
   - room (ObjectId, ref: 'Room').
   - guest (ObjectId, ref: 'Guest').
   - serviceType (Enum: 'Wake-up Call', 'Airport Transportation', 'Room Service', 'Luggage Assistance').
   - details (String): Specific guest instructions.
   - status (Enum: 'Requested', 'In Progress', 'Completed').

9. Feedback.js (Guest Reviews)
   - guest (ObjectId, ref: 'Guest').
   - ratings ({ cleanliness: 1-5, service: 1-5, roomComfort: 1-5, overall: 1-5 }).
   - comments (String, required): Detailed guest reflection.

10. Setting.js (Global Hotel Configuration)
    - hotelName (String): Default: 'LuxuryStay Hospitality'.
    - taxPercentage (Number): Default: 13%.
    - checkInTime (String): Default: '14:00'.
    - checkOutTime (String): Default: '11:00'.
    - cancellationPolicy (String).

11. Notification.js (Internal Staff Alerts)
    - title (String), message (String), type (Enum), isRead (Boolean).

---

## 7. COMPLETE REST API ENDPOINTS DIRECTORY

Authentication & Employee Administration (/api/auth):
* POST /api/auth/login — Public — Staff authentication & JWT token generation
* GET /api/auth/me — Protected — Current user identity payload
* POST /api/auth/create-staff — Admin Only — Provision new employee account
* GET /api/auth/staff — Admin Only — List all staff members
* PATCH /api/auth/staff/:id/toggle-status — Admin Only — Toggle staff activation flag
* PUT /api/auth/staff/:id — Admin Only — Modify staff name, email, password, role, phone

Room Inventory (/api/rooms):
* GET /api/rooms — Public / Staff — List suites with category and price filters
* GET /api/rooms/:id — Public / Staff — Single room technical specs
* POST /api/rooms — Admin / Manager — Insert new suite into inventory
* PUT /api/rooms/:id — Admin / Manager — Update suite attributes
* PATCH /api/rooms/:id/status — Staff (All) — Instant status switcher
* DELETE /api/rooms/:id — Admin Only — Remove suite from inventory

Reservations & Front Desk (/api/reservations):
* POST /api/reservations — Public / Staff — Create booking (includes past date validation)
* GET /api/reservations — Staff Only — List all bookings
* GET /api/reservations/lookup/:reference — Public — Guest self-service tracker by booking code
* PATCH /api/reservations/:id/check-in — Staff Only — Automated check-in (marks room Occupied)
* PATCH /api/reservations/:id/check-out — Staff Only — Automated check-out (marks room Cleaning & triggers task)

Fiscal Billing & Invoicing (/api/billing):
* GET /api/billing — Staff Only — Retrieve all folio billing records
* POST /api/billing/generate/:reservationId — Staff Only — Initialize bill from reservation stay
* POST /api/billing/:billId/add-service — Staff Only — Append Food, Laundry, or Mini-bar charges
* PATCH /api/billing/:billId/pay — Staff Only — Record payment method & mark as Paid

Housekeeping & Facilities (/api/operations):
* GET /api/operations/housekeeping — Staff Only — Sanitation log and history
* POST /api/operations/housekeeping — Staff Only — Manually schedule cleaning task
* PATCH /api/operations/housekeeping/:id/complete — Staff Only — Complete task & release room to Available
* PATCH /api/operations/housekeeping/quick-clean/:roomId — Staff Only — 1-Click clean & automatic history logger
* GET /api/operations/maintenance — Staff Only — Retrieve all defect tickets
* POST /api/operations/maintenance — Staff Only — Log equipment defect (marks room Maintenance)
* PATCH /api/operations/maintenance/:id/resolve — Staff Only — Mark resolved (restores room to Available)

Dashboard Analytics & Concierge Extras (/api/dashboard, /api/extras):
* GET /api/dashboard/stats — Admin, Mgr, Rec — Executive KPI calculation (Occupancy, Revenue)
* GET /api/extras/feedback — Public — Retrieve verified guest feedback
* POST /api/extras/feedback — Public — Submit new guest rating and review
* GET /api/extras/services — Staff Only — Retrieve live guest concierge requests
* POST /api/extras/services — Public — Transmit guest concierge request
* PATCH /api/extras/services/:id/status — Staff Only — Mark concierge request completed
* GET /api/extras/settings — Protected — Retrieve global hotel configuration
* PUT /api/extras/settings — Admin Only — Update tax %, check-in hours, cancellation terms

---

## 8. THE AUTOMATED HOTEL LIFECYCLE STATE MACHINE

[ 1. Online Reservation ]
           |
           | Guest submits dates via Public Portal
           v
[ Room Status: Confirmed ] ---> Unique Booking Code Generated (e.g. LS-7033-P6EN)
           |
           | Guest arrives at Front Desk
           v
[ 2. Automated Check-In ]  ---> Staff clicks "Check-In"
           |                      |---> Room status automatically shifts to: OCCUPIED (Red)
           |                      |---> Keycard issuance recorded
           v
[ 3. In-Stay Services ]    ---> Food / Laundry added to Folio
           |                      |---> Subtotal + 13% Luxury Tax dynamically recalculated
           |                      |---> Bill marked "PAID" via Credit Card/Cash
           v
[ 4. Automated Check-Out ] ---> Staff clicks "Check-Out"
           |                      |---> Room status automatically shifts to: CLEANING (Yellow)
           |                      |---> Automatic Housekeeping task spawned
           v
[ 5. Sanitation Queue ]    ---> Room appears in Housekeeper's Immediate Sanitization Queue
           |                      |---> Housekeeper clicks "Mark Cleaned"
           v
[ 6. Restored to Available] ---> Room status automatically shifts to: AVAILABLE (Green)
                                  |---> Task logged in permanent Sanitation History
                                  |---> Room immediately re-listed on public website

---

## 9. FRONTEND ROUTE & INTERFACE DIRECTORY

Public Experience (Customer Facing — Zero Login Needed):
1. Home (/): Twin video crossfade hero banner, brand narrative, featured suite matrix, world-class amenities, interactive concierge request drawer, and stay review submissions.
2. Suites & Residences (/rooms): Full hotel inventory catalog with category filter tabs (Standard, Deluxe, Suite, Executive, Presidential), live search, quick specs modal, and online reservation booking.
3. Track My Booking (/my-booking): Guest self-service portal. Entering a reference code displays guest information, assigned suite, check-in/out dates, and live status badge (Confirmed, Checked-In, Checked-Out).
4. About Us (/about): Brand vision and dedicated Lead Software Architect & Developer profile showcasing Muhammad Abdullah with gold portrait frame, direct contact, and architectural blueprint.
5. Staff Portal Gateway (/login): Executive login form with password eye visibility toggle and return-to-website navigation.

Internal HMS Portal (Employee Facing — Role Protected):
6. Executive Cockpit (/dashboard): Top 4 KPIs (Occupancy %, Revenue, Active Bookings, Guests), live inventory status bar, live rooms matrix, and mathematical guest sentiment analytics with verified comments feed.
7. Room Inventory (/dashboard/rooms): Real-time inventory grid with 1-click status dropdowns, search, Add New Room modal (Admin/Manager), and safe room deletion.
8. Reservations & Front Desk (/dashboard/reservations): Central booking directory with status filters, search, automated Check-In, automated Check-Out, and new reservation provisioning with past date prevention.
9. Concierge & Guest Requests (/dashboard/concierge): Live queue of digital requests (Wake-up calls, Airport transport, Room service) with 1-click completion.
10. Guest CRM Profiles (/dashboard/guests): Comprehensive guest directory with ID credentials, contact numbers, and bespoke stay preference badges.
11. Billing & Invoices (/dashboard/billing): Financial folios, service charge appenders, payment collection, and official 5-star printable tax invoice generator (window.print()).
12. Housekeeping Operations (/dashboard/housekeeping): Live automatic queue showing rooms in Cleaning status, 1-click instant sanitation release, and permanent historical log.
13. Facility Maintenance (/dashboard/maintenance): Defect ticketing system, priority indicators (Low, Med, High, Critical), and resolution triggers.
14. Staff Management (/dashboard/staff - Admin Only): Employee accounts, role assignment, account activation toggle, and profile/credential modifications (Email & Password reset).
15. System Settings (/dashboard/settings - Admin Only): Global tax rates, operational check-in/out windows, and cancellation policies.

---

## 10. INSTALLATION & LOCAL RUN GUIDE

Prerequisites:
* Node.js: v18.0.0 or higher
* MongoDB: Community Server running locally on port 27017 or a MongoDB Atlas URI

Step 1: Clone Repository
git clone https://github.com/M-Abdullah256/Luxury-Stay-.git
cd Luxury-Stay-

Step 2: Backend Server Configuration
cd Server
npm install

Configure Server/.env:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/luxurystay_hms
JWT_SECRET=luxurystay_super_secret_jwt_key_2026
NODE_ENV=development

Seed initial Super Admin and luxury suites:
node seeder.js

Start backend development server:
npm run dev
(Active on http://localhost:5000)

Step 3: Frontend Client Configuration
Open a new terminal:
cd Client
npm install
npm run dev
(Active on http://localhost:5173)

---

## 11. QUALITY ASSURANCE & TESTING PROCEDURES

* Past Date Prevention:
  Input: Select yesterday's date in calendar
  Expected Result: Dates grayed out / disabled by min attribute
  Status: PASSED

* Date Range Validation:
  Input: Select Check-out before Check-in
  Expected Result: Check-out auto-adjusts; server rejects invalid ranges
  Status: PASSED

* Returning Guest Booking:
  Input: Book with existing email test@gmail.com
  Expected Result: Re-uses existing profile; creates reservation seamlessly
  Status: PASSED

* Guest Booking Lookup:
  Input: Enter reference code in /my-booking
  Expected Result: Retrieves exact booking record without login
  Status: PASSED

* RBAC Navigation Restriction:
  Input: Login as Receptionist
  Expected Result: Staff Management & Settings hidden from sidebar
  Status: PASSED

* Automated Check-In:
  Input: Click "Check-In" on booking
  Expected Result: Reservation marked Checked-In, Room turns Occupied
  Status: PASSED

* Dynamic Tax Calculation:
  Input: Add $50 Food Service to $400 Stay
  Expected Result: Subtotal: $450, 13% Tax: $58.50, Total: $508.50
  Status: PASSED

* Automated Check-Out:
  Input: Click "Check-Out" on booking
  Expected Result: Room turns Cleaning, appears in Housekeeping queue
  Status: PASSED

* 1-Click Sanitization:
  Input: Click "Mark Cleaned" in Housekeeping
  Expected Result: Room turns Available, logged in Sanitation History
  Status: PASSED

* Real-Time Revenue Sync:
  Input: Settle bill via Credit Card
  Expected Result: Revenue reflects on Dashboard Overview cockpit
  Status: PASSED

---

## 12. OPERATIONAL STANDARD OPERATING PROCEDURE (SOP)

Front Desk Receptionist SOP:
1. When guest arrives, open Reservations & Check-In.
2. Locate booking by guest name or reference code.
3. Click "Check-In" (issues key card and locks room to Occupied).
4. To add food or laundry charges, open Billing & Invoices, find the guest folio, click "+ Add Service", and specify charge.
5. On departure, click "Pay" to record settlement, click "Invoice" to print guest tax invoice, and click "Check-Out" to release room to Housekeeping.

Housekeeping Staff SOP:
1. Log in with housekeeping credentials.
2. Open Housekeeping Tasks.
3. View the "Suites Requiring Immediate Sanitization" banner at the top.
4. After physical room sanitation is complete, click "Mark Cleaned" on the corresponding suite card.
5. The room will instantly release back to Available status for front desk re-booking and record in the permanent history log.

---

## 13. OFFICIAL 5-MINUTE VIDEO DEMONSTRATION SCRIPT

Follow this sequential script when recording the project presentation video:

1. Minute 0:00 – 1:00 (Public Portal & Brand Showcase):
   - Display http://localhost:5173/. Highlight the video hero banner, brand narrative, and navigate to /rooms.
   - Demonstrate category filters (Standard, Deluxe, Suite, Presidential).

2. Minute 1:00 – 1:45 (Instant Guest Booking):
   - Click "Reserve Online" on Room #102. Show that past dates are blocked.
   - Fill guest details and click "Confirm Online Booking".
   - Highlight the generated Booking Reference Code (e.g., LS-7033-P6EN) and calculated tariff.

3. Minute 1:45 – 2:30 (Self-Service Tracker & About Us):
   - Open /my-booking, enter the booking reference, and demonstrate that the guest can track their reservation without logging in.
   - Open /about and showcase the brand philosophy and the Lead Software Architect profile of Muhammad Abdullah.

4. Minute 2:30 – 3:30 (Front Desk Receptionist Check-in):
   - Navigate to /login. Demonstrate the show/hide password toggle. Log in with receptionist credentials.
   - Point out the dynamic sidebar (Staff Management and Settings are hidden).
   - Open Reservations & Check-In, locate the booking, and execute "Check-In".
   - Open Room Inventory to demonstrate that Room #102 is now automatically Occupied (Red).

5. Minute 3:30 – 4:15 (Billing, Folios & Check-Out):
   - Open Billing & Invoices, click "+ Add Service", add $50 Room Service, and explain the dynamic 13% tax math ($508.50).
   - Settle the bill as Paid and open the 5-Star Luxury Printable Tax Invoice.
   - Return to Reservations and click "Check-Out".

6. Minute 4:15 – 5:00 (Housekeeping Automation & Executive Cockpit):
   - Log out and log in as Housekeeper. Show the restricted sidebar.
   - Open Housekeeping Tasks, showcase the live "Suites Requiring Immediate Sanitization" card for Room #102.
   - Click "Mark Cleaned" and demonstrate that the room is restored to Available and logged in the history table.
   - Conclude by logging in as Super Admin to display the updated live revenue in the Executive Cockpit.

---
(c) 2026 LuxuryStay Hospitality Group. Engineered by Muhammad Abdullah. All Rights Reserved.