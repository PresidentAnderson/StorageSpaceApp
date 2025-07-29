import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

import { FTPFile, FTPConfig } from '../types/ftp';
import FTPService from '../services/FTPService';

const FTPBrowserScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { configId } = route.params as { configId: string };

  const [files, setFiles] = useState<FTPFile[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [config, setConfig] = useState<FTPConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useFocusEffect(
    useCallback(() => {
      initializeConnection();
    }, [configId])
  );

  const initializeConnection = async () => {
    try {
      setLoading(true);
      const ftpConfig = await FTPService.getConfig(configId);
      
      if (!ftpConfig) {
        Alert.alert('Error', 'FTP configuration not found');
        navigation.goBack();
        return;
      }

      setConfig(ftpConfig);

      // Check if already connected or connect
      const connected = FTPService.isConnected(configId) || await FTPService.connect(configId);
      setIsConnected(connected);

      if (connected) {
        await loadFiles();
      } else {
        Alert.alert('Connection Failed', 'Unable to connect to FTP server');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to initialize connection: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (path: string = currentPath) => {
    try {
      setLoading(true);
      const fileList = await FTPService.listFiles(configId, path);
      setFiles(fileList);
      setCurrentPath(path);
    } catch (error) {
      Alert.alert('Error', `Failed to load files: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFiles();
    setRefreshing(false);
  };

  const handleFilePress = (file: FTPFile) => {
    if (file.type === 'directory') {
      loadFiles(file.path);
    } else {
      showFileOptions(file);
    }
  };

  const showFileOptions = (file: FTPFile) => {
    Alert.alert(
      file.name,
      `Size: ${FTPService.formatFileSize(file.size)}\nModified: ${file.modifiedDate.toLocaleDateString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => downloadFile(file) },
        { text: 'Delete', style: 'destructive', onPress: () => confirmDelete(file) },
      ]
    );
  };

  const downloadFile = async (file: FTPFile) => {
    try {
      const localPath = `${require('expo-file-system').documentDirectory}${file.name}`;
      
      Alert.alert(
        'Download Started',
        `Downloading ${file.name}...`,
        [{ text: 'View Transfers', onPress: () => navigation.navigate('FileTransfers' as never) }]
      );

      await FTPService.downloadFile(configId, file.path, localPath, (progress) => {
        console.log(`Download progress: ${progress}%`);
      });

      Alert.alert('Download Complete', `${file.name} has been downloaded successfully`);
    } catch (error) {
      Alert.alert('Download Failed', `Failed to download ${file.name}: ${error}`);
    }
  };

  const confirmDelete = (file: FTPFile) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete ${file.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteFile(file) },
      ]
    );
  };

  const deleteFile = async (file: FTPFile) => {
    try {
      await FTPService.deleteFile(configId, file.path);
      await loadFiles(); // Refresh the list
      Alert.alert('Success', `${file.name} has been deleted`);
    } catch (error) {
      Alert.alert('Delete Failed', `Failed to delete ${file.name}: ${error}`);
    }
  };

  const uploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const remotePath = `${currentPath}/${file.name}`;

        Alert.alert(
          'Upload Started',
          `Uploading ${file.name}...`,
          [{ text: 'View Transfers', onPress: () => navigation.navigate('FileTransfers' as never) }]
        );

        await FTPService.uploadFile(configId, file.uri, remotePath, (progress) => {
          console.log(`Upload progress: ${progress}%`);
        });

        await loadFiles(); // Refresh the list
        Alert.alert('Upload Complete', `${file.name} has been uploaded successfully`);
      }
    } catch (error) {
      Alert.alert('Upload Failed', `Failed to upload file: ${error}`);
    }
  };

  const createFolder = () => {
    Alert.prompt(
      'Create Folder',
      'Enter folder name:',
      async (folderName) => {
        if (folderName) {
          try {
            const remotePath = `${currentPath}/${folderName}`;
            await FTPService.createDirectory(configId, remotePath);
            await loadFiles(); // Refresh the list
            Alert.alert('Success', `Folder ${folderName} has been created`);
          } catch (error) {
            Alert.alert('Error', `Failed to create folder: ${error}`);
          }
        }
      },
      'plain-text'
    );
  };

  const navigateUp = () => {
    if (currentPath !== '/') {
      const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      loadFiles(parentPath);
    }
  };

  const renderFileItem = ({ item }: { item: FTPFile }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => handleFilePress(item)}
    >
      <View style={styles.fileIcon}>
        <Ionicons
          name={item.type === 'directory' ? 'folder' : FTPService.getFileIcon(item.name) as any}
          size={24}
          color={item.type === 'directory' ? '#FFD700' : '#007AFF'}
        />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <View style={styles.fileDetails}>
          <Text style={styles.fileSize}>
            {item.type === 'directory' ? 'Folder' : FTPService.formatFileSize(item.size)}
          </Text>
          <Text style={styles.fileDate}>
            {item.modifiedDate.toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#CCC" />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.pathContainer}>
      <TouchableOpacity
        style={styles.pathButton}
        onPress={navigateUp}
        disabled={currentPath === '/'}
      >
        <Ionicons
          name="arrow-up"
          size={20}
          color={currentPath === '/' ? '#CCC' : '#007AFF'}
        />
      </TouchableOpacity>
      <Text style={styles.pathText}>{currentPath}</Text>
    </View>
  );

  if (!config) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#007AFF', '#0056CC']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{config.name}</Text>
            <Text style={styles.headerSubtitle}>
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'} • {config.host}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.transferButton}
            onPress={() => navigation.navigate('FileTransfers' as never)}
          >
            <Ionicons name="swap-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {renderHeader()}

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading files...</Text>
          </View>
        ) : (
          <FlatList
            data={files}
            renderItem={renderFileItem}
            keyExtractor={(item) => item.path}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.fileList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={uploadFile}>
          <Ionicons name="cloud-upload-outline" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Upload</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={createFolder}>
          <Ionicons name="folder-outline" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>New Folder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  transferButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: -20,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  pathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pathButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pathText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'monospace',
  },
  fileList: {
    paddingHorizontal: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fileIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: 20,
    marginRight: 15,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fileSize: {
    fontSize: 14,
    color: '#666',
  },
  fileDate: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default FTPBrowserScreen;