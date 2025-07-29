import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';

import { FileTransfer } from '../types/ftp';
import FTPService from '../services/FTPService';

const FileTransfersScreen = () => {
  const navigation = useNavigation();
  const [transfers, setTransfers] = useState<FileTransfer[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadTransfers();
    
    // Set up auto-refresh for active transfers
    const interval = setInterval(() => {
      loadTransfers();
    }, 1000);
    
    setRefreshInterval(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const loadTransfers = () => {
    const activeTransfers = FTPService.getActiveTransfers();
    setTransfers(activeTransfers);
  };

  const cancelTransfer = (transferId: string) => {
    Alert.alert(
      'Cancel Transfer',
      'Are you sure you want to cancel this transfer?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: () => {
          FTPService.cancelTransfer(transferId);
          loadTransfers();
        }},
      ]
    );
  };

  const clearCompleted = () => {
    FTPService.clearCompletedTransfers();
    loadTransfers();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'in_progress': return 'arrow-forward-circle';
      case 'completed': return 'checkmark-circle';
      case 'failed': return 'close-circle';
      case 'cancelled': return 'stop-circle';
      default: return 'help-circle';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'in_progress': return '#007AFF';
      case 'completed': return '#4CAF50';
      case 'failed': return '#FF6B6B';
      case 'cancelled': return '#666';
      default: return '#666';
    }
  };

  const formatDuration = (startTime?: Date, endTime?: Date) => {
    if (!startTime) return '--';
    
    const end = endTime || new Date();
    const duration = end.getTime() - startTime.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const renderTransferItem = ({ item }: { item: FileTransfer }) => {
    const isActive = item.status === 'in_progress';
    const canCancel = item.status === 'in_progress' || item.status === 'pending';

    return (
      <View style={[styles.transferItem, isActive && styles.activeTransferItem]}>
        <View style={styles.transferHeader}>
          <View style={styles.transferIcon}>
            <Ionicons
              name={item.type === 'upload' ? 'cloud-upload' : 'cloud-download'}
              size={20}
              color={item.type === 'upload' ? '#4CAF50' : '#007AFF'}
            />
          </View>
          <View style={styles.transferInfo}>
            <Text style={styles.fileName}>{item.fileName}</Text>
            <Text style={styles.transferPath} numberOfLines={1}>
              {item.type === 'upload' ? item.localPath : item.remotePath}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Ionicons
              name={getStatusIcon(item.status) as any}
              size={16}
              color={getStatusColor(item.status)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        {isActive && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#007AFF', '#0056CC']}
                style={[styles.progressFill, { width: `${item.progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(item.progress)}%</Text>
          </View>
        )}

        <View style={styles.transferDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Size:</Text>
            <Text style={styles.detailValue}>
              {FTPService.formatFileSize(item.transferredSize)} / {FTPService.formatFileSize(item.totalSize)}
            </Text>
          </View>
          
          {isActive && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Speed:</Text>
              <Text style={styles.detailValue}>
                {FTPService.formatTransferSpeed(item.speed)}
              </Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>
              {formatDuration(item.startTime, item.endTime)}
            </Text>
          </View>

          {item.error && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={16} color="#FF6B6B" />
              <Text style={styles.errorText}>{item.error}</Text>
            </View>
          )}
        </View>

        {canCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => cancelTransfer(item.id)}
          >
            <Ionicons name="stop" size={16} color="#FF6B6B" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="swap-horizontal-outline" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>No File Transfers</Text>
      <Text style={styles.emptyDescription}>
        Upload or download files to see transfer progress here
      </Text>
    </View>
  );

  const activeCount = transfers.filter(t => t.status === 'in_progress').length;
  const completedCount = transfers.filter(t => t.status === 'completed').length;

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
          <Text style={styles.headerTitle}>File Transfers</Text>
          {transfers.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearCompleted}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {transfers.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{activeCount}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{transfers.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        )}

        {transfers.length > 0 ? (
          <FlatList
            data={transfers}
            renderItem={renderTransferItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.transferList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
        )}
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
  clearButton: {
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
  transferList: {
    paddingHorizontal: 20,
  },
  transferItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 12,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  activeTransferItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  transferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  transferIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: 20,
    marginRight: 12,
  },
  transferInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transferPath: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
    minWidth: 35,
    textAlign: 'right',
  },
  transferDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginLeft: 5,
    flex: 1,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
  },
});

export default FileTransfersScreen;