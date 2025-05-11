import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { GrFormNext, GrFormPrevious, GrPowerReset, GrZoomIn, GrZoomOut } from "react-icons/gr";
import { IoHome } from "react-icons/io5";
import CustomItem from "../components/CustomItem";

const Book = () => {
  const [page, setPage] = useState(0);
  const [scale, setScale] = useState(1);
  const [dimensions, setDimensions] = useState({
    width: 600,
    height: 853
  });
  const bookRef = useRef();
  const [pinchStartDistance, setPinchStartDistance] = useState(null);
  const [initialScale, setInitialScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Consistent aspect ratio for the book
  const ASPECT_RATIO = 161/229;

  const handleClick = () => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;
    
    if (timeDiff < 500) { // 500ms for double-click detection
      setClickCount(prev => prev + 1);
      
      // Double click control
      if (clickCount === 1) {
        handleZoomIn();
      }
      // Triple click control
      else if (clickCount === 2) {
        handleZoomOut();
        setClickCount(0);
      }
    } else {
      // Reset counter after timeout
      setClickCount(1);
    }
    
    setLastClickTime(currentTime);
  };

  // Timer to reset click counter
  useEffect(() => {
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [clickCount]);

  useEffect(() => {
    const updateDimensions = () => {
      // Kesin en/boy oranı tanımla
      const EXACT_ASPECT_RATIO = 161/229; // Kitabın gerçek en/boy oranı
      
      // Ekran ölçüleri
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Sayfa genişliği için ekran boyutuna göre oran belirle
      let widthRatio;
      if (screenWidth < 640) {
        widthRatio = 0.9; // Mobil cihazlarda daha büyük
      } else if (screenWidth < 768) {
        widthRatio = 0.75; // Tablet boyutlarında
      } else if (screenWidth < 1024) {
        widthRatio = 0.6; // Küçük masaüstü
      } else {
        widthRatio = 0.5; // Büyük ekranlar
      }
      
      // İki sayfa açık gösterileceği için genişliği böl
      widthRatio = widthRatio / 2;
      
      // İlk geçici genişlik hesabı
      let pageWidth = screenWidth * widthRatio;
      
      // Yüksekliği en/boy oranına göre hesapla
      let pageHeight = pageWidth / EXACT_ASPECT_RATIO;
      
      // Ekran yüksekliğinin %85'inden fazlaysa, yüksekliği sınırla
      const maxHeight = screenHeight * 0.85;
      if (pageHeight > maxHeight) {
        pageHeight = maxHeight;
        // Yeni yüksekliğe göre genişliği yeniden hesapla
        pageWidth = pageHeight * EXACT_ASPECT_RATIO;
      }
      
      // Sonuçları yuvarla
      setDimensions({
        width: Math.round(pageWidth),
        height: Math.round(pageHeight)
      });
      
      // console.log(`Sayfa boyutları: ${Math.round(pageWidth)}x${Math.round(pageHeight)}, Oran: ${EXACT_ASPECT_RATIO}`);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Her sayfanın genişlik/yükseklik oranını kontrol eden yardımcı fonksiyon
  const checkImageDimensions = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        // console.log(`Image ${src}: Width=${img.width}, Height=${img.height}, Ratio=${aspectRatio}`);
        resolve(aspectRatio);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        resolve(null);
      };
      img.src = src;
    });
  };

  const pages = [
    "https://kahveland.com.tr/images/vG9gGdqnbEBvRZvxV3TWM4hIpET8UoCZrtYuvdlG.jpeg",
    "./images/2.jpg",
    "./images/3.jpg",
    "./images/4.jpg",
    "./images/5.jpg",
    "./images/6.jpg",
    "./images/7.jpg",
    "./images/8.jpg",
    "./images/9.jpg",
    "./images/10.jpg",
    "./images/11.jpg",
    "./images/12.jpg",
    "./images/13.jpg",
  ];
  
  // Sayfa yüklendiğinde tüm resimlerin boyutlarını kontrol et
  useEffect(() => {
    const checkAllImages = async () => {
      for (const src of pages) {
        await checkImageDimensions(src);
      }
    };
    checkAllImages();
  }, []);

  const onFlip = (e) => {
    setPage(e.data);
  };

  const handleStartPage = () => {
    // Reset position and scale
    setPosition({ x: 0, y: 0 });
    setScale(1);
    
    // Go to first page
    bookRef.current.pageFlip().turnToPage(0);
  };

  const handlePrevPage = () => {
    bookRef.current.pageFlip().flipPrev();
  };

  const handleNextPage = () => {
    bookRef.current.pageFlip().flipNext();
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && scale > 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    } else if (e.touches.length === 2) {
      handlePinchStart(e);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const getPinchDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handlePinchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = getPinchDistance(e.touches[0], e.touches[1]);
      setPinchStartDistance(distance);
      setInitialScale(scale);
    }
  };

  const handlePinchMove = (e) => {
    if (e.touches.length === 2 && pinchStartDistance !== null) {
      const currentDistance = getPinchDistance(e.touches[0], e.touches[1]);
      const scaleFactor = currentDistance / pinchStartDistance;
      const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.5), 2.5);
      setScale(newScale);
    }
  };

  const handlePinchEnd = () => {
    setPinchStartDistance(null);
  };

  useEffect(() => {
    const element = document.querySelector('.book-container');
    if (!element) return;

    // Mouse events
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseUp);
    
    // Touch events
    element.addEventListener('touchstart', handlePinchStart);
    element.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        handlePinchMove(e);
      } else {
        handleTouchMove(e);
      }
    }, { passive: false });
    element.addEventListener('touchend', (e) => {
      handlePinchEnd();
      handleTouchEnd(e);
    });
    element.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      // Cleanup events
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('touchstart', handlePinchStart);
      element.removeEventListener('touchmove', handlePinchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, dragStart, pinchStartDistance]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[url(https://kahveland.com.tr/jquery_newspaper_flipbook/img/bg.jpeg)] bg-cover bg-no-repeat">
      <div className="fixed top-0 left-0 right-0 bg-black/40 z-10 m-auto w-full h-16 rounded-none sm:rounded flex flex-row gap-2 p-2 flex-wrap justify-between items-center backdrop-blur-sm">
        <div></div>
        <div className="flex flex-row gap-1 flex-wrap items-center justify-center">
          <CustomItem onClick={handleStartPage} children={<button className="w-7 h-7 flex justify-center items-center cursor-pointer"><IoHome className="w-6 h-6" /></button>} />
          <CustomItem onClick={handlePrevPage} children={<button className="w-7 h-7 flex justify-center items-center cursor-pointer"><GrFormPrevious className="w-10 h-10" /></button>} />
          <CustomItem onClick={handleNextPage} children={<button className="w-7 h-7 flex justify-center items-center cursor-pointer"><GrFormNext className="w-10 h-10" /></button>} />
          <CustomItem onClick={handleZoomOut} children={<button className="w-7 h-7 flex justify-center items-center cursor-pointer"><GrZoomOut className="w-6 h-6" /></button>} />
          <CustomItem onClick={handleZoomIn} children={<button className="w-7 h-7 flex justify-center items-center cursor-pointer"><GrZoomIn className="w-6 h-6" /></button>} />
          <CustomItem onClick={handleZoomReset} children={<button className="w-7 h-7 flex justify-center items-center cursor-pointer"><GrPowerReset className="w-6 h-6" /></button>} />
        </div>
        <div className="text-white/70 font-semibold px-4 py-2 rounded-full">
          <b className="bg-white/20 py-1 px-2 rounded">{page + 1}</b> <span className="text-lg">/ {pages.length}</span>
        </div>
      </div>
      <div 
        className="book-container min-h-fit mt-20 flex justify-center mb-2 transition-transform duration-300 cursor-grab active:cursor-grabbing touch-none"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          touchAction: "none"
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
      >
        <HTMLFlipBook
          ref={bookRef}
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          minWidth={dimensions.width}
          maxWidth={dimensions.width}
          minHeight={dimensions.height}
          maxHeight={dimensions.height}
          useMouseEvents={false}
          maxShadowOpacity={0.5}
          showCover={true}
          onFlip={onFlip}
          mobileScrollSupport={true}
          className="book select-none touch-none"
          style={{
            touchAction: "none",
            userSelect: "none"
          }}
          startPage={0}
          renderMode="portrait"
          flippingTime={1000}
          swipeDistance={0}
          showPageCorners={true}
          disableFlipByClick={false}
          usePortrait={false}
          startZIndex={5} // Sayfaların z-index değerini ayarla
          drawShadow={true} // Gölge çizimi
          autoSize={true} // Otomatik boyutlandırma
        >
          {pages.map((src, index) => {
            // Çift sayfalar için özel stil (sağdaki sayfalar)
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
                      objectFit: isRightPage ? "contain" : "cover", // Sağ sayfa için contain, sol sayfa için cover
                      width: "100%", 
                      height: "100%"
                    }}
                    onError={(e) => {
                      console.error(`Image failed to load: ${src}`);
                      e.target.onerror = null;
                      e.target.src = "placeholder.jpg";
                    }}
                  />
                </div>
              </div>
            );
          })}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default Book;