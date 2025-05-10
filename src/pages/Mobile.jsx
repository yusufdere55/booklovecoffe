import data from "../../public/data.json"
const MobileTemplate = () => {
  
  const categories = Object.keys(data);
  console.log(categories)
  
  return(
    <div className="flex flex-col justify-start items-center bg-[#F8F4E1] min-h-screen">
      <div className="flex flex-col justify-center items-center py-4 gap-8">
        <img src="./favicon.png" className="w-32" alt="" />
        <h2 className="text-black font-[Borel] title">Bir Yudum Kahve, Bir Sayfa Huzur</h2>
        <div className="flex flex-row justify-center items-center gap-4 text-black">
          {categories.map((key)=> (
            <a 
              href="#" 
              key={key}
              className="text-semibold menu menu-clamp bg-[#FEBA17]/80 uppercase px-4 py-2 rounded transition-all duration-400  hover:bg-[#FEBA17]/40"
            >
              {key}
            </a>
          ))}
        </div>
      </div>
      <div className="bg-[#74512D] min-w-full py-2 px-4">
          <h2 className="text-4xl menu">Classics</h2>
          <div className="py-2  flex flex-col gap-2">
            {data[categories[0]].map((item,index) => (
              <div key={index} className="flex flex-col gap-4 rounded overflow-hidden p-2 bg-[#4E1F00] justify-between">
                <div className="flex flex-row gap-2 ">
                  <img src={item.img} className="w-16 h-16 rounded" alt="" />
                  <div className="flex flex-col justify-center items-start">
                    <h2 className="text-[#F8F4E1] menu-item-clamp line-clamp">{item.name}</h2>
                    <p className="text-[#F8F4E1]/70 text-sm menu-item-clamp line-clamp">{item.desc}</p>
                  </div>
                </div>
                <div className="bg-[#F8F4E1] rounded p-1 text-white flex flex-row">
                  <h2 className="bg-[#74512D] px-4 py-1 rounded">Fincan : {item.price}</h2>
                </div>
              </div>
            ))}
          </div>
      </div>
      <div className="bg-[#F8F4E1] text-black min-w-full py-2 px-4">
        <h2 className="text-4xl menu">Teas</h2>
        <div className="py-2  flex flex-col gap-2">
          {data[categories[1]].map((item,index) => (
            <div key={index} className="flex flex-col gap-4 rounded overflow-hidden p-2 bg-[#4E1F00] justify-between">
              <div className="flex flex-row gap-2">
                <img src={item.img} className="w-16 h-16 rounded" alt="" />
                <div className="flex flex-col justify-center items-start">
                  <h2 className="text-[#F8F4E1] menu-item-clamp line-clamp">{item.name}</h2>
                  <p className="text-[#F8F4E1]/70 text-sm menu-item-clamp line-clamp">{item.desc}</p>
                </div>
              </div>
              <div className="bg-[#F8F4E1] rounded p-1 text-white flex flex-row gap-2">
                {item.price.map((size, i) => {
                  const sizeName = Object.keys(size)[0];
                  const sizePrice = size[sizeName];
                  return (
                    <h2 key={i} className="bg-[#74512D] px-4 py-1 rounded">
                      {sizeName}: {sizePrice}
                    </h2>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MobileTemplate;