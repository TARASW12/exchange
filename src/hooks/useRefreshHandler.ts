import { useState, useCallback } from 'react';
import { Action, ThunkAction } from '@reduxjs/toolkit'; // Import necessary types
import { useAppDispatch, useAppSelector, RootState } from '../store/store';

// Типізуємо аргументи хука
interface UseRefreshHandlerProps {
  onRefreshAction: () => ThunkAction<Promise<any>, RootState, any, Action>; // Функція, що повертає ThunkAction
  timestampSelector: (state: RootState) => number | null; // Селектор для отримання timestamp
  throttleDurationMs: number; // Тривалість обмеження в мс
}

export const useRefreshHandler = ({
  onRefreshAction,
  timestampSelector,
  throttleDurationMs,
}: UseRefreshHandlerProps) => {
  const dispatch = useAppDispatch();
  const timestamp = useAppSelector(timestampSelector);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    const now = Date.now();
    const lastFetchTime = timestamp || 0; // timestamp може бути null, беремо 0

    // Перевірка обмеження частоти
    if (lastFetchTime && (now - lastFetchTime) < throttleDurationMs) {
      console.log('Refresh throttled.');
      // Не потрібно встановлювати isRefreshing(false) тут, 
      // бо ми його ще не встановили в true
      return; 
    }

    setIsRefreshing(true);
    try {
      // Тепер просто викликаємо функцію, що повертає ThunkAction
      await dispatch(onRefreshAction()); 
      // Якщо потрібно отримати результат/помилку, можна зробити це після dispatch, 
      // але для pull-to-refresh зазвичай достатньо обробки стану в слайсі.
    } catch (refreshError) {
      // Обробка помилки (опціонально, оскільки слайс обробляє стан)
      console.error("Refresh action failed:", refreshError);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, timestamp, throttleDurationMs, onRefreshAction]);

  return {
    isRefreshing,
    handleRefresh,
  };
}; 