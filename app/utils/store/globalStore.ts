import { create } from "zustand";

export interface IGlobalStore {
  versionApp: number;
  setVersionApp: (val: number) => void;
}

const useGlobalStore = create<IGlobalStore>((set) => ({
  versionApp: 2,
  setVersionApp: (val) =>
    set(() => ({
      versionApp: val,
    })),
}));

export default useGlobalStore;
