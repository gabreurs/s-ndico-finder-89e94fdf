import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-file-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const json = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const contentType = (req.headers.get('x-file-type') || '').toLowerCase()
  const ext = ALLOWED[contentType]
  if (!ext) return json({ error: 'Formato inválido. Use JPG, PNG ou WebP.' }, 400)

  const bytes = new Uint8Array(await req.arrayBuffer())
  if (bytes.byteLength === 0) return json({ error: 'Arquivo vazio.' }, 400)
  if (bytes.byteLength > MAX_SIZE) return json({ error: 'Arquivo muito grande. Máximo 5MB.' }, 400)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const filePath = `profiles/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('sindicos').upload(filePath, bytes, {
    contentType,
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    console.error('upload failed:', error.message)
    return json({ error: 'Não foi possível enviar a imagem.' }, 500)
  }

  const { data } = supabase.storage.from('sindicos').getPublicUrl(filePath)
  return json({ success: true, url: data.publicUrl })
})
