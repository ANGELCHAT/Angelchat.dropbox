import { useState, useEffect } from "react";

export const useStateWithLocalStorage = (key, defaultValue = "") => {
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
    // the key won't change, so we don't / shouldn't
    // put it in the deps
    // eslint-disable-next-line
  }, [value]);

  return [value, setValue];
};
