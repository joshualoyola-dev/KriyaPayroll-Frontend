const Tooltip = ({ text = "", children }) => {
    return (
        <div className="relative flex items-center group cursor-pointer">
            {children}
            {text !== "" &&
                <div className="w-sm opacity-0 group-hover:opacity-100 transition bg-gray-700 text-white text-xs rounded-md py-1 px-2 absolute left-1/2 -translate-x-1/2 mt-16 z-10 shadow-lg">
                    {text}
                </div>
            }
        </div>

    );
};

export default Tooltip;