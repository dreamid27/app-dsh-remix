import { differenceInDays } from "date-fns";

const useEventLocalStorage = () => {
  const addEvent = (key: string) => {
    localStorage.setItem(key, new Date().toJSON());
  };

  const getEvent = (key: string) => {
    return localStorage.getItem(key);
  };

  const validEvent = (key: string, days: number) => {
    const lastEvent = getEvent(key); // 2024-02-01
    if (!lastEvent) return false;

    const diffDays = differenceInDays(
      new Date(),
      new Date(lastEvent as string)
    );

    return diffDays < days;
  };

  return {
    get: getEvent,
    add: addEvent,
    valid: validEvent,
  };
};

export default useEventLocalStorage;
