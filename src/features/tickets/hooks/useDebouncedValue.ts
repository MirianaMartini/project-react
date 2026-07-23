/** Il hook restituisce il valore solo dopo una pausa della durata richiesta. */
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timerId);
  }, [delay, value]);

  return debouncedValue;
}