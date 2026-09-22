'use server';

import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function loginAdmin(password: string) {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'true', { 
      secure: process.env.NODE_ENV === 'production', 
      httpOnly: true, 
      maxAge: 60 * 60 * 24 
    });
    return { success: true };
  }
  return { success: false, error: 'كلمة المرور غير صحيحة' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
}

export async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('admin_auth')?.value === 'true';
  } catch (error) {
    console.error('Error in checkAdminAuth:', error);
    return false;
  }
}

// Medicines Admin Actions
export async function getAdminMedicines() {
  const { data, error } = await supabase.from('medicines').select('*, active_ingredients(name)').order('trade_name_ar', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function addMedicine(formData: FormData) {
  const trade_name_ar = formData.get('trade_name_ar') as string;
  const trade_name_en = formData.get('trade_name_en') as string;
  const concentration = formData.get('concentration') as string;
  const price = parseFloat(formData.get('price') as string);
  const company = formData.get('company') as string;

  const { error } = await supabase.from('medicines').insert([{
    trade_name_ar, trade_name_en, concentration, price, company
  }]);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateMedicinePrice(id: string, price: number) {
  const { error } = await supabase.from('medicines').update({ price }).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteMedicine(id: string) {
  const { error } = await supabase.from('medicines').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Pharmacies Admin Actions
export async function getAdminPharmacies() {
  const { data, error } = await supabase.from('pharmacies').select('*').order('name', { ascending: true });
  if (error) {
    console.log(error); // Might fail if table not created yet
    return [];
  }
  return data;
}

export async function addPharmacy(formData: FormData) {
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const phone = formData.get('phone') as string;
  const commission_rate = parseFloat(formData.get('commission_rate') as string) || 0;
  const profit_margin = parseFloat(formData.get('profit_margin') as string) || 0;

  const { error } = await supabase.from('pharmacies').insert([{ name, address, phone, commission_rate, profit_margin }]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deletePharmacy(id: string) {
  const { error } = await supabase.from('pharmacies').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
