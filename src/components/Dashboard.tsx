import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Users, Bot, TrendingUp, Activity, Zap, Brain, Flower } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Conversas Hoje",
      value: "342",
      change: "+12.5%",
      icon: MessageSquare,
      trend: "up"
    },
    {
      title: "Documentos Ativos",
      value: "28",
      change: "+2",
      icon: FileText,
      trend: "up"
    },
    {
      title: "Taxa de Sucesso",
      value: "94.2%",
      change: "+3.1%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Usuários Únicos",
      value: "1,248",
      change: "+8.3%",
      icon: Users,
      trend: "up"
    }
  ];

  const recentActivity = [
    { type: "conversation", message: "Nova conversa iniciada", time: "2 min atrás", user: "João Silva" },
    { type: "document", message: "Documento 'FAQ_Produtos.pdf' processado", time: "5 min atrás", user: "Sistema" },
    { type: "error", message: "Erro na API da OpenAI", time: "12 min atrás", user: "Sistema" },
    { type: "success", message: "Backup da base de conhecimento concluído", time: "1h atrás", user: "Sistema" }
  ];

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            RAG Chatbot
          </h1>
          <p className="text-muted-foreground mt-2">
            Painel de controle do assistente WhatsApp
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Logs
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90 shadow-primary">
            <div className="flex items-center mr-2 relative">
              <Bot className="w-4 h-4" />
              <Flower className="w-2 h-2 text-pink-200 absolute -top-1 -right-1" />
            </div>
            Testar Bot
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <Badge variant="secondary" className="mt-2 bg-success/20 text-success-foreground">
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Performance */}
        <Card className="lg:col-span-2 bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Performance da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Modelo Atual</p>
                  <p className="font-semibold">GPT-4 Turbo</p>
                </div>
                <Badge className="bg-gradient-success">Ativo</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Relevância das respostas</span>
                  <span className="text-sm font-semibold">94%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tempo de resposta médio</span>
                  <span className="text-sm font-semibold">2.3s</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-gradient-success h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Utilização de contexto</span>
                  <span className="text-sm font-semibold">78%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-gradient-hero h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-success' :
                    activity.type === 'error' ? 'bg-destructive' :
                    activity.type === 'document' ? 'bg-warning' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;