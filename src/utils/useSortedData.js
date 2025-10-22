import { useMemo } from 'react';

export default function useSortedData(data, sortConfig) {
  return useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data];

    if (sortConfig.key === 'index') {
      return sortConfig.direction === 'asc' ? sorted : sorted.reverse();
    }

    return sorted.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);
}
