-- Create table for chat sessions/courses
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'New Chat',
  emoji TEXT NOT NULL DEFAULT '💬',
  color TEXT NOT NULL DEFAULT 'from-indigo-500/20 to-purple-500/20',
  message_count INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for chat messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for now)
CREATE POLICY "Anyone can view chat sessions" 
ON public.chat_sessions FOR SELECT USING (true);

CREATE POLICY "Anyone can create chat sessions" 
ON public.chat_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update chat sessions" 
ON public.chat_sessions FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete chat sessions" 
ON public.chat_sessions FOR DELETE USING (true);

CREATE POLICY "Anyone can view chat messages" 
ON public.chat_messages FOR SELECT USING (true);

CREATE POLICY "Anyone can create chat messages" 
ON public.chat_messages FOR INSERT WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_sessions_last_message ON public.chat_sessions(last_message_at DESC);

-- Create function to update session stats
CREATE OR REPLACE FUNCTION public.update_session_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_sessions
  SET 
    message_count = message_count + 1,
    last_message_at = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-update session stats
CREATE TRIGGER on_message_insert
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_session_on_message();