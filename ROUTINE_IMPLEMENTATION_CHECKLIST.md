# Daily Routine Plan - Implementation Checklist

## Phase 1: Core Implementation ✅ DONE

- [x] Add `DailyRoutinePlan` interface
- [x] Add `generateDetailedDailyPlan()` function
- [x] Add `dailyPlan` state
- [x] Add `setDailyPlan` setter
- [x] Update context type definitions
- [x] Provide functions through context
- [x] Type safety verified
- [x] No TypeScript errors

## Phase 2: Integration with Analysis Screen

### Tasks
- [ ] Import `useRoutine` in analysis screen
- [ ] Call `generateDetailedDailyPlan()` when analysis completes
- [ ] Display plan in analysis results
- [ ] Add button to "View Daily Routine"
- [ ] Navigate to routine screen

### Code Template
```typescript
import { useRoutine } from '@/context/RoutineContext';

export default function AnalysisScreen({ analysisData }) {
  const { generateDetailedDailyPlan, dailyPlan } = useRoutine();

  useEffect(() => {
    if (analysisData) {
      generateDetailedDailyPlan(analysisData);
    }
  }, [analysisData]);

  return (
    <View>
      {/* Existing analysis display */}
      {dailyPlan && (
        <View>
          <Text>Your Personalized Routine Plan Generated!</Text>
          <Button 
            title="View Daily Routine" 
            onPress={() => router.push('/(tabs)/routine')}
          />
        </View>
      )}
    </View>
  );
}
```

## Phase 3: Display Daily Routine Screen

### Morning Routine Section
- [ ] Create section component
- [ ] Display title and description
- [ ] Show duration (10-15 min)
- [ ] List all morning steps
- [ ] Add checkboxes for completion
- [ ] Show pro tips
- [ ] Styling and layout

### Evening Routine Section
- [ ] Create section component
- [ ] Display title and description
- [ ] Show duration (15-20 min)
- [ ] List all evening steps
- [ ] Add checkboxes for completion
- [ ] Show pro tips

### Night Routine Section
- [ ] Create section component
- [ ] Display title and description
- [ ] Show duration (20-25 min)
- [ ] List all night steps
- [ ] Add checkboxes for completion
- [ ] Show pro tips

### Weekly Treatments Section
- [ ] Display treatment cards
- [ ] Show name, frequency, description
- [ ] Color-coded by type
- [ ] Add info icons

### Nutrition Tips Section
- [ ] List all nutrition tips
- [ ] Icons for each category
- [ ] Collapsible if needed

### General Advice Section
- [ ] Display general advice
- [ ] Use emojis for visual appeal
- [ ] Encourage consistency

## Phase 4: Task Tracking

### Completion Tracking
- [ ] Implement task toggle on tap
- [ ] Visual feedback (strikethrough)
- [ ] Progress counter
- [ ] Daily reset

### Completion States
- [ ] Show X/Y tasks completed
- [ ] Celebrate milestones (50%, 100%)
- [ ] Weekly progress summary
- [ ] Streak counter

### Code Template
```typescript
import { useRoutine } from '@/context/RoutineContext';

const handleTaskToggle = (taskId: string) => {
  toggleTask('morning', taskId);
};

{routines.morning.map(task => (
  <Pressable 
    key={task.id}
    onPress={() => handleTaskToggle(task.id)}
  >
    <Checkbox value={task.completed} />
    <Text style={task.completed ? styles.done : styles.todo}>
      {task.name}
    </Text>
  </Pressable>
))}
```

## Phase 5: Data Persistence

### Save to Supabase
- [ ] Create `routines` table in Supabase
- [ ] Schema for routine plans
- [ ] Schema for task completion
- [ ] User-routine relationship (foreign key)

### Load from Storage
- [ ] Retrieve user's routine plan
- [ ] Load task completion history
- [ ] Initialize context on app launch

### Table Schema
```sql
CREATE TABLE routine_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE routine_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  task_id TEXT NOT NULL,
  period TEXT NOT NULL, -- 'morning', 'evening', 'night'
  completed_at TIMESTAMP NOT NULL,
  date DATE NOT NULL,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
```

## Phase 6: Notifications & Reminders

- [ ] Morning routine reminder (7 AM)
- [ ] Evening routine reminder (6 PM)
- [ ] Night routine reminder (10 PM)
- [ ] Customize reminder times in settings
- [ ] Permission handling

## Phase 7: Analytics & Progress

### Progress Tracking
- [ ] Weekly completion percentage
- [ ] Consistency streak
- [ ] Before/after photos
- [ ] Skin improvement metrics

### Reports
- [ ] Weekly routine report
- [ ] Monthly progress summary
- [ ] Product effectiveness tracker
- [ ] Export routine history

## Phase 8: UI Components

### Reusable Components
```typescript
// RoutineStepCard.tsx
<RoutineStepCard 
  task={task} 
  period="morning"
  onToggle={handleToggle}
/>

// RoutineSection.tsx
<RoutineSection 
  title="☀️ Morning Routine"
  steps={steps}
  duration="10-15 min"
  tips={tips}
/>

// NutritionCard.tsx
<NutritionCard tips={nutritionTips} />

// TreatmentCard.tsx
<TreatmentCard treatment={treatment} />

// AdviceCard.tsx
<AdviceCard advice={generalAdvice} />
```

## Phase 9: Settings & Customization

- [ ] Allow users to skip steps
- [ ] Add custom steps
- [ ] Adjust routine timings
- [ ] Set reminder times
- [ ] Export routine as PDF
- [ ] Share routine with friends

## Phase 10: Testing

### Functional Testing
- [ ] Generate plan with various skin types
- [ ] Toggle tasks
- [ ] Save/load progress
- [ ] Handle edge cases

### UI Testing
- [ ] Responsive layouts
- [ ] Different screen sizes
- [ ] Dark/light mode
- [ ] Accessibility

### Performance Testing
- [ ] Plan generation speed
- [ ] Task toggle responsiveness
- [ ] Data loading time
- [ ] Memory usage

## Quick Start Guide

### 1. Generate Plan in Analysis Screen
```typescript
const { generateDetailedDailyPlan } = useRoutine();

useEffect(() => {
  if (analysisData) {
    generateDetailedDailyPlan(analysisData);
  }
}, [analysisData]);
```

### 2. Display in Routine Screen
```typescript
const { dailyPlan, routines, toggleTask } = useRoutine();

if (!dailyPlan) return <Loading />;

return (
  <ScrollView>
    <Morning steps={dailyPlan.morningRoutine.steps} />
    <Evening steps={dailyPlan.eveningRoutine.steps} />
    <Night steps={dailyPlan.nightRoutine.steps} />
    <Nutrition tips={dailyPlan.nutritionTips} />
    <Advice tips={dailyPlan.generalAdvice} />
  </ScrollView>
);
```

### 3. Track Completion
```typescript
const handleComplete = (taskId: string) => {
  toggleTask('morning', taskId);
};
```

## File References

- Implementation: `context/RoutineContext.tsx`
- API Guide: `ROUTINE_CONTEXT_GUIDE.md`
- Overview: `DAILY_ROUTINE_PLAN_SUMMARY.md`
- This File: `ROUTINE_IMPLEMENTATION_CHECKLIST.md`

## Success Criteria

- [x] Function generates valid plan
- [x] Plan includes all required sections
- [x] Personalization works correctly
- [ ] Plan displays in UI
- [ ] Tasks can be toggled
- [ ] Progress is tracked
- [ ] Data persists
- [ ] Users find value

## Next Immediate Task

**Start Phase 2**: Integrate `generateDetailedDailyPlan()` into your analysis screen to begin showing routine plans to users after they complete a face scan.
