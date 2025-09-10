import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  Key, 
  Bot, 
  Zap, 
  Shield, 
  MessageSquare,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    openaiApiKey: "sk-***************************",
    whatsappToken: "EAAf***************************",
    model: "gpt-4-turbo",
    temperature: "0.7",
    maxTokens: "4000",
    systemPrompt: "Você é um assistente virtual especializado em atendimento ao cliente. Seja sempre educado, profissional e útil. Use as informações da base de conhecimento para responder perguntas de forma precisa.",
    welcomeMessage: "Olá! 👋 Eu sou seu assistente virtual. Como posso ajudá-lo hoje?",
    enableAnalytics: true,
    enableLogging: true,
    enableFallback: true
  });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure o comportamento e integrações do seu chatbot
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-gradient-primary hover:opacity-90 shadow-primary">
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Configuration */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Configuração de APIs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="openai-key">API Key OpenAI</Label>
              <div className="relative">
                <Input
                  id="openai-key"
                  type={showApiKey ? "text" : "password"}
                  value={settings.openaiApiKey}
                  onChange={(e) => setSettings({...settings, openaiApiKey: e.target.value})}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp-token">Token WhatsApp Business</Label>
              <Input
                id="whatsapp-token"
                type="password"
                value={settings.whatsappToken}
                onChange={(e) => setSettings({...settings, whatsappToken: e.target.value})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm font-medium">Conexão Ativa</span>
              </div>
              <Badge className="bg-success/20 text-success">Conectado</Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Configuração da IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Select value={settings.model} onValueChange={(value) => setSettings({...settings, model: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperatura: {settings.temperature}</Label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings({...settings, temperature: e.target.value})}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservativo</span>
                <span>Criativo</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-tokens">Máximo de Tokens</Label>
              <Input
                id="max-tokens"
                value={settings.maxTokens}
                onChange={(e) => setSettings({...settings, maxTokens: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Personality Configuration */}
        <Card className="bg-card border-border shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Personalidade do Chatbot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="system-prompt">Prompt do Sistema</Label>
              <Textarea
                id="system-prompt"
                rows={6}
                value={settings.systemPrompt}
                onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
                placeholder="Defina como o chatbot deve se comportar..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-message">Mensagem de Boas-vindas</Label>
              <Input
                id="welcome-message"
                value={settings.welcomeMessage}
                onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})}
                placeholder="Primeira mensagem que o usuário recebe"
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card className="bg-card border-border shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Configurações Avançadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20">
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-muted-foreground">Coletar métricas de uso</p>
                </div>
                <Switch
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => setSettings({...settings, enableAnalytics: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20">
                <div>
                  <p className="font-medium">Logging</p>
                  <p className="text-sm text-muted-foreground">Registrar conversas</p>
                </div>
                <Switch
                  checked={settings.enableLogging}
                  onCheckedChange={(checked) => setSettings({...settings, enableLogging: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20">
                <div>
                  <p className="font-medium">Fallback</p>
                  <p className="text-sm text-muted-foreground">Resposta padrão para erros</p>
                </div>
                <Switch
                  checked={settings.enableFallback}
                  onCheckedChange={(checked) => setSettings({...settings, enableFallback: checked})}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;