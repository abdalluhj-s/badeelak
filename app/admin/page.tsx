'use client';

import { useState, useEffect } from 'react';
import { 
  loginAdmin, 
  checkAdminAuth, 
  getAdminMedicines, 
  updateMedicinePrice, 
  deleteMedicine,
  addMedicine,
  getAdminPharmacies,
  addPharmacy,
  deletePharmacy,
  logoutAdmin
} from './actions';
import { ShieldAlert, LogOut, Plus, Trash2, Edit2, Check, Pill, Store } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'medicines' | 'pharmacies'>('medicines');
  
  // Data States
  const [medicines, setMedicines] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  
  // Load data
  const loadData = async () => {
    if (activeTab === 'medicines') {
      const data = await getAdminMedicines();
      setMedicines(data || []);
    } else {
      const data = await getAdminPharmacies();
      setPharmacies(data || []);
    }
  };

  useEffect(() => {
    checkAdminAuth().then(auth => {
      setIsAuthenticated(auth);
      if (auth) loadData();
    });
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginAdmin(password);
    if (res.success) {
      setIsAuthenticated(true);
      loadData();
    } else {
      setLoginError(res.error || 'خطأ في تسجيل الدخول');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900"></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col items-center mb-6">
            <ShieldAlert className="w-12 h-12 text-emerald-600 dark:text-emerald-500 mb-2" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">لوحة الإدارة</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">قم بتسجيل الدخول للوصول للوحة التحكم</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="كلمة المرور..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                autoFocus
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors">
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 transition-colors">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">لوحة الإدارة | بديلك</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('medicines')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'medicines' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Pill className="w-4 h-4" /> الأدوية والأسعار
          </button>
          <button 
            onClick={() => setActiveTab('pharmacies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'pharmacies' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Store className="w-4 h-4" /> الصيدليات المتعاقدة
          </button>
        </div>

        {activeTab === 'medicines' ? <MedicinesTab medicines={medicines} reload={loadData} /> : <PharmaciesTab pharmacies={pharmacies} reload={loadData} />}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Medicines Tab Component
// -------------------------------------------------------------
function MedicinesTab({ medicines, reload }: { medicines: any[], reload: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');

  const handleUpdatePrice = async (id: string) => {
    await updateMedicinePrice(id, parseFloat(editPrice));
    setEditingId(null);
    reload();
  };

  const handleDelete = async (id: string) => {
    if(confirm('هل أنت متأكد من الحذف؟')) {
      await deleteMedicine(id);
      reload();
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addMedicine(formData);
    (e.target as HTMLFormElement).reset();
    reload();
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
        <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-500" /> إضافة دواء جديد
        </h2>
        <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input required name="trade_name_ar" placeholder="الاسم بالعربي" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
          <input name="trade_name_en" placeholder="الاسم بالإنجليزي" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
          <input required name="concentration" placeholder="التركيز (مثال: 500mg)" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
          <input required name="price" type="number" step="0.5" placeholder="السعر" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition-colors">إضافة</button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 text-sm">
              <tr>
                <th className="p-4 font-medium">اسم الدواء</th>
                <th className="p-4 font-medium">التركيز</th>
                <th className="p-4 font-medium">السعر</th>
                <th className="p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {medicines.map(med => (
                <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{med.trade_name_ar}</div>
                    <div className="text-xs text-slate-500">{med.trade_name_en}</div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{med.concentration}</td>
                  <td className="p-4">
                    {editingId === med.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          step="0.5"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          className="w-20 px-2 py-1 border rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                        />
                        <button onClick={() => handleUpdatePrice(med.id)} className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 p-1 rounded"><Check className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{med.price} ج.م</span>
                    )}
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <button 
                      onClick={() => { setEditingId(med.id); setEditPrice(med.price.toString()); }}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(med.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {medicines.length === 0 && <div className="p-8 text-center text-slate-500">لا توجد أدوية لعرضها</div>}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Pharmacies Tab Component
// -------------------------------------------------------------
function PharmaciesTab({ pharmacies, reload }: { pharmacies: any[], reload: () => void }) {
  const handleDelete = async (id: string) => {
    if(confirm('هل أنت متأكد من الحذف؟')) {
      await deletePharmacy(id);
      reload();
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addPharmacy(formData);
    (e.target as HTMLFormElement).reset();
    reload();
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
        <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-500" /> إضافة صيدلية متعاقدة
        </h2>
        <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input required name="name" placeholder="اسم الصيدلية" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
          <input required name="address" placeholder="العنوان (المنطقة)" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
          <input name="phone" placeholder="رقم التواصل" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
          <input name="commission_rate" type="number" step="0.1" placeholder="العمولة (%)" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
          <input name="profit_margin" type="number" step="0.1" placeholder="هامش الربح (%)" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
          <button type="submit" className="lg:col-span-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition-colors">حفظ الصيدلية</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pharmacies.map(pharmacy => (
          <div key={pharmacy.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-start transition-colors">
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">{pharmacy.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{pharmacy.address}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {pharmacy.phone && (
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 w-fit px-2 py-1 rounded">
                    {pharmacy.phone}
                  </div>
                )}
                {pharmacy.commission_rate > 0 && (
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 w-fit px-2 py-1 rounded">
                    العمولة: {pharmacy.commission_rate}%
                  </div>
                )}
                {pharmacy.profit_margin > 0 && (
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 w-fit px-2 py-1 rounded">
                    هامش الربح: {pharmacy.profit_margin}%
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => handleDelete(pharmacy.id)}
              className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {pharmacies.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            لم يتم إضافة صيدليات متعاقدة بعد
          </div>
        )}
      </div>
    </div>
  );
}
