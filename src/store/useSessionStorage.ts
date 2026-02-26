import { useState, useEffect } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            window.dispatchEvent(new CustomEvent('session-storage', { detail: { key, value: valueToStore } }));
        } catch (error) {
            console.warn(`Error setting sessionStorage key "${key}":`, error);
        }
    };

    useEffect(() => {
        const handleStorageChange = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail.key === key) {
                setStoredValue(customEvent.detail.value);
            }
        };
        window.addEventListener('session-storage', handleStorageChange);
        return () => window.removeEventListener('session-storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue] as const;
}
