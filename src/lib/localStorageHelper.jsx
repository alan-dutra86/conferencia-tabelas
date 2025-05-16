
    import * as XLSX from 'xlsx';
    import { CheckCircle, DownloadCloud } from 'lucide-react';
    import React from 'react';

    export const saveComparisonToHistory = (result, toast) => {
      try {
        const history = JSON.parse(localStorage.getItem('priceComparisonHistory') || '[]');
        const newEntry = {
          date: new Date().toISOString(),
          summary: result.summary,
          reportData: result.changes,
        };
        history.unshift(newEntry); 
        if (history.length > 10) history.pop(); 
        localStorage.setItem('priceComparisonHistory', JSON.stringify(history));
      } catch (error) {
        console.error("Erro ao salvar no histórico:", error);
        toast({ title: "Erro de Histórico", description: "Não foi possível salvar a comparação no histórico local.", variant: "destructive"});
      }
    };

    export const loadHistoryFromStorage = () => {
      try {
        return JSON.parse(localStorage.getItem('priceComparisonHistory') || '[]');
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        return [];
      }
    };
    
    export const clearHistoryFromStorage = () => {
        localStorage.removeItem('priceComparisonHistory');
    };

    export const deleteHistoryEntryFromStorage = (indexToDelete) => {
        const history = loadHistoryFromStorage();
        const updatedHistory = history.filter((_, index) => index !== indexToDelete);
        localStorage.setItem('priceComparisonHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
    };

    export const exportResultsToExcel = (changes, toast) => {
      const dataToExport = changes.map(item => ({
        'Código de Barras': item.barcode,
        'Descrição': item.description,
        'Marca': item.brand,
        'Preço Antigo (Loja)': item.oldPrice.toFixed(2),
        'Novo Preço (Fornecedor)': item.newPrice.toFixed(2),
        'Diferença (R$)': item.priceDifference.toFixed(2),
        'Diferença (%)': item.percentageDifference === Infinity ? 'Novo Produto' : item.percentageDifference === -Infinity ? 'Produto Removido' : item.percentageDifference.toFixed(2) + '%',
      }));
    
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "RelatorioPrecos");
      XLSX.writeFile(workbook, `Relatorio_Comparacao_Precos_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
      toast({ title: "Exportado com Sucesso!", description: "O relatório foi baixado.", variant: "default", action: <CheckCircle className="text-green-500" /> });
    };

    export const downloadTemplate = (toast) => {
        const templateData = [
            {"Código de Barras": "EX: 7890000000001", "Descrição do Produto": "EX: Shampoo Anti-Caspa 200ml", "Marca": "EX: Marca Famosa", "Preço Sugerido": "EX: 19.99"},
            {"Código de Barras": "EX: 7890000000002", "Descrição do Produto": "EX: Condicionador Hidratante 200ml", "Marca": "EX: Marca Famosa", "Preço Sugerido": "EX: 21.50"},
            {"Código de Barras": "EX: 7890000000003", "Descrição do Produto": "EX: Creme Facial Noturno 50g", "Marca": "EX: Outra Marca", "Preço Sugerido": "EX: 55.00"},
        ];
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo");

        const columnWidths = [
            { wch: 20 }, /* Código de Barras */
            { wch: 40 }, /* Descrição do Produto */
            { wch: 20 }, /* Marca */
            { wch: 15 }  /* Preço Sugerido */
        ];
        worksheet['!cols'] = columnWidths;

        XLSX.writeFile(workbook, "Modelo_Planilha_Precos.xlsx");
        toast({ title: "Modelo Baixado", description: "Planilha modelo 'Modelo_Planilha_Precos.xlsx' baixada.", variant: "default", action: <DownloadCloud className="text-primary" /> });
    };
  