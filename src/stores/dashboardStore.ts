import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WidgetConfig } from '../types/widget';
import { nanoid } from 'nanoid';

type State = {
  widgets: WidgetConfig[];
  addWidget: (kind: WidgetConfig['kind']) => void;
  removeWidget: (id: string) => void;
};

export const useDashboardStore = create<State>()(
  persist(
    (set) => ({
      widgets: [],
      addWidget: (kind) => {
        const newWidget: WidgetConfig = {
          id: nanoid(),
          kind,
          title: `${kind} widget`,
          position: { x: 0, y: 0, w: 4, h: 6 },
          refreshIntervalSecs: 30,
        };
        set((s) => ({ widgets: [...s.widgets, newWidget] }));
      },
      removeWidget: (id) =>
        set((s) => ({ widgets: s.widgets.filter((w) => w.id !== id) })),
    }),
    { name: 'finboard-dashboard' }
  )
);
