import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { FTPConfig, FTPFile, FileTransfer, FTPConnection } from '../types/ftp';

class FTPService {
  private static instance: FTPService;
  private connections: Map<string, FTPConnection> = new Map();
  private activeTransfers: Map<string, FileTransfer> = new Map();
  private transferCallbacks: Map<string, (transfer: FileTransfer) => void> = new Map();

  static getInstance(): FTPService {
    if (!FTPService.instance) {
      FTPService.instance = new FTPService();
    }
    return FTPService.instance;
  }

  // Configuration Management
  async saveConfig(config: FTPConfig): Promise<void> {
    try {
      const configs = await this.getAllConfigs();
      const existingIndex = configs.findIndex(c => c.id === config.id);
      
      if (existingIndex >= 0) {
        configs[existingIndex] = config;
      } else {
        configs.push(config);
      }
      
      await AsyncStorage.setItem('ftp_configs', JSON.stringify(configs));
    } catch (error) {
      throw new Error(`Failed to save FTP config: ${error}`);
    }
  }

  async getAllConfigs(): Promise<FTPConfig[]> {
    try {
      const configs = await AsyncStorage.getItem('ftp_configs');
      return configs ? JSON.parse(configs) : [];
    } catch (error) {
      console.error('Failed to load FTP configs:', error);
      return [];
    }
  }

  async getConfig(id: string): Promise<FTPConfig | null> {
    const configs = await this.getAllConfigs();
    return configs.find(c => c.id === id) || null;
  }

  async deleteConfig(id: string): Promise<void> {
    try {
      const configs = await this.getAllConfigs();
      const filteredConfigs = configs.filter(c => c.id !== id);
      await AsyncStorage.setItem('ftp_configs', JSON.stringify(filteredConfigs));
      
      // Disconnect if connected
      if (this.connections.has(id)) {
        await this.disconnect(id);
      }
    } catch (error) {
      throw new Error(`Failed to delete FTP config: ${error}`);
    }
  }

  // Connection Management
  async connect(configId: string): Promise<boolean> {
    try {
      const config = await this.getConfig(configId);
      if (!config) {
        throw new Error('FTP configuration not found');
      }

      // Simulate connection (in real implementation, use actual FTP library)
      const connection: FTPConnection = {
        config,
        isConnected: true,
        currentPath: '/',
        lastActivity: new Date(),
      };

      this.connections.set(configId, connection);
      return true;
    } catch (error) {
      console.error('FTP connection failed:', error);
      return false;
    }
  }

  async disconnect(configId: string): Promise<void> {
    if (this.connections.has(configId)) {
      this.connections.delete(configId);
    }
  }

  isConnected(configId: string): boolean {
    return this.connections.has(configId) && this.connections.get(configId)?.isConnected === true;
  }

  getConnection(configId: string): FTPConnection | null {
    return this.connections.get(configId) || null;
  }

  // File Operations
  async listFiles(configId: string, path: string = '/'): Promise<FTPFile[]> {
    if (!this.isConnected(configId)) {
      throw new Error('Not connected to FTP server');
    }

    // Mock file listing (replace with actual FTP implementation)
    const mockFiles: FTPFile[] = [
      {
        name: 'documents',
        path: '/documents',
        size: 0,
        type: 'directory',
        modifiedDate: new Date('2024-01-15'),
        permissions: 'drwxr-xr-x',
      },
      {
        name: 'images',
        path: '/images',
        size: 0,
        type: 'directory',
        modifiedDate: new Date('2024-01-10'),
        permissions: 'drwxr-xr-x',
      },
      {
        name: 'backup.zip',
        path: '/backup.zip',
        size: 1024 * 1024 * 50, // 50MB
        type: 'file',
        modifiedDate: new Date('2024-01-20'),
        permissions: '-rw-r--r--',
      },
      {
        name: 'readme.txt',
        path: '/readme.txt',
        size: 2048,
        type: 'file',
        modifiedDate: new Date('2024-01-18'),
        permissions: '-rw-r--r--',
      },
    ];

    // Update last activity
    const connection = this.connections.get(configId);
    if (connection) {
      connection.lastActivity = new Date();
      connection.currentPath = path;
    }

    return mockFiles;
  }

  async uploadFile(
    configId: string,
    localPath: string,
    remotePath: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (!this.isConnected(configId)) {
      throw new Error('Not connected to FTP server');
    }

    const transferId = `upload_${Date.now()}`;
    const fileName = localPath.split('/').pop() || 'unknown';

    try {
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (!fileInfo.exists) {
        throw new Error('Local file does not exist');
      }

      const transfer: FileTransfer = {
        id: transferId,
        fileName,
        localPath,
        remotePath,
        type: 'upload',
        status: 'in_progress',
        progress: 0,
        totalSize: fileInfo.size || 0,
        transferredSize: 0,
        speed: 0,
        startTime: new Date(),
      };

      this.activeTransfers.set(transferId, transfer);

      // Simulate upload progress
      await this.simulateTransfer(transferId, onProgress);

      transfer.status = 'completed';
      transfer.endTime = new Date();
      transfer.progress = 100;

      return transferId;
    } catch (error) {
      const transfer = this.activeTransfers.get(transferId);
      if (transfer) {
        transfer.status = 'failed';
        transfer.error = error.toString();
      }
      throw error;
    }
  }

  async downloadFile(
    configId: string,
    remotePath: string,
    localPath: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (!this.isConnected(configId)) {
      throw new Error('Not connected to FTP server');
    }

    const transferId = `download_${Date.now()}`;
    const fileName = remotePath.split('/').pop() || 'unknown';

    try {
      const transfer: FileTransfer = {
        id: transferId,
        fileName,
        localPath,
        remotePath,
        type: 'download',
        status: 'in_progress',
        progress: 0,
        totalSize: 1024 * 1024 * 10, // Mock 10MB file
        transferredSize: 0,
        speed: 0,
        startTime: new Date(),
      };

      this.activeTransfers.set(transferId, transfer);

      // Simulate download progress
      await this.simulateTransfer(transferId, onProgress);

      // Create mock downloaded file
      await FileSystem.writeAsStringAsync(localPath, 'Mock downloaded content');

      transfer.status = 'completed';
      transfer.endTime = new Date();
      transfer.progress = 100;

      return transferId;
    } catch (error) {
      const transfer = this.activeTransfers.get(transferId);
      if (transfer) {
        transfer.status = 'failed';
        transfer.error = error.toString();
      }
      throw error;
    }
  }

  private async simulateTransfer(transferId: string, onProgress?: (progress: number) => void): Promise<void> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }

        const transfer = this.activeTransfers.get(transferId);
        if (transfer) {
          transfer.progress = progress;
          transfer.transferredSize = (transfer.totalSize * progress) / 100;
          transfer.speed = Math.random() * 1024 * 1024; // Random speed
        }

        onProgress?.(progress);
      }, 200);
    });
  }

  async deleteFile(configId: string, remotePath: string): Promise<void> {
    if (!this.isConnected(configId)) {
      throw new Error('Not connected to FTP server');
    }

    // Simulate file deletion
    console.log(`Deleting file: ${remotePath}`);
  }

  async createDirectory(configId: string, remotePath: string): Promise<void> {
    if (!this.isConnected(configId)) {
      throw new Error('Not connected to FTP server');
    }

    // Simulate directory creation
    console.log(`Creating directory: ${remotePath}`);
  }

  // Transfer Management
  getActiveTransfers(): FileTransfer[] {
    return Array.from(this.activeTransfers.values());
  }

  getTransfer(transferId: string): FileTransfer | null {
    return this.activeTransfers.get(transferId) || null;
  }

  cancelTransfer(transferId: string): void {
    const transfer = this.activeTransfers.get(transferId);
    if (transfer && transfer.status === 'in_progress') {
      transfer.status = 'cancelled';
    }
  }

  clearCompletedTransfers(): void {
    for (const [id, transfer] of this.activeTransfers.entries()) {
      if (transfer.status === 'completed' || transfer.status === 'failed' || transfer.status === 'cancelled') {
        this.activeTransfers.delete(id);
      }
    }
  }

  // Utility Methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatTransferSpeed(bytesPerSecond: number): string {
    return this.formatFileSize(bytesPerSecond) + '/s';
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf': return 'document-text';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
      case 'mp4':
      case 'avi':
      case 'mov': return 'videocam';
      case 'mp3':
      case 'wav':
      case 'aac': return 'musical-notes';
      case 'zip':
      case 'rar':
      case '7z': return 'archive';
      case 'txt':
      case 'doc':
      case 'docx': return 'document';
      default: return 'document-outline';
    }
  }
}

export default FTPService.getInstance();