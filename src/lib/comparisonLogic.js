
    export const compareProducts = (storeProducts, supplierProducts) => {
      const changes = [];
      const supplierMap = new Map(supplierProducts.map(p => [p.barcode, p]));

      storeProducts.forEach(storeProd => {
        const supplierProd = supplierMap.get(storeProd.barcode);
        if (supplierProd && supplierProd.price !== storeProd.price) {
          const priceDiff = supplierProd.price - storeProd.price;
          const percentageDiff = storeProd.price === 0 ? (priceDiff > 0 ? Infinity : -Infinity) : (priceDiff / storeProd.price) * 100;
          changes.push({
            barcode: storeProd.barcode,
            description: storeProd.description,
            brand: storeProd.brand,
            oldPrice: storeProd.price,
            newPrice: supplierProd.price,
            priceDifference: priceDiff,
            percentageDifference: percentageDiff,
          });
        }
      });
      return changes;
    };

    export const calculateSummary = (changes) => {
      const increases = changes.filter(c => c.priceDifference > 0);
      const reductions = changes.filter(c => c.priceDifference < 0);
    
      const totalIncreaseValue = increases.reduce((sum, c) => sum + c.priceDifference, 0);
      const totalReductionValue = reductions.reduce((sum, c) => sum + c.priceDifference, 0); // Will be negative or zero
    
      const averageIncrease = increases.length > 0 ? totalIncreaseValue / increases.length : 0;
      const averageReduction = reductions.length > 0 ? totalReductionValue / reductions.length : 0; 
    
      const topIncrease = increases.length > 0 
        ? increases.reduce((max, c) => (c.percentageDifference > max.percentageDifference ? c : max), increases[0]) 
        : null;
      const topReduction = reductions.length > 0 
        ? reductions.reduce((min, c) => (c.percentageDifference < min.percentageDifference ? c : min), reductions[0]) 
        : null;
    
      return {
        totalChanges: changes.length,
        countIncreases: increases.length,
        countReductions: reductions.length,
        averageIncrease: averageIncrease, 
        averageReduction: Math.abs(averageReduction), 
        topIncrease: topIncrease ? { description: topIncrease.description, percentage: topIncrease.percentageDifference } : null,
        topReduction: topReduction ? { description: topReduction.description, percentage: topReduction.percentageDifference } : null,
      };
    };
  