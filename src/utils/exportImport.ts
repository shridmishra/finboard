export function exportDashboard(widgets: unknown[]) {
  const blob = new Blob([JSON.stringify({ widgets }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "finboard.json";
  a.click();
}

export async function importDashboard(file: File) {
  const text = await file.text();
  return JSON.parse(text);
}
