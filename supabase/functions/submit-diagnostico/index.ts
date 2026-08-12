import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'https://esm.sh/zod@3'

// Perfis válidos definidos pelo servidor — o cliente não pode inventar rótulos.
const PERFIS_VALIDOS = [
  'executivo',
  'financeiro',
  'operacional',
  'tecnico',
  'mediador',
  'implantador',
] as const

const BodySchema = z.object({
  nome: z.string().min(2).max(200),
  whatsapp: z.string().min(10).max(30),
  email: z.string().email().max(200).optional().nullable(),
  condominio: z.string().min(1).max(200),
  cidade: z.string().max(100).optional().nullable(),
  regiao: z.string().max(100).optional().nullable(),
  respostas: z.record(z.any()).refine(
    (r) => Object.keys(r).length <= 40 && JSON.stringify(r).length <= 20000,
    'respostas payload too large',
  ),
  perfil_recomendado: z.enum(PERFIS_VALIDOS).optional().nullable(),
  perfis_secundarios: z.array(z.enum(PERFIS_VALIDOS)).max(5).default([]),
  sindicos_sugeridos: z
    .array(
      z.object({
        id: z.string().uuid(),
        slug: z.string().max(200),
        nome: z.string().max(200),
        nivel: z.enum(['alta', 'media', 'baixa']),
        motivos: z.array(z.string().max(300)).max(6).default([]),
      }),
    )
    .max(12)
    .default([]),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const { data, error } = await supabase
    .from('diagnosticos')
    .insert({
      nome: parsed.data.nome,
      whatsapp: parsed.data.whatsapp,
      email: parsed.data.email,
      condominio: parsed.data.condominio,
      cidade: parsed.data.cidade,
      regiao: parsed.data.regiao,
      respostas: parsed.data.respostas,
      perfil_recomendado: parsed.data.perfil_recomendado,
      perfis_secundarios: parsed.data.perfis_secundarios,
      sindicos_sugeridos: parsed.data.sindicos_sugeridos,
      status: 'novo', // campo administrativo definido apenas pelo servidor
    })
    .select('id')
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true, id: data.id }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
