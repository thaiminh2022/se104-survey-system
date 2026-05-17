import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ToolbarStore = {
  activeSectionId: string | null;
  activeQuestionId: string | null;

  setActiveSectionId: (id: string | null) => void;
  setActiveQuestionId: (id: string | null) => void;
};
export const useToolbarStore = create<ToolbarStore>()(
  immer((set) => ({
    activeSectionId: null,
    activeQuestionId: null,
    setActiveSectionId: (id) =>
      set((s) => {
        if (id != s.activeSectionId) {
          s.activeSectionId = id;
          s.activeQuestionId = null;
        }
      }),

    setActiveQuestionId: (id) =>
      set((s) => {
        s.activeQuestionId = id;
        // console.log(s.activeQuestionId);
      }),
  })),
);
