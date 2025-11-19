import React, { createContext, useState, useContext } from "react";

export interface RoutineTask {
  id: string;
  name: string;
  completed: boolean;
}

export interface SkinAnalysisResult {
  skinType?: string;
  hydration?: number;
  acne?: number;
  sensitivity?: number;
  oiliness?: number;
  recommendation?: string;
}

export interface DailyRoutinePlan {
  morningRoutine: {
    title: string;
    description: string;
    steps: RoutineTask[];
    duration: string;
    tips: string[];
  };
  eveningRoutine: {
    title: string;
    description: string;
    steps: RoutineTask[];
    duration: string;
    tips: string[];
  };
  nightRoutine: {
    title: string;
    description: string;
    steps: RoutineTask[];
    duration: string;
    tips: string[];
  };
  weeklyTreatments: {
    name: string;
    frequency: string;
    description: string;
  }[];
  nutritionTips: string[];
  generalAdvice: string[];
}

interface RoutineContextType {
  scanData: SkinAnalysisResult | null;
  setScanData: (data: SkinAnalysisResult) => void;
  analysisData: any | null;
  setAnalysisData: (data: any) => void;
  routines: {
    morning: RoutineTask[];
    evening: RoutineTask[];
    night: RoutineTask[];
  };
  setRoutines: (routines: any) => void;
  toggleTask: (period: "morning" | "evening" | "night", taskId: string) => void;
  updateRoutinesFromScan: (analysisData: any) => void;
  generateDetailedDailyPlan: (analysisData: any) => DailyRoutinePlan;
  dailyPlan: DailyRoutinePlan | null;
  setDailyPlan: (plan: DailyRoutinePlan | null) => void;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const RoutineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scanData, setScanData] = useState<SkinAnalysisResult | null>(null);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyRoutinePlan | null>(null);
  const [routines, setRoutines] = useState({
    morning: [
      // Skincare
      { id: "1", name: "Splash face with cold water", completed: false },
      { id: "2", name: "Face wash with gentle cleanser", completed: false },
      { id: "3", name: "Pat dry gently", completed: false },
      { id: "4", name: "Apply toner/essence", completed: false },
      { id: "5", name: "Apply serum", completed: false },
      { id: "6", name: "Use moisturizer", completed: false },
      { id: "7", name: "Apply sunscreen (SPF 30+)", completed: false },
      // Wellness
      { id: "8", name: "Drink 2 glasses of water", completed: false },
      { id: "9", name: "Yoga/Stretching (10 min)", completed: false },
      { id: "10", name: "Morning walk (15 min)", completed: false },
      // Nutrition
      { id: "11", name: "Eat breakfast with fruits", completed: false },
      { id: "12", name: "Take vitamins/supplements", completed: false },
    ],
    evening: [
      // Work routine
      {
        id: "13",
        name: "Reduce screen time (20 min before)",
        completed: false,
      },
      { id: "14", name: "Relax with light activities", completed: false },
      // Skincare
      { id: "15", name: "Gentle face cleanse", completed: false },
      { id: "16", name: "Apply essence/toner", completed: false },
      { id: "17", name: "Apply serum/ampoule", completed: false },
      { id: "18", name: "Light skincare massage (5 min)", completed: false },
      { id: "19", name: "Apply evening moisturizer", completed: false },
      // Wellness
      { id: "20", name: "Drink 2 glasses of water", completed: false },
      { id: "21", name: "Evening walk (20 min)", completed: false },
      { id: "22", name: "Light exercise (yoga/pilates)", completed: false },
      // Nutrition
      { id: "23", name: "Eat balanced dinner", completed: false },
      { id: "24", name: "Avoid heavy/spicy food", completed: false },
    ],
    night: [
      // Pre-sleep routine
      { id: "25", name: "Finish eating 2 hours before bed", completed: false },
      { id: "26", name: "Reduce light exposure", completed: false },
      { id: "27", name: "Stop using phone 30 min before", completed: false },
      // Skincare
      { id: "28", name: "Double cleanse (oil + water)", completed: false },
      { id: "29", name: "Apply toner/essence", completed: false },
      { id: "30", name: "Apply night serum/treatment", completed: false },
      { id: "31", name: "Eye cream application", completed: false },
      { id: "32", name: "Lip balm/treatment", completed: false },
      { id: "33", name: "Apply night mask (optional)", completed: false },
      // Wellness
      { id: "34", name: "Final water intake (before bed)", completed: false },
      { id: "35", name: "Meditation/breathing exercise", completed: false },
      { id: "36", name: "Journaling (5 min)", completed: false },
      { id: "37", name: "Get 7-8 hours of quality sleep", completed: false },
    ],
  });

  const toggleTask = (
    period: "morning" | "evening" | "night",
    taskId: string
  ) => {
    setRoutines((prev: any) => ({
      ...prev,
      [period]: prev[period].map((task: RoutineTask) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const generateDetailedDailyPlan = (analysisData: any): DailyRoutinePlan => {
    const skinType = analysisData?.skinType || "normal";
    const healthScore = analysisData?.healthScore || 0;
    const detectedIssues = analysisData?.detectedIssues || [];
    const recommendations = analysisData?.recommendations || {};

    // Base routine templates
    const morningSteps: RoutineTask[] = [
      {
        id: "m1",
        name: "Splash face with cold water (1 min)",
        completed: false,
      },
      {
        id: "m2",
        name: "Gentle cleanser - massage for 1 minute",
        completed: false,
      },
      { id: "m3", name: "Rinse with lukewarm water", completed: false },
      { id: "m4", name: "Pat dry with soft towel", completed: false },
      { id: "m5", name: "Apply toner/essence", completed: false },
      { id: "m6", name: "Apply targeted serum", completed: false },
      {
        id: "m7",
        name: "Apply moisturizer (appropriate for skin type)",
        completed: false,
      },
      {
        id: "m8",
        name: "Apply sunscreen SPF 30+ (wait 15 min)",
        completed: false,
      },
      { id: "m9", name: "Drink a glass of water", completed: false },
      {
        id: "m10",
        name: "Light facial massage or gua sha (5 min)",
        completed: false,
      },
    ];

    const eveningSteps: RoutineTask[] = [
      {
        id: "e1",
        name: "Reduce screen time 30 min before routine",
        completed: false,
      },
      { id: "e2", name: "Wash hands thoroughly", completed: false },
      {
        id: "e3",
        name: "Oil cleanse - massage for 2 minutes",
        completed: false,
      },
      { id: "e4", name: "Add water and emulsify (1 min)", completed: false },
      { id: "e5", name: "Rinse thoroughly", completed: false },
      {
        id: "e6",
        name: "Water cleanse - gentle massage for 1 minute",
        completed: false,
      },
      { id: "e7", name: "Pat dry gently", completed: false },
      { id: "e8", name: "Apply toner/essence", completed: false },
      { id: "e9", name: "Apply treatment serum/ampoule", completed: false },
      { id: "e10", name: "Light facial massage (5 min)", completed: false },
      { id: "e11", name: "Apply evening moisturizer", completed: false },
      { id: "e12", name: "Drink herbal tea", completed: false },
    ];

    const nightSteps: RoutineTask[] = [
      {
        id: "n1",
        name: "Stop using phone 30-60 min before bed",
        completed: false,
      },
      {
        id: "n2",
        name: "Wash hands and remove makeup/sunscreen",
        completed: false,
      },
      {
        id: "n3",
        name: "Oil cleanse - gentle massage for 2 minutes",
        completed: false,
      },
      { id: "n4", name: "Emulsify and rinse", completed: false },
      {
        id: "n5",
        name: "Water cleanse - massage for 1 minute",
        completed: false,
      },
      { id: "n6", name: "Pat dry", completed: false },
      { id: "n7", name: "Apply toner/essence on damp skin", completed: false },
      { id: "n8", name: "Apply night serum/ampoule", completed: false },
      {
        id: "n9",
        name: "Apply eye cream with gentle tapping",
        completed: false,
      },
      {
        id: "n10",
        name: "Apply rich night moisturizer/sleeping mask",
        completed: false,
      },
      { id: "n11", name: "Lip treatment (if needed)", completed: false },
      { id: "n12", name: "Final water intake (before bed)", completed: false },
      {
        id: "n13",
        name: "Meditation/breathing exercise (5 min)",
        completed: false,
      },
      {
        id: "n14",
        name: "Aim for 7-8 hours of quality sleep",
        completed: false,
      },
    ];

    // Customize based on skin type
    if (
      skinType.toLowerCase().includes("oily") ||
      detectedIssues.includes("acne")
    ) {
      morningSteps.splice(4, 0, {
        id: "m-oily1",
        name: "Apply oil-control toner or clay mask",
        completed: false,
      });
      eveningSteps.splice(7, 0, {
        id: "e-oily1",
        name: "Apply sebum-control serum or BHA toner",
        completed: false,
      });
    }

    if (
      skinType.toLowerCase().includes("dry") ||
      detectedIssues.includes("dryness")
    ) {
      morningSteps.splice(5, 0, {
        id: "m-dry1",
        name: "Apply hydrating essence or booster",
        completed: false,
      });
      eveningSteps.splice(8, 0, {
        id: "e-dry1",
        name: "Apply rich hydrating serum",
        completed: false,
      });
    }

    if (
      skinType.toLowerCase().includes("sensitive") ||
      detectedIssues.includes("sensitivity")
    ) {
      morningSteps.splice(1, 0, {
        id: "m-sens1",
        name: "Use fragrance-free, gentle cleanser",
        completed: false,
      });
      morningSteps.push({
        id: "m-sens2",
        name: "Apply soothing essence with centella or aloe",
        completed: false,
      });
    }

    // Weekly treatments
    const weeklyTreatments = [];
    if (skinType.toLowerCase().includes("oily")) {
      weeklyTreatments.push({
        name: "Clay/Mud Mask",
        frequency: "1-2 times per week",
        description: "Use on T-zone or full face for 10-15 minutes",
      });
    }
    if (!skinType.toLowerCase().includes("oily")) {
      weeklyTreatments.push({
        name: "Hydrating/Nourishing Mask",
        frequency: "1-2 times per week",
        description: "Apply for 15-20 minutes to boost hydration",
      });
    }
    weeklyTreatments.push({
      name: "Gentle Exfoliation",
      frequency: "1-2 times per week",
      description: "Use chemical exfoliant (BHA/AHA) or gentle physical scrub",
    });

    // Nutrition tips based on skin condition
    const nutritionTips = [
      "Drink at least 8 glasses of water daily",
      "Eat antioxidant-rich foods: berries, dark leafy greens, dark chocolate",
      "Include omega-3 sources: fish, walnuts, flaxseeds, chia seeds",
      "Eat foods rich in Vitamin C: citrus, kiwi, bell peppers, broccoli",
      "Include zinc-rich foods: oysters, beef, pumpkin seeds, chickpeas",
    ];

    if (detectedIssues.includes("acne")) {
      nutritionTips.push("Limit dairy and high-glycemic foods");
      nutritionTips.push("Reduce sugar and processed food intake");
    }

    if (detectedIssues.includes("dryness")) {
      nutritionTips.push("Include healthy fats: avocado, olive oil, nuts");
      nutritionTips.push(
        "Increase collagen-boosting foods: bone broth, citrus"
      );
    }

    // General advice based on health score
    const generalAdvice = [];
    if (healthScore >= 80) {
      generalAdvice.push(
        "✨ Your skin is in excellent condition! Maintain your current routine."
      );
    } else if (healthScore >= 60) {
      generalAdvice.push(
        "👍 Your skin is doing well. Consistency is key to further improvement."
      );
    } else {
      generalAdvice.push(
        "💪 Your skin needs more targeted care. Follow this plan consistently for 4-6 weeks."
      );
    }

    generalAdvice.push(
      "🌙 Consistency is more important than perfection - aim for 80% adherence"
    );
    generalAdvice.push(
      "⏰ Spend 10-15 minutes on morning routine, 20-25 minutes on night routine"
    );
    generalAdvice.push(
      "💧 Adjust routine based on seasonal changes and climate"
    );
    generalAdvice.push(
      "🔍 Reassess your skin every 4-6 weeks and adjust as needed"
    );

    if (healthScore < 50) {
      generalAdvice.push(
        "⚠️ Consider consulting a dermatologist for persistent issues"
      );
    }

    const plan: DailyRoutinePlan = {
      morningRoutine: {
        title: "☀️ Morning Routine",
        description: `Refreshing and protective routine for ${skinType} skin to start your day right`,
        steps: morningSteps,
        duration: "10-15 minutes",
        tips: [
          "Use lukewarm water - not hot",
          "Apply products to damp skin for better absorption",
          "Wait 5-10 minutes after moisturizer before applying sunscreen",
          "Don't rush - take time for the massage steps",
        ],
      },
      eveningRoutine: {
        title: "🌅 Evening Routine",
        description: "Preparation for deeper night treatment and relaxation",
        steps: eveningSteps,
        duration: "15-20 minutes",
        tips: [
          "Double cleanse is crucial - remove makeup and sunscreen first",
          "Be gentle while cleansing - massage, don't scrub",
          "This is a good time to apply treatment products",
          "Relax and enjoy the massage - it boosts circulation",
        ],
      },
      nightRoutine: {
        title: "🌙 Night Routine",
        description: "Intensive repair and restoration while you sleep",
        steps: nightSteps,
        duration: "20-25 minutes",
        tips: [
          "Use richer products at night - skin absorbs better",
          "Don't apply too much product - a little goes a long way",
          "Reduce screen light blue exposure 30 min before bed",
          "Proper sleep is part of skincare - aim for 7-8 hours",
          "Keep pillowcase clean and change it 2-3 times per week",
        ],
      },
      weeklyTreatments,
      nutritionTips,
      generalAdvice,
    };

    setDailyPlan(plan);
    return plan;
  };

  const updateRoutinesFromScan = (analysisData: any) => {
    const skinType = analysisData?.skinType || "normal";
    const recommendations = analysisData?.recommendations || {};

    // Create personalized routines
    const newRoutines = {
      morning: [
        { id: "1", name: "Splash face with cold water", completed: false },
        { id: "2", name: "Face wash with gentle cleanser", completed: false },
        { id: "3", name: "Pat dry gently", completed: false },
        { id: "4", name: "Apply toner/essence", completed: false },
        { id: "5", name: "Apply serum", completed: false },
        { id: "6", name: "Use moisturizer", completed: false },
        { id: "7", name: "Apply sunscreen (SPF 30+)", completed: false },
        { id: "8", name: "Drink 2 glasses of water", completed: false },
        { id: "9", name: "Yoga/Stretching (10 min)", completed: false },
        { id: "10", name: "Eat breakfast with fruits", completed: false },
      ],
      evening: [
        {
          id: "13",
          name: "Reduce screen time (20 min before)",
          completed: false,
        },
        { id: "14", name: "Relax with light activities", completed: false },
        { id: "15", name: "Gentle face cleanse", completed: false },
        { id: "16", name: "Apply essence/toner", completed: false },
        { id: "17", name: "Apply serum/ampoule", completed: false },
        { id: "18", name: "Light skincare massage (5 min)", completed: false },
        { id: "19", name: "Apply evening moisturizer", completed: false },
        { id: "20", name: "Drink 2 glasses of water", completed: false },
        { id: "22", name: "Light exercise (yoga/pilates)", completed: false },
      ],
      night: [
        {
          id: "25",
          name: "Finish eating 2 hours before bed",
          completed: false,
        },
        { id: "26", name: "Reduce light exposure", completed: false },
        { id: "27", name: "Stop using phone 30 min before", completed: false },
        { id: "28", name: "Double cleanse (oil + water)", completed: false },
        { id: "29", name: "Apply toner/essence", completed: false },
        { id: "30", name: "Apply night serum/treatment", completed: false },
        { id: "31", name: "Eye cream application", completed: false },
        { id: "32", name: "Lip balm/treatment", completed: false },
        { id: "34", name: "Final water intake (before bed)", completed: false },
        { id: "35", name: "Meditation/breathing exercise", completed: false },
        { id: "37", name: "Get 7-8 hours of quality sleep", completed: false },
      ],
    };

    // Personalize based on skin type
    if (
      skinType.toLowerCase().includes("oily") ||
      skinType.toLowerCase().includes("acne")
    ) {
      newRoutines.morning.splice(5, 0, {
        id: "oily-1",
        name: "Use oil-control toner/clay mask",
        completed: false,
      });
      newRoutines.evening.splice(3, 0, {
        id: "oily-2",
        name: "Apply sebum-control serum",
        completed: false,
      });
    }

    if (
      skinType.toLowerCase().includes("dry") ||
      skinType.toLowerCase().includes("sensitive")
    ) {
      newRoutines.morning.splice(5, 0, {
        id: "dry-1",
        name: "Apply hydrating essence/booster",
        completed: false,
      });
      newRoutines.evening.splice(3, 0, {
        id: "dry-2",
        name: "Use rich hydrating mask (2-3x weekly)",
        completed: false,
      });
    }

    // Add recommendations from analysis
    if (
      recommendations.morningRoutine &&
      Array.isArray(recommendations.morningRoutine)
    ) {
      recommendations.morningRoutine.forEach((rec: string, index: number) => {
        newRoutines.morning.push({
          id: `rec-morning-${index}`,
          name: rec,
          completed: false,
        });
      });
    }

    if (
      recommendations.nightRoutine &&
      Array.isArray(recommendations.nightRoutine)
    ) {
      recommendations.nightRoutine.forEach((rec: string, index: number) => {
        newRoutines.night.push({
          id: `rec-night-${index}`,
          name: rec,
          completed: false,
        });
      });
    }

    // Add lifestyle recommendations to morning
    if (recommendations.lifestyle && Array.isArray(recommendations.lifestyle)) {
      recommendations.lifestyle.forEach((rec: string, index: number) => {
        newRoutines.morning.push({
          id: `rec-lifestyle-${index}`,
          name: rec,
          completed: false,
        });
      });
    }

    setRoutines(newRoutines);
    setAnalysisData(analysisData);
  };

  return (
    <RoutineContext.Provider
      value={{
        scanData,
        setScanData,
        analysisData,
        setAnalysisData,
        routines,
        setRoutines,
        toggleTask,
        updateRoutinesFromScan,
        generateDetailedDailyPlan,
        dailyPlan,
        setDailyPlan,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};

export const useRoutine = () => {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error("useRoutine must be used within a RoutineProvider");
  }
  return context;
};
