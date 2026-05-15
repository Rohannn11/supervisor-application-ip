# Patrol Incident Reporting System - Implementation Roadmap

This document outlines the tasks that have been completed and those that remain for the proper end-to-end implementation of the system. It also serves as a handover guide for running the application and managing environment variables.

---

## 1. Done: Completed Tasks & Implementations

- **SQL TiDB Based Database:** Fully configured for handling relational data including employee master, shift data, checklist responses, and basic reporting. SQL is robustly handling relational architectures; *do not use Firebase for relational data, as it is not scalable.*
- **Firebase:** Integrated primarily for robust Authentication. (Later to be used for paid SMS features or Twilio depending on future preferences).
- **The Entire UI:** Complete supervisor application user interface including offline-capable UX flows, dynamic theming (Dark/Light mode), and robust navigation.
- **Geofencing and Location Pipeline:** Configured with React Native Maps, capable of displaying patrol boundaries and validating spot proximities before check-ins.
- **Checklist Pipeline:** Dynamic tri-state (Yes/No/N/A) question handling with the ability to attach photo evidence to responses.
- **Occurrence Pipeline:** Fully integrated frontend-to-SQL logic ensuring accurate tracking of incidents, including `user_id`, `shift_id`, GPS coordinates, and mapped image references.

---

## 2. To-Do: Pending Tasks for System Completion

- [x] **MongoDB Configuration:**
  - Successfully configured to handle large-scale image metadata.
  - Connected to MongoDB Atlas cluster.
- [x] **Cloudinary Integration (Data Storage):**
  - Implemented direct uploads using `multer-storage-cloudinary`.
  - Created modular upload middleware for incidents, checklists, and reports.
  - Secured HTTPS URL storage in MongoDB metadata.
- [ ] **Real Authentication API Connections:**
  - Build out the `/api/auth/resolve-employee` endpoint on the backend to correctly look up Employee IDs against the SQL TiDB and return masked mobile numbers for Firebase OTP.

---

## 3. Environment Variables & Credentials Required

To run this application, you must create a `.env` file in the root directory. **Do not commit this file to version control.**

### Backend Configuration
*   **Variable:** `EXPO_PUBLIC_API_BASE`
    *   **Meaning:** The base URL where your Node.js backend is running.
    *   **Value:** e.g., `http://192.168.1.5:3000` (Use your local network IP for testing on physical devices, NOT localhost).
    *   **How to get:** Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to find your local IPv4 address.
*   **Variable:** `EXPO_PUBLIC_MOCK_TOKEN`
    *   **Meaning:** A placeholder token used for Proof-of-Concept API headers.
    *   **Value:** `mock-token-12345`

### Firebase Configuration (Web SDK for React Native)
*   **Variable:** `EXPO_PUBLIC_FIREBASE_API_KEY`
    *   **Meaning:** The public API key to identify your app to Firebase services.
    *   **Value:** String (e.g., `AIzaSy...`)
*   **Variable:** `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
    *   **Meaning:** The domain used for Firebase Auth.
    *   **Value:** `<PROJECT_ID>.firebaseapp.com`
*   **Variable:** `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
    *   **Meaning:** Your unique Firebase project identifier.
    *   **Value:** e.g., `patrol-incident-application`
*   **Variable:** `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
    *   **Meaning:** Default Cloud Storage bucket for Firebase.
    *   **Value:** `<PROJECT_ID>.firebasestorage.app`
*   **Variable:** `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    *   **Meaning:** ID used for Cloud Messaging.
    *   **Value:** Numeric string (e.g., `225044323271`)
*   **Variable:** `EXPO_PUBLIC_FIREBASE_APP_ID`
    *   **Meaning:** Your specific Web App's unique ID within Firebase.
    *   **Value:** String (e.g., `1:225044...:web:...`)

**How to get Firebase values:**
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Click the **Gear Icon** next to "Project Overview" and select **Project Settings**.
4. Scroll down to **Your apps**. Copy the `firebaseConfig` object values into their respective variables.

### Database / Secret Keys (Backend ONLY)
**Important:** Your `MYSQL_URL` (TiDB connection string) and Cloudinary secrets should NEVER be placed in the React Native `.env` file. They must only exist on the backend server's environment file.

---

## 4. How to Run the Application

### Prerequisites
- Install **Node.js** (v18 or higher recommended).
- Install **Git**.
- Download **Expo Go** on your physical iOS/Android device.

### Step 1: Start the Backend (MySQL API)
1. Open a terminal and navigate to the backend folder:
   `cd backend`
2. Install dependencies:
   `npm install`
3. Create a `.env` file inside the `/backend` folder with your TiDB connection string (`MYSQL_URL="..."`).
4. Start the server:
   `node index.js`
   *(It should log: "Connected to MySQL (TiDB) successfully")*

### Step 2: Start the Frontend (React Native / Expo)
1. Open a **new** terminal and navigate to the root project folder:
   `cd patrol-incident-reporting-system`
2. Install frontend dependencies:
   `npm install`
3. Ensure your `.env` file in the root is filled out correctly (as described in section 3).
4. Start the Expo bundler, clearing the cache to ensure new env variables load:
   `npx expo start -c`
5. Scan the generated QR code using your phone's camera (iOS) or the Expo Go app (Android).
6. **Login Testing:** Use `RJ123` as the Employee ID to trigger the testing workflow.
