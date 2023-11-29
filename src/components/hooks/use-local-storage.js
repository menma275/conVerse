import { useEffect } from "react";

function useLocalStorage(key, data) {
  useEffect(() => {
    const jsonString = JSON.stringify(data);
    localStorage.setItem(key, jsonString);
    console.log("localStorage", key, data);
  }, [key, data]); // data（この場合は allCards）の変更を監視
}
export default useLocalStorage;
