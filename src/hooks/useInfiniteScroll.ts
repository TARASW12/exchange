import { useState, useCallback, useEffect } from "react";

interface UseInfiniteScrollProps<T> {
  fullData: T[];
  status: "idle" | "loading" | "succeeded" | "failed";
  initialCount: number;
  increment: number;
}

export const useInfiniteScroll = <T>({
  fullData,
  status,
  initialCount,
  increment,
}: UseInfiniteScrollProps<T>) => {
  const [renderedCount, setRenderedCount] = useState(initialCount);

  useEffect(() => {
    setRenderedCount(initialCount);
  }, [fullData, initialCount]);

  const loadMore = useCallback(() => {
    if (status !== "succeeded" || renderedCount >= fullData.length) {
      return;
    }
    setRenderedCount((prevCount: number) =>
      Math.min(prevCount + increment, fullData.length)
    );
  }, [renderedCount, fullData.length, status, increment]);

  const displayedItems = fullData.slice(0, renderedCount);

  return {
    displayedItems,
    loadMore,
    hasMore: status === "succeeded" && renderedCount < fullData.length,
  };
};
