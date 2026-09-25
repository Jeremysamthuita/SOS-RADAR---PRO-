# Requirements Document

## 1. Application Overview

- **Application Name**: SOS RADAR - Emergency Roadside Assistance (Kenya Edition)
- **Application Description**: A tactical, high-contrast crisis response web application designed for high-stress roadside emergencies in Kenya. The system features an ultra-minimalist interface with a single-tap SOS primary action, immediate haptic and visual feedback, real-time Kenyan highway coordinate and landmark tracking, integrated Kenyan emergency hotlines, and collapsible bento-style data cards for secondary details.

## 2. Target Users & Core Scenarios

- **Target Users**:
  - Motorists experiencing breakdowns, accidents, or distress on Kenyan roads and highways.
  - Fleet and commercial drivers requiring rapid, high-visibility emergency dispatch.
  - Designated emergency contacts tracking live incident status.
- **Core Scenarios**:
  - Driver triggers instant assistance with a single tap on the primary SOS button without navigating menus.
  - Driver receives instant visual status updates and haptic confirmation during low-visibility or night driving conditions.
  - Driver shares live coordinates and Kenyan highway landmark positions (such as A104 Kinungi Escarpment or Mombasa Road A109) with emergency services.
  - Driver accesses direct one-touch Kenyan hotlines (999, 112, Red Cross Kenya 1199, AA Kenya, St John Ambulance) or executes silent alarm/medical profile sharing.

## 3. Page Structure & Functional Specifications

### Page Structure Tree

```
SOS RADAR Web Application
├── Authentication
│   ├── Driver Sign-In
│   └── Account Registration
├── Tactical Emergency Dashboard
│   ├── Single-Tap Primary SOS Button
│   ├── High-Contrast Status Banner
│   ├── Live Highway Location & Landmark Stream
│   ├── One-Touch Quick Actions (Silent Alarm, Medical Sharing, Direct Audio Link)
│   └── Collapsible Bento Cards (Secondary Data)
│       ├── Vehicle Profile Card
│       ├── Medical Profile Card
│       ├── Emergency Contacts Card (+254 Validation)
│       └── Kenya Emergency Hotlines Direct Dial
├── Active Rescue Tracking
│   ├── Tactical Leaflet Map (SAR Overlays & Kenyan Highway Points)
│   ├── Live Status Readout
│   ├── Rescuer Details & ETA
│   └── Masked Communication Channel
└── Service Resolution
    └── Incident Summary & Completion Status
```

### Functional Specifications

#### 1. Authentication
- **Driver Sign-In & Registration**:
  - Mobile number authentication supporting Kenyan phone prefixes (+254 7XX XXX XXX / +254 1XX XXX XXX) and password.
  - Streamlined account creation with minimal required fields to ensure rapid onboarding.

#### 2. Tactical Emergency Dashboard
- **High-Contrast Crisis Interface**:
  - Muted dark mode base theme to eliminate screen glare and prevent night blindness.
  - Deep safety crimson color coding for active critical alerts and primary trigger.
  - Safety amber color coding for warnings, standby states, and pending dispatches.
  - Large, zero-jargon typography for instant millisecond readability.
- **Single-Tap Primary SOS Trigger**:
  - Massive, centered action button requiring zero nested menu navigation.
  - Triggers immediate emergency cascade upon a single touch.
- **Haptic & Visual Confirmation**:
  - Browser vibration pulse confirmation on trigger activation.
  - Instant visual state transition confirming dispatch transmission.
- **Live Highway Location Stream**:
  - Real-time GPS coordinate acquisition paired with recognized Kenyan highway landmarks (e.g., Nairobi-Nakuru A104 Kinungi Escarpment, Mombasa Road A109, Thika Superhighway A2, Nairobi Expressway).
  - Manual fallback text input for highway mile marker or nearest landmark when GPS is degraded.
- **One-Touch Presets**:
  - Silent Alarm mode: Activates covert emergency dispatch without loud UI alerts or audio triggers.
  - Medical Profile Sharing: Instantly attaches stored medical notes and allergies to the dispatch payload.
  - Direct Audio Link: Initiates one-tap emergency call connectivity.
- **Collapsible Bento-Style Data Cards**:
  - Clean modular hierarchy keeping secondary details hidden or minimized until expanded.
  - *Vehicle Profile Card*: Stored vehicle registration number, make, model, and color.
  - *Medical Notes Card*: Blood type, critical conditions, and emergency instructions.
  - *Emergency Contacts Card*: Stored Kenyan phone contacts for automated alert dispatch.
  - *Kenyan Emergency Hotlines Card*: One-tap direct dial for National Police / Emergency (999, 112), Kenya Red Cross (1199), AA Kenya Roadside Rescue (+254 709 933 000), and St John Ambulance (+254 721 225 285).

#### 3. Active Rescue Tracking
- **Tactical Map View**:
  - Leaflet map with satellite radar layer overlays and localized Kenyan highway route geometry.
  - Real-time visual markers for user position, highway landmarks, and approaching rescue unit.
- **Instant Status Readouts**:
  - Large-format text indicators without technical jargon (e.g., HELP IS DISPATCHING, RESCUE EN ROUTE, RESCUER ARRIVED).
- **Rescuer & Dispatch Management**:
  - Displays rescuer name, vehicle identifier, and dynamic ETA.
  - Automated provider reassignment if current provider does not confirm within 60 seconds.
- **In-App Masked Communication**:
  - Secure text and audio communication link between driver and assigned rescue responder.

## 4. Business Rules & Core Logic

1. **Zero-Friction Trigger**: Activating the main SOS button executes the emergency dispatch payload immediately without secondary confirmation dialogs.
2. **Phone Number Formatting**: All phone inputs must conform to Kenyan national and international dialing standards (+254 7XX XXX XXX or +254 1XX XXX XXX).
3. **Kenyan Highway Contextualization**: Location stream attempts to match GPS coordinates with predefined Kenyan highway corridors (A104, A109, A2, Nairobi Expressway) to enrich dispatch data.
4. **Automated Cascading Dispatch**: If an assigned roadside provider does not accept the emergency request within 60 seconds, the request cascades automatically to the next available unit.
5. **Emergency Contact Broadcast**: SOS activation automatically transmits a distress message containing live location and landmark data to all verified emergency contacts.
6. **Silent Alarm Execution**: Silent alarm activation updates status silently on the backend while displaying a discreet interface state to the user.

## 5. Exceptions & Edge Cases

| Scenario | Condition | System Behavior |
| :--- | :--- | :--- |
| GPS Unavailable | Browser location permission blocked or device GPS offline | Present high-contrast manual input field prompting for Kenyan highway name, marker, or landmark |
| Device Vibration Unsupported | User browser or device does not support vibration API | Fall back to immediate high-contrast visual flash and crimson pulse without throwing errors |
| Rescuer Acceptance Timeout | No provider response within 60 seconds | Automatically cascade ticket to next nearest provider and update status text to SEARCHING BACKUP RESCUE |
| Zero Service Providers Available | No active responders within operational zone | Display prominent direct call buttons to Kenyan hotlines (999, 112, 1199, AA Kenya, St John) |
| Invalid Phone Format | Number does not match Kenyan mobile prefix | Flag input field immediately with amber warning and display correct +254 format pattern |

## 6. Acceptance Criteria

1. The user can sign in and register using a valid Kenyan mobile number (+254).
2. The user can activate an emergency SOS request with a single tap on the central action button.
3. The application triggers vibration feedback and an immediate visual transition upon SOS activation.
4. The dashboard displays the user live GPS coordinates alongside recognized Kenyan highway corridors and landmarks.
5. The user can expand collapsible bento cards to view or update vehicle data, medical notes, emergency contacts, and direct Kenyan emergency hotlines.
6. The user can trigger silent alarm and medical profile sharing presets with one touch.
7. The system automatically cascades unaccepted rescue requests to backup providers after 60 seconds.
8. The tracking interface displays large zero-jargon status updates, rescuer ETA, and tactical map location.

## 7. Out of Scope (Current MVP)

- Third-party social media integrations.
- OBD-II vehicle diagnostic hardware telemetry.
- Multi-currency payment gateway processing outside Kenyan national emergency frameworks.