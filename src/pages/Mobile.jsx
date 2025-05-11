import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaMapLocation, FaXTwitter } from "react-icons/fa6";

const MobileTemplate = () => {
  const [owlLoaded, setOwlLoaded] = useState(false);
  
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

  useEffect(() => {
    // jQuery ve Owl Carousel'ı script olarak ekleyelim
    const loadScripts = async () => {
      // jQuery'yi önce ekleyelim
      const jqueryScript = document.createElement("script");
      jqueryScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";
      jqueryScript.async = true;
      document.body.appendChild(jqueryScript);

      // jQuery yüklendiğinde Owl Carousel'ı ekleyelim
      jqueryScript.onload = () => {
        const owlCarouselCss = document.createElement("link");
        owlCarouselCss.rel = "stylesheet";
        owlCarouselCss.href = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css";
        document.head.appendChild(owlCarouselCss);

        const owlThemeCss = document.createElement("link");
        owlThemeCss.rel = "stylesheet";
        owlThemeCss.href = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css";
        document.head.appendChild(owlThemeCss);

        const owlCarouselScript = document.createElement("script");
        owlCarouselScript.src = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js";
        owlCarouselScript.async = true;
        document.body.appendChild(owlCarouselScript);

        owlCarouselScript.onload = () => {
          // Owl Carousel yüklendi, şimdi başlatabiliriz
          setOwlLoaded(true);
        };
      };
    };

    loadScripts();

    // Temizleme fonksiyonu
    return () => {
      // Eğer gerekirse, script ve stil etiketlerini kaldırma kodu buraya eklenebilir
    };
  }, []);

  // Owl Carousel'ı başlat
  useEffect(() => {
    if (owlLoaded && window.jQuery) {
      const $ = window.jQuery;
      $(".owl-carousel").owlCarousel({
        items: 1,
        loop: true,
        nav: false,
        dots: false,
        autoplay: false,
        touchDrag: true,
        mouseDrag: true,
        margin: 0,
        navText: [
          '<i class="fa fa-angle-left"></i>',
          '<i class="fa fa-angle-right"></i>'
        ]
      });
    }
  }, [owlLoaded]);

  return (
    <div className="flex flex-col justify-start items-center min-h-screen">
      <div className="flex flex-row min-w-screen px-4 justify-between items-center bg-[#F8F4E1] py-4 gap-8">
        <img src="./favicon.png" className="w-22" alt="" draggable="false" />
        <h2 className="menu-clamp menu text-[#F7BE79] text-shadow-md text-shadow-black/20 tracking-[3px] text-right italic">
          Bir Yudum Kahve, Bir Sayfa Huzur!!
        </h2>
      </div>
      
      <div className="w-screen">
        <div className="owl-carousel owl-theme">
          {pages.map((src, key) => (
            <div key={key} className="item">
              <img
                src={src}
                alt={`Slide ${key + 1}`}
                className="w-screen h-max object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col justify-center items-center min-h-max bg-[#F8F4E1]">
        <div className="flex flex-row justify-between w-screen px-4 py-2 text-black items-center">
          <img src="./favicon.png" className="w-16 h-16" alt="" draggable={false} />
          <div className="flex flex-row justify-center items-center gap-2">
            <a href="#" className="border rounded-full border-[#F7BE79] w-7 h-7 flex items-center justify-center">
              <FaInstagram className="w-4 h-4 text-[#F7BE79]" />
            </a>
            <a href="#" className="border rounded-full border-[#F7BE79] w-7 h-7 flex items-center justify-center">
              <FaFacebook className="w-4 h-4 text-[#F7BE79]" />
            </a>
            <a href="#" className="border rounded-full border-[#F7BE79] w-7 h-7 flex items-center justify-center">
              <FaXTwitter className="w-4 h-4 text-[#F7BE79]" />
            </a>
            <a href="https://maps.app.goo.gl/7U2ek4sYCrej8BV77" target="_blank" className="border rounded-full border-[#F7BE79] w-7 h-7 flex items-center justify-center">
              <FaMapLocation className="w-4 h-4 text-[#F7BE79]" />
            </a>
          </div>
        </div>
        <div className="w-screen text-center text-[#F7BE79] menu menu-item-clamp">
          © Copyright 2025. All Reserved For <b><i>Book-Love Coffee</i></b>
        </div>
      </div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
    </div>
  );
};

export default MobileTemplate;