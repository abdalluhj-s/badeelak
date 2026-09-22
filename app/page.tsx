'use client';

import { useState } from 'react';
import { Search, Pill, BadgeCheck, AlertTriangle, CheckCircle2, Factory } from 'lucide-react';
import { searchMedicines, getAlternatives, submitShortageRequest } from './actions';
import { ThemeToggle } from './components/ThemeToggle';
import Link from 'next/link';

type Medicine = {
  id: string;
  trade_name_ar: string;
  trade_name_en: string;
  concentration: string;
  price: number;
  company: string;
  is_local: boolean;
  ingredient_id?: string;
  active_ingredients?: {
    name: string;
    usage: string;
  };
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [alternatives, setAlternatives] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      const results = await searchMedicines(value);
      setSearchResults(results as any[]);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectMedicine = async (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setSearchResults([]);
    setQuery('');
    setLoading(true);
    
    if (medicine.ingredient_id) {
      const alts = await getAlternatives(medicine.ingredient_id, medicine.concentration, medicine.id);
      setAlternatives(alts);
    }
    setLoading(false);
  };

  const handleShortageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await submitShortageRequest(formData);
    
    if (result.success) {
      setFormStatus({ type: 'success', message: 'تم تسجيل طلبك بنجاح. سنعلمك فور توفر الدواء.' });
      (e.target as HTMLFormElement).reset();
    } else {
      setFormStatus({ type: 'error', message: result.error || 'حدث خطأ ما' });
    }
  };

  return (
    <main className="min-h-screen pb-20 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <header className="bg-emerald-600 dark:bg-emerald-800 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-8 h-8" />
            <h1 className="text-2xl font-bold">بديلك</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm opacity-90 hidden sm:block">وفر فلوسك.. ابحث عن بدائل الأدوية</p>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8 relative transition-colors">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">ابحث عن دواء</h2>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="اكتب اسم الدواء بالعربي أو بالإنجليزي..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          </div>

          {/* Quick Tags */}
          {!query && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">شائع:</span>
              {['أنتينال', 'بنادول', 'كاتافلام', 'أوجمنتين'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch({ target: { value: tag } } as any)}
                  className="bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-sm px-3 py-1 rounded-full transition-colors font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Search Results Dropdown */}
          {query.length > 1 && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-40 max-h-80 overflow-y-auto">
              {searchResults.map((med) => (
                <button
                  key={med.id}
                  onClick={() => handleSelectMedicine(med)}
                  className="w-full text-right px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-50 dark:border-slate-700 last:border-0 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100">{med.trade_name_ar}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{med.trade_name_en} • {med.concentration}</div>
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">{med.price} ج.م</div>
                </button>
              ))}
            </div>
          )}

          {/* Empty Search Results */}
          {query.length > 1 && searchResults.length === 0 && !loading && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-amber-100 dark:border-amber-900/50 p-6 z-40 text-center animate-in fade-in transition-colors">
              <AlertTriangle className="w-12 h-12 text-amber-400 dark:text-amber-500 mx-auto mb-3" />
              <p className="text-slate-800 dark:text-slate-200 font-bold mb-2">هذا الدواء غير مسجل في نسختنا التجريبية بعد</p>
              <button 
                onClick={() => {
                  setQuery('');
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium underline text-sm transition-colors"
              >
                اضغط هنا لطلب إضافته أو البحث عن بديله
              </button>
            </div>
          )}
        </div>

        {/* Selected Medicine & Alternatives */}
        {selectedMedicine && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Selected Medicine Card */}
            <div className="bg-slate-800 dark:bg-slate-950 text-white rounded-2xl p-6 shadow-lg transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{selectedMedicine.trade_name_ar}</h3>
                  <p className="text-slate-300 dark:text-slate-400">{selectedMedicine.trade_name_en}</p>
                </div>
                <div className="text-2xl font-bold bg-white/10 dark:bg-white/5 px-4 py-2 rounded-lg">
                  {selectedMedicine.price} ج.م
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700 dark:border-slate-800">
                <p className="text-sm text-slate-300 dark:text-slate-500 mb-1">المادة الفعالة:</p>
                <p className="font-medium text-emerald-400 dark:text-emerald-500">{selectedMedicine.active_ingredients?.name} - {selectedMedicine.concentration}</p>
              </div>
            </div>

            {/* Alternatives List */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <BadgeCheck className="text-emerald-500 dark:text-emerald-400" />
                البدائل المتاحة ({alternatives.length})
              </h3>
              
              {loading ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">جاري البحث عن بدائل...</div>
              ) : alternatives.length > 0 ? (
                <div className="grid gap-4">
                  {alternatives.map((alt) => {
                    const savings = selectedMedicine.price - alt.price;
                    const savingsPercent = Math.round((savings / selectedMedicine.price) * 100);
                    const isCheaper = savings > 0;

                    return (
                      <div key={alt.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
                        <div>
                          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{alt.trade_name_ar}</h4>
                          <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{alt.trade_name_en}</div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 w-fit px-3 py-1 rounded-full">
                            <Factory className="w-4 h-4" />
                            {alt.company} {alt.is_local && '(محلي)'}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{alt.price} ج.م</div>
                          {isCheaper && (
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 w-full justify-center sm:justify-end">
                              <CheckCircle2 className="w-4 h-4" />
                              يوفر لك {savings.toFixed(2)} ج.م ({savingsPercent}%)
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
                  لا توجد بدائل مسجلة بنفس المادة الفعالة والتركيز.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shortage Request Form */}
        <div className="mt-12 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">لم تجد دواءك في الصيدليات؟</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">سجل طلب نقص وسنرسل لك إشعاراً فور توفره في أقرب صيدلية لك.</p>
          
          <form onSubmit={handleShortageSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">اسم الدواء</label>
                <input required type="text" name="medicine_name" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف</label>
                <input required type="tel" name="phone_number" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">المدينة / المنطقة</label>
                <input type="text" name="city" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors" />
              </div>
            </div>
            
            {formStatus && (
              <div className={`p-4 rounded-xl text-sm ${formStatus.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'}`}>
                {formStatus.message}
              </div>
            )}
            
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              تسجيل الطلب
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-400 py-3 text-xs text-center px-4 z-50 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <p>تنبيه: هذه المنصة للعرض فقط ويجب مراجعة الطبيب.</p>
        </div>
        <Link href="/admin" className="text-slate-500 hover:text-slate-300 underline">لوحة الإدارة</Link>
      </footer>
    </main>
  );
}
