1. Role of the Supervisor
The Supervisor is the frontline operational user who physically performs patrolling duties at client sites.
He is the primary data collector and reporter of the entire system. Every checkpoint visit, checklist response, incident photo, occurrence log, and SOS alert originates from his mobile app.
He does not manage teams, approve reports, or view analytics, his job is to execute patrols accurately, capture real-time evidence, and ensure personal safety. All his actions are GPS-verified, server-timestamped (UTC), and anti-spoof protected, automatically flowing upward for review.
Position in Hierarchy:
Guard → Supervisor → Field Officer → Area Manager → Director
Client → Admin
________________________________________
2. Application Access & Features
Application: Mobile App ONLY (Android, offline-first)
No Web Access – Everything happens inside one simple mobile app.
Features Available to Supervisor (100% of his scope):
Category	Key Features
Authentication	Live photo + liveness check, IMEI device binding, OTP login/ Approval based login , auto-logout
Home/Dashboard	Today’s shift card, language switcher, GPS status, quick action tiles
Real-Time Tracking	Live map with blue dot, geofencing, checkpoint pinning, breadcrumb trail
Checkpoint Tagging	NFC / QR Code / GPS-based physical verification
Patrolling Checklist	Dynamic yes/no/NA questions, conditional “No” → remark + single upload
Incidents & Observations	Separate sections at checklist end with multi-upload (photo/video/doc)
Occurrence Checklist	Unlimited numbered entries (Occurrence 1, 2, 3…) with text + multi-upload
Safety	Persistent floating red SOS button (long-press), live GPS streaming
Reporting	View Own past patrol reports only (PDF)
Usability	Full 8-language support (English/Hindi/Marathi + others), voice-over, speech-to-text, offline mode + auto-sync
Strict Constraints:
●	Limits on the uploading constraints ensuring homogeneity.
●	Auto-compression
●	All data immutable & audit-logged
Restricted Areas: No access to masters, analytics, client reports, SOS console, user management, or approval workflows.
________________________________________
3. How the Supervisor Will Use the Application
The app is designed like a simple tool , not a complex software.
●	One-tap actions
●	Icon-first + large buttons (48dp minimum)
●	Language switcher always visible (top-right) , entire app changes instantly to Hindi/Marathi
●	Persistent red SOS button on every screen or hovers dynamically.
●	Works fully offline (auto-syncs when back online)
________________________________________
4. Core Responsibilities
1.	Physically visit every assigned checkpoint and prove presence (NFC/QR/GPS).
2.	Accurately complete the Patrolling Checklist during the shift.
3.	Capture evidence for any “No” answer, incident, or observation.
4.	Log unlimited separate occurrences with supporting media.
5.	Trigger SOS instantly in any emergency.
6.	Submit complete report at end of shift.
7.	Maintain personal safety and device health (low-battery alerts).
________________________________________

5. Daily Tasks the Supervisor Must Undergo
1.	Morning login (photo + Approval).
2.	View assigned patrol on Home screen.
3.	Tap “Start Patrol” (geofence must be active).
4.	Follow live map and tag checkpoints.
5.	Fill Patrolling Checklist question-by-question.
6.	Scroll down and fill Incidents + Observations if required.
7.	Switch to Occurrence Checklist and add any extra events.
8.	Press SOS if any threat arises.
9.	Swipe to Submit at end of shift.
10.	End-of-day check “My Reports” for status.
________________________________________
6. Complete Workflow (Step-by-Step)
Start of Shift
Login → Home → “Start Patrol” (geofence check) → Live Map
During Patrol
Navigate → Tag checkpoint → Open Patrolling Checklist
→ Answer questions (Yes/No/NA)
→ On “No”: Remark + voice + upload opens automatically
→ Scroll to bottom → Incidents & Observations (multi-upload)
Extra Events
Switch to Occurrence Checklist → + Add New (auto-numbered) → text + multi-upload
Emergency
Long-press floating SOS → red screen activates → live GPS shared instantly
End of Shift
Submit → Success animation → “Report Sent to Area Manager” → auto-routed
Post-Shift
My Reports → view status (Approved / Pending / Sent Back)
________________________________________


7. Data Flow (System Perspective)
1.	Supervisor submits checklist + media + GPS proof
2.	Report instantly saved with server UTC timestamp
3.	Auto-routed to Area Manager for review (4-hour SLA)
4.	Area Manager can approve or “Send Back” with comments
5.	If approved → forwarded to Client as white-labeled PDF
6.	All actions logged in immutable audit trail
7.	EOD automated summary email sent to stakeholders (Supervisor receives own copy only)
Critical Path: SOS → immediate push/SMS/email to Admin + Area Manager + Site Manager + live map zoom.
________________________________________
8. User Stories 
Epic:
As a Supervisor, I want a simple, voice-enabled, offline-first mobile app so that I can complete my entire patrol shift safely and accurately even if I have low literacy or limited smartphone experience.
Detailed User Stories:
1.	As a Supervisor, I want to login with a live photo and OTP so that only verified guards can access the app.
2.	As a Supervisor, I want to see my today’s shift in Hindi/Marathi with a big “START PATROL” button so that I know exactly what to do.
3.	As a Supervisor, I want the “Start Patrol” button to activate only inside the geofence so that I cannot fake my location.
4.	As a Supervisor, I want to answer checklist questions with giant coloured buttons ( Yes / No / NA) so that I can finish quickly.
5.	As a Supervisor, I want the “No” button to automatically open remark + photo upload so that I can explain problems easily.
6.	As a Supervisor, I want separate Incidents and Observations sections at the end with multi-upload so that I can report extra issues.
7.	As a Supervisor, I want to add unlimited numbered Occurrences with voice and photos so that every unusual event is recorded.
8.	As a Supervisor, I want a persistent red SOS button that works with one long-press so that help reaches me instantly.
9.	As a Supervisor, I want to swipe to submit so that my report automatically goes to my Area Manager.
10.	As a Supervisor, I want the entire app to switch to Hindi or Marathi instantly and read questions aloud so that I never feel stuck.
11.	As a Supervisor working in low-network areas, I want full offline mode with auto-sync so that I never lose data.
Supervisor Story
Ravi, a dedicated supervisor in Pune, starts his night shift at 8 PM. He opens the mobile app on his Android phone, which is already bound to his device IMEI for security. After entering his Employee ID and mobile number, an OTP arrives via SMS, and he uploads a live selfie— the app verifies it's him with liveness detection, matching it against his HR photo.
Once logged in, Ravi taps the language selector on the home screen, switching to Marathi for ease. The app auto-selects his current shift from the master data, showing his assigned site: a large IT campus in Hinjewadi.

Case 1 : - 
With the persistent floating SOS button glowing red in the corner (set to long-press activation to avoid accidents), Ravi heads out. The real-time GPS kicks in, drawing a geofence around the campus— he can't access checklists until he's within 50 meters, ensuring no remote faking. His task list pops up: a site-specific Patrolling Checklist allocated via the admin's bulk mapping. It includes questions like "Are all fire exits clear?" with Yes/No/NA buttons, weighted risk points, and optional remarks via voice-to-text.

Case 2 :-
Mid-patrol, Ravi feels uneasy near a dimly lit area— he double-taps the SOS button. It vibrates confirmation, then streams his GPS every 30 seconds to the command center. Alerts blast via push, SMS, and email to his area manager and admin. The web dashboard auto-zooms to his blinking red icon. His supervisor resolves it quickly (a false alarm from shadows), marking the Safety Ticket as Closed with a resolution report upload. 

Case 3 :- 
By shift end, Ravi submits the full checklist— server-stamped to prevent tampering. It auto-routes via workflow to his area manager for review
