import { useCallback } from 'react';

export const useMovement = (transform, setTransform) => {
  const updatePosition = useCallback((clientX, clientY, dragStart) => {
    requestAnimationFrame(() => {
      const newX = clientX - dragStart.x;
      const newY = clientY - dragStart.y;
      
      const maxX = window.innerWidth * (transform.scale - 1) / 2;
      const maxY = window.innerHeight * (transform.scale - 1) / 2;
      
      setTransform(prev => ({
        ...prev,
        position: {
          x: Math.min(Math.max(newX, -maxX), maxX),
          y: Math.min(Math.max(newY, -maxY), maxY)
        }
      }));
    });
  }, [transform.scale, setTransform]);

  const handleTouch = useCallback((touch, dragStart) => {
    if (!touch) return;
    updatePosition(touch.clientX, touch.clientY, dragStart);
  }, [updatePosition]);

  return { updatePosition };
};