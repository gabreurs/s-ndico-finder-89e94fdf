import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const BodySchema = z.object({
  nome_completo: z.string().min(3).max(200),
  contato_whatsapp: z.string().min(10).max(30),
  email: z.string().email().max(200),
  nome_empresa: z.string().max(200).optional().nullable(),
  ano_inicio_profissao: z.number().int().min(1950).max(2100).optional().nullable(),
  site_redes_sociais: z.string().max(300).optional().nullable(),
  breve_resumo: z.string().max(6000).optional().nullable(),
  bio_data: z.record(z.any()).optional().nullable(),
  link_youtube: z.string().max(300).optional().nullable(),
  regioes: z.array(z.string().max(100)).max(30).default([]),
  especialidades: z.array(z.string().max(100)).max(30).default([]),
  cidade: z.array(z.string().max(100)).max(30).default([]),
  aceita_divulgacao_materiais: z.boolean().default(false),
  autoriza_divulgacao_clientes: z.boolean().default(false),
  foto_url: z.string().url().max(1000),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const json = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const d = parsed.data
  const digits = d.contato_whatsapp.replace(/\D/g, '')

  // Evita duplicidade por WhatsApp ou e-mail em cadastros ativos
  const { data: existing, error: existingError } = await supabase
    .from('sindicos')
    .select('id, status')
    .or(
      `contato_whatsapp.eq.${d.contato_whatsapp},contato_whatsapp.eq.${digits},email.eq.${d.email}`,
    )
    .in('status', ['pending', 'approved'])

  if (existingError) return json({ error: existingError.message }, 500)
  if (existing && existing.length > 0) {
    return json(
      {
        error: 'duplicate',
        message: existing.some((e) => e.status === 'pending')
          ? 'Você já possui um cadastro pendente de aprovação.'
          : 'Você já possui um perfil aprovado na plataforma.',
      },
      409,
    )
  }

  const { data, error } = await supabase
    .from('sindicos')
    .insert({
      nome_completo: d.nome_completo,
      contato_whatsapp: d.contato_whatsapp,
      email: d.email,
      nome_empresa: d.nome_empresa ?? null,
      ano_inicio_profissao: d.ano_inicio_profissao ?? null,
      site_redes_sociais: d.site_redes_sociais ?? null,
      breve_resumo: d.breve_resumo ?? null,
      bio_data: d.bio_data ?? null,
      link_youtube: d.link_youtube ?? null,
      regioes: d.regioes,
      especialidades: d.especialidades,
      cidade: d.cidade,
      aceita_divulgacao_materiais: d.aceita_divulgacao_materiais,
      autoriza_divulgacao_clientes: d.autoriza_divulgacao_clientes,
      foto_url: d.foto_url,
      status: 'pending',
    })
    .select('id, slug')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ success: true, id: data.id, slug: data.slug })
})
