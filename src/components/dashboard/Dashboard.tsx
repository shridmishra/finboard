"use client";
import RGL, { WidthProvider } from "react-grid-layout";
import { useDashboardStore } from "@/stores/dashboardStore";
import WidgetShell from "./WidgetShell";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import AddWidget from "./AddWidget";

const ReactGridLayout = WidthProvider(RGL);

export default function Dashboard() {
  const widgets = useDashboardStore((s) => s.widgets);
  const updateWidget = useDashboardStore((s) => s.updateWidget);

  return (
    <div className="p-4">
      <ReactGridLayout
        cols={12}
        rowHeight={30}
        width={1200}
        draggableHandle=".drag-handle"   // ✅ only header is draggable
        draggableCancel=".non-draggable" // optional safeguard
        onLayoutChange={(layout) => {
          layout.forEach((item) => {
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

        {widgets.map((w) => (
          <div key={w.id} data-grid={w.position}>
            <WidgetShell widget={w} />
          </div>
        ))}
      </ReactGridLayout>

      <div
        key="add-widget"
        data-grid={{ x: 0, y: Infinity, w: 4, h: 4, static: true }}
      >
        <AddWidget />
      </div>
    </div>
  );
}
