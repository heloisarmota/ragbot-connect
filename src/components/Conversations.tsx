import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  MessageSquare, 
  Phone, 
  Filter,
  Download,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const Conversations = () => {
  const conversations = [
    {
      id: 1,
      user: {
        name: "João Silva",
        phone: "+55 11 99999-9999",
        avatar: "JS"
      },
      lastMessage: "Preciso de ajuda com meu pedido #12345",
      timestamp: "2 min atrás",
      status: "active",
      messageCount: 8,
      resolved: false
    },
    {
      id: 2,
      user: {
        name: "Maria Santos",
        phone: "+55 11 88888-8888",
        avatar: "MS"
      },
      lastMessage: "Obrigada pela ajuda! Problema resolvido.",
      timestamp: "15 min atrás",
      status: "resolved",
      messageCount: 12,
      resolved: true
    },
    {
      id: 3,
      user: {
        name: "Pedro Costa",
        phone: "+55 11 77777-7777",
        avatar: "PC"
      },
      lastMessage: "Qual o horário de funcionamento?",
      timestamp: "1h atrás",
      status: "waiting",
      messageCount: 3,
      resolved: false
    },
    {
      id: 4,
      user: {
        name: "Ana Oliveira",
        phone: "+55 11 66666-6666",
        avatar: "AO"
      },
      lastMessage: "Como posso cancelar minha assinatura?",
      timestamp: "3h atrás",
      status: "escalated",
      messageCount: 15,
      resolved: false
    }
  ];

  const recentMessages = [
    {
      id: 1,
      conversationId: 1,
      sender: "user",
      message: "Preciso de ajuda com meu pedido #12345",
      timestamp: "14:35"
    },
    {
      id: 2,
      conversationId: 1,
      sender: "bot",
      message: "Claro! Vou verificar seu pedido. Por favor, aguarde um momento enquanto busco as informações.",
      timestamp: "14:35"
    },
    {
      id: 3,
      conversationId: 1,
      sender: "bot",
      message: "Encontrei seu pedido! Ele foi enviado hoje às 09:30 e deve chegar em até 2 dias úteis. Você gostaria de mais detalhes sobre o rastreamento?",
      timestamp: "14:36"
    },
    {
      id: 4,
      conversationId: 1,
      sender: "user",
      message: "Sim, por favor. Preciso do código de rastreamento.",
      timestamp: "14:37"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-success rounded-full animate-pulse" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'waiting':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'escalated':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <div className="w-2 h-2 bg-muted rounded-full" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success">Ativo</Badge>;
      case 'resolved':
        return <Badge className="bg-success/20 text-success">Resolvido</Badge>;
      case 'waiting':
        return <Badge className="bg-warning/20 text-warning">Aguardando</Badge>;
      case 'escalated':
        return <Badge className="bg-destructive/20 text-destructive">Escalado</Badge>;
      default:
        return <Badge variant="secondary">Inativo</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            Conversas
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitore e gerencie as conversas do seu chatbot
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversations List */}
        <Card className="lg:col-span-1 bg-card border-border shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Conversas Recentes</CardTitle>
              <Badge variant="secondary">342 hoje</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar conversas..."
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="p-4 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {conversation.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground truncate">{conversation.user.name}</h4>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(conversation.status)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {conversation.user.phone}
                      </p>
                      <p className="text-sm text-muted-foreground truncate mt-2">{conversation.lastMessage}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(conversation.status)}
                          <Badge variant="outline" className="text-xs">
                            {conversation.messageCount} msgs
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat View */}
        <Card className="lg:col-span-2 bg-card border-border shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">João Silva</h3>
                  <p className="text-sm text-muted-foreground">+55 11 99999-9999</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success/20 text-success">Ativo</Badge>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 h-96 overflow-y-auto">
              {recentMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite uma mensagem..."
                  className="flex-1"
                />
                <Button className="bg-gradient-primary hover:opacity-90">
                  Enviar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Conversations;