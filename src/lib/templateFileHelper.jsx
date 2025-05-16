
    import * as XLSX from 'xlsx';
    import { CheckCircle, AlertTriangle } from 'lucide-react';
    import React from 'react';

    export const downloadTemplateFile = (toast) => {
      try {
        const templateData = [
          ["Código de Barras", "Descrição do Produto", "Marca", "Preço Sugerido"],
          ["7890000000001", "Shampoo Anti-Caspa", "Marca A", "15.99"],
          ["7890000000002", "Condicionador Hidratante", "Marca B", "12.50"],
          ["7890000000003", "Sabonete Líquido", "Marca C", "8.75"],
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(templateData);
        
        worksheet['!cols'] = [ {wch:20}, {wch:30}, {wch:15}, {wch:15} ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ModeloPrecos");
        
        XLSX.writeFile(workbook, "Modelo_Tabela_Precos.xlsx");
        
        toast({
          title: "Modelo Baixado",
          description: "O arquivo 'Modelo_Tabela_Precos.xlsx' foi baixado com sucesso.",
          variant: "default",
          action: <CheckCircle className="text-green-500" />,
        });
      } catch (error) {
        console.error("Erro ao gerar arquivo modelo:", error);
        toast({
          title: "Erro ao Gerar Modelo",
          description: "Não foi possível gerar o arquivo modelo. Tente novamente.",
          variant: "destructive",
          action: <AlertTriangle className="text-red-500" />,
        });
      }
    };
  