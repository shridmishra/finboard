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
    const desiredW = 6;
    const desiredH = 4;

    if (widgets.length === 0) return { x: 0, y: 0, w: desiredW, h: desiredH, minW: desiredW, maxW: desiredW };

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

    // Find first horizontal free spot with full rectangle free for height
    let newX = 0;
    let newY = 0;
    let found = false;

    for (let y = 0; !found; y++) {
      for (let x = 0; x <= gridCols - desiredW; x++) {
        let fits = true;
        for (let dy = 0; dy < desiredH; dy++) {
          for (let i = x; i < x + desiredW; i++) {
            if (positions[y + dy]?.[i]) {
              fits = false;
              break;
            }
          }
          if (!fits) break;
        }
        if (fits) {
          newX = x;
          newY = y;
          found = true;
          break;
        }
      }
    }

    // Ensure AddWidget goes beside the last widget
    if (newX < 6 && widgets.length % 2 === 0) newX = 6; // Move to right side if left side is filled
    return { x: newX, y: newY, w: desiredW, h: desiredH, minW: desiredW, maxW: desiredW };
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
          cols={{ lg: 12, md: 12, sm: 6, xs: 1, xxs: 1 }}
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
          compactType="horizontal"
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
                  position: {
                    x: item.x, y: item.y, w: item.w, h: item.h,
                    minH: 0,
                    minW: 0,
                    maxW: 0
                  },
                });
              }
            });
          }}
        >
          {/* Render existing widgets */}
          {widgets.map((widget) => (
            <div
              key={widget.id}
              data-grid={{
                x: widget.position.x,
                y: widget.position.y,
                w: widget.position.w,
                h: widget.position.h,
                minW: widget.position.minW || 6, // Default minW if not specified
                maxW: widget.position.maxW || 12, // Allow full width if needed
                minH: widget.position.minH || 4, // Default minH if not specified
              }}
              className="widget-container bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <WidgetShell
                widget={{
                  ...widget,
                  position: { ...widget.position },
                  symbol: widget.symbol ?? "AAPL",
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
            className="add-widget-container mt-12 mx-auto flex items-center justify-center max-w-lg bg-gray-50/50 dark:bg-gray-800/50  hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded border border-dashed border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <AddWidget />
          </div>

        {/* Empty State */}
        {widgets.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
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