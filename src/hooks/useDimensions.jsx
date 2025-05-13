import { useState, useEffect } from 'react';

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: 600,
    height: 853
  });

  useEffect(() => {
    const EXACT_ASPECT_RATIO = 161/229;
    
    const calculateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      let widthRatio;
      if (screenWidth < 640) {
        widthRatio = 0.9;
      } else if (screenWidth < 768) {
        widthRatio = 0.75;
      } else if (screenWidth < 1024) {
        widthRatio = 0.6;
      } else {
        widthRatio = 0.5;
      }
      
      widthRatio = widthRatio / 2;
      
      let pageWidth = screenWidth * widthRatio;
      let pageHeight = pageWidth / EXACT_ASPECT_RATIO;
      
      const maxHeight = screenHeight * 0.85;
      if (pageHeight > maxHeight) {
        pageHeight = maxHeight;
        pageWidth = pageHeight * EXACT_ASPECT_RATIO;
      }
      
      setDimensions({
        width: Math.round(pageWidth),
        height: Math.round(pageHeight)
      });
    };

    calculateDimensions();
    
    const debouncedResize = debounce(calculateDimensions, 250);
    window.addEventListener('resize', debouncedResize);
    
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  return dimensions;
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
