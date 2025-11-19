# Routine Context Usage Guide

## Overview

The `RoutineContext` provides comprehensive daily skincare routine management with AI-generated personalized plans based on face scan analysis.

## Interfaces

### `DailyRoutinePlan`

Complete daily routine structure with morning, evening, and night routines.

```typescript
interface DailyRoutinePlan {
  morningRoutine: {
    title: string;              // "☀️ Morning Routine"
    description: string;        // Skin type specific description
    steps: RoutineTask[];       // Array of tasks to complete
    duration: string;           // "10-15 minutes"
    tips: string[];            // Pro tips for morning routine
  };
  eveningRoutine: {
    title: string;              // "🌅 Evening Routine"
    description: string;
    steps: RoutineTask[];
    duration: string;           // "15-20 minutes"
    tips: string[];
  };
  nightRoutine: {
    title: string;              // "🌙 Night Routine"
    description: string;
    steps: RoutineTask[];
    duration: string;           // "20-25 minutes"
    tips: string[];
  };
  weeklyTreatments: {
    name: string;               // "Clay/Mud Mask"
    frequency: string;          // "1-2 times per week"
    description: string;
  }[];
  nutritionTips: string[];      // Personalized nutrition advice
  generalAdvice: string[];      // Overall skincare guidance
}
```

### `RoutineTask`

Individual task in a routine.

```typescript
interface RoutineTask {
  id: string;           // Unique identifier
  name: string;         // Task description
  completed: boolean;   // Completion status
}
```

## Context Functions

### `generateDetailedDailyPlan(analysisData)`

Generates a complete personalized daily routine plan based on face scan analysis.

**Parameters:**
- `analysisData`: Analysis result from face scan containing:
  - `skinType`: Type of skin (oily, dry, normal, combination, sensitive)
  - `healthScore`: 0-100 skin health score
  - `detectedIssues`: Array of detected issues (acne, dryness, sensitivity, etc.)
  - `recommendations`: AI recommendations object

**Returns:** `DailyRoutinePlan`

**Example:**
```typescript
import { useRoutine } from '@/context/RoutineContext';

export default function ScanResultScreen({ analysisData }) {
  const { generateDetailedDailyPlan } = useRoutine();

  // Generate plan when analysis is complete
  const plan = generateDetailedDailyPlan(analysisData);
  
  // Use the plan to display to user
  console.log(plan.morningRoutine.steps);
  console.log(plan.nutritionTips);
}
```

### `updateRoutinesFromScan(analysisData)`

Updates the basic routine tasks based on scan analysis (legacy, simplified version).

**Parameters:**
- `analysisData`: Analysis result from face scan

**Returns:** void

**Example:**
```typescript
const { updateRoutinesFromScan } = useRoutine();
updateRoutinesFromScan(analysisData);
```

### `toggleTask(period, taskId)`

Marks a task as completed or incomplete.

**Parameters:**
- `period`: "morning" | "evening" | "night"
- `taskId`: ID of the task to toggle

**Returns:** void

**Example:**
```typescript
const { toggleTask } = useRoutine();

// Mark task as done
toggleTask('morning', 'm1');

// Mark task as not done
toggleTask('morning', 'm1');
```

## Context Values

### State Variables

```typescript
// Scan analysis data
scanData: SkinAnalysisResult | null;
analysisData: any | null;

// Generated daily plan
dailyPlan: DailyRoutinePlan | null;

// Current routines (simplified)
routines: {
  morning: RoutineTask[];
  evening: RoutineTask[];
  night: RoutineTask[];
};
```

### Setters

```typescript
setScanData: (data: SkinAnalysisResult) => void;
setAnalysisData: (data: any) => void;
setDailyPlan: (plan: DailyRoutinePlan | null) => void;
setRoutines: (routines: any) => void;
```

## Usage Examples

### 1. Display Daily Plan After Scan

```typescript
import { useRoutine } from '@/context/RoutineContext';
import { View, Text, ScrollView } from 'react-native';

export default function RoutineDisplay({ analysisData }) {
  const { generateDetailedDailyPlan, dailyPlan, setDailyPlan } = useRoutine();

  useEffect(() => {
    // Generate plan when component mounts
    const plan = generateDetailedDailyPlan(analysisData);
  }, [analysisData]);

  if (!dailyPlan) return <Text>Loading routine...</Text>;

  return (
    <ScrollView>
      {/* Morning Routine */}
      <View>
        <Text style={styles.title}>{dailyPlan.morningRoutine.title}</Text>
        <Text>{dailyPlan.morningRoutine.description}</Text>
        <Text>Duration: {dailyPlan.morningRoutine.duration}</Text>
        
        {dailyPlan.morningRoutine.steps.map(step => (
          <Task key={step.id} task={step} period="morning" />
        ))}
      </View>

      {/* Evening Routine */}
      <View>
        <Text style={styles.title}>{dailyPlan.eveningRoutine.title}</Text>
        {/* Similar structure */}
      </View>

      {/* Night Routine */}
      <View>
        <Text style={styles.title}>{dailyPlan.nightRoutine.title}</Text>
        {/* Similar structure */}
      </View>

      {/* Weekly Treatments */}
      <View>
        <Text style={styles.title}>Weekly Treatments</Text>
        {dailyPlan.weeklyTreatments.map(treatment => (
          <View key={treatment.name}>
            <Text>{treatment.name}</Text>
            <Text>{treatment.frequency}</Text>
            <Text>{treatment.description}</Text>
          </View>
        ))}
      </View>

      {/* Nutrition Tips */}
      <View>
        <Text style={styles.title}>Nutrition Tips</Text>
        {dailyPlan.nutritionTips.map((tip, i) => (
          <Text key={i}>• {tip}</Text>
        ))}
      </View>

      {/* General Advice */}
      <View>
        <Text style={styles.title}>General Advice</Text>
        {dailyPlan.generalAdvice.map((advice, i) => (
          <Text key={i}>• {advice}</Text>
        ))}
      </View>
    </ScrollView>
  );
}
```

### 2. Task Tracker with Completion

```typescript
import { useRoutine } from '@/context/RoutineContext';
import { View, Text, Checkbox } from 'react-native';

export default function TaskTracker() {
  const { routines, toggleTask } = useRoutine();

  return (
    <View>
      <Text style={styles.sectionTitle}>Morning Routine</Text>
      {routines.morning.map(task => (
        <View key={task.id} style={styles.taskRow}>
          <Checkbox
            value={task.completed}
            onValueChange={() => toggleTask('morning', task.id)}
          />
          <Text style={task.completed ? styles.completedText : styles.taskText}>
            {task.name}
          </Text>
        </View>
      ))}
    </View>
  );
}
```

### 3. Show Personalized Tips

```typescript
import { useRoutine } from '@/context/RoutineContext';

export default function RoutineTips() {
  const { dailyPlan } = useRoutine();

  if (!dailyPlan) return null;

  return (
    <View>
      <Text style={styles.title}>Tips for Your Morning Routine</Text>
      {dailyPlan.morningRoutine.tips.map((tip, i) => (
        <Text key={i} style={styles.tip}>
          💡 {tip}
        </Text>
      ))}

      <Text style={styles.title}>Pro Tips</Text>
      {dailyPlan.generalAdvice.map((advice, i) => (
        <Text key={i} style={styles.advice}>
          {advice}
        </Text>
      ))}
    </View>
  );
}
```

### 4. Integration with Analysis Flow

```typescript
// In analysis.tsx or wherever scan results are displayed
import { useRoutine } from '@/context/RoutineContext';

export default function AnalysisScreen({ analysisData }) {
  const { generateDetailedDailyPlan, dailyPlan } = useRoutine();

  useEffect(() => {
    if (analysisData) {
      // Generate detailed plan when analysis is ready
      generateDetailedDailyPlan(analysisData);
    }
  }, [analysisData]);

  return (
    <View>
      {/* Show scan results */}
      <ShowAnalysisResults data={analysisData} />
      
      {/* Show generated routine plan */}
      {dailyPlan && <ShowDailyPlan plan={dailyPlan} />}
      
      {/* Action button */}
      <Button 
        title="Start My Routine" 
        onPress={() => router.push('/(tabs)/routine')}
      />
    </View>
  );
}
```

## Personalization Logic

The `generateDetailedDailyPlan` function customizes routines based on:

### 1. **Skin Type**
- **Oily/Acne**: Adds oil-control and sebum-control steps
- **Dry/Dryness**: Adds hydrating essence and rich masks
- **Sensitive**: Adds fragrance-free products and soothing treatments

### 2. **Health Score**
- **≥80**: Positive reinforcement to maintain routine
- **≥60**: Encouragement for consistency
- **<60**: Emphasis on dedication and improvement
- **<50**: Recommendation to consult dermatologist

### 3. **Detected Issues**
- Adjusts nutrition tips based on specific concerns
- Recommends targeted treatments
- Provides customized frequency recommendations

### 4. **Recommendations Object**
- Incorporates AI recommendations from analysis
- Adds custom products or techniques
- Merges with standard routine steps

## Weekly Treatments

Automatically generated based on skin type:

| Skin Type | Treatment | Frequency |
|-----------|-----------|-----------|
| Oily | Clay/Mud Mask | 1-2 times/week |
| Dry | Hydrating/Nourishing Mask | 1-2 times/week |
| All | Gentle Exfoliation | 1-2 times/week |

## Routine Durations

- **Morning**: 10-15 minutes
- **Evening**: 15-20 minutes
- **Night**: 20-25 minutes

## Best Practices

1. **Consistency Over Perfection**
   - Aim for 80% adherence
   - Don't skip crucial steps (cleanse, moisturize, sunscreen)

2. **Listen to Your Skin**
   - Adjust products based on seasonal changes
   - Reassess every 4-6 weeks

3. **Proper Technique**
   - Use lukewarm water (not hot)
   - Gentle massage movements
   - Apply products to damp skin

4. **Sleep & Nutrition**
   - 7-8 hours of quality sleep
   - Stay hydrated (8 glasses daily)
   - Eat skin-healthy foods

5. **Timeline for Results**
   - Initial improvement: 2-3 weeks
   - Significant changes: 4-6 weeks
   - Full skin renewal: 8-12 weeks

## Tips by Routine Period

### Morning (10-15 min)
- Cold water splash for circulation
- Lightweight, hydrating products
- SPF protection is non-negotiable
- Allows absorption time before makeup

### Evening (15-20 min)
- Double cleanse priority
- Double cleanse removes makeup, sunscreen
- Gentle massage boosts circulation
- Light treatment products

### Night (20-25 min)
- Richer, more intensive products
- Skin repairs during sleep
- No screen light 30 min before
- Sleep quality affects results
- Clean pillowcase essential

## Troubleshooting

**Plan not generating?**
- Ensure analysisData has required fields
- Check skinType and healthScore values
- Verify detectedIssues is an array

**Tasks not updating?**
- Confirm taskId exists in routine
- Check period parameter (morning/evening/night)
- Verify context provider wraps component

**Plan seems generic?**
- Pass detailed analysisData from AI scan
- Ensure recommendations are included
- Check for detected issues

## Future Enhancements

- [ ] Save routine preferences
- [ ] Progress tracking over time
- [ ] Reminders/notifications
- [ ] Product recommendation integration
- [ ] Routine export/share functionality
- [ ] Before/after photo tracking
