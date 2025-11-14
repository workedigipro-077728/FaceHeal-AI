import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure notification handler
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    } as any),
  });
}

interface NotificationSettings {
  waterReminder: boolean;
  waterTime: string; // HH:mm format
  morningReminder: boolean;
  morningTime: string;
  eveningReminder: boolean;
  eveningTime: string;
  nightReminder: boolean;
  nightTime: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  waterReminder: true,
  waterTime: '09:00',
  morningReminder: true,
  morningTime: '07:00',
  eveningReminder: true,
  eveningTime: '18:00',
  nightReminder: true,
  nightTime: '21:00',
};

const STORAGE_KEY = 'notification_settings';

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') {
    console.log('Notifications not supported on web');
    return false;
  }

  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveNotificationSettings(settings: NotificationSettings) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
}

export async function scheduleWaterReminders(enabled: boolean, time: string) {
  if (Platform.OS === 'web') return;

  try {
    // Cancel existing water reminders
    const waterNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const waterIds = waterNotifications
      .filter((n) => n.content.data.type === 'water')
      .map((n) => n.identifier);

    for (const id of waterIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }

    if (!enabled) return;
  } catch (error) {
    console.error('Error in scheduleWaterReminders:', error);
    return;
  }

  const [hours, minutes] = time.split(':').map(Number);

  // Schedule water reminders every 2 hours starting from the specified time
  for (let i = 0; i < 8; i++) {
    const notifTime = new Date();
    notifTime.setHours(hours + i * 2, minutes, 0);

    if (notifTime.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💧 Time to hydrate!',
          body: 'Drink a glass of water to stay healthy',
          sound: true,
          data: {
            type: 'water',
          },
        },
        trigger: {
          type: 'daily',
          hour: notifTime.getHours(),
          minute: notifTime.getMinutes(),
        } as any,
      });
    }
  }
}

export async function scheduleRoutineReminder(
  type: 'morning' | 'evening' | 'night',
  enabled: boolean,
  time: string
) {
  if (Platform.OS === 'web') return;

  try {
    // Cancel existing reminders for this type
    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const existingIds = allNotifications
      .filter((n) => n.content.data.type === type)
      .map((n) => n.identifier);

    for (const id of existingIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }

    if (!enabled) return;
  } catch (error) {
    console.error(`Error in scheduleRoutineReminder (${type}):`, error);
    return;
  }

  const [hours, minutes] = time.split(':').map(Number);

  const routineConfig = {
    morning: {
      title: '🌅 Good Morning!',
      body: 'Time to start your morning routine',
    },
    evening: {
      title: '🌆 Good Evening!',
      body: 'Time for your evening routine',
    },
    night: {
      title: '🌙 Good Night!',
      body: 'Time to prepare for bed with your night routine',
    },
  };

  const config = routineConfig[type];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: config.title,
      body: config.body,
      sound: true,
      data: {
        type: type,
      },
    },
    trigger: {
      type: 'daily',
      hour: hours,
      minute: minutes,
    } as any,
  });
}

export async function scheduleAllReminders(settings: NotificationSettings) {
  if (Platform.OS === 'web') return;

  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permissions not granted');
      return;
    }

    // Schedule water reminders
    await scheduleWaterReminders(settings.waterReminder, settings.waterTime);

    // Schedule routine reminders
    await scheduleRoutineReminder('morning', settings.morningReminder, settings.morningTime);
    await scheduleRoutineReminder('evening', settings.eveningReminder, settings.eveningTime);
    await scheduleRoutineReminder('night', settings.nightReminder, settings.nightTime);
  } catch (error) {
    console.error('Error scheduling all reminders:', error);
  }
}

export async function cancelAllReminders() {
  if (Platform.OS === 'web') return;

  try {
    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of allNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  } catch (error) {
    console.error('Error cancelling reminders:', error);
  }
}
