
    import { useState, useCallback, useRef } from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { processUploadedFile } from '@/lib/fileProcessor';
    import { compareProducts, calculateSummary } from '@/lib/comparisonLogic';
    import { saveComparisonToHistory, exportResultsToExcel, downloadTemplate } from '@/lib/localStorageHelper';

    const usePriceComparison = () => {
      const [storeFile, setStoreFile] = useState(null);
      const [supplierFile, setSupplierFile] = useState(null);
      const [comparisonResult, setComparisonResult] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const storeFileInputRef = useRef(null);
      const supplierFileInputRef = useRef(null);

      const handleFileUpload = useCallback((file, fileType) => {
        if (!file) {
          if (fileType === 'store') setStoreFile(null);
          else setSupplierFile(null);
          toast({
            title: "Seleção de Arquivo Removida",
            description: `O arquivo para ${fileType === 'store' ? 'loja' : 'fornecedor'} foi desmarcado.`,
            variant: "default",
          });
          return;
        }

        if (fileType === 'store') setStoreFile(file);
        else setSupplierFile(file);
        
        toast({
          title: "Arquivo Carregado",
          description: `"${file.name}" foi carregado com sucesso.`,
          variant: "default",
        });
      }, [toast]);

      const handleCompare = async () => {
        if (!storeFile || !supplierFile) {
          toast({
            title: "Arquivos Ausentes",
            description: "Por favor, carregue os arquivos da loja e do fornecedor.",
            variant: "destructive",
          });
          return;
        }

        setIsLoading(true);
        setComparisonResult(null);

        try {
          const storeProducts = await processUploadedFile(storeFile, toast);
          const supplierProducts = await processUploadedFile(supplierFile, toast);

          if (!storeProducts || !supplierProducts) {
            setIsLoading(false);
            return; 
          }
          
          const changes = compareProducts(storeProducts, supplierProducts);

          if (changes.length === 0) {
            toast({
              title: "Sem Alterações",
              description: "Nenhuma alteração de preço encontrada entre os arquivos.",
              variant: "default",
            });
            setComparisonResult({ changes: [], summary: { totalChanges: 0, countIncreases: 0, countReductions: 0, averageIncrease: 0, averageReduction: 0, topIncrease: null, topReduction: null } });
          } else {
            const summary = calculateSummary(changes);
            const resultData = { changes, summary };
            setComparisonResult(resultData);
            saveComparisonToHistory(resultData, toast);
            toast({
              title: "Comparação Concluída",
              description: `${changes.length} produtos com preços alterados.`,
              variant: "default",
            });
          }
        } catch (error) {
          console.error("Erro na comparação:", error);
          toast({
            title: "Erro na Comparação",
            description: error.message || "Ocorreu um erro ao comparar os arquivos.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      const handleExport = () => {
        if (!comparisonResult || comparisonResult.changes.length === 0) {
            toast({ title: "Nada para Exportar", description: "Nenhum dado de comparação disponível.", variant: "destructive" });
            return;
        }
        exportResultsToExcel(comparisonResult.changes, toast);
      };

      const resetComparison = () => {
        setStoreFile(null);
        setSupplierFile(null);
        setComparisonResult(null);
        if (storeFileInputRef.current) {
            storeFileInputRef.current.value = "";
        }
        if (supplierFileInputRef.current) {
            supplierFileInputRef.current.value = "";
        }
        toast({ title: "Limpo", description: "Seleção de arquivos e resultados foram limpos.", variant: "default" });
      };

      const handleDownloadTemplate = () => {
        downloadTemplate(toast);
      };

      return {
        storeFile,
        supplierFile,
        comparisonResult,
        isLoading,
        storeFileInputRef,
        supplierFileInputRef,
        handleFileUpload,
        handleCompare,
        handleExport,
        resetComparison,
        handleDownloadTemplate,
      };
    };

    export default usePriceComparison;
  