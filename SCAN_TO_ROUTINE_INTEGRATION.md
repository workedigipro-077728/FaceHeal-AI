# Face Scan to Daily Routine Integration

## Overview
This feature integrates AI-powered face scan analysis with personalized daily routine recommendations. When users scan their face, they receive a detailed health analysis that automatically updates their daily routine with personalized skincare and wellness tasks.

## Key Features

### 1. **AI-Powered Skin Analysis**
- Deep face scanning using Gemini AI
- Detects: skin type, hydration levels, acne severity, symmetry, age estimate
- Provides health score (0-100) and identified concerns
- Generates personalized recommendations

### 2. **Automatic Routine Personalization**
- Daily routine is updated based on scan results
- Customized tasks added based on skin type:
  - **Oily/Acne-prone**: Oil-control toner, sebum-control serum
  - **Dry/Sensitive**: Hydrating essence, hydrating masks
- AI recommendations integrated into morning, evening, and night routines

### 3. **Data Persistence**
- Scan data saved locally for offline access
- Firebase integration for cloud storage and multi-device sync
- Historical scan tracking

## Technical Implementation

### Modified Files

#### 1. **services/firebase.ts**
```typescript
// New function: Save scan data and sync with routine generation
export const saveScanDataAndGeneratePlan = async (
  userId: string,
  scanData: any,
  analysisData: any
)
```
- Saves scan results to Firestore under `users/{userId}/scans`
- Stores: skin type, health score, detected issues, recommendations
- Timestamps stored for historical tracking

#### 2. **context/RoutineContext.tsx**
```typescript
// New state
const [analysisData, setAnalysisData] = useState<any | null>(null);

// New method: Updates routines based on scan analysis
const updateRoutinesFromScan = (analysisData: any) => {
  // Generates base routines
  // Personalizes based on skin type
  // Adds AI recommendations to appropriate time periods
}
```
- Manages daily routine state
- Updates routines with scan-based personalization
- Handles skin-type specific task additions

#### 3. **app/(tabs)/analysis.tsx**
- Integrates `updateRoutinesFromScan` when analysis completes
- Saves to both local storage and Firebase
- Adds "View Daily Plan" button to navigate to personalized routine
- Three action buttons:
  1. **View Daily Plan** - Shows updated routine (primary)
  2. **New Scan** - Take another scan
  3. **Home** - Return to home screen

#### 4. **app/(tabs)/daily-routine.tsx**
- Displays personalized plan card from scan
- Shows skin type and health score prominently
- Lists detected issues for reference
- Displays all routine tasks (updated with AI recommendations)
- Visual distinction for personalized vs. standard routines

## Data Flow

```
User Takes Face Scan
        ↓
    Camera Captures Photo
        ↓
Gemini AI Analyzes Image
        ↓
Analysis Results Generated (healthScore, skinType, recommendations)
        ↓
    Split into Two Paths:
    
    Path 1: Update UI
    ├─ Store in RoutineContext (analysisData)
    ├─ Call updateRoutinesFromScan()
    └─ Update daily-routine display with personalized plan
    
    Path 2: Save Data
    ├─ Save to local storage (scanStorage)
    └─ Save to Firebase (if user authenticated)
```

## Personalization Logic

### Skin Type-Based Customization
```typescript
if (skinType.includes('oily') || skinType.includes('acne')) {
  // Add oil-control tasks to morning and evening
}

if (skinType.includes('dry') || skinType.includes('sensitive')) {
  // Add hydrating tasks to morning and evening
}
```

### AI Recommendation Integration
- `recommendations.morningRoutine[]` → Added to morning tasks
- `recommendations.nightRoutine[]` → Added to night tasks
- `recommendations.lifestyle[]` → Added to morning wellness
- All recommendations marked as incomplete, ready for user to track

## User Experience Flow

1. User navigates to Scan screen
2. Takes/selects a face photo
3. AI analyzes and displays health analysis
4. User clicks **"View Daily Plan"** button
5. Navigates to Daily Routine screen showing:
   - Personalized plan card (skin type, health score, issues)
   - Updated morning routine with personalized tasks
   - Updated evening routine with personalized tasks
   - Updated night routine with personalized tasks
6. User can track completion of all routine items
7. Data persists across sessions

## Firebase Structure

```
users/{userId}/
  ├─ scans/
  │  ├─ {scanId}/
  │  │  ├─ userId: string
  │  │  ├─ scanData:
  │  │  │  ├─ skinType: string
  │  │  │  ├─ healthScore: number
  │  │  │  ├─ detectedIssues: string[]
  │  │  │  ├─ hydration: number
  │  │  │  ├─ acne: number
  │  │  │  ├─ oiliness: number
  │  │  │  ├─ ageEstimate: number
  │  │  │  ├─ symmetryScore: number
  │  │  │  └─ recommendations: object
  │  │  ├─ timestamp: Timestamp
  │  │  └─ createdAt: ISO string
```

## API Integration Points

### Gemini AI Service
- `analyzeDeepScan()` - Returns `FaceHealthAnalysis` with full recommendations
- Provides structured recommendations object with:
  - morningRoutine[]
  - nightRoutine[]
  - products[]
  - lifestyle[]
  - exercises[]

### Local Storage
- Scans stored locally via `scanStorage.saveScan()`
- Enables offline access to scan history

### Firebase
- Authentication-triggered saves
- Historical tracking and cross-device sync
- User-specific scan data isolation

## Error Handling

- Firebase saves fail gracefully (console logging only)
- Local saves still proceed even if cloud save fails
- Routine updates always complete regardless of storage status
- User-friendly error messages in UI

## Future Enhancements

1. **Scan History Tracking**
   - Compare scan results over time
   - Track progress toward health goals

2. **Smart Notifications**
   - Remind users to take periodic scans
   - Alert for new recommendations

3. **Product Recommendations**
   - Link recommended products to e-commerce
   - Track usage and results

4. **Social Features**
   - Share progress with friends (privacy-aware)
   - Community skincare tips

5. **Advanced Analytics**
   - Trend analysis of skin health
   - Predictive recommendations
   - Integration with wearables
