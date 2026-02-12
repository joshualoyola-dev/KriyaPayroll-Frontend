import Input from "../../components/Input.component";
import { useAuthContext } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom";
import DualBallLoading from "../../assets/dual-ball-loading.svg";
import env from "../../configs/env.config";

const LoginForm = () => {
    const { formData, setFormData, isLoading, handleLogin } = useAuthContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <Input
                label="Email"
                type="email"
                value={formData.user_email}
                onChange={(e) =>
                    setFormData({ ...formData, user_email: e.target.value })
                }
                required
            />

            {/* Password */}
            <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                }
                required
            />

            {/* Forgot Password */}
            <div className="flex justify-end">
                <Link
                    to={env.VITE_HRIS_FRONTEND_URL}
                    className="text-sm text-teal-600 hover:underline"
                >
                    Forgot password?
                </Link>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-medium transition ${isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                    }`}
            >
                {isLoading ? (
                    <>
                        <img
                            src={DualBallLoading}
                            alt="Loading..."
                            className="w-7 h-7"
                        />
                        <span>Logging in...</span>
                    </>
                ) : (
                    "Login"
                )}
            </button>
        </form>
    );
};

export default LoginForm;
