"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { LayoutList, Table, ChartColumn, Copy, CheckSquare, X } from "lucide-react";

import { WidgetConfig, WidgetKind, ApiResponse } from "@/types/types";

export default function AddWidget() {
  const addWidget = useDashboardStore((s) => s.addWidget);

  const [open, setOpen] = useState(false);
  const [widgetName, setWidgetName] = useState("Widget");
  const [copied, setCopied] = useState(false);
  const [symbol, setSymbol] = useState("AAPL");
  const [apiUrl, setApiUrl] = useState("api/finnhub?symbol=AAPL");
  const [refreshInterval, setRefreshInterval] = useState("");
  const [displayMode, setDisplayMode] = useState<WidgetKind>("table");
  const [apiResponse, setApiResponse] = useState<ApiResponse>(null);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    if (!apiUrl) return;
    setLoadingApi(true);
    setApiResponse(null);
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data: ApiResponse = await res.json();
      if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
        throw new Error("Empty data returned");
      }
      setApiResponse(data);
      setAvailableFields(extractFields(data));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setApiResponse(null);
      setAvailableFields([]);
    } finally {
      setLoadingApi(false);
    }
  };

  const extractFields = (data: ApiResponse, prefix = ""): string[] => {
    let fields: string[] = [];
    if (!data || typeof data !== "object") return fields;

    // Handle object (Record<string, unknown>)
    if (!Array.isArray(data)) {
      for (const key in data) {
        const value = (data as Record<string, unknown>)[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof value !== "object" || value === null) {
          fields.push(path);
        } else {
          fields = [...fields, ...extractFields(value as ApiResponse, path)];
        }
      }
    } else {
      // Handle array (unknown[])
      data.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          fields = [...fields, ...extractFields(item as ApiResponse, `${prefix}[${index}]`)];
        }
      });
    }
    return fields;
  };

  const toggleFieldSelection = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
      setRefreshInterval("");
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const selectAllFields = () => {
    setSelectedFields([...availableFields]);
  };

  const handleAddWidget = () => {
    const widget: WidgetConfig = {
      id: nanoid(),
      kind: displayMode,
      title: widgetName,
      apiUrl,
      refreshIntervalSecs: refreshInterval ? Number(refreshInterval) : 0,
      fields: selectedFields,
      position: {
        x: 0, y: 0, w: 6, h: 6,
        minW: 0,
        maxW: 0,
        minH: 0
      },
      symbol, // Add symbol to widget
    };
    addWidget(widget);
    setOpen(false);
  };

  return (
    <>
      {/* Add Widget Button */}
      <div
        className="max-w-2xl h-full  rounded  flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 group py-12"
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

            {/* Symbol */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                placeholder="e.g., AAPL"
              />
            </div>

            {/* API URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">API URL</label>
              
              <div className="relative text-xs my-2 border rounded p-2 bg-gray-50 dark:bg-gray-700">
                /api/alphaVantage?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "/api/alphaVantage?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo"
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000); // reset after 2s
                  }}
                  className="absolute top-1 right-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                >
                  {copied ? <CheckSquare size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="relative text-xs my-2 border rounded p-2 bg-gray-50 dark:bg-gray-700">
                /api/finnhub?symbol=AAPL
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "api/finnhub?symbol=AAPL"
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000); // reset after 2s
                  }}
                  className="absolute top-1 right-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                >
                  {copied ? <CheckSquare size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="flex space-x-2 w-full">
                <div className="flex w-full">

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
              {apiResponse && <div className="text-xs text-primary border-1 bg-green-600 mt-2 border-green-800 rounded p-1">API connection successful!</div>}
              {!apiResponse && apiUrl && !loadingApi && <div className="text-xs text-red-600 mt-1">API connection failed.</div>}
            </div>

            {/* Refresh Interval */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Refresh Interval (seconds)</label>
              <input
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Display Mode */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Mode</label>
              <div className="flex space-x-2">
                {(["card", "table", "chart"] as WidgetKind[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDisplayMode(mode)}
                    className={`px-3 py-1 rounded flex items-center ${displayMode === mode ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                  >
                    {mode === "card" && <LayoutList className="mr-1 h-4 w-4" />}
                    {mode === "table" && <Table className="mr-1 h-4 w-4" />}
                    {mode === "chart" && <ChartColumn className="mr-1 h-4 w-4" />}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Fields */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Fields</label>
              <input
                type="text"
                placeholder="Search for fields..."
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Available Fields */}
            {availableFields.length > 0 && (
              <div className="mb-3 max-h-40 overflow-auto border p-2 rounded bg-gray-50 dark:bg-gray-700">
                <p className="text-sm font-medium mb-1 flex justify-between items-center">
                  Available Fields
                  <button onClick={selectAllFields} className="text-blue-500 flex items-center">
                    <CheckSquare className="h-4 w-4 mr-1" /> All
                  </button>
                </p>
                {availableFields.map((field) => (
                  <div
                    key={field}
                    onClick={() => toggleFieldSelection(field)}
                    className={`flex justify-between items-center mb-1 p-2 rounded cursor-pointer ${selectedFields.includes(field) ? "bg-blue-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    <span>{field.replace("c.", "current_price.").replace("d.", "daily.").replace("t.", "time_series.")}</span>
                    <span>{selectedFields.includes(field) ? <CheckSquare className="h-4 w-4 text-green-500" /> : <CheckSquare className="h-4 w-4 text-gray-400" />}</span>
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
                    <span>{field.replace("c.", "current_price.").replace("d.", "daily.").replace("t.", "time_series.")}</span>
                    <button
                      onClick={() => toggleFieldSelection(field)}
                      className="text-red-500"
                    >
                      <X className="h-4 w-4" />
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
                disabled={!apiResponse || selectedFields.length === 0 || !symbol}
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