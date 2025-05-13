import { useState, useCallback } from 'react';

export const usePinchGesture = (onScale) => {
  const [touchState, setTouchState] = useState({
    pinchStartDistance: null,
    initialScale: 1,
    clickCount: 0,
    lastClickTime: 0
  });

  const getDistance = useCallback((touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setTouchState(prev => ({
        ...prev,
        pinchStartDistance: distance,
        initialScale: prev.scale
      }));
    }
  }, [getDistance]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && touchState.pinchStartDistance !== null) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = (touchState.initialScale * distance) / touchState.pinchStartDistance;
      onScale(Math.max(0.5, Math.min(2.5, scale)));
    }
  }, [getDistance, onScale, touchState.initialScale, touchState.pinchStartDistance]);

  const handleTouchEnd = useCallback(() => {
    setTouchState(prev => ({
      ...prev,
      pinchStartDistance: null
    }));
  }, []);

  const handleDoubleTap = useCallback((e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    setTouchState(prev => {
      if (now - prev.lastClickTime < DOUBLE_TAP_DELAY) {
        onScale(1); // Reset scale on double tap
        return {
          ...prev,
          clickCount: 0,
          lastClickTime: 0
        };
      }
      
      return {
        ...prev,
        clickCount: prev.clickCount + 1,
        lastClickTime: now
      };
    });
  }, [onScale]);

  return {
    touchState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
      onTap: handleDoubleTap
    }
  };
};

export default usePinchGesture;
