export default function MomPage(){
  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center text-teal-700">Ghalyah Health - Mom</h1>
      <div className="bg-white rounded-2xl shadow p-6 mt-6 text-center">
        <p className="text-gray-500">الجرعة القادمة</p>
        <p className="text-3xl font-bold mt-2">أموكسيسيلين - قرص واحد</p>
        <p className="text-xl mt-1">قبل الفطار بنص ساعة - 10:30 ص</p>
        <p className="text-sm text-gray-400 mt-2">المخزون: 19 قرص - يكفي 9 أيام</p>
        <div className="grid grid-cols-1 gap-3 mt-6">
          <button className="bg-teal-600 text-white text-xl py-4 rounded-xl">✓ تم أخذ الجرعة</button>
          <button className="bg-amber-100 text-amber-800 text-xl py-4 rounded-xl">تأجيل 10 دقائق</button>
          <button className="bg-white border text-xl py-4 rounded-xl">لم آخذ الجرعة</button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 mt-4">
        <p className="font-bold">إعدادات الوجبات المتغيرة</p>
        <p className="text-sm text-gray-500">الفطار 11:00 - الغدا 17:00 - العشا 22:00 (قابل للتعديل يومياً)</p>
      </div>
    </main>
  )
}