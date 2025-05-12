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

   // Component yüklendikten sonra Owl Carousel'i başlat
  useEffect(() => {
    // jQuery ve Owl Carousel zaten yüklü olduğundan emin olalım
    if (window.jQuery) {
      const $ = window.jQuery;
      // Bu noktada Owl Carousel'i başlatalım
      $(".owl-carousel").owlCarousel({
        items: 1,
        loop: false,
        nav: false,
        dots: false,
        autoplay: false,
        touchDrag: true,
        mouseDrag: true,
        margin: 0,
        lazyLoad:true,
      });
    } else {
      console.error("jQuery not loaded. Make sure it's included in index.html");
    }
    
    // Component unmount olduğunda
    return () => {
      if (window.jQuery) {
        const $ = window.jQuery;
        // Carousel'i yok edelim (bellek temizliği için)
        $(".owl-carousel").owlCarousel('destroy');
      }
    };
  }, []);

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-[#F8F4E1]">
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
            <a href="#" className="border-2 rounded-full border-[#F7BE79] w-7 h-7 flex items-center justify-center">
              <FaInstagram className="w-4 h-4 text-[#F7BE79]" />
            </a>
            <a href="#" className="border-2 rounded-full border-[#F7BE79] w-7 h-7 flex items-center justify-center">
              <FaFacebook className="w-4 h-4 text-[#F7BE79]" />
            </a>
            <a href="#" className="border-2 rounded-full border-[#F7BE79] w-7 h-7 flex items-center justify-center">
              <FaXTwitter className="w-4 h-4 text-[#F7BE79]" />
            </a>
            <a href="https://maps.app.goo.gl/7U2ek4sYCrej8BV77" target="_blank" className="border-2 rounded-full border-[#F7BE79] w-7 h-7 flex items-center justify-center">
              <FaMapLocation className="w-4 h-4 text-[#F7BE79]" />
            </a>
          </div>
        </div>
        <div className="w-screen text-center text-[#F7BE79] menu menu-item-clamp">
          © Copyright 2025. All Reserved For <b><i>Book-Love Coffee</i></b>
        </div>
      </div>
    </div>
  );
};

export default MobileTemplate;