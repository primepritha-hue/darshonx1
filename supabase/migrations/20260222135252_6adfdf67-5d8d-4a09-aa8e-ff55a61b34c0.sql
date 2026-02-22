
-- Drop the overly permissive policy
DROP POLICY "Service role can manage chat_usage" ON public.chat_usage;

-- Only allow reading own usage (by visitor_id match via RPC), all writes go through service role
CREATE POLICY "Deny all direct access to chat_usage"
  ON public.chat_usage
  FOR SELECT
  USING (false);
