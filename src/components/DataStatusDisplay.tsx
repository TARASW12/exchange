import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface DataStatusDisplayProps {
  status: Status;
  error: string | null;
  dataLength: number; // Кількість елементів для перевірки на порожній стан
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  children: React.ReactNode; // Компонент для відображення, коли є дані
  loadingCondition?: 'always' | 'noData'; // Коли показувати завантаження
  errorCondition?: 'always' | 'noData'; // Коли показувати помилку
}

const DefaultLoadingComponent = () => (
  <View style={[styles.container, styles.centered]}>
    <ActivityIndicator size="large" color="#FF9500" />
    <Text style={styles.infoText}>Loading...</Text>
  </View>
);

const DefaultErrorComponent = ({ error }: { error: string | null }) => (
  <View style={[styles.container, styles.centered]}>
    <Text style={styles.errorText}>Error: {error || 'Unknown error'}</Text>
    <Text style={styles.infoText}>Could not load data.</Text>
  </View>
);

const DefaultEmptyComponent = () => (
  <View style={[styles.container, styles.centered]}>
    <Text style={styles.infoText}>No data available.</Text>
  </View>
);

export const DataStatusDisplay: React.FC<DataStatusDisplayProps> = ({
  status,
  error,
  dataLength,
  loadingComponent = <DefaultLoadingComponent />,
  errorComponent = <DefaultErrorComponent error={error} />,
  emptyComponent = <DefaultEmptyComponent />,
  children,
  loadingCondition = 'noData', // За замовчуванням, показувати завантаження лише якщо немає даних
  errorCondition = 'noData',   // За замовчуванням, показувати помилку лише якщо немає даних
}) => {

  // Умови показу повноекранних станів
  const showLoading = status === 'loading' && (loadingCondition === 'always' || dataLength === 0);
  const showError = status === 'failed' && (errorCondition === 'always' || dataLength === 0);

  if (showLoading) {
    return <>{loadingComponent}</>;
  }

  if (showError) {
    return <>{errorComponent}</>;
  }

  // Показувати порожній стан, якщо завантаження/помилка завершились, а даних немає
  if (status !== 'loading' && status !== 'failed' && dataLength === 0) {
    return <>{emptyComponent}</>;
  }

  // В іншому випадку (є дані, або стан idle/succeeded) показуємо дочірній компонент
  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f0f0f0', // Батьківський компонент має стилізувати фон
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
}); 