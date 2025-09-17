import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, MessageCircle, FileText, Search, Users, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ClientForm from "./ClientForm";
import ClientContracts from "./ClientContracts";

interface Client {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  hasExpiringContracts?: boolean;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchClients = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check for expiring contracts
      const clientsWithAlerts = await Promise.all(
        (data || []).map(async (client) => {
          const { data: expiringContracts } = await supabase
            .rpc('check_expiring_contracts', { days_ahead: 30 });
          
          const hasExpiring = expiringContracts?.some(
            (contract) => contract.client_id === client.id
          );

          return {
            ...client,
            hasExpiringContracts: hasExpiring
          };
        })
      );

      setClients(clientsWithAlerts);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleWhatsAppClick = (phone: string) => {
    const formattedPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${formattedPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleClientAdded = () => {
    fetchClients();
    setShowClientForm(false);
  };

  if (selectedClient) {
    return (
      <ClientContracts 
        clientId={selectedClient} 
        onBack={() => setSelectedClient(null)}
      />
    );
  }

  if (showClientForm) {
    return (
      <ClientForm 
        onClose={() => setShowClientForm(false)}
        onClientAdded={handleClientAdded}
      />
    );
  }

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Clientes
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus clientes e contratos
          </p>
        </div>
        <Button 
          onClick={() => setShowClientForm(true)}
          className="bg-gradient-primary hover:opacity-90 shadow-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Clientes
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{clients.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contratos Ativos
            </CardTitle>
            <FileText className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">--</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vencendo em 30 dias
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {clients.filter(c => c.hasExpiringContracts).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-card border-border shadow-card">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar clientes por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">Carregando clientes...</div>
            </CardContent>
          </Card>
        ) : filteredClients.length === 0 ? (
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground">
                {searchTerm ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{client.name}</h3>
                          {client.hasExpiringContracts && (
                            <Badge variant="destructive" className="bg-warning/20 text-warning-foreground">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Vencendo
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{client.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWhatsAppClick(client.phone)}
                      className="bg-green-600/10 border-green-600/20 text-green-400 hover:bg-green-600/20"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedClient(client.id)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Contratos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Clients;