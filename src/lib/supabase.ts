import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ddopekrratkjytkqcqho.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cpmrpSzH6rVfkvOYhoJBlg_hM6FL9Zi';
const PRODUCTION_SITE_URL = 'https://quero1sindico.com';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

export const getMeuPerfilRedirectUrl = () => {
  if (typeof window === 'undefined') {
    return `${PRODUCTION_SITE_URL}/meu-perfil`;
  }

  const hostname = window.location.hostname.toLowerCase();
  const origin = LOCAL_HOSTS.has(hostname) ? PRODUCTION_SITE_URL : window.location.origin;

  return `${origin}/meu-perfil`;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
