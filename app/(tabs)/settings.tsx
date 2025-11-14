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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';

// Colors
const DARK_BG = '#1a3a3f';
const TEAL_PRIMARY = '#4a9b8e';
const TEAL_BRIGHT = '#00d4ff';
const TEAL_DARK = '#2a5a5f';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#a0a0a0';
const STATUS_LOW = '#ef4444';
const DIVIDER = 'rgba(255,255,255,0.1)';

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
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('Olivia');
  const [editName, setEditName] = useState('Olivia');

  const handleNotificationChange = (value: boolean) => {
    setNotifications(value);
  };

  const handleDarkModeChange = (value: boolean) => {
    setDarkMode(value);
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
        onPress: () => {
          // TODO: Implement logout logic
          router.push('/auth');
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
          description: 'Enable dark mode',
          type: 'toggle',
          icon: 'dark-mode',
          value: darkMode,
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Settings</ThemedText>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.profileAvatar}>
              <MaterialIcons name="person" size={40} color={TEAL_BRIGHT} />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>{userName}</ThemedText>
              <ThemedText style={styles.profileEmail}>user@faceheal.ai</ThemedText>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={handleEditProfile}
          >
            <MaterialIcons name="edit" size={20} color={TEAL_BRIGHT} />
          </Pressable>
        </View>

        {/* Settings Categories */}
        {settingsData.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categoryContainer}>
            <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>

            <View style={styles.settingsGroup}>
              {category.settings.map((setting, settingIndex) => (
                <View key={setting.id}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.settingItem,
                      {
                        backgroundColor: pressed ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      if (setting.type === 'button' && setting.action) {
                        setting.action();
                      } else if (setting.id === 'notifications') {
                        handleNotificationChange(!notifications);
                      } else if (setting.id === 'darkMode') {
                        handleDarkModeChange(!darkMode);
                      } else if (setting.id === 'dataCollection') {
                        handleDataCollectionChange(!dataCollection);
                      }
                    }}
                  >
                    <View style={styles.settingLeft}>
                      <View style={styles.settingIconContainer}>
                        <MaterialIcons name={setting.icon as any} size={24} color={TEAL_BRIGHT} />
                      </View>
                      <View style={styles.settingContent}>
                        <ThemedText style={styles.settingTitle}>{setting.title}</ThemedText>
                        <ThemedText style={styles.settingDescription}>
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
                        trackColor={{ false: TEAL_DARK, true: TEAL_PRIMARY }}
                        thumbColor={TEAL_BRIGHT}
                      />
                    )}
                    {setting.type === 'button' && (
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={TEXT_SECONDARY}
                      />
                    )}
                  </Pressable>

                  {settingIndex < category.settings.length - 1 && (
                    <View style={styles.divider} />
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
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={20} color="#ffffff" />
            <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Edit Profile</ThemedText>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={28} color={TEXT_PRIMARY} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholderTextColor={TEXT_SECONDARY}
                placeholder="Enter your name"
              />

              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value="user@faceheal.ai"
                editable={false}
                placeholderTextColor={TEXT_SECONDARY}
              />

              <View style={styles.modalButtonGroup}>
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.saveButton,
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                  onPress={handleSaveName}
                >
                  <ThemedText style={styles.saveButtonText}>Save</ThemedText>
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
    backgroundColor: DARK_BG,
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
    color: TEXT_PRIMARY,
  },
  profileCard: {
    backgroundColor: TEAL_DARK,
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
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: TEXT_SECONDARY,
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
    color: TEAL_BRIGHT,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsGroup: {
    backgroundColor: TEAL_DARK,
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
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginHorizontal: 16,
  },
  logoutContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: STATUS_LOW,
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
    color: '#ffffff',
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
    backgroundColor: DARK_BG,
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
    color: TEXT_PRIMARY,
  },
  modalBody: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: TEAL_DARK,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: TEXT_PRIMARY,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
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
    backgroundColor: TEAL_DARK,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEAL_BRIGHT,
  },
  saveButton: {
    flex: 1,
    backgroundColor: TEAL_BRIGHT,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_BG,
  },
});
