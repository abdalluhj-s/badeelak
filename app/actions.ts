'use server';

import { supabase } from '@/lib/supabase';

export async function searchMedicines(query: string) {
  if (!query || query.length < 2) return [];

  const { data, error } = await supabase
    .from('medicines')
    .select(`
      id,
      trade_name_ar,
      trade_name_en,
      concentration,
      price,
      company,
      ingredient_id,
      active_ingredients (
        name,
        usage
      )
    `)
    .or(`trade_name_ar.ilike.%${query}%,trade_name_en.ilike.%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error fetching medicines:', error);
    return [];
  }

  return data;
}

export async function getAlternatives(ingredientId: string, concentration: string, currentMedicineId: string) {
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      id,
      trade_name_ar,
      trade_name_en,
      concentration,
      price,
      company,
      is_local
    `)
    .eq('ingredient_id', ingredientId)
    .eq('concentration', concentration)
    .neq('id', currentMedicineId)
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching alternatives:', error);
    return [];
  }

  return data;
}

export async function submitShortageRequest(formData: FormData) {
  const medicine_name = formData.get('medicine_name') as string;
  const phone_number = formData.get('phone_number') as string;
  const city = formData.get('city') as string;

  if (!medicine_name || !phone_number) {
    return { success: false, error: 'الرجاء إدخال اسم الدواء ورقم الهاتف' };
  }

  const { error } = await supabase
    .from('shortage_requests')
    .insert([{ medicine_name, phone_number, city }]);

  if (error) {
    console.error('Error inserting shortage request:', error);
    return { success: false, error: 'حدث خطأ أثناء إرسال الطلب' };
  }

  return { success: true };
}
