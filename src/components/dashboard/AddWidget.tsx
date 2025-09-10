"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { useState, useRef, useEffect } from "react";

export default function AddWidget() {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleAdd = (kind: "chart" | "table" | "card") => {
    addWidget(kind);
    setOpen(false);
  };

  const widgetTypes = [
    {
      type: "chart",
      label: "Chart",
      icon: "📊",
      description: "Data visualization",
      color: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
    },
    {
      type: "table",
      label: "Table", 
      icon: "📋",
      description: "Tabular data",
      color: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
    },
    {
      type: "card",
      label: "Card",
      icon: "🃏",
      description: "Info card",
      color: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
    }
  ];

  return (
    <div 
      ref={dropdownRef}
      className="relative w-full h-full"
    >
      {/* Add Widget Button */}
      <div
        className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 group py-12"
        onClick={() => setOpen(!open)}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200/80 dark:bg-gray-700/80 flex items-center justify-center group-hover:bg-gray-300/80 dark:group-hover:bg-gray-600/80 transition-colors duration-200">
            <span className="text-2xl text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
              ＋
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Add Widget
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Click to add new widget
          </p>
        </div>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          <div className="p-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Choose Widget Type
            </h4>
            <div className="space-y-2">
              {widgetTypes.map((widget) => (
                <button
                  key={widget.type}
                  className={`w-full ${widget.color} text-white rounded-lg p-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md`}
                  onClick={() => handleAdd(widget.type as "chart" | "table" | "card")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">
                      {widget.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-sm">
                        {widget.label}
                      </div>
                      <div className="text-xs opacity-90">
                        {widget.description}
                      </div>
                    </div>
                    <div className="text-white/70">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2">
            <button
              className="w-full text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}