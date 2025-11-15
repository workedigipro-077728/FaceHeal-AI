import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { signOut } from '@/services/firebase';

interface Setting {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'button' | 'option';
  icon: string;
  value?: boolean;
  action?: () => void;
}

interface SettingsCategory {
  title: string;
  settings: Setting[];
}

export default function SettingsScreen() {
  const router = useRouter();
  const { isDarkMode, setIsDarkMode, theme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('Olivia');
  const [editName, setEditName] = useState('Olivia');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNotificationChange = (value: boolean) => {
    setNotifications(value);
  };

  const handleDarkModeChange = async (value: boolean) => {
    await setIsDarkMode(value);
    Alert.alert(
      'Theme Changed',
      `Switched to ${value ? 'Dark' : 'Light'} Mode`,
      [{ text: 'OK' }]
    );
  };

  const handleDataCollectionChange = (value: boolean) => {
    setDataCollection(value);
  };

  const handleEditProfile = () => {
    setEditName(userName);
    setModalVisible(true);
  };

  const handleSaveName = () => {
    setUserName(editName);
    setModalVisible(false);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'Are you sure you want to delete all scan history? This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => {
            // TODO: Implement data clearing logic
            Alert.alert('Success', 'All scan data has been cleared.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          if (isLoggingOut) return;
          
          setIsLoggingOut(true);
          try {
            console.log('🔐 Starting logout process with Firebase...');
            
            // Call Firebase signOut
            const { error } = await signOut();
            
            console.log('🔐 Firebase signOut result:', { error });
            
            if (error) {
              console.error('🔐 Logout error from Firebase:', error);
              setIsLoggingOut(false);
              Alert.alert('Error', 'Failed to logout: ' + error);
              return;
            }
            
            console.log('🔐 Logout successful, navigating to auth...');
            
            // Navigate after a small delay
            setTimeout(() => {
              console.log('🔐 Navigating to /auth');
              router.replace('/auth');
            }, 300);
            
          } catch (err: any) {
            console.error('🔐 Logout exception:', err);
            setIsLoggingOut(false);
            Alert.alert('Error', 'Exception during logout: ' + (err.message || 'Unknown error'));
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const settingsData: SettingsCategory[] = [
    {
      title: 'Account',
      settings: [
        {
          id: 'profile',
          title: 'Edit Profile',
          description: `Name: ${userName}`,
          type: 'button',
          icon: 'person',
          action: handleEditProfile,
        },
        {
          id: 'password',
          title: 'Change Password',
          description: 'Update your password',
          type: 'button',
          icon: 'lock',
          action: () => {
            Alert.alert('Coming Soon', 'Password change feature coming soon.');
          },
        },
      ],
    },
    {
      title: 'Preferences',
      settings: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          description: 'Receive tips and reminders',
          type: 'toggle',
          icon: 'notifications-active',
          value: notifications,
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          description: isDarkMode ? 'Disable dark mode' : 'Enable dark mode',
          type: 'toggle',
          icon: 'dark-mode',
          value: isDarkMode,
        },
        {
          id: 'dataCollection',
          title: 'Data Collection',
          description: 'Help improve app with usage data',
          type: 'toggle',
          icon: 'analytics',
          value: dataCollection,
        },
      ],
    },
    {
      title: 'Support & About',
      settings: [
        {
          id: 'faq',
          title: 'FAQ',
          description: 'Frequently asked questions',
          type: 'button',
          icon: 'help',
          action: () => {
            Alert.alert('FAQ', 'FAQ section coming soon.');
          },
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          description: 'Review privacy policy',
          type: 'button',
          icon: 'shield',
          action: () => {
            Alert.alert('Privacy Policy', 'Privacy policy page coming soon.');
          },
        },
        {
          id: 'about',
          title: 'About FaceHeal AI',
          description: 'Version 1.0.0',
          type: 'button',
          icon: 'info',
          action: () => {
            Alert.alert('About', 'FaceHeal AI v1.0.0\nYour personal facial health assistant.');
          },
        },
      ],
    },
    {
      title: 'Data Management',
      settings: [
        {
          id: 'clearData',
          title: 'Clear All Data',
          description: 'Delete all scan history',
          type: 'button',
          icon: 'delete',
          action: handleClearData,
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.BG }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={[styles.headerTitle, { color: theme.TEXT_PRIMARY }]}>Settings</ThemedText>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.TEAL_DARK }]}>
          <View style={styles.profileContent}>
            <View style={[styles.profileAvatar, { backgroundColor: `rgba(0, 212, 255, ${isDarkMode ? '0.2' : '0.15'})` }]}>
              <MaterialIcons name="person" size={40} color={theme.TEAL_BRIGHT} />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={[styles.profileName, { color: theme.TEXT_PRIMARY }]}>{userName}</ThemedText>
              <ThemedText style={[styles.profileEmail, { color: theme.TEXT_SECONDARY }]}>user@faceheal.ai</ThemedText>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={handleEditProfile}
          >
            <MaterialIcons name="edit" size={20} color={theme.TEAL_BRIGHT} />
          </Pressable>
        </View>

        {/* Settings Categories */}
        {settingsData.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categoryContainer}>
            <ThemedText style={[styles.categoryTitle, { color: theme.TEAL_BRIGHT }]}>{category.title}</ThemedText>

            <View style={[styles.settingsGroup, { backgroundColor: theme.TEAL_DARK }]}>
              {category.settings.map((setting, settingIndex) => (
                <View key={setting.id}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.settingItem,
                      {
                        backgroundColor: pressed ? `rgba(0, 212, 255, ${isDarkMode ? '0.1' : '0.05'})` : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      if (setting.type === 'button' && setting.action) {
                        setting.action();
                      } else if (setting.id === 'notifications') {
                        handleNotificationChange(!notifications);
                      } else if (setting.id === 'darkMode') {
                        handleDarkModeChange(!isDarkMode);
                      } else if (setting.id === 'dataCollection') {
                        handleDataCollectionChange(!dataCollection);
                      }
                    }}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIconContainer, { backgroundColor: `rgba(0, 212, 255, ${isDarkMode ? '0.15' : '0.1'})` }]}>
                        <MaterialIcons name={setting.icon as any} size={24} color={theme.TEAL_BRIGHT} />
                      </View>
                      <View style={styles.settingContent}>
                        <ThemedText style={[styles.settingTitle, { color: theme.TEXT_PRIMARY }]}>{setting.title}</ThemedText>
                        <ThemedText style={[styles.settingDescription, { color: theme.TEXT_SECONDARY }]}>
                          {setting.description}
                        </ThemedText>
                      </View>
                    </View>

                    {setting.type === 'toggle' && (
                      <Switch
                        value={setting.value || false}
                        onValueChange={(value) => {
                          if (setting.id === 'notifications') {
                            handleNotificationChange(value);
                          } else if (setting.id === 'darkMode') {
                            handleDarkModeChange(value);
                          } else if (setting.id === 'dataCollection') {
                            handleDataCollectionChange(value);
                          }
                        }}
                        trackColor={{ false: theme.TEAL_DARK, true: theme.TEAL_PRIMARY }}
                        thumbColor={theme.TEAL_BRIGHT}
                      />
                    )}
                    {setting.type === 'button' && (
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={theme.TEXT_SECONDARY}
                      />
                    )}
                  </Pressable>

                  {settingIndex < category.settings.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.DIVIDER }]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              { opacity: pressed && !isLoggingOut ? 0.85 : 1 },
            ]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color={isDarkMode ? '#ffffff' : '#000000'} size="small" />
            ) : (
              <>
                <MaterialIcons name="logout" size={20} color={isDarkMode ? '#ffffff' : '#000000'} />
                <ThemedText style={[styles.logoutButtonText, { color: isDarkMode ? '#ffffff' : '#000000' }]}>Logout</ThemedText>
              </>
            )}
          </Pressable>
        </View>

        {/* Extra padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.BG }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={[styles.modalTitle, { color: theme.TEXT_PRIMARY }]}>Edit Profile</ThemedText>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={28} color={theme.TEXT_PRIMARY} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <ThemedText style={[styles.inputLabel, { color: theme.TEXT_PRIMARY }]}>Full Name</ThemedText>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.TEAL_DARK, color: theme.TEXT_PRIMARY, borderColor: `rgba(0, 212, 255, ${isDarkMode ? '0.2' : '0.1'})` }]}
                value={editName}
                onChangeText={setEditName}
                placeholderTextColor={theme.TEXT_SECONDARY}
                placeholder="Enter your name"
              />

              <ThemedText style={[styles.inputLabel, { color: theme.TEXT_PRIMARY }]}>Email</ThemedText>
              <TextInput
                style={[styles.textInput, styles.disabledInput, { backgroundColor: theme.TEAL_DARK, color: theme.TEXT_PRIMARY, borderColor: `rgba(0, 212, 255, ${isDarkMode ? '0.2' : '0.1'})` }]}
                value="user@faceheal.ai"
                editable={false}
                placeholderTextColor={theme.TEXT_SECONDARY}
              />

              <View style={styles.modalButtonGroup}>
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    { opacity: pressed ? 0.85 : 1, backgroundColor: theme.TEAL_DARK, borderColor: `rgba(0, 212, 255, ${isDarkMode ? '0.2' : '0.1'})` },
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <ThemedText style={[styles.cancelButtonText, { color: theme.TEAL_BRIGHT }]}>Cancel</ThemedText>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.saveButton,
                    { opacity: pressed ? 0.85 : 1, backgroundColor: theme.TEAL_BRIGHT },
                  ]}
                  onPress={handleSaveName}
                >
                  <ThemedText style={[styles.saveButtonText, { color: isDarkMode ? '#1a3a3f' : '#f5f5f5' }]}>Save</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  profileCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  categoryContainer: {
    marginBottom: 28,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsGroup: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  modalBody: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  disabledInput: {
    opacity: 0.6,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
