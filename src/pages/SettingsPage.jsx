
    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { Mail, Bell, Save, Settings as SettingsIconLucide, Trash2, AlertTriangle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const SettingsPage = () => {
      const { toast } = useToast();
      const [emailRecipients, setEmailRecipients] = useState('');
      const [enableEmailNotifications, setEnableEmailNotifications] = useState(false);
      const [enableWhatsAppNotifications, setEnableWhatsAppNotifications] = useState(false);
      const [whatsAppNumber, setWhatsAppNumber] = useState('');
      
      useEffect(() => {
        const storedSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
        setEmailRecipients(storedSettings.emailRecipients || '');
        setEnableEmailNotifications(storedSettings.enableEmailNotifications || false);
        setEnableWhatsAppNotifications(storedSettings.enableWhatsAppNotifications || false);
        setWhatsAppNumber(storedSettings.whatsAppNumber || '');
      }, []);

      const handleSaveSettings = () => {
        const emails = emailRecipients.split(',').map(e => e.trim()).filter(e => e);
        const invalidEmails = emails.filter(e => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

        if (enableEmailNotifications && emails.length === 0) {
          toast({ title: "Configuração Incompleta", description: "Adicione ao menos um e-mail para ativar notificações.", variant: "destructive" });
          return;
        }
        if (invalidEmails.length > 0) {
          toast({ title: "E-mails Inválidos", description: `Os seguintes e-mails parecem inválidos: ${invalidEmails.join(', ')}`, variant: "destructive" });
          return;
        }
        if (enableWhatsAppNotifications && !/^\+[1-9]\d{1,14}$/.test(whatsAppNumber)) { // Basic E.164 format check
            toast({ title: "Número Inválido", description: "Informe um número de WhatsApp válido com código do país (ex: +5511999999999).", variant: "destructive" });
            return;
        }

        const settings = { emailRecipients, enableEmailNotifications, enableWhatsAppNotifications, whatsAppNumber };
        localStorage.setItem('appSettings', JSON.stringify(settings));
        toast({ title: "Configurações Salvas", description: "Suas preferências de notificação foram atualizadas.", variant: "default" });
      };
      
      const handleClearSettings = () => {
        localStorage.removeItem('appSettings');
        setEmailRecipients('');
        setEnableEmailNotifications(false);
        setEnableWhatsAppNotifications(false);
        setWhatsAppNumber('');
        toast({ title: "Configurações Limpas", description: "Todas as preferências foram restauradas para o padrão.", variant: "default" });
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-border">
            <CardHeader className="p-6 border-b border-border">
              <CardTitle className="text-2xl font-semibold text-foreground flex items-center"><SettingsIconLucide className="mr-3 h-7 w-7 text-primary" /> Ajustes</CardTitle>
              <CardDescription className="text-muted-foreground text-base mt-1">
                Configure as preferências de notificação para os relatórios de comparação.
                <br />
                <span className="text-xs text-muted-foreground/80 flex items-center mt-1">
                  <AlertTriangle size={14} className="mr-1 text-amber-600" />
                  O envio de e-mail e WhatsApp não está funcional nesta demonstração.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <motion.div className="space-y-3 p-5 border border-input rounded-md bg-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="text-lg font-medium text-foreground flex items-center"><Mail className="mr-2 h-5 w-5 text-secondary" />Notificações por E-mail</h3>
                <div className="flex items-center space-x-2.5">
                  <Switch 
                    id="email-notifications" 
                    checked={enableEmailNotifications} 
                    onCheckedChange={setEnableEmailNotifications}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor="email-notifications" className="text-sm text-muted-foreground cursor-pointer">Ativar notificações por e-mail</Label>
                </div>
                {enableEmailNotifications && (
                  <div className="space-y-1.5 pt-1">
                    <Label htmlFor="email-recipients" className="text-sm text-foreground">E-mails (separados por vírgula)</Label>
                    <Input 
                      id="email-recipients" 
                      type="text" 
                      placeholder="exemplo@dominio.com, outro@dominio.com" 
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      className="bg-input border-input focus:ring-primary text-foreground placeholder:text-muted-foreground/70"
                    />
                  </div>
                )}
              </motion.div>

              <motion.div className="space-y-3 p-5 border border-input rounded-md bg-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-lg font-medium text-foreground flex items-center"><Bell className="mr-2 h-5 w-5 text-accent" />Notificações por WhatsApp</h3>
                 <div className="flex items-center space-x-2.5">
                  <Switch 
                    id="whatsapp-notifications" 
                    checked={enableWhatsAppNotifications} 
                    onCheckedChange={setEnableWhatsAppNotifications}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor="whatsapp-notifications" className="text-sm text-muted-foreground cursor-pointer">Ativar notificações por WhatsApp</Label>
                </div>
                {enableWhatsAppNotifications && (
                  <div className="space-y-1.5 pt-1">
                    <Label htmlFor="whatsapp-number" className="text-sm text-foreground">Número WhatsApp (com cód. país)</Label>
                    <Input 
                      id="whatsapp-number" 
                      type="tel" 
                      placeholder="+5511912345678" 
                      value={whatsAppNumber}
                      onChange={(e) => setWhatsAppNumber(e.target.value)}
                      className="bg-input border-input focus:ring-primary text-foreground placeholder:text-muted-foreground/70"
                    />
                  </div>
                )}
              </motion.div>
            </CardContent>
            <CardFooter className="p-6 flex justify-between border-t border-border">
              <Button onClick={handleClearSettings} variant="outline" className="text-destructive border-destructive/70 hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Limpar Ajustes
              </Button>
              <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm">
                <Save className="mr-2 h-4 w-4" /> Salvar Ajustes
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default SettingsPage;
  