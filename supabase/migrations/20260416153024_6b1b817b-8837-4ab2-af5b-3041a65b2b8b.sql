-- Remove the unique index on whatsapp since the app already checks duplicates
-- This prevents issues when a deleted user tries to re-register
DROP INDEX IF EXISTS idx_sindicos_unique_whatsapp_active;