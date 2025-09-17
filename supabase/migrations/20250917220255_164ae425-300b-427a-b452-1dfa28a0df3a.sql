-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contracts table
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Users can view their own clients" 
ON public.clients 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" 
ON public.clients 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" 
ON public.clients 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for contracts table
CREATE POLICY "Users can view contracts of their clients" 
ON public.contracts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.clients 
  WHERE clients.id = contracts.client_id 
  AND clients.user_id = auth.uid()
));

CREATE POLICY "Users can create contracts for their clients" 
ON public.contracts 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.clients 
  WHERE clients.id = contracts.client_id 
  AND clients.user_id = auth.uid()
));

CREATE POLICY "Users can update contracts of their clients" 
ON public.contracts 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.clients 
  WHERE clients.id = contracts.client_id 
  AND clients.user_id = auth.uid()
));

CREATE POLICY "Users can delete contracts of their clients" 
ON public.contracts 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.clients 
  WHERE clients.id = contracts.client_id 
  AND clients.user_id = auth.uid()
));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
BEFORE UPDATE ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for contracts
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false);

-- Create storage policies
CREATE POLICY "Users can upload contracts for their clients" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'contracts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view contracts of their clients" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'contracts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update contracts of their clients" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'contracts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete contracts of their clients" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'contracts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to check expiring contracts
CREATE OR REPLACE FUNCTION public.check_expiring_contracts(days_ahead integer DEFAULT 30)
RETURNS TABLE(client_id uuid, client_name text, contract_count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as client_id,
    c.name as client_name,
    COUNT(co.id) as contract_count
  FROM public.clients c
  INNER JOIN public.contracts co ON c.id = co.client_id
  WHERE co.end_date <= (CURRENT_DATE + (days_ahead || ' days')::interval)
    AND co.end_date >= CURRENT_DATE
    AND c.user_id = auth.uid()
  GROUP BY c.id, c.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;