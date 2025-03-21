import { useCallback, useSyncExternalStore } from "react";

type SetValue = (value: ((prevState: Value) => Value) | Value) => void;

type Value = string | undefined;

export const useLocalStorage = (key: string): [Value, SetValue] => {
  const getSnapshot = useCallback(() => {
    return window.localStorage.getItem(key) ?? undefined;
  }, [key]);

  const value = useSyncExternalStore(subscribe, getSnapshot);

  const setLocalStorage: SetValue = useCallback(
    (value) => {
      const newValue =
        typeof value === "function"
          ? value(window.localStorage.getItem(key) ?? undefined)
          : value;

      if (newValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, newValue);
      }

      window.dispatchEvent(new Event("storage"));
    },
    [key],
  );

  return [value, setLocalStorage];
};

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
};
