import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Upload, Download, Calendar, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ContractUpload from "./ContractUpload";

interface Client {
  id: string;
  name: string;
  phone: string;
}

interface Contract {
  id: string;
  file_name: string;
  file_path: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface ClientContractsProps {
  clientId: string;
  onBack: () => void;
}

const ClientContracts = ({ clientId, onBack }: ClientContractsProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchClientAndContracts = async () => {
    if (!user) return;

    try {
      // Fetch client data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .eq('user_id', user.id)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);

      // Fetch contracts
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;
      setContracts(contractsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientAndContracts();
  }, [clientId, user]);

  const handleDownload = async (contract: Contract) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('contracts')
        .download(contract.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = contract.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar o arquivo.",
        variant: "destructive",
      });
    }
  };

  const handleContractUploaded = () => {
    fetchClientAndContracts();
    setShowUpload(false);
  };

  const isExpiring = (endDate: string) => {
    const today = new Date();
    const contractEnd = new Date(endDate);
    const diffTime = contractEnd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isExpired = (endDate: string) => {
    const today = new Date();
    const contractEnd = new Date(endDate);
    return contractEnd < today;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (showUpload) {
    return (
      <ContractUpload
        clientId={clientId}
        clientName={client?.name || ""}
        onClose={() => setShowUpload(false)}
        onContractUploaded={handleContractUploaded}
      />
    );
  }

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Contratos
            </h1>
            <p className="text-muted-foreground mt-2">
              {client ? `Cliente: ${client.name}` : "Carregando..."}
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setShowUpload(true)}
          className="bg-gradient-primary hover:opacity-90 shadow-primary"
        >
          <Upload className="w-4 h-4 mr-2" />
          Anexar Contrato
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Contratos
            </CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{contracts.length}</div>
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
              {contracts.filter(c => isExpiring(c.end_date)).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vencidos
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {contracts.filter(c => isExpired(c.end_date)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">Carregando contratos...</div>
            </CardContent>
          </Card>
        ) : contracts.length === 0 ? (
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground mb-4">
                Nenhum contrato encontrado para este cliente.
              </div>
              <Button 
                onClick={() => setShowUpload(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Anexar Primeiro Contrato
              </Button>
            </CardContent>
          </Card>
        ) : (
          contracts.map((contract) => (
            <Card key={contract.id} className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{contract.file_name}</h3>
                        {isExpired(contract.end_date) && (
                          <Badge variant="destructive">Vencido</Badge>
                        )}
                        {isExpiring(contract.end_date) && !isExpired(contract.end_date) && (
                          <Badge variant="destructive" className="bg-warning/20 text-warning-foreground">
                            Vencendo
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(contract)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientContracts;