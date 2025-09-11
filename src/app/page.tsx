
import Dashboard from "@/components/dashboard/Dashboard";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold p-4 flex lg:mx-16 border-b-2">FinBoard<ThemeToggle/></h1>
      
      
      <Dashboard />
      
    
    </main>
  );
}
