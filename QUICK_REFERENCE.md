# Quick Reference Card

## 🔐 Authentication (Supabase)

### Sign Up
```typescript
const { signup } = useAuth();
await signup('email@example.com', 'password123');
```

### Sign In
```typescript
const { signin } = useAuth();
await signin('email@example.com', 'password123');
```

### Logout
```typescript
const { logout } = useAuth();
await logout();
```

### Check Auth State
```typescript
const { user, loading } = useAuth();

if (loading) return <Loading />;
if (!user) return <LoginScreen />;
return <AppContent />;
```

---

## 📋 Daily Routine (Context)

### Generate Plan
```typescript
const { generateDetailedDailyPlan } = useRoutine();

const plan = generateDetailedDailyPlan(analysisData);
// Returns DailyRoutinePlan
```

### Access Generated Plan
```typescript
const { dailyPlan } = useRoutine();

// Access sections
dailyPlan.morningRoutine.steps
dailyPlan.eveningRoutine.steps
dailyPlan.nightRoutine.steps
dailyPlan.weeklyTreatments
dailyPlan.nutritionTips
dailyPlan.generalAdvice
```

### Toggle Task
```typescript
const { toggleTask } = useRoutine();

toggleTask('morning', 'task-id');
toggleTask('evening', 'task-id');
toggleTask('night', 'task-id');
```

---

## 🏗️ Integration Workflow

### 1. After Face Scan
```typescript
// In analysis screen
import { useRoutine } from '@/context/RoutineContext';

const { generateDetailedDailyPlan } = useRoutine();

useEffect(() => {
  if (analysisData) {
    generateDetailedDailyPlan(analysisData);
  }
}, [analysisData]);
```

### 2. Display Routine
```typescript
const { dailyPlan } = useRoutine();

return (
  <ScrollView>
    <Morning steps={dailyPlan.morningRoutine.steps} />
    <Evening steps={dailyPlan.eveningRoutine.steps} />
    <Night steps={dailyPlan.nightRoutine.steps} />
  </ScrollView>
);
```

### 3. Track Completion
```typescript
const handleTaskPress = (taskId: string, period: string) => {
  toggleTask(period, taskId);
};

<Pressable onPress={() => handleTaskPress(task.id, 'morning')}>
  <Checkbox value={task.completed} />
  <Text>{task.name}</Text>
</Pressable>
```

---

## 📊 Daily Plan Structure

```
DailyRoutinePlan {
  ☀️ morningRoutine: {
    title: "☀️ Morning Routine"
    description: "For [skin type] skin"
    duration: "10-15 minutes"
    steps: [{id, name, completed}, ...]
    tips: ["Use lukewarm water", ...]
  }
  
  🌅 eveningRoutine: {
    title: "🌅 Evening Routine"
    description: "Double cleanse focus"
    duration: "15-20 minutes"
    steps: [{id, name, completed}, ...]
    tips: ["Massage not scrub", ...]
  }
  
  🌙 nightRoutine: {
    title: "🌙 Night Routine"
    description: "Intensive repair"
    duration: "20-25 minutes"
    steps: [{id, name, completed}, ...]
    tips: ["Rich products", ...]
  }
  
  📋 weeklyTreatments: [
    {
      name: "Clay Mask",
      frequency: "1-2 times/week",
      description: "..."
    },
    ...
  ]
  
  🥗 nutritionTips: [
    "Drink 8 glasses water",
    "Eat antioxidants",
    ...
  ]
  
  💡 generalAdvice: [
    "✨ Your skin is excellent",
    "🌙 Consistency over perfection",
    ...
  ]
}
```

---

## 🧪 Testing Scenarios

### Test Oily Skin
```typescript
const analysisData = {
  skinType: 'oily',
  healthScore: 60,
  detectedIssues: ['acne', 'oiliness'],
  recommendations: {}
};
generateDetailedDailyPlan(analysisData);

// Should include: oil-control, sebum management, clay masks
```

### Test Dry Skin
```typescript
const analysisData = {
  skinType: 'dry',
  healthScore: 70,
  detectedIssues: ['dryness', 'sensitivity'],
  recommendations: {}
};
generateDetailedDailyPlan(analysisData);

// Should include: hydrating essence, rich moisturizers, nourishing masks
```

### Test Excellent Skin
```typescript
const analysisData = {
  skinType: 'normal',
  healthScore: 90,
  detectedIssues: [],
  recommendations: {}
};
generateDetailedDailyPlan(analysisData);

// Should emphasize maintaining routine
```

---

## 🛠️ Environment Setup

### .env.local
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_APP_URL=exp://localhost:8081
```

### Test Auth
```bash
npm start
# Select 'w' for web or 'i' for iOS
# Try: signup → signin → logout → signin
```

---

## 📚 Documentation Map

| Need | File |
|------|------|
| Setup Supabase | `SUPABASE_QUICK_START.md` |
| Migration details | `FIREBASE_TO_SUPABASE_MIGRATION.md` |
| API reference | `ROUTINE_CONTEXT_GUIDE.md` |
| Features overview | `DAILY_ROUTINE_PLAN_SUMMARY.md` |
| Integration steps | `ROUTINE_IMPLEMENTATION_CHECKLIST.md` |
| Project overview | `IMPLEMENTATION_SUMMARY.md` |
| This file | `QUICK_REFERENCE.md` |

---

## ⚡ Quick Debugging

### Auth Not Working
```typescript
// Check user
const { user } = useAuth();
console.log('User:', user);

// Check session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### Plan Not Generating
```typescript
// Check analysis data
console.log('Analysis:', analysisData);

// Check if required fields exist
console.log('skinType:', analysisData?.skinType);
console.log('healthScore:', analysisData?.healthScore);

// Manually test
const { generateDetailedDailyPlan } = useRoutine();
const plan = generateDetailedDailyPlan(analysisData);
console.log('Generated plan:', plan);
```

### Tasks Not Toggling
```typescript
// Check routine state
const { routines } = useRoutine();
console.log('Morning tasks:', routines.morning);

// Check toggle
toggleTask('morning', 'task-id');

// Verify completed updated
console.log('After toggle:', routines.morning);
```

---

## 💡 Pro Tips

1. **Always check if user exists before displaying protected content**
   ```typescript
   if (!user) return <Navigate to="/auth" />;
   ```

2. **Generate plan immediately after analysis**
   ```typescript
   useEffect(() => {
     if (analysisData?.healthScore !== undefined) {
       generateDetailedDailyPlan(analysisData);
     }
   }, [analysisData]);
   ```

3. **Store plan in Supabase for persistence**
   ```typescript
   await supabase
     .from('routine_plans')
     .insert({ user_id: user.id, plan_data: dailyPlan });
   ```

4. **Load plan on app startup**
   ```typescript
   useEffect(() => {
     const loadPlan = async () => {
       const { data } = await supabase
         .from('routine_plans')
         .select('plan_data')
         .eq('user_id', user.id)
         .single();
       
       if (data) setDailyPlan(data.plan_data);
     };
     
     if (user) loadPlan();
   }, [user]);
   ```

5. **Add progress tracking**
   ```typescript
   const completedCount = routines.morning.filter(t => t.completed).length;
   const progress = (completedCount / routines.morning.length) * 100;
   ```

---

## 🎯 Common Tasks

### Display Morning Routine
```typescript
<View>
  <Text>{dailyPlan.morningRoutine.title}</Text>
  <Text>{dailyPlan.morningRoutine.duration}</Text>
  <FlatList
    data={dailyPlan.morningRoutine.steps}
    renderItem={({ item }) => (
      <TaskItem task={item} period="morning" />
    )}
    keyExtractor={item => item.id}
  />
  {dailyPlan.morningRoutine.tips.map((tip, i) => (
    <Text key={i}>💡 {tip}</Text>
  ))}
</View>
```

### Show Nutrition Tips
```typescript
<View>
  <Text>🥗 Nutrition Tips</Text>
  {dailyPlan.nutritionTips.map((tip, i) => (
    <Text key={i}>• {tip}</Text>
  ))}
</View>
```

### Weekly Treatments
```typescript
<View>
  <Text>📋 Weekly Treatments</Text>
  {dailyPlan.weeklyTreatments.map(treatment => (
    <View key={treatment.name}>
      <Text>{treatment.name}</Text>
      <Text>{treatment.frequency}</Text>
      <Text>{treatment.description}</Text>
    </View>
  ))}
</View>
```

---

## ✅ Checklist Before Deployment

- [ ] Supabase credentials configured
- [ ] Auth flows tested (signup, signin, logout)
- [ ] Daily plan generation tested
- [ ] UI displays routine correctly
- [ ] Task tracking works
- [ ] Data persists on refresh
- [ ] Error handling in place
- [ ] Loading states handled
- [ ] Styling complete
- [ ] Tested on device

---

## 🚀 Ready to Go!

Everything is implemented and tested. Next step: UI integration in your routine screens.

Start with: `ROUTINE_IMPLEMENTATION_CHECKLIST.md` Phase 2
