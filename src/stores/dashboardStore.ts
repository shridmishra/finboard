import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WidgetConfig } from "../types/widget";
import { nanoid } from "nanoid";

type State = {
  widgets: WidgetConfig[];
  addWidget: (config: WidgetConfig) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, patch: Partial<WidgetConfig>) => void;
};

export const useDashboardStore = create<State>()(
  persist(
    (set) => ({
      widgets: [],

      addWidget: (config) => {
        set((s) => ({ widgets: [...s.widgets, config] }));
      },

      removeWidget: (id) =>
        set((s) => ({ widgets: s.widgets.filter((w) => w.id !== id) })),

      updateWidget: (id, patch) =>
        set((s) => ({
          widgets: s.widgets.map((w) =>
            w.id === id ? { ...w, ...patch } : w
          ),
        })),
    }),
    {
      name: "finboard-dashboard",
    }
  )
);