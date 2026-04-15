import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Get all sindicos with old site URLs
  const { data: sindicos, error } = await supabase
    .from("sindicos")
    .select("id, foto_url")
    .like("foto_url", "%queroumsindico.com.br%");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results = { success: 0, failed: 0, errors: [] as string[], total: sindicos?.length || 0 };

  for (const sindico of sindicos || []) {
    // Take only first URL (some have pipe-separated URLs)
    const firstUrl = sindico.foto_url.split("|")[0].trim();
    if (!firstUrl.includes("queroumsindico.com.br")) continue;

    // Determine extension
    const extMatch = firstUrl.match(/\.(jpe?g|png|webp|gif)/i);
    const ext = extMatch ? extMatch[0].toLowerCase() : ".jpg";
    const storagePath = `profiles/${sindico.id}${ext}`;

    try {
      // Download from old site
      const response = await fetch(firstUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      if (!response.ok) {
        results.errors.push(`${sindico.id}: HTTP ${response.status}`);
        results.failed++;
        continue;
      }

      const blob = await response.blob();
      if (blob.size < 1000) {
        results.errors.push(`${sindico.id}: too small (${blob.size}b)`);
        results.failed++;
        continue;
      }

      // Determine content type
      let contentType = "image/jpeg";
      if (ext === ".png") contentType = "image/png";
      else if (ext === ".webp") contentType = "image/webp";
      else if (ext === ".gif") contentType = "image/gif";

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("sindicos")
        .upload(storagePath, blob, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        results.errors.push(`${sindico.id}: upload error - ${uploadError.message}`);
        results.failed++;
        continue;
      }

      // Build new public URL
      const newUrl = `${supabaseUrl}/storage/v1/object/public/sindicos/${storagePath}`;

      // Update DB
      const { error: updateError } = await supabase
        .from("sindicos")
        .update({ foto_url: newUrl })
        .eq("id", sindico.id);

      if (updateError) {
        results.errors.push(`${sindico.id}: db update error - ${updateError.message}`);
        results.failed++;
        continue;
      }

      results.success++;
    } catch (e) {
      results.errors.push(`${sindico.id}: ${e.message}`);
      results.failed++;
    }
  }

  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
