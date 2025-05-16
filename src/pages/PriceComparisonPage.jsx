
    import React from 'react';
    import { motion } from 'framer-motion';
    import FileUploadSection from '@/components/price-comparison/FileUploadSection';
    import ComparisonResults from '@/components/price-comparison/ComparisonResults';
    import usePriceComparison from '@/hooks/usePriceComparison';

    const PriceComparisonPage = () => {
      const {
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
      } = usePriceComparison();

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <FileUploadSection
            onFileUpload={handleFileUpload}
            onCompare={handleCompare}
            onReset={resetComparison}
            onDownloadTemplate={handleDownloadTemplate}
            isLoading={isLoading}
            storeFile={storeFile}
            supplierFile={supplierFile}
            storeFileInputRef={storeFileInputRef}
            supplierFileInputRef={supplierFileInputRef}
          />

          {comparisonResult && (
            <ComparisonResults
              comparisonResult={comparisonResult}
              onExport={handleExport}
            />
          )}
        </motion.div>
      );
    };

    export default PriceComparisonPage;
  