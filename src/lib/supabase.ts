import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ddopekrratkjytkqcqho.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cpmrpSzH6rVfkvOYhoJBlg_hM6FL9Zi';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
