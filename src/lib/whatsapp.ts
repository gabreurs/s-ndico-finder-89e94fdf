// All WhatsApp CTAs across the app route to Rafael Bernardes.
// The original sindico contato_whatsapp is preserved in the database
// (admin/profile editing) but not exposed publicly via clickable links.
export const RAFAEL_WHATSAPP_PHONE = "5511960841033";

/** Link curto oficial (botão flutuante e contato geral). */
export const WHATSAPP_LINK_OFICIAL = "https://wa.me/message/GZ5YOZ3EGOA2F1";

export const buildRafaelWhatsAppUrl = (message?: string) => {
  const base = `https://api.whatsapp.com/send/?phone=${RAFAEL_WHATSAPP_PHONE}&type=phone_number&app_absent=0`;
  return message ? `${base}&text=${encodeURIComponent(message)}` : base;
};
