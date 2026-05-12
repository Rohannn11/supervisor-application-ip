# Patrol and Incident Reporting System - Technical Documentation

## 1. System Overview
The Patrol and Incident Reporting System is a production-grade mobile solution designed for security personnel and supervisors. It facilitates real-time tracking, sequential incident reporting, checkpoint management, and emergency response coordination. The system is built with a focus on high availability, visual excellence, and ease of use in high-stress environments.

---

## 2. Current Implementation Details

### 2.1 Technology Stack
- **Frontend Framework**: React Native with Expo (SDK 54).
- **Navigation**: `@react-navigation/native` utilizing a combination of Native Stacks and Bottom Tab navigators.
- **State Management**: React Context API (`AuthContext`, `AppContext`) for global session and application state.
- **Styling**: Vanilla React Native `StyleSheet` with a centralized design system (`src/theme/colors.js`).
- **Icons**: Expo Vector Icons (MaterialIcons).

### 2.2 Feature Breakdown
- **Authentication**: 
  - Supervisor-specific login flow with Employee ID and OTP input.
  - Mocked authentication logic with simulated network latency.
- **Supervisor Dashboard**:
  - Real-time GPS status indicator (UI-only).
  - Quick access cards for Patrol Checklist and Occurrence Reporting.
  - Dynamic greeting and site information display.
- **Patrol Management**:
  - **Start/End Patrol**: Global state toggle to track active patrol sessions.
  - **Active Patrol Map**: Interactive map interface (placeholder for real-time tracking).
  - **Checkpoint Scanning**: UI for scanning patrol points (CheckpointScanScreen).
- **Incident Reporting**:
  - **Sequential Reporting**: "Report Occurrences" screen allowing multiple entries per session.
  - **Multimedia Support**: UI placeholders for photo and video evidence attachment.
  - **Voice Integration**: UI for microphone-based reporting (UI trigger only).
- **Emergency System**:
  - Global SOS trigger available in the header and specialized SOS active screen.
- **Multi-language Support**:
  - Language switcher implemented with support for English, Hindi, Marathi, Gujarati, and Punjabi.

### 2.3 Architecture
- **Navigation Hierarchy**:
  - `RootNavigator`: Switches between `AuthStack` and `MainTabNavigator` based on login state.
  - `MainTabNavigator`: Contains Home, Checklist, Reports, and Profile tabs.
  - Specialized Stacks: `HomeStack`, `ChecklistStack`, `ReportsStack`, and `TasksStack` for deep navigation.
- **Global Contexts**:
  - `AuthContext`: Manages user session, login/logout, and profile data.
  - `AppContext`: Manages operational state like active patrol status, SOS status, and localization settings.

---

## 3. Gap Analysis & Production Readiness

The following elements are identified as partially implemented or missing, requiring completion for end-to-end production readiness.

### 3.1 Backend & API Integration
- [ ] **API Service Layer**: Currently, all data is mocked. A service layer (using Axios or Fetch) needs to be implemented to communicate with a REST/GraphQL backend.
- [ ] **Authentication Persistence**: Implement JWT token storage using `expo-secure-store` to keep users logged in.
- [ ] **Real-time Synchronization**: Integrate WebSockets (e.g., Socket.io) for live SOS alerts and supervisor-to-officer coordination.

### 3.2 Storage & Offline Capability
- [ ] **Local Persistence**: Implement `AsyncStorage` or `SQLite` to store reports locally when the device is offline.
- [ ] **Sync Queue**: A mechanism to automatically upload cached reports once the internet connection is restored.

### 3.3 Device Capabilities (Native Modules)
- [ ] **GPS Tracking**: Implement background location tracking (`expo-location`) to send periodic coordinates to the server during an active patrol.
- [ ] **Camera & Media**: Integrate `expo-camera` and `expo-image-picker` to make the "Add Evidence" functionality operational.
- [ ] **Biometrics**: Add FaceID/Fingerprint authentication for faster supervisor access.

### 3.4 Security Layer
- [ ] **Data Encryption**: Encrypt sensitive reporting data stored on the device.
- [ ] **SSL Pinning**: Ensure secure communication between the app and the backend.
- [ ] **Input Sanitization**: Robust validation for all form fields to prevent injection attacks.

### 3.5 Infrastructure & DevOps
- [ ] **Environment Configuration**: Set up `.env` files for development, staging, and production API endpoints.
- [ ] **Error Monitoring**: Integrate Sentry or Bugsnag for real-time crash reporting and performance monitoring.
- [ ] **CI/CD**: Automate builds and deployments using EAS (Expo Application Services).

---

## 4. Roadmap for Integration
1. **Phase 1**: Define OpenAPI specifications for all endpoints (Login, Submit Report, Get Sites).
2. **Phase 2**: Replace `AuthContext` mock logic with real API calls and Secure Store.
3. **Phase 3**: Implement the `ApiService` layer for incident reporting and patrol logs.
4. **Phase 4**: Enable native hardware features (Camera, GPS, Storage).
5. **Phase 5**: Security hardening and load testing.
