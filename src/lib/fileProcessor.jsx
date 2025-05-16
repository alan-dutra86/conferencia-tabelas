
    import * as XLSX from 'xlsx';
    import { AlertTriangle } from 'lucide-react';
    import React from 'react';

    export const processUploadedFile = async (file, toast) => {
      return new Promise((resolve, reject) => {
        if (!file) {
          toast({ title: "Arquivo não fornecido", description: "Um arquivo é necessário para processamento.", variant: "destructive", action: <AlertTriangle className="text-red-500" /> });
          reject(new Error("Arquivo não fornecido"));
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length < 2) {
              const errorMsg = "Planilha vazia ou sem cabeçalho.";
              toast({ title: "Erro na Planilha", description: errorMsg, variant: "destructive", action: <AlertTriangle className="text-red-500" /> });
              reject(new Error(errorMsg));
              return;
            }

            const header = jsonData[0].map(h => String(h).trim().toLowerCase());
            const expectedHeaders = ["código de barras", "descrição do produto", "marca", "preço sugerido"];
            
            const missingHeaders = expectedHeaders.filter(eh => !header.includes(eh));
            if (missingHeaders.length > 0) {
               const errorMsg = `Cabeçalhos ausentes: ${missingHeaders.join(', ')}. Verifique se as colunas A, B, C, D estão corretas.`;
               toast({ title: "Erro no Cabeçalho", description: errorMsg, variant: "destructive", action: <AlertTriangle className="text-red-500" /> });
               reject(new Error(errorMsg));
               return;
            }
            
            const barcodeIndex = header.indexOf("código de barras");
            const descriptionIndex = header.indexOf("descrição do produto");
            const brandIndex = header.indexOf("marca");
            const priceIndex = header.indexOf("preço sugerido");

            const products = jsonData.slice(1).map(row => ({
              barcode: String(row[barcodeIndex] || '').trim(),
              description: String(row[descriptionIndex] || '').trim(),
              brand: String(row[brandIndex] || '').trim(),
              price: parseFloat(String(row[priceIndex] || '0').replace(',', '.')),
            })).filter(p => p.barcode && !isNaN(p.price) && p.description);

            if (products.length === 0) {
              const errorMsg = "Nenhum produto válido encontrado na planilha. Verifique os dados (código de barras, descrição e preço).";
              toast({ title: "Nenhum Produto Válido", description: errorMsg, variant: "destructive", action: <AlertTriangle className="text-red-500" /> });
              reject(new Error(errorMsg));
              return;
            }
            resolve(products);
          } catch (error) {
            const errorMsg = `Erro ao processar o arquivo: ${error.message}`;
            toast({ title: "Erro de Processamento", description: errorMsg, variant: "destructive", action: <AlertTriangle className="text-red-500" /> });
            reject(new Error(errorMsg));
          }
        };
        reader.onerror = (error) => {
          const errorMsg = `Erro ao ler o arquivo: ${error.message}`;
          toast({ title: "Erro de Leitura", description: errorMsg, variant: "destructive", action: <AlertTriangle className="text-red-500" /> });
          reject(new Error(errorMsg));
        };
        reader.readAsArrayBuffer(file);
      });
    };
  