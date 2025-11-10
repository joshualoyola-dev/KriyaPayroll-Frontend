import CodingBroImg from "../assets/NoEnter.svg";

const NoAccess = ({ title, label }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-6">
            <img
                src={CodingBroImg}
                alt="Question illustration"
                className="w-56 h-56 object-contain mb-6 drop-shadow-md"
            />

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6 max-w-md">{label}</p>
        </div>
    );
};

export default NoAccess;
