import useDevice from "./hooks/useDevice";

//Pages
import MobileTemplate from "./pages/Mobile";
import Book from "./pages/Desktop";

function App() {
  const isMobile = useDevice(true);
  return (
      <>
        {isMobile ? <MobileTemplate /> : <Book/> } 
      </>
  );
}

export default App;
