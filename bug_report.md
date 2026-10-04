# LuxuryStay Project Scan - Bug Report

Here is a comprehensive list of bugs, vulnerabilities, and logical errors found during the scan of the project.

## 🚨 Critical / High Priority

1. **Authentication Secret Hardcoded in Production**
   - **Location:** `Server/utils/generateToken.js` & `Server/middleware/authMiddleware.js`
   - **Issue:** The JWT signing key falls back to `'secret123'` if `process.env.JWT_SECRET` is not provided. In production, if the env variable fails to load or is missing, anyone knowing this fallback can forge admin tokens and hijack the system.
   - **Fix:** Remove the fallback or throw a critical error if `JWT_SECRET` is missing during startup.

2. **Guest Data Overwrite Vulnerability**
   - **Location:** `Server/controllers/guestController.js` (in `createGuest`)
   - **Issue:** The endpoint looks up a guest by `email`. If found, it blindly updates their `fullName`, `phone`, and `idNumber` based on the new request. An attacker could overwrite another guest's sensitive PII simply by making a booking using their email address.
   - **Fix:** Ensure that creating a new booking does not automatically overwrite existing guest details unless authenticated by that guest.

3. **Silent API Failures Presenting as Success**
   - **Location:** `Client/src/pages/LandingPage.jsx`
   - **Issue:** In the `handleServiceSubmit` and `handleFeedbackSubmit` functions, the `catch (err)` block shows a success alert (`alert('Service request submitted to concierge team.')`) instead of an error message. If the API fails or the server is down, users will falsely believe their request was successful.
   - **Fix:** Update the catch blocks to display the actual error (e.g., `alert(err.response?.data?.message || 'Failed')`).

4. **Timezone Offset Bug in Date Selection**
   - **Location:** `Client/src/pages/LandingPage.jsx` & `Client/src/pages/PublicRooms.jsx`
   - **Issue:** The code uses `new Date().toISOString().split('T')[0]` to determine the current local date. Since `toISOString()` uses UTC, users in timezones behind UTC (like PST) will see "today" as yesterday during evening hours, leading to unselectable dates or 1-day offset errors in bookings.
   - **Fix:** Use local timezone formatting (e.g., `toLocaleDateString('en-CA')`) instead of `toISOString()`.

## ⚠️ Medium Priority

5. **Weak Entropy for Unique Identifiers**
   - **Location:** `Server/models/Bill.js` & `Server/models/Reservation.js`
   - **Issue:** The `invoiceNumber` and `bookingReference` are generated using `Date.now().toString().slice(-6)` and `slice(-4)`. Due to the high likelihood of concurrent requests occurring within the same millisecond or second, this can easily lead to duplicate key errors crashing the database save operation.
   - **Fix:** Use a robust library like `uuid` or `nanoid` to generate guaranteed unique references.

6. **Unvalidated Operations Data**
   - **Location:** `Server/controllers/operationsController.js` (in `quickCleanRoom`)
   - **Issue:** The endpoint does not verify if the provided `roomId` actually corresponds to an existing room in the database. It will blindly create or complete a task for a non-existent room, leading to dangling task records.
   - **Fix:** Add a check `const room = await Room.findById(roomId)` before proceeding.

7. **Harsh Authentication Redirection**
   - **Location:** `Client/src/api/axios.js`
   - **Issue:** The global Axios response interceptor uses `window.location.href = '/login'` when it encounters a 401 Unauthorized error. This forces a full page reload, dropping all React application state.
   - **Fix:** Integrate React Router's `navigate` mechanism into the interceptor or utilize an event emitter to gracefully redirect the user.

8. **Direct State Mutation in Effects (React Cascades)**
   - **Location:** `Client/src/pages/RoomsManagement.jsx`
   - **Issue:** Linter output flagged multiple potential instances where React state is directly manipulated within `useEffect` hooks without proper dependency array management. This could cause extra re-renders or infinite loops if not carefully managed.
   - **Fix:** Review `useEffect` hooks across the client and ensure `setState` is only called when absolutely necessary.

## 🧹 Maintenance & Cleanliness

9. **Missing Linter / Code Quality Tools**
   - **Location:** Root & Client folders
   - **Issue:** The project does not enforce ESLint or Prettier on commit or build, leading to the 86+ warnings detected when we ran `oxlint`.
   - **Fix:** Set up Husky pre-commit hooks and a standard ESLint configuration.

10. **Unused Imports & Variables**
    - **Location:** Across the `Client` directory
    - **Issue:** The linter found numerous unused imports (e.g., unused React hooks, unused Lucide icons). This marginally increases the bundle size and creates clutter.
    - **Fix:** Perform a codebase cleanup to remove dead code.

---

### Suggested Next Steps
Let me know which bugs you'd like to tackle first! I can automatically apply fixes to the code if you point me to the ones you want to prioritize.
