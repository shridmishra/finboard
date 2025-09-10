"use client";

import { Responsive, WidthProvider } from "react-grid-layout";
import { useDashboardStore } from "@/stores/dashboardStore";
import WidgetShell from "./WidgetShell";
import AddWidget from "./AddWidget";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useMemo } from "react";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const widgets = useDashboardStore((s) => s.widgets);
  const updateWidget = useDashboardStore((s) => s.updateWidget);

  // Calculate the next AddWidget position beside existing widgets
  const addWidgetPosition = useMemo(() => {
    if (widgets.length === 0) return { x: 0, y: 0, w: 4, h: 4, minW: 3, maxW: 6 };

    const gridCols = 12;
    const positions: boolean[][] = [];

    widgets.forEach((widget) => {
      for (let i = widget.position.x; i < widget.position.x + widget.position.w; i++) {
        for (let j = widget.position.y; j < widget.position.y + widget.position.h; j++) {
          if (!positions[j]) positions[j] = [];
          positions[j][i] = true; // mark as occupied
        }
      }
    });

    // Find first horizontal free spot
    let newX = 0;
    let newY = 0;
    let found = false;

    for (let y = 0; !found; y++) {
      for (let x = 0; x <= gridCols - 4; x++) {
        let fits = true;
        for (let i = x; i < x + 4; i++) {
          if (positions[y]?.[i]) {
            fits = false;
            break;
          }
        }
        if (fits) {
          newX = x;
          newY = y;
          found = true;
          break;
        }
      }
    }

    return { x: newX, y: newY, w: 4, h: 4, minW: 3, maxW: 6 };
  }, [widgets]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <div className="mx-auto max-w-[1400px] px-4 py-8 w-full">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your widgets and data visualization
          </p>
        </div>

        {/* Responsive Grid */}
        <ResponsiveGridLayout
          className="layout"
          breakpoints={{ lg: 1400, md: 1200, sm: 992, xs: 768, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          margin={[20, 20]}
          containerPadding={[0, 0]}
          draggableHandle=".drag-handle"
          draggableCancel=".non-draggable"
          isResizable
          isDraggable
          autoSize
          useCSSTransforms
          preventCollision={false}
          compactType="vertical"
          onLayoutChange={(layout) => {
            layout.forEach((item) => {
              if (item.i === "add-widget") return;
              const widget = widgets.find((w) => w.id === item.i);
              if (
                widget &&
                (widget.position.x !== item.x ||
                  widget.position.y !== item.y ||
                  widget.position.w !== item.w ||
                  widget.position.h !== item.h)
              ) {
                updateWidget(item.i, {
                  position: { x: item.x, y: item.y, w: item.w, h: item.h },
                });
              }
            });
          }}
        >
          {/* Render existing widgets */}
          {widgets.map((widget) => (
            <div
              key={widget.id}
              data-grid={{ ...widget.position, minW: 3, maxW: 6 }}
              className="widget-container bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <WidgetShell
                widget={{
                  ...widget,
                  position: { ...widget.position },
                  symbol: widget.symbol ?? "AAPL", // fallback
                }}
              />

            </div>
          ))}


        </ResponsiveGridLayout>

        {/* Add Widget Button */}
        <div
          key="add-widget"
          data-grid={{
            ...addWidgetPosition,
            static: true,
            isDraggable: false,
            isResizable: false,
          }}
          className="add-widget-container flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded border border-dashed border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 max-w-xl my-8 "
        >
          <AddWidget />
        </div>
        {/* Empty State */}
        {widgets.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-600 mb-4 ">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No widgets yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start building your dashboard by adding your first widget
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
