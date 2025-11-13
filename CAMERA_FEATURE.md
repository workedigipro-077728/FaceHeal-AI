# Real-Time Face Scan Camera Feature

## Overview
The updated scan page now includes camera functionality for capturing face photos directly within the app using `expo-image-picker`.

## Features

### 1. **Scan Menu** (Entry Point)
- Two intuitive options with icons:
  - **Take a Photo**: Opens native camera for real-time face capture
  - **Choose from Gallery**: Select existing photos from device library
- Tips section with 5 best practices for accurate scanning
- Permission handling for both camera and gallery access
- Disabled states when permissions are unavailable

### 2. **Camera Capture**
- Uses device's native camera app (via expo-image-picker)
- Support for front and back cameras (device native controls)
- Built-in photo editing with crop/rotate
- 0.9 quality for optimal speed and accuracy
- Automatic permission request

### 3. **Photo Preview**
- Displays captured/selected photo
- Loading indicator during analysis
- Error handling with clear messages
- Stores image URI for analysis

### 4. **Analysis Flow**
- Converts image to base64
- Sends to Gemini API for skin analysis
- Auto-navigates to detailed results page
- Data persists to home screen

## Workflow

```
Scan Menu
├── Take a Photo → Native Camera → Photo Selected → Analysis
└── Choose from Gallery → Photo Selected → Analysis

Analysis Results → Home Screen (data persisted)
```

## Technical Implementation

### Key Dependencies
- `expo-image-picker` (already installed)
- `expo-file-system` (for base64 conversion)
- `expo-router` (navigation)

### Key Functions

#### `handleOpenCamera()`
- Requests camera permission
- Launches native camera app
- Handles photo selection
- Triggers analysis on success

#### `handleSelectImage()`
- Requests gallery permission
- Opens photo library picker
- Handles image selection
- Triggers analysis on success

#### `analyzeImage()`
- Converts image to base64 format
- Sends to Gemini API for analysis
- Handles loading and error states
- Navigates to analysis page

### State Management
```typescript
- status: 'idle' | 'loading' | 'success' | 'error'
- selectedImageUri: string | null
- result: FaceHealthAnalysis | null
- errorMessage: string | null
```

### Image Processing
```typescript
// From ImagePicker asset
const [asset] = pickerResult.assets;
const uri = asset.uri;
const mimeType = asset.mimeType; // e.g., "image/jpeg"

// Convert to base64
const base64 = await readFileAsBase64(uri);

// Send to API
const analysis = await analyzeFaceHealth({
  imageBase64: base64,
  mimeType: mimeType,
});
```

## UI/UX Features

### Visual Components
- **Option Cards**: Large, tappable areas with icons and descriptions
- **Loading State**: Centered spinner with feedback text
- **Tips Section**: Information box with best practices
- **Error Handling**: Red banner with clear error messages
- **Image Preview**: Full-width preview of selected photo

### Colors & Styling
- Primary action (camera): Teal (#00d4ff)
- Dark background: #1a3a3f
- Secondary text: #a0a0a0
- Teal dark cards: #2a5a5f

### Accessibility
- Clear button labels
- Large touch targets (56x56px minimum)
- Disabled states when permissions unavailable
- Semantic naming and structure

## Permissions Required

### Android (app.json)
```json
"android": {
  "permissions": [
    "android.permission.CAMERA",
    "android.permission.READ_EXTERNAL_STORAGE"
  ]
}
```

### iOS (app.json)
```json
"ios": {
  "infoPlist": {
    "NSCameraUsageDescription": "We need access to your camera to capture face photos for skin analysis.",
    "NSPhotoLibraryUsageDescription": "We need access to your photos to analyze your skin health."
  }
}
```

## Error Handling

| Error Type | Trigger | User Message |
|-----------|---------|--------------|
| Permission Denied | Camera/Gallery access refused | Permission alert dialog |
| Photo Capture Failed | Camera error | "Unable to capture the photo" |
| No Asset Selected | User cancels photo picker | Handled silently |
| Analysis Failed | API error or network issue | Error banner with API message |
| File Read Error | Base64 conversion failed | "Failed to read file data" |

## Performance Considerations

- Photo quality set to 0.9 (balance between quality and speed)
- Base64 encoding handled asynchronously
- Navigation delayed 500ms for smooth transitions
- Uses native camera (device optimized)
- Automatic image compression by OS

## Advantages Over Raw Camera Library

1. **Native Integration**: Uses device's optimized camera app
2. **Simpler Code**: No custom camera UI needed
3. **Built-in Editing**: Users can crop/rotate before analysis
4. **No Permission Complexity**: Handled by expo-image-picker
5. **Cross-Platform**: Works seamlessly on iOS and Android
6. **Smaller Bundle Size**: No additional camera library needed

## Testing Checklist

- [ ] Camera permission request works
- [ ] Camera app launches correctly
- [ ] Photo capture succeeds
- [ ] Gallery permission request works
- [ ] Photo selection works
- [ ] Image preview displays correctly
- [ ] Analysis starts after photo selection
- [ ] Loading indicator displays
- [ ] Analysis results navigate correctly
- [ ] Error states display with proper messages
- [ ] Data persists to home screen
- [ ] Multiple scans work in sequence

## Future Enhancements

- [ ] Image compression before upload
- [ ] Capture multiple photos for comparison
- [ ] History of previous scans
- [ ] Export results as PDF/image
- [ ] Batch scanning capability
- [ ] Brightness/focus detection feedback
- [ ] Face detection verification
- [ ] Before/after tracking

## Troubleshooting

### Camera won't open
- Check camera permissions in device settings
- Ensure camera app is not restricted
- Try restarting the app

### Photo won't analyze
- Check network connectivity
- Verify API key is configured
- Check file size isn't too large

### Blurry or dark photos
- Use better lighting
- Clean camera lens
- Follow tips in the app
