import AsyncStorage from '@react-native-async-storage/async-storage';
import { FaceHealthAnalysis } from './gemini.service';

const SCAN_DATA_KEY = 'facehealth_latest_scan';
const SCAN_IMAGE_KEY = 'facehealth_latest_scan_image';

export interface StoredScanData extends FaceHealthAnalysis {
  timestamp: number;
}

export const scanStorage = {
  async saveScan(analysis: FaceHealthAnalysis, imageUri: string): Promise<void> {
    try {
      const scanData: StoredScanData = {
        ...analysis,
        timestamp: Date.now(),
      };
      
      await Promise.all([
        AsyncStorage.setItem(SCAN_DATA_KEY, JSON.stringify(scanData)),
        AsyncStorage.setItem(SCAN_IMAGE_KEY, imageUri),
      ]);
    } catch (error) {
      console.error('Failed to save scan data:', error);
      throw error;
    }
  },

  async getLatestScan(): Promise<{ data: StoredScanData; image: string } | null> {
    try {
      const [scanDataStr, imageUri] = await Promise.all([
        AsyncStorage.getItem(SCAN_DATA_KEY),
        AsyncStorage.getItem(SCAN_IMAGE_KEY),
      ]);

      if (!scanDataStr || !imageUri) {
        return null;
      }

      return {
        data: JSON.parse(scanDataStr) as StoredScanData,
        image: imageUri,
      };
    } catch (error) {
      console.error('Failed to get latest scan:', error);
      return null;
    }
  },

  async clearScan(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(SCAN_DATA_KEY),
        AsyncStorage.removeItem(SCAN_IMAGE_KEY),
      ]);
    } catch (error) {
      console.error('Failed to clear scan data:', error);
      throw error;
    }
  },
};
