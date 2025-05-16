
    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Download, Trash2, Info, History as HistoryIcon, AlertCircle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { exportResultsToExcel, loadHistoryFromStorage, clearHistoryFromStorage, deleteHistoryEntryFromStorage } from '@/lib/localStorageHelper';

    const HistoryPage = () => {
      const [history, setHistory] = useState([]);
      const { toast } = useToast();

      useEffect(() => {
        setHistory(loadHistoryFromStorage());
      }, []);

      const formatDate = (isoString) => {
        if (!isoString) return 'Data inválida';
        const date = new Date(isoString);
        return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      };

      const handleDownloadReport = (reportData, date) => {
        if (!reportData || reportData.length === 0) {
          toast({ title: "Relatório Vazio", description: "Não há dados para exportar neste registro.", variant: "destructive" });
          return;
        }
        exportResultsToExcel(reportData, toast);
      };
      
      const handleClearHistory = () => {
        clearHistoryFromStorage();
        setHistory([]);
        toast({ title: "Histórico Limpo", description: "Todos os registros de comparações foram removidos.", variant: "default" });
      };
      
      const handleDeleteEntry = (index) => {
        const updatedHistory = deleteHistoryEntryFromStorage(index);
        setHistory(updatedHistory);
        toast({ title: "Registro Removido", description: "O registro selecionado foi removido do histórico.", variant: "default" });
      };


      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-border">
            <CardHeader className="p-6 border-b border-border">
              <CardTitle className="text-2xl font-semibold text-foreground flex items-center"><HistoryIcon className="mr-3 h-7 w-7 text-primary" /> Histórico de Comparações</CardTitle>
              <CardDescription className="text-muted-foreground text-base mt-1">
                Acesse os registros das últimas análises comparativas. Os dados são armazenados localmente.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {history.length > 0 ? (
                <>
                  <div className="overflow-x-auto max-h-[600px] rounded-md border border-input">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                        <TableRow className="border-b-input">
                          <TableHead className="text-foreground font-medium">Data/Hora (UTC-3)</TableHead>
                          <TableHead className="text-center text-foreground font-medium">Produtos Alterados</TableHead>
                          <TableHead className="text-center text-foreground font-medium">Aumentos</TableHead>
                          <TableHead className="text-center text-foreground font-medium">Reduções</TableHead>
                          <TableHead className="text-right text-foreground font-medium">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((entry, index) => (
                          <motion.tr 
                            key={index} 
                            className="border-b border-input hover:bg-muted/30"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <TableCell className="text-muted-foreground font-mono text-sm">{formatDate(entry.date)}</TableCell>
                            <TableCell className="text-center text-foreground">{entry.summary?.totalChanges || 0}</TableCell>
                            <TableCell className="text-center text-destructive">{entry.summary?.countIncreases || 0}</TableCell>
                            <TableCell className="text-center text-green-600">{entry.summary?.countReductions || 0}</TableCell>
                            <TableCell className="text-right space-x-1.5">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDownloadReport(entry.reportData, entry.date)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                title="Baixar Relatório"
                                disabled={!entry.reportData || entry.reportData.length === 0}
                              >
                                <Download size={18} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteEntry(index)}
                                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                title="Excluir Registro"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleClearHistory} variant="destructive" className="bg-destructive/90 hover:bg-destructive text-destructive-foreground">
                      <AlertCircle className="mr-2 h-4 w-4" /> Limpar Histórico
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Info size={40} className="mx-auto mb-3 text-primary" />
                  <p className="text-lg text-foreground">Nenhum registro no histórico.</p>
                  <p>Os resultados das suas análises aparecerão aqui.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default HistoryPage;
  