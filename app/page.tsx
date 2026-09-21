'use client';

import { useState } from 'react';
import { Search, Pill, BadgeCheck, AlertTriangle, CheckCircle2, Factory } from 'lucide-react';
import { searchMedicines, getAlternatives, submitShortageRequest } from './actions';

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
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-8 h-8" />
            <h1 className="text-2xl font-bold">بديلك</h1>
          </div>
          <p className="text-sm opacity-90 hidden sm:block">وفر فلوسك.. ابحث عن بدائل الأدوية</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 relative">
          <h2 className="text-xl font-bold text-slate-800 mb-4">ابحث عن دواء</h2>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="اكتب اسم الدواء بالعربي أو بالإنجليزي..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-40 max-h-80 overflow-y-auto">
              {searchResults.map((med) => (
                <button
                  key={med.id}
                  onClick={() => handleSelectMedicine(med)}
                  className="w-full text-right px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-800">{med.trade_name_ar}</div>
                    <div className="text-sm text-slate-500">{med.trade_name_en} • {med.concentration}</div>
                  </div>
                  <div className="text-emerald-600 font-bold">{med.price} ج.م</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Medicine & Alternatives */}
        {selectedMedicine && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Selected Medicine Card */}
            <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{selectedMedicine.trade_name_ar}</h3>
                  <p className="text-slate-300">{selectedMedicine.trade_name_en}</p>
                </div>
                <div className="text-2xl font-bold bg-white/10 px-4 py-2 rounded-lg">
                  {selectedMedicine.price} ج.م
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-300 mb-1">المادة الفعالة:</p>
                <p className="font-medium text-emerald-400">{selectedMedicine.active_ingredients?.name} - {selectedMedicine.concentration}</p>
              </div>
            </div>

            {/* Alternatives List */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BadgeCheck className="text-emerald-500" />
                البدائل المتاحة ({alternatives.length})
              </h3>
              
              {loading ? (
                <div className="text-center py-8 text-slate-500">جاري البحث عن بدائل...</div>
              ) : alternatives.length > 0 ? (
                <div className="grid gap-4">
                  {alternatives.map((alt) => {
                    const savings = selectedMedicine.price - alt.price;
                    const savingsPercent = Math.round((savings / selectedMedicine.price) * 100);
                    const isCheaper = savings > 0;

                    return (
                      <div key={alt.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h4 className="font-bold text-lg text-slate-800">{alt.trade_name_ar}</h4>
                          <div className="text-sm text-slate-500 mb-2">{alt.trade_name_en}</div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 w-fit px-3 py-1 rounded-full">
                            <Factory className="w-4 h-4" />
                            {alt.company} {alt.is_local && '(محلي)'}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                          <div className="text-xl font-bold text-slate-800">{alt.price} ج.م</div>
                          {isCheaper && (
                            <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 w-full justify-center sm:justify-end">
                              <CheckCircle2 className="w-4 h-4" />
                              يوفر لك {savings} ج.م ({savingsPercent}%)
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 text-slate-500">
                  لا توجد بدائل مسجلة بنفس المادة الفعالة والتركيز.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shortage Request Form */}
        <div className="mt-12 bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">لم تجد دواءك في الصيدليات؟</h3>
          <p className="text-slate-600 mb-6 text-sm">سجل طلب نقص وسنرسل لك إشعاراً فور توفره في أقرب صيدلية لك.</p>
          
          <form onSubmit={handleShortageSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">اسم الدواء</label>
                <input required type="text" name="medicine_name" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">رقم الهاتف</label>
                <input required type="tel" name="phone_number" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">المدينة / المنطقة</label>
                <input type="text" name="city" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
            </div>
            
            {formStatus && (
              <div className={`p-4 rounded-xl text-sm ${formStatus.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {formStatus.message}
              </div>
            )}
            
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              تسجيل الطلب
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-400 py-3 text-xs text-center px-4 z-50">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <p>تنبيه: هذه المنصة لعرض البدائل المتطابقة كيميائياً فقط، ويجب مراجعة الطبيب أو الصيدلي قبل تناول أي دواء.</p>
        </div>
      </footer>
    </main>
  );
}
