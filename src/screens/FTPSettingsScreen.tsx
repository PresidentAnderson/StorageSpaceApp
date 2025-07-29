import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

import { FTPConfig } from '../types/ftp';
import FTPService from '../services/FTPService';

const FTPSettingsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { configId } = route.params as { configId?: string } || {};

  const [config, setConfig] = useState<FTPConfig>({
    id: configId || `ftp_${Date.now()}`,
    name: '',
    host: '',
    port: 21,
    username: '',
    password: '',
    protocol: 'ftp',
    passive: true,
    secure: false,
  });

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (configId) {
      loadConfig();
    }
  }, [configId]);

  const loadConfig = async () => {
    try {
      const existingConfig = await FTPService.getConfig(configId!);
      if (existingConfig) {
        setConfig(existingConfig);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load configuration');
    }
  };

  const validateConfig = (): boolean => {
    if (!config.name.trim()) {
      Alert.alert('Validation Error', 'Please enter a connection name');
      return false;
    }
    if (!config.host.trim()) {
      Alert.alert('Validation Error', 'Please enter a host address');
      return false;
    }
    if (!config.username.trim()) {
      Alert.alert('Validation Error', 'Please enter a username');
      return false;
    }
    if (config.port < 1 || config.port > 65535) {
      Alert.alert('Validation Error', 'Port must be between 1 and 65535');
      return false;
    }
    return true;
  };

  const testConnection = async () => {
    if (!validateConfig()) return;

    try {
      setTesting(true);
      
      // Save temporarily to test
      await FTPService.saveConfig(config);
      const connected = await FTPService.connect(config.id);
      
      if (connected) {
        Alert.alert(
          'Connection Successful',
          'Successfully connected to the FTP server!',
          [
            { text: 'OK', onPress: () => FTPService.disconnect(config.id) }
          ]
        );
      } else {
        Alert.alert(
          'Connection Failed',
          'Unable to connect to the FTP server. Please check your settings and try again.'
        );
      }
    } catch (error) {
      Alert.alert('Connection Error', `Failed to test connection: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const saveConfig = async () => {
    if (!validateConfig()) return;

    try {
      setLoading(true);
      await FTPService.saveConfig(config);
      Alert.alert(
        'Success',
        'Configuration saved successfully!',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (field: keyof FTPConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const protocols = [
    { value: 'ftp', label: 'FTP', description: 'Standard FTP (not secure)' },
    { value: 'ftps', label: 'FTPS', description: 'FTP over SSL/TLS' },
    { value: 'sftp', label: 'SFTP', description: 'SSH File Transfer Protocol' },
  ];

  const renderProtocolSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Protocol</Text>
      {protocols.map((protocol) => (
        <TouchableOpacity
          key={protocol.value}
          style={[
            styles.protocolOption,
            config.protocol === protocol.value && styles.selectedProtocol
          ]}
          onPress={() => {
            updateConfig('protocol', protocol.value);
            // Update default port based on protocol
            if (protocol.value === 'sftp') {
              updateConfig('port', 22);
            } else if (protocol.value === 'ftps') {
              updateConfig('port', 990);
            } else {
              updateConfig('port', 21);
            }
          }}
        >
          <View style={styles.protocolInfo}>
            <Text style={[
              styles.protocolLabel,
              config.protocol === protocol.value && styles.selectedProtocolText
            ]}>
              {protocol.label}
            </Text>
            <Text style={[
              styles.protocolDescription,
              config.protocol === protocol.value && styles.selectedProtocolText
            ]}>
              {protocol.description}
            </Text>
          </View>
          <Ionicons
            name={config.protocol === protocol.value ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color={config.protocol === protocol.value ? '#007AFF' : '#CCC'}
          />
        </TouchableOpacity>
      ))}
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
          <Text style={styles.headerTitle}>
            {configId ? 'Edit Connection' : 'New Connection'}
          </Text>
          <TouchableOpacity
            style={styles.testButton}
            onPress={testConnection}
            disabled={testing}
          >
            {testing ? (
              <Ionicons name="hourglass" size={20} color="white" />
            ) : (
              <Ionicons name="wifi" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Connection Name</Text>
            <TextInput
              style={styles.textInput}
              value={config.name}
              onChangeText={(text) => updateConfig('name', text)}
              placeholder="My FTP Server"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Host Address</Text>
            <TextInput
              style={styles.textInput}
              value={config.host}
              onChangeText={(text) => updateConfig('host', text)}
              placeholder="ftp.example.com"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Port</Text>
            <TextInput
              style={styles.textInput}
              value={config.port.toString()}
              onChangeText={(text) => updateConfig('port', parseInt(text) || 21)}
              placeholder="21"
              keyboardType="numeric"
            />
          </View>
        </View>

        {renderProtocolSelector()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={config.username}
              onChangeText={(text) => updateConfig('username', text)}
              placeholder="username"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              value={config.password}
              onChangeText={(text) => updateConfig('password', text)}
              placeholder="password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Passive Mode</Text>
              <Text style={styles.settingDescription}>
                Use passive mode for connections through firewalls
              </Text>
            </View>
            <Switch
              value={config.passive}
              onValueChange={(value) => updateConfig('passive', value)}
              trackColor={{ false: '#CCC', true: '#007AFF' }}
              thumbColor={config.passive ? 'white' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Secure Connection</Text>
              <Text style={styles.settingDescription}>
                Enable SSL/TLS encryption (for FTPS)
              </Text>
            </View>
            <Switch
              value={config.secure}
              onValueChange={(value) => updateConfig('secure', value)}
              trackColor={{ false: '#CCC', true: '#007AFF' }}
              thumbColor={config.secure ? 'white' : '#f4f3f4'}
              disabled={config.protocol === 'sftp'} // SFTP is always secure
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Your credentials are stored securely on this device and are only used to connect to your FTP server.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveConfig}
          disabled={loading}
        >
          <LinearGradient
            colors={['#007AFF', '#0056CC']}
            style={styles.saveButtonGradient}
          >
            {loading ? (
              <Ionicons name="hourglass" size={20} color="white" />
            ) : (
              <Ionicons name="checkmark" size={20} color="white" />
            )}
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Configuration'}
            </Text>
          </LinearGradient>
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
  testButton: {
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
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F9FA',
  },
  protocolOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedProtocol: {
    backgroundColor: '#F0F7FF',
    borderColor: '#007AFF',
  },
  protocolInfo: {
    flex: 1,
  },
  protocolLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  protocolDescription: {
    fontSize: 12,
    color: '#666',
  },
  selectedProtocolText: {
    color: '#007AFF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F7FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 100,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 10,
    lineHeight: 20,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  saveButton: {
    width: '100%',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default FTPSettingsScreen;