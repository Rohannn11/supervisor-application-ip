# Patrol Incident Reporting System - Implementation Roadmap

This document outlines the current state of the Patrol Incident Reporting System frontend, detailing completed features, upcoming backend integration tasks, and the required environment configuration for the incoming development team.

---

## 1. Current State: Completed Features (Frontend & UI)
The mobile application's frontend is fully structured with responsive React Native components, local persistence, and offline-capable UX flows.

### Authentication & Supervisor Flow
- **UI/UX:** Complete login screen with dynamic theming.
- **Mock Authentication Pipeline:** Implemented an end-to-end "Proof of Concept" mock flow that perfectly simulates Firebase Phone Authentication (Employee ID `RJ123` fast-tracks to the OTP test sequence).
- **Environment Preparedness:** Firebase SDK is linked and ready; can easily transition to real Firebase Auth by re-enabling standard `signInWithPhoneNumber` logic when backend provisioning is finalized.

### Core Patrol & Incident Workflows
- **Checklist Hub & Spot Validation:** QR scanning is simulated and integrated before checking into a patrol spot.
- **Dynamic Checklists:** Checklists support tri-state (Yes/No/N/A) functionality with image attachment capabilities.
- **Occurrence Reporting:** Supervisors can submit checklists with or without logged occurrences. Incident tracking allows multiple photo evidence attachments.
- **Timeouts & Safety:** All API simulation points (e.g., `submitToBackend`) are wrapped with a `5000ms` strict timeout (`AbortController`) to ensure the UI never hangs for 90 seconds if the network/backend is unreachable.

### Persistent State & Settings
- **Context API & AsyncStorage:** Manages Global Themes (Light/Dark mode), Notification Preferences, Geofence Polygons, and Session Locking reliably.

---

## 2. To-Do: Backend Integration & System Completion
The following infrastructure components must be connected and built out to convert the mock application into a production-ready system.

### Database Architecture
- [ ] **MongoDB Configuration:**
  - Need to establish the Mongoose schemas and database clusters to store:
    - **Patrol Checklists:** Questions, user responses, and status.
    - **Incidents/Occurrences:** Time, GPS location, textual description, and photo URIs.
    - **Employee Master:** Employee ID to phone number mapping.
- [ ] **SQL Server (Optional/If Required):**
  - If analytics or specific metrics are required to be kept relational, link Firebase SQL Connect or a standard PostgreSQL instance for shift data.

### Media & File Storage
- [ ] **Cloudinary Integration:**
  - Replace the current local URI image handling (`expo-image-picker`) with direct uploads to **Cloudinary**.
  - The API should accept the base64 or multipart/form-data from the React Native app, upload it to Cloudinary, and return the secure URL to save into MongoDB.

### Security & API Logic
- [ ] **Real Authentication Endpoints:**
  - Build out the `/api/auth/resolve-employee` endpoint to correctly look up the Employee ID and return the masked mobile number.
- [ ] **Patrol Endpoints:**
  - Create the POST `/api/patrol/submit` endpoint to accept checklist responses and occurrence reports.

---

## 3. Environment Variables (.env Setup)

To run this application, create a `.env` file in the root of the project. **Do not commit your `.env` file to version control.** 

Below is the required schema. Ensure you populate the values from your respective Firebase/Cloudinary/Backend consoles.

```env
# ── BACKEND CONFIGURATION ──
# The base URL of your running backend (Node.js/Express or similar)
# During local development, use your machine's local IP (e.g., http://192.168.1.x:3000)
EXPO_PUBLIC_API_BASE=http://<YOUR_BACKEND_IP>:3000

# Optional mock token used for POC headers. Update to use real JWT implementation.
EXPO_PUBLIC_MOCK_TOKEN=mock-token-12345

# ── FIREBASE CONFIGURATION (Web SDK) ──
# Obtain these from Firebase Console -> Project Settings -> General -> Web Apps
EXPO_PUBLIC_FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=<YOUR_PROJECT>.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=<YOUR_PROJECT_ID>
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=<YOUR_PROJECT>.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<YOUR_SENDER_ID>
EXPO_PUBLIC_FIREBASE_APP_ID=<YOUR_APP_ID>
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=<YOUR_MEASUREMENT_ID>

# ── CLOUDINARY / DATABASE (To be added on backend .env, NOT Expo) ──
# Note: Database strings and Cloudinary secrets should only exist on your BACKEND SERVER (.env).
# Do not expose them in this React Native EXPO_PUBLIC environment.
```

### How to obtain Firebase Credentials:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Click the **Gear Icon** next to "Project Overview" and select **Project Settings**.
4. Scroll down to **Your apps**. If a Web App exists, copy the `firebaseConfig` object values into the respective `EXPO_PUBLIC_FIREBASE_*` variables above. If not, click the Web icon (`</>`) to create one.
