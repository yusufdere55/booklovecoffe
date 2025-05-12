import { useEffect, useState } from "react";
import useDevice from "./hooks/useDevice";

//Pages
import MobileTemplate from "./pages/Mobile";
import Book from "./pages/Desktop";

function App() {
  const isMobile = useDevice(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer);
  },[])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] flex flex-col items-center justify-center">
        {/* Logo */}
        <img 
          src="./favicon.png" 
          alt="Logo" 
          className="w-24 h-24 animate-bounce"
          draggable={false}
        />
        {/* Loading Text */}
        <h2 className="menu text-[#F7BE79] text-xl mt-4 animate-pulse">
          Book-Love Coffee
        </h2>
      </div>
    );
  }

  return (
      <>
        {isMobile ? <MobileTemplate /> : <Book/> } 
      </>
  );
}

export default App;
