
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { UploadCloud, Trash2, Zap, Download } from 'lucide-react';

    const FileUploadSection = ({ onFileUpload, onCompare, onReset, onDownloadTemplate, isLoading, storeFile, supplierFile, storeFileInputRef, supplierFileInputRef }) => {
      return (
        <Card className="shadow-lg border-border">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="text-2xl font-semibold text-foreground flex items-center"><UploadCloud className="mr-3 h-7 w-7 text-primary" /> Upload de Tabelas</CardTitle>
            <CardDescription className="text-muted-foreground text-base mt-1">
              Insira as tabelas Excel da loja e do fornecedor para análise comparativa de preços.
              As tabelas devem seguir o formato: Coluna A: Código de Barras, B: Descrição do Produto, C: Marca, D: Preço Sugerido.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid md:grid-cols-2 gap-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <label htmlFor="store-file-input" className="block text-sm font-medium text-foreground mb-1.5">Tabela Loja (.xlsx)</label>
              <Input 
                id="store-file-input" 
                ref={storeFileInputRef}
                type="file" 
                accept=".xlsx" 
                onChange={(e) => onFileUpload(e.target.files[0], 'store')} 
                className="file:mr-4 file:py-2 file:px-3 file:rounded-md file:border file:border-input file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/90 cursor-pointer bg-input border-input focus:ring-primary text-foreground"
              />
              {storeFile && <p className="mt-1.5 text-xs text-muted-foreground">Arquivo carregado: {storeFile.name}</p>}
            </motion.div>
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <label htmlFor="supplier-file-input" className="block text-sm font-medium text-foreground mb-1.5">Tabela Fornecedor (.xlsx)</label>
              <Input 
                id="supplier-file-input" 
                ref={supplierFileInputRef}
                type="file" 
                accept=".xlsx" 
                onChange={(e) => onFileUpload(e.target.files[0], 'supplier')}
                className="file:mr-4 file:py-2 file:px-3 file:rounded-md file:border file:border-input file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/90 cursor-pointer bg-input border-input focus:ring-primary text-foreground"
              />
              {supplierFile && <p className="mt-1.5 text-xs text-muted-foreground">Arquivo carregado: {supplierFile.name}</p>}
            </motion.div>
            <motion.div className="md:col-span-2 mt-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <Button onClick={onDownloadTemplate} variant="link" className="text-sm text-primary p-0 h-auto">
                    <Download size={16} className="mr-1.5" /> Baixar planilha modelo
                </Button>
            </motion.div>
          </CardContent>
          <CardFooter className="p-6 flex justify-end space-x-3 border-t border-border">
            <Button onClick={onReset} variant="outline" className="text-muted-foreground border-input hover:bg-muted hover:text-foreground">
              <Trash2 className="mr-2 h-4 w-4" /> Limpar
            </Button>
            <Button onClick={onCompare} disabled={isLoading || !storeFile || !supplierFile} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm">
              {isLoading ? 'Analisando...' : <><Zap className="mr-2 h-4 w-4" /> Comparar Agora</>}
            </Button>
          </CardFooter>
        </Card>
      );
    };

    export default FileUploadSection;
  