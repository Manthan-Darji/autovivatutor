-- Remove old permissive policies that are still lingering
DROP POLICY IF EXISTS "Anyone can create chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can view chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can delete chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can update chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can view chat sessions" ON public.chat_sessions;