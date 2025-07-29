export interface FTPConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  protocol: 'ftp' | 'sftp' | 'ftps';
  passive: boolean;
  secure: boolean;
  isDefault?: boolean;
}

export interface FTPFile {
  name: string;
  path: string;
  size: number;
  type: 'file' | 'directory';
  modifiedDate: Date;
  permissions?: string;
  isSymbolicLink?: boolean;
}

export interface FileTransfer {
  id: string;
  fileName: string;
  localPath: string;
  remotePath: string;
  type: 'upload' | 'download';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  totalSize: number;
  transferredSize: number;
  speed: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface FTPConnection {
  config: FTPConfig;
  isConnected: boolean;
  currentPath: string;
  lastActivity: Date;
}

export type FTPStackParamList = {
  FTPConnections: undefined;
  FTPBrowser: { configId: string };
  FTPSettings: { configId?: string };
  FileTransfers: undefined;
  FileViewer: { file: FTPFile; configId: string };
};