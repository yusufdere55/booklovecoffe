import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import CustomItem from "../components/CustomItem";
import { FaHome, FaSearchMinus, FaSearchPlus } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useMovement } from "../hooks/useMovement";
import { useDimensions } from "../hooks/useDimensions";
import { usePinchGesture } from "../hooks/usePinchGesture";

const Book = () => {
  const [page, setPage] = useState(0);
  const dimensions = useDimensions();
  const bookRef = useRef();

  const [transform, setTransform] = useState({
    scale: 1,
    position: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });

  const { updatePosition } = useMovement(transform, setTransform);

  const handleScale = useCallback((scale) => {
    setTransform(prev => ({ ...prev, scale }));
  }, []);

  const { handlers: touchHandlers } = usePinchGesture(handleScale);

  const handleZoom = useCallback((type) => {
    setTransform(prev => {
      switch(type) {
        case 'in': return { ...prev, scale: Math.min(prev.scale + 0.25, 2.5) };
        case 'out': return { ...prev, scale: Math.max(prev.scale - 0.25, 0.5) };
        case 'reset': return { ...prev, scale: 1, position: { x: 0, y: 0 } };
        default: return prev;
      }
    });
  }, []);

  const pages = useMemo(() => [
    "https://kahveland.com.tr/images/vG9gGdqnbEBvRZvxV3TWM4hIpET8UoCZrtYuvdlG.jpeg",
    ...Array.from({ length: 12 }, (_, i) => `./images/${i + 2}.jpg`)
  ], []);

  // Image preloading
  useEffect(() => {
    const preloadImages = async () => {
      const promises = pages.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            reject(src);
          };
          img.src = src;
        });
      });

      try {
        await Promise.allSettled(promises);
      } catch (error) {
        console.error('Some images failed to load:', error);
      }
    };

    preloadImages();
  }, [pages]);

  const handleTouchStart = useCallback((e) => {
    if (transform.scale > 1) {
      const touch = e.touches[0];
      setTransform(prev => ({
        ...prev,
        isDragging: true,
        dragStart: {
          x: touch.clientX - prev.position.x,
          y: touch.clientY - prev.position.y
        }
      }));
      e.preventDefault();
    }
  }, [transform.scale]);

  const handleTouchMove = useCallback((e) => {
    if (!transform.isDragging) return;
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY, transform.dragStart);
    e.preventDefault();
  }, [transform.isDragging, transform.dragStart, updatePosition]);

  const handleTouchEnd = useCallback((e) => {
    if (transform.isDragging) {
      setTransform(prev => ({ ...prev, isDragging: false }));
      e.preventDefault();
    }
  }, [transform.isDragging]);

  const handleMouseDown = useCallback((e) => {
    if (transform.scale > 1) {
      e.preventDefault();
      setTransform(prev => ({
        ...prev,
        isDragging: true,
        dragStart: {
          x: e.clientX - prev.position.x,
          y: e.clientY - prev.position.y
        }
      }));
    }
  }, [transform.scale]);

  const handleMouseMove = useCallback((e) => {
    if (!transform.isDragging) return;
    e.preventDefault();
    updatePosition(e.clientX, e.clientY, transform.dragStart);
  }, [transform.isDragging, transform.dragStart, updatePosition]);

  const handleMouseUp = useCallback((e) => {
    if (transform.isDragging) {
      e.preventDefault();
      setTransform(prev => ({ ...prev, isDragging: false }));
    }
  }, [transform.isDragging]);

  useEffect(() => {
    const element = document.querySelector('.book-container');
    if (!element) return;

    const handlers = new Map([
      ['mousedown', handleMouseDown],
      ['mousemove', handleMouseMove],
      ['mouseup', handleMouseUp],
      ['mouseleave', handleMouseUp],
      ['touchstart', handleTouchStart],
      ['touchmove', handleTouchMove],
      ['touchend', handleTouchEnd],
      ['touchcancel', handleTouchEnd]
    ]);

    handlers.forEach((handler, event) => {
      element.addEventListener(event, handler, { passive: false });
    });

    return () => {
      handlers.forEach((handler, event) => {
        element.removeEventListener(event, handler);
      });
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Navigation handlers
  const handleStartPage = useCallback(() => {
    setTransform(prev => ({ ...prev, position: { x: 0, y: 0 }, scale: 1 }));
    bookRef.current?.pageFlip()?.turnToPage(0);
  }, []);

  const handlePrevPage = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handleNextPage = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  // Book event handlers
  const onFlip = useCallback((e) => {
    setPage(e.data);
  }, []);

  // UI Components
  const renderPageControls = () => (
    <div className="flex flex-row gap-1 flex-wrap items-center justify-center">
      <CustomItem onClick={handleStartPage}>
        <button className="w-7 h-7 flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95 transition-all">
          <FaHome className="w-6 h-6" />
        </button>
      </CustomItem>
      <CustomItem onClick={handlePrevPage}>
        <button className="w-7 h-7 flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95 transition-all">
          <RiArrowLeftSLine className="w-10 h-10" />
        </button>
      </CustomItem>
      <CustomItem onClick={handleNextPage}>
        <button className="w-7 h-7 flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95 transition-all">
          <RiArrowRightSLine className="w-10 h-10" />
        </button>
      </CustomItem>
      <CustomItem onClick={() => handleZoom('in')}>
        <button className="w-7 h-7 flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95 transition-all">
          <FaSearchPlus className="w-5 h-5" />
        </button>
      </CustomItem>
      <CustomItem onClick={() => handleZoom('out')}>
        <button className="w-7 h-7 flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95 transition-all">
          <FaSearchMinus className="w-5 h-5" />
        </button>
      </CustomItem>
      <CustomItem onClick={() => handleZoom('reset')}>
        <button className="w-7 h-7 flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95 transition-all">
          <FaMagnifyingGlass className="w-5 h-5" />
        </button>
      </CustomItem>
    </div>
  );

  const renderPage = (src, index) => {
    const isRightPage = index % 2 === 1;
    return (
      <div 
        key={index} 
        className={`page bg-white ${isRightPage ? 'right-page' : 'left-page'}`}
        style={{ 
          touchAction: "none",
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          overflow: "hidden"
        }}
      >
        <div 
          className="page-content"
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            draggable="false"
            src={src}
            alt={`Page ${index + 1}`}
            className="select-none"
            loading="lazy"
            style={{ 
              pointerEvents: "none",
              objectFit: isRightPage ? "contain" : "cover",
              width: "100%", 
              height: "100%"
            }}
          />
        </div>
      </div>
    );
  };

  // Book container props
  const bookContainerProps = useMemo(() => ({
    className: "book-container min-h-fit mt-20 flex justify-center mb-2 touch-none",
    style: {
      perspective: "1000px",
      transformStyle: "preserve-3d",
      transform: `scale(${transform.scale}) translate3d(${transform.position.x}px, ${transform.position.y}px, 0)`,
      touchAction: "none",
      willChange: "transform",
      transition: transform.isDragging ? "none" : "transform 0.3s ease-out",
      WebkitUserSelect: "none",
      userSelect: "none"
    }
  }), [transform.scale, transform.position.x, transform.position.y, transform.isDragging]);

  // HTMLFlipBook props
  const flipBookProps = useMemo(() => ({
    style: {
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none"
    },
    useMouseEvents: transform.scale <= 1,
    mobileScrollSupport: true,
    swipeDistance: 30,
    clickEventForward: false,
    usePortrait: false,
    maxShadowOpacity: 0.5
  }), [transform.scale]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[url(https://kahveland.com.tr/jquery_newspaper_flipbook/img/bg.jpeg)] bg-cover bg-no-repeat">
      <div className="fixed top-0 left-0 right-0 bg-black/40 z-10 m-auto w-full h-16 rounded-none sm:rounded flex flex-row gap-2 p-2 flex-wrap justify-between items-center backdrop-blur-sm">
        <div></div>
        {renderPageControls()}
        <div className="text-white/70 font-semibold px-4 py-2 rounded-full">
          <b className="bg-white/20 py-1 px-2 rounded">{page + 1}</b> <span className="text-lg">/ {pages.length}</span>
        </div>
      </div>
      
      <div {...bookContainerProps}>
        <HTMLFlipBook
          {...flipBookProps}
          ref={bookRef}
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          minWidth={dimensions.width}
          maxWidth={dimensions.width}
          minHeight={dimensions.height}
          maxHeight={dimensions.height}
          showCover={true}
          onFlip={onFlip}
          flippingTime={1000}
          showPageCorners={false}
          startPage={0}
          useMouseEvents={false}
          drawShadow={false}
          autoSize={true}
        >
          {pages.map(renderPage)}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default Book;