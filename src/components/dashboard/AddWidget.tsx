"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";

export default function AddWidget() {
  const addWidget = useDashboardStore((s) => s.addWidget);

  const [open, setOpen] = useState(false);
  const [widgetName, setWidgetName] = useState("Stock Chart");
  const [apiUrl, setApiUrl] = useState("api/finnhub?symbol=AAPL");
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [displayMode, setDisplayMode] = useState("chart");
  const [apiResponse, setApiResponse] = useState<unknown>(null);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loadingApi, setLoadingApi] = useState(false);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const testApi = async () => {
    if (!apiUrl) return alert("Please enter API URL");
    setLoadingApi(true);
    setApiResponse(null);
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data = await res.json();
      if (!data || Object.keys(data).length === 0) throw new Error("Empty data returned");
      setApiResponse(data);
      setAvailableFields(extractFields(data));
      alert("API connection successful! Fields extracted.");
    } catch (err: any) {
      alert(`API connection failed: ${err.message}`);
      setApiResponse(null);
      setAvailableFields([]);
    } finally {
      setLoadingApi(false);
    }
  };

  const extractFields = (data: any, prefix = ""): string[] => {
    let fields: string[] = [];
    for (const key in data) {
      const value = data[key];
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof value !== "object" || value === null) {
        fields.push(path);
      } else {
        fields = [...fields, ...extractFields(value, path)];
      }
    }
    return fields;
  };

  const toggleFieldSelection = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleAddWidget = () => {
    const widget = {
      id: nanoid(),
      kind: displayMode,
      title: widgetName,
      apiUrl,
      refreshIntervalSecs: refreshInterval,
      fields: selectedFields,
      position: { x: 0, y: 0, w: 6, h: 6 },
    };
    addWidget(widget);
    setOpen(false);
  };

  return (
    <>
      {/* Add Widget Button */}
      <div
        className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 group py-12 "
        onClick={() => setOpen(true)}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200/80 dark:bg-gray-700/80 flex items-center justify-center group-hover:bg-gray-300/80 dark:group-hover:bg-gray-600/80 transition-colors duration-200">
            <span className="text-2xl text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">＋</span>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Widget</h3>
          <p className="text-xs text-gray-500 dark:text-gray-500">Click to add new widget</p>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur Background */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)}></div>

          {/* Modal Content */}
          <div ref={dropdownRef} className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-auto p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Widget</h4>

            {/* Widget Name */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Widget Name</label>
              <input
                type="text"
                value={widgetName}
                onChange={(e) => setWidgetName(e.target.value)}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* API URL */}
            <div className="mb-3"> 
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">API URL</label>
              <div className="flex space-x-2 w-full">
                <div className="flex ">
                   <div className="bg-gray-500 text-secondary rounded-l flex items-center justify-center p-1">https://</div>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="flex-1 p-2 border rounded-r bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"

                />
                </div>
               
                <button
                  onClick={testApi}
                  className={`px-3 rounded ${loadingApi ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white`}
                  disabled={loadingApi}
                >
                  {loadingApi ? "Testing..." : "Test"}
                </button>
              </div>
              {apiResponse && <p className="text-xs text-green-600 mt-1">API connection successful!</p>}
            </div>

            {/* Refresh Interval */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Refresh Interval (seconds)</label>
              <input
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Display Mode */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Mode</label>
              <div className="flex space-x-2">
                {["card", "table", "chart"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDisplayMode(mode)}
                    className={`px-3 py-1 rounded ${displayMode === mode ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Fields */}
            {availableFields.length > 0 && (
              <div className="mb-3 max-h-40 overflow-auto border p-2 rounded bg-gray-50 dark:bg-gray-700">
                <p className="text-sm font-medium mb-1">Select Fields</p>
                {availableFields.map((field) => (
                  <div key={field} className="flex justify-between items-center mb-1">
                    <span>{field}</span>
                    <button
                      onClick={() => toggleFieldSelection(field)}
                      className="text-green-500"
                    >
                      {selectedFields.includes(field) ? "✓" : "+"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Fields */}
            {selectedFields.length > 0 && (
              <div className="mb-3 max-h-32 overflow-auto border p-2 rounded bg-gray-50 dark:bg-gray-700">
                <p className="text-sm font-medium mb-1">Selected Fields</p>
                {selectedFields.map((field) => (
                  <div key={field} className="flex justify-between items-center mb-1">
                    <span>{field}</span>
                    <button
                      onClick={() => toggleFieldSelection(field)}
                      className="text-red-500"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWidget}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={!apiResponse || selectedFields.length === 0}
              >
                Add Widget
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
