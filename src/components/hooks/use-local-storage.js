import { useEffect } from "react";

function useLocalStorage(key, data) {
  useEffect(() => {
    localStorage.removeItem(key);
    const jsonString = JSON.stringify(data);
    localStorage.setItem(key, jsonString);
  }, [key, data]);
}

export default useLocalStorage;
