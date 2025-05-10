const CustomItem = ({text,onClick,children}) => {
    return(
        <div onClick={onClick} className="flex flex-col justify-between items-center cursor-pointer ">
            {children}
            <p className="">{text}</p>
        </div>
    )
}

export default CustomItem