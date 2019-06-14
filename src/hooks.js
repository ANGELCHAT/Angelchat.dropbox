import { useState, useEffect } from "react";

export const useStateWithLocalStorage = (key, defaultValue = "") => {
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
