// cdimport React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Button} from 'react-native';
import AppNavigator from './src/components/BottomTabNavigator';
import { testConnection } from './src/services';
import { useEffect, useState } from 'react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        // Chỉ giả lập thời gian tải, bỏ qua kiểm tra kết nối
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error: any) {
        console.error('Lỗi khởi động ứng dụng:', error);
        setErrorMessage(error.message || 'Lỗi không xác định');
        setHasError(false); // Chuyển thành false để vẫn hiển thị app
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  const retryConnection = () => {
    setIsLoading(true);
    setHasError(false);
    // Giả lập thời gian tải
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Đang tải ứng dụng...</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Có lỗi xảy ra khi tải ứng dụng</Text>
        <Text style={styles.subText}>
          {errorMessage || 'Vui lòng kiểm tra kết nối và thử lại'}
        </Text>
        <Button title="Thử lại" onPress={retryConnection} />
      </View>
    );
  }

  // Luôn hiển thị ứng dụng ngay cả khi có lỗi
  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
});
