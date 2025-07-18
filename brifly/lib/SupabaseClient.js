import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const { SUPABASE_URL, SUPABASE_KEY } = Constants.expoConfig.extra;

console.log("SUPABASE_URL:", SUPABASE_URL);
console.log("SUPABASE_KEY:", SUPABASE_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
