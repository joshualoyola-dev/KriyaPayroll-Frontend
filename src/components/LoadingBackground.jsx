import DualBallLoadingSVG from "../assets/dual-ball-loading.svg";

const LoadingBackground = () => {
    return (
        <div className="fixed inset-0  flex items-center justify-center">
            <img
                src={DualBallLoadingSVG}
                alt="Loading animation"
                className="w-16 h-16"
            />
        </div>
    );
};

export default LoadingBackground;