import { useState, useCallback, useEffect } from 'react';

interface UseInfiniteScrollProps<T> {
  fullData: T[]; // Повний масив даних
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Статус завантаження даних
  initialCount: number; // Початкова кількість
  increment: number; // Крок додавання
}

export const useInfiniteScroll = <T>({ 
  fullData, 
  status,
  initialCount, 
  increment 
}: UseInfiniteScrollProps<T>) => {
  
  const [renderedCount, setRenderedCount] = useState(initialCount);

  // Скидаємо count, якщо повний масив даних змінився
  useEffect(() => {
    setRenderedCount(initialCount);
  }, [fullData, initialCount]);

  // Функція для "довантаження" (збільшення кількості видимих)
  const loadMore = useCallback(() => {
    // Не збільшувати, якщо статус не 'succeeded' або вже всі елементи відображені
    if (status !== 'succeeded' || renderedCount >= fullData.length) {
      return;
    }
    setRenderedCount((prevCount: number) => 
      Math.min(prevCount + increment, fullData.length)
    );
  }, [renderedCount, fullData.length, status, increment]);

  // Повертаємо підмножину даних та функцію довантаження
  const displayedItems = fullData.slice(0, renderedCount);

  return {
    displayedItems,
    loadMore,
    hasMore: status === 'succeeded' && renderedCount < fullData.length, // Прапорець, чи є ще елементи для довантаження
  };
}; 