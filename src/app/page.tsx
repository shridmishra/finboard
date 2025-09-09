import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold p-4">FinBoard Dashboard</h1>
      <Dashboard />
    </main>
  );
}
