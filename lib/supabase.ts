
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://guznnrsyuuypehqnkjwh.supabase.co';
const supabaseKey = 'sb_publishable_f97hAnwZwKN_XOWvHCWxRQ_aPEjCnHQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
