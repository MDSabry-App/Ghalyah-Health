import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <h1 className="text-3xl font-bold text-teal-700">Ghalyah Health</h1>
      <p className="text-gray-500 mt-2">غالية هيلث - متابعة أدوية الأم</p>
      
      <div className="grid grid-cols-1 gap-4 w-full max-w-md mt-8">
        <Link href="/mom" className="bg-teal-600 text-white text-center text-xl py-5 rounded-2xl shadow">
          دخول الأم - الجرعات
        </Link>
        <Link href="/son" className="bg-white border text-center text-xl py-5 rounded-2xl shadow">
          دخول الابن - المتابعة
        </Link>
      </div>
      <p className="text-xs text-gray-400 mt-6">com.ghalyah.health - Africa/Cairo - وجبات 11 / 17 / 22 متغيرة</p>
    </main>
  );
}