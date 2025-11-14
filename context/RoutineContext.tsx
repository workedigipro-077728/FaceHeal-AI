import React, { createContext, useState, useContext } from 'react';

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

interface RoutineContextType {
  scanData: SkinAnalysisResult | null;
  setScanData: (data: SkinAnalysisResult) => void;
  routines: {
    morning: RoutineTask[];
    evening: RoutineTask[];
    night: RoutineTask[];
  };
  setRoutines: (routines: any) => void;
  toggleTask: (period: 'morning' | 'evening' | 'night', taskId: string) => void;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const RoutineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanData, setScanData] = useState<SkinAnalysisResult | null>(null);
  const [routines, setRoutines] = useState({
    morning: [
      // Skincare
      { id: '1', name: 'Splash face with cold water', completed: false },
      { id: '2', name: 'Face wash with gentle cleanser', completed: false },
      { id: '3', name: 'Pat dry gently', completed: false },
      { id: '4', name: 'Apply toner/essence', completed: false },
      { id: '5', name: 'Apply serum', completed: false },
      { id: '6', name: 'Use moisturizer', completed: false },
      { id: '7', name: 'Apply sunscreen (SPF 30+)', completed: false },
      // Wellness
      { id: '8', name: 'Drink 2 glasses of water', completed: false },
      { id: '9', name: 'Yoga/Stretching (10 min)', completed: false },
      { id: '10', name: 'Morning walk (15 min)', completed: false },
      // Nutrition
      { id: '11', name: 'Eat breakfast with fruits', completed: false },
      { id: '12', name: 'Take vitamins/supplements', completed: false },
    ],
    evening: [
      // Work routine
      { id: '13', name: 'Reduce screen time (20 min before)', completed: false },
      { id: '14', name: 'Relax with light activities', completed: false },
      // Skincare
      { id: '15', name: 'Gentle face cleanse', completed: false },
      { id: '16', name: 'Apply essence/toner', completed: false },
      { id: '17', name: 'Apply serum/ampoule', completed: false },
      { id: '18', name: 'Light skincare massage (5 min)', completed: false },
      { id: '19', name: 'Apply evening moisturizer', completed: false },
      // Wellness
      { id: '20', name: 'Drink 2 glasses of water', completed: false },
      { id: '21', name: 'Evening walk (20 min)', completed: false },
      { id: '22', name: 'Light exercise (yoga/pilates)', completed: false },
      // Nutrition
      { id: '23', name: 'Eat balanced dinner', completed: false },
      { id: '24', name: 'Avoid heavy/spicy food', completed: false },
    ],
    night: [
      // Pre-sleep routine
      { id: '25', name: 'Finish eating 2 hours before bed', completed: false },
      { id: '26', name: 'Reduce light exposure', completed: false },
      { id: '27', name: 'Stop using phone 30 min before', completed: false },
      // Skincare
      { id: '28', name: 'Double cleanse (oil + water)', completed: false },
      { id: '29', name: 'Apply toner/essence', completed: false },
      { id: '30', name: 'Apply night serum/treatment', completed: false },
      { id: '31', name: 'Eye cream application', completed: false },
      { id: '32', name: 'Lip balm/treatment', completed: false },
      { id: '33', name: 'Apply night mask (optional)', completed: false },
      // Wellness
      { id: '34', name: 'Final water intake (before bed)', completed: false },
      { id: '35', name: 'Meditation/breathing exercise', completed: false },
      { id: '36', name: 'Journaling (5 min)', completed: false },
      { id: '37', name: 'Get 7-8 hours of quality sleep', completed: false },
    ],
  });

  const toggleTask = (period: 'morning' | 'evening' | 'night', taskId: string) => {
    setRoutines((prev: any) => ({
      ...prev,
      [period]: prev[period].map((task: RoutineTask) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  return (
    <RoutineContext.Provider value={{ scanData, setScanData, routines, setRoutines, toggleTask }}>
      {children}
    </RoutineContext.Provider>
  );
};

export const useRoutine = () => {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error('useRoutine must be used within a RoutineProvider');
  }
  return context;
};
