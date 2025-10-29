import DualBallLoadingSVG from "../assets/dual-ball-loading.svg";

const LoadingWholeScreen = () => {
    return (
        <div className="fixed inset-0  flex items-center justify-center z-50">
            <img
                src={DualBallLoadingSVG}
                alt="Loading animation"
                className="w-16 h-16"
            />
        </div>
    );
};

export default LoadingWholeScreen;