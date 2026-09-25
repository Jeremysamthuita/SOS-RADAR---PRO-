# Requirements Document

## 1. Application Overview

- **Application Name**: Roadside SOS - High-Stress Emergency Assistance
- **Application Description**: A streamlined, high-visibility emergency roadside assistance web application engineered to minimize cognitive load, reduce dispatch steps, and provide upfront pricing transparency during vehicle breakdowns and roadside distress.
- **Design Foundations**:
  - **Color Palette**: High-contrast dark mode background with high-visibility safety amber/orange (#F59E0B / #F97316) for primary actions and critical alerts.
  - **Typography**: Bold, highly legible sans-serif typography ensuring fast readability in low-light and stressful environments.

## 2. Target Users & Core Scenarios

- **Target Users**:
  - Stranded drivers experiencing vehicle failure on highways, suburban roads, or remote routes.
  - Drivers requiring instant, fixed-price roadside support with verified arrival times.
- **Core Scenarios**:
  - Driver opens the application, identifies breakdown type in one tap on the home screen, and initiates dispatch immediately.
  - Driver reviews and selects verified local provider bids based on upfront fixed pricing, ETA, and vehicle equipment compatibility.
  - Driver monitors live provider arrival while accessing on-screen safety protocols and vehicle identification data.

## 3. Page Structure & Functional Specifications

### Page Structure Tree

```
Roadside SOS Web Application
├── One-Tap Dispatch (Home Screen)
│   ├── Live Location Map View
│   ├── 4 Core Diagnostic Tiles
│   │   ├── Flatbed Tow
│   │   ├── Flat Tire
│   │   ├── Dead Battery
│   │   └── Lockout / Fuel / Winch
│   └── Quick Dispatch Confirmation Action
├── Live Bidding & Pricing
│   ├── Provider Offer Comparison Matrix
│   ├── Fixed Upfront Price & Breakdown Details
│   ├── Verified ETA & Provider Rating Badges
│   └── Offer Selection & Dispatch Lock
└── Anxiety-Reduction Active Tracking
    ├── Live ETA Countdown Clock
    ├── Rescuer Live Location Map
    ├── Driver & Vehicle Plate Verification Card
    ├── Roadside Safety Protocols
    │   ├── Hazard Triangle Reminder
    │   ├── Stay Belted Notice
    │   └── Emergency Phone Screen Strobe Mode
    └── Direct Contact & SOS Escalation
```

### Functional Specifications

#### 1. One-Tap Dispatch (Home Screen)
- **Live Location Map View**:
  - Displays a high-contrast dark-themed map centered on user real-time GPS coordinates.
  - Prominently displays detected street/highway address with an option for manual correction if needed.
- **Diagnostic Selection Tiles**:
  - Four oversized, high-contrast action tiles positioned for thumb reach:
    - *Flatbed Tow*: Transmits heavy recovery and flatbed transport requirements.
    - *Flat Tire*: Requests mobile puncture repair or spare wheel installation.
    - *Dead Battery*: Requests mobile jump-start or battery test unit.
    - *Lockout / Fuel / Winch*: Bundles entry lockout assistance, emergency fuel drop, or ditch/incline winch extraction.
- **Quick Dispatch Confirmation**:
  - Selecting a tile activates an instant dispatch request action button, moving directly to local provider matching without multi-step forms.

#### 2. Live Bidding & Pricing Screen
- **Provider Comparison Matrix**:
  - Displays incoming bids from nearby verified recovery units in a clear side-by-side or stacked card matrix.
  - Highlights key selection parameters per provider:
    - Verified arrival time (ETA in minutes).
    - Upfront fixed price (guaranteed total cost with no hidden surcharges).
    - Equipment match indicator (confirms correct truck/tool capability).
    - Driver rating and completed rescue count.
- **Offer Selection & Booking Lock**:
  - Single-tap confirmation locks in selected provider, fixes the price, and triggers active dispatch.

#### 3. Anxiety-Reduction Active Tracking Screen
- **ETA Countdown Clock**:
  - Large, high-visibility digital countdown timer indicating remaining minutes to provider arrival.
- **Live Provider Location Map**:
  - Real-time map displaying current user location, assigned service vehicle position, and live route path.
- **Driver & Vehicle Verification Card**:
  - Displays verified rescuer name, company name, contact button, vehicle model, and prominent license plate number for secure identification.
- **Roadside Safety Protocols**:
  - Visual checklist and actionable guidance for stranded motorists:
    - Reminder to remain inside the vehicle with seatbelts fastened if stopped on active lanes.
    - Placement instructions for reflective hazard warning triangles.
    - *Phone Strobe Mode*: Full-screen flashing safety beacon (bright amber/white) to alert oncoming traffic in darkness.
- **Direct Emergency Channel**:
  - One-tap calling to assigned driver and one-tap escalation to local emergency hotlines.

## 4. Business Rules & Core Logic

1. **High-Stress Action Hierarchy**: The interface limits user interaction on the home screen to selecting one of the 4 diagnostic tiles and confirming dispatch.
2. **Fixed Upfront Pricing**: Quoted prices on the bidding screen represent final guaranteed rates; service providers cannot alter agreed amounts after selection.
3. **Equipment Matching**: The system only displays bids from providers verified to possess necessary gear corresponding to selected breakdown tiles (e.g., flatbed for towing).
4. **Provider Verification**: All active tracking payloads must include confirmed license plate, provider name, and direct communication relay.
5. **Safety Strobe Override**: Activating Phone Strobe Mode switches display brightness to maximum with rhythmic high-visibility flashing.

## 5. Exceptions & Edge Cases

| Scenario | Condition | System Behavior |
| :--- | :--- | :--- |
| Location Permission Denied | Browser GPS access blocked | Present high-contrast manual address / landmark search input immediately |
| No Active Provider Bids | Zero local units available within operational radius | Display direct emergency hotline dispatch numbers with pre-copied GPS coordinates |
| Bid Expiry | User does not select a provider within bidding window | Refresh provider list automatically and retain current diagnostic request |
| Provider Re-route / Delay | Driver ETA extends by more than 5 minutes | Update countdown clock dynamically and display status notification |

## 6. Acceptance Criteria

1. The home screen presents the user location map and 4 large diagnostic tiles (Flatbed Tow, Flat Tire, Dead Battery, Lockout / Fuel / Winch).
2. Selecting any diagnostic tile allows triggering an emergency assistance search in a single confirmation step.
3. The bidding screen displays incoming provider offers with verified ETA, fixed upfront price, equipment match, and ratings.
4. Selecting a provider successfully locks the request and transitions the interface to the active tracking screen.
5. The active tracking screen displays a prominent live ETA countdown clock and real-time rescuer location map.
6. The active tracking screen displays verified rescuer vehicle license plate details and safety guidelines.
7. Activating the emergency phone strobe feature displays a full-screen high-contrast flashing beacon.

## 7. Out of Scope (Current MVP)

- In-app roadside insurance policy underwriting and claims processing.
- Multi-vehicle simultaneous dispatch management.
- Non-roadside routine maintenance booking and garage scheduling.