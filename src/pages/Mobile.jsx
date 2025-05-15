import { useEffect, useState, useCallback, useMemo } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaMapLocation, FaXTwitter } from "react-icons/fa6";

const MobileTemplate = () => {
  const [carouselState, setCarouselState] = useState({
    isLoaded: false,
    currentSlide: 0,
    isError: false
  });

  const pages = useMemo(() => [
    "https://kahveland.com.tr/images/vG9gGdqnbEBvRZvxV3TWM4hIpET8UoCZrtYuvdlG.jpeg",
    ...Array.from({ length: 12 }, (_, i) => `./images/${i + 2}.jpg`)
  ], []);

  // Resim ön yükleme fonksiyonu
  const preloadImages = useCallback(async () => {
    try {
      await Promise.all(
        pages.map(
          (src) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = reject;
              img.src = src;
            })
        )
      );
    } catch (error) {
      console.error("Bazı görseller yüklenemedi:", error);
      setCarouselState(prev => ({ ...prev, isError: true }));
    }
  }, [pages]);

  // Carousel yapılandırması
  const initializeCarousel = useCallback(() => {
    if (!window.jQuery) {
      console.error("jQuery yüklü değil!");
      return;
    }

    const $ = window.jQuery;
    const owlConfig = {
      items: 1,
      loop: false,
      nav: false,
      dots: false,
      autoplay: false,
      touchDrag: true,
      mouseDrag: true,
      margin: 0,
      lazyLoad: true,
      // navText: [
        // '<i class="fa fa-chevron-left"></i>',
        // '<i class="fa fa-chevron-right"></i>'
      // ],
      responsive: {
        0: {
          items: 1,
          nav: false
        },
        600: {
          items: 1,
          nav: false
        }
      },
      onChanged: (event) => {
        setCarouselState(prev => ({
          ...prev,
          currentSlide: event.item.index
        }));
      }
    };

    try {
      $(".owl-carousel")
        .owlCarousel(owlConfig)
        .on("initialized.owl.carousel", () => {
          setCarouselState(prev => ({ ...prev, isLoaded: true }));
        });
    } catch (error) {
      console.error("Carousel başlatılamadı:", error);
      setCarouselState(prev => ({ ...prev, isError: true }));
    }

    return () => {
      try {
        $(".owl-carousel").owlCarousel("destroy");
      } catch (error) {
        console.error("Carousel temizlenemedi:", error);
      }
    };
  }, []);

  useEffect(() => {
    preloadImages();
    const cleanup = initializeCarousel();
    return cleanup;
  }, [initializeCarousel, preloadImages]);

  const renderSocialLinks = useCallback(() => (
    <div className="flex flex-row justify-center items-center gap-3">
      {[
        { Icon: FaInstagram, href: "#", label: "Instagram" },
        { Icon: FaFacebook, href: "#", label: "Facebook" },
        { Icon: FaXTwitter, href: "#", label: "Twitter" },
        { Icon: FaMapLocation, href: "https://maps.app.goo.gl/7U2ek4sYCrej8BV77", label: "Konum" }
      ].map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 rounded-full border-[#F7BE79] w-8 h-8 flex items-center justify-center hover:bg-[#F7BE79] hover:text-white transition-colors duration-300"
          aria-label={label}
        >
          <Icon className="w-4 h-4 text-[#F7BE79] group-hover:text-white" />
        </a>
      ))}
    </div>
  ), []);

  if (carouselState.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4E1]">
        <div className="text-center text-[#F7BE79] p-4">
          <h2 className="text-xl mb-2">Üzgünüz, bir hata oluştu</h2>
          <p>Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-[#F8F4E1]">
      
      {/* Header */}
      <header className="flex flex-row w-full px-4 justify-between items-center bg-[#664343] py-4 gap-8 shadow-sm">
        <img 
          src="./favicon.png" 
          className="w-20 h-20 object-contain shadow-white iniset-shadow-xl rounded-full" 
          alt="Book Love Coffee Logo" 
          draggable={false}
        />
        <p className="title-clamp menu text-[#F7BE79] text-shadow-md text-xs text-shadow-black/20  text-right font-medium">
          Bir Yudum Kahve, Bir Sayfa Huzur!
        </p>
      </header>

      {/* Main Carousel */}
      <main className="w-full flex-1">
        <div className="owl-carousel owl-theme">
          {pages.map((src, index) => (
            <div key={index} className="item">
              <img
                src={src}
                alt={`Sayfa ${index + 1}`}
                className="w-full h-auto object-contain"
                draggable={false}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#664343] mt-auto">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center">
            <img 
              src="./favicon.png" 
              className="w-16 h-16 object-contain" 
              alt="Book Love Coffee Logo" 
              draggable={false} 
            />
            {renderSocialLinks()}
          </div>
          
          <div className="text-center text-[#F7BE79] menu menu-item-clamp py-2">
            © {new Date().getFullYear()}. Tüm Hakları Saklıdır - <b><i>Book-Love Coffee</i></b>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MobileTemplate;