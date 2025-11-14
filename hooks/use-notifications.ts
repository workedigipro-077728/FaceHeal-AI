import { useEffect } from 'react';
import { Platform } from 'react-native';
import { scheduleAllReminders, getNotificationSettings } from '@/services/notifications';

export function useNotifications() {
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const setupNotifications = async () => {
      try {
        const settings = await getNotificationSettings();
        await scheduleAllReminders(settings);
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, []);
}
