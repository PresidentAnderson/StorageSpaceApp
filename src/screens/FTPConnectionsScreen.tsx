import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { FTPConfig } from '../types/ftp';
import FTPService from '../services/FTPService';

const FTPConnectionsScreen = () => {
  const navigation = useNavigation();
  const [configs, setConfigs] = useState<FTPConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadConfigs();
    }, [])
  );

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const ftpConfigs = await FTPService.getAllConfigs();
      setConfigs(ftpConfigs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load FTP configurations');
    } finally {
      setLoading(false);
    }
  };

  const connectToServer = async (config: FTPConfig) => {
    try {
      setConnectingId(config.id);
      const connected = await FTPService.connect(config.id);
      
      if (connected) {
        navigation.navigate('FTPBrowser' as never, { configId: config.id } as never);
      } else {
        Alert.alert('Connection Failed', 'Unable to connect to the FTP server. Please check your credentials and try again.');
      }
    } catch (error) {
      Alert.alert('Connection Error', `Failed to connect: ${error}`);
    } finally {
      setConnectingId(null);
    }
  };

  const showConfigOptions = (config: FTPConfig) => {
    Alert.alert(
      config.name,
      `${config.host}:${config.port}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Connect', onPress: () => connectToServer(config) },
        { text: 'Edit', onPress: () => editConfig(config) },
        { text: 'Delete', style: 'destructive', onPress: () => confirmDelete(config) },
      ]
    );
  };

  const editConfig = (config: FTPConfig) => {
    navigation.navigate('FTPSettings' as never, { configId: config.id } as never);
  };

  const confirmDelete = (config: FTPConfig) => {
    Alert.alert(
      'Delete Configuration',
      `Are you sure you want to delete "${config.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteConfig(config.id) },
      ]
    );
  };

  const deleteConfig = async (configId: string) => {
    try {
      await FTPService.deleteConfig(configId);
      await loadConfigs();
      Alert.alert('Success', 'Configuration deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete configuration');
    }
  };

  const addNewConfig = () => {
    navigation.navigate('FTPSettings' as never);
  };

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case 'sftp': return 'shield-checkmark';
      case 'ftps': return 'lock-closed';
      default: return 'server';
    }
  };

  const getProtocolColor = (protocol: string) => {
    switch (protocol) {
      case 'sftp': return '#4CAF50';
      case 'ftps': return '#FF9800';
      default: return '#007AFF';
    }
  };

  const renderConfigItem = ({ item }: { item: FTPConfig }) => {
    const isConnecting = connectingId === item.id;
    const isConnected = FTPService.isConnected(item.id);

    return (
      <TouchableOpacity
        style={[styles.configItem, isConnected && styles.connectedItem]}
        onPress={() => isConnected ? navigation.navigate('FTPBrowser' as never, { configId: item.id } as never) : showConfigOptions(item)}
        onLongPress={() => showConfigOptions(item)}
        disabled={isConnecting}
      >
        <View style={styles.configIcon}>
          {isConnecting ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Ionicons
              name={getProtocolIcon(item.protocol) as any}
              size={24}
              color={getProtocolColor(item.protocol)}
            />
          )}
        </View>
        
        <View style={styles.configInfo}>
          <View style={styles.configHeader}>
            <Text style={styles.configName}>{item.name}</Text>
            {isConnected && (
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedText}>Connected</Text>
              </View>
            )}
          </View>
          <Text style={styles.configHost}>{item.host}:{item.port}</Text>
          <View style={styles.configMeta}>
            <View style={styles.protocolBadge}>
              <Text style={[styles.protocolText, { color: getProtocolColor(item.protocol) }]}>
                {item.protocol.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.configUser}>@{item.username}</Text>
          </View>
        </View>
        
        <View style={styles.configActions}>
          {isConnected ? (
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('FTPBrowser' as never, { configId: item.id } as never)}
            >
              <Ionicons name="folder-open" size={20} color="#007AFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => connectToServer(item)}
            >
              <Ionicons name="play-circle" size={20} color="#4CAF50" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => showConfigOptions(item)}
          >
            <Ionicons name="ellipsis-vertical" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="server-outline" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>No FTP Connections</Text>
      <Text style={styles.emptyDescription}>
        Add your first FTP server connection to start transferring files
      </Text>
      <TouchableOpacity style={styles.addFirstButton} onPress={addNewConfig}>
        <LinearGradient colors={['#007AFF', '#0056CC']} style={styles.addFirstGradient}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addFirstText}>Add FTP Server</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.headerTitle}>FTP Connections</Text>
          <TouchableOpacity style={styles.addButton} onPress={addNewConfig}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading connections...</Text>
          </View>
        ) : configs.length > 0 ? (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{configs.length}</Text>
                <Text style={styles.statLabel}>Total Servers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {configs.filter(c => FTPService.isConnected(c.id)).length}
                </Text>
                <Text style={styles.statLabel}>Connected</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {configs.filter(c => c.protocol === 'sftp').length}
                </Text>
                <Text style={styles.statLabel}>Secure</Text>
              </View>
            </View>

            <FlatList
              data={configs}
              renderItem={renderConfigItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.configList}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          renderEmptyState()
        )}
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.bottomActionButton}
          onPress={() => navigation.navigate('FileTransfers' as never)}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color="#007AFF" />
          <Text style={styles.bottomActionText}>Transfers</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.bottomActionButton}
          onPress={addNewConfig}
        >
          <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.bottomActionText}>Add Server</Text>
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
    paddingBottom: 30,
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
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
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
    paddingTop: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  configList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  connectedItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  configIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: 25,
    marginRight: 15,
  },
  configInfo: {
    flex: 1,
  },
  configHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  configName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  connectedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  connectedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  configHost: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  configMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  protocolBadge: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 10,
  },
  protocolText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  configUser: {
    fontSize: 12,
    color: '#999',
  },
  configActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  addFirstButton: {
    marginTop: 20,
  },
  addFirstGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  addFirstText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  bottomActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomActionText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default FTPConnectionsScreen;