import Input from "../../components/Input.component";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const { formData, setFormData, isLoading, handleLogin } = useAuth();

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
                onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                required
            />

            {/* Password */}
            <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
            />

            {/* Forgot Password */}
            <div className="flex justify-end">
                <Link to="/auth/forgot-password" className="text-sm text-teal-600 hover:underline">
                    Forgot password?
                </Link>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
            >
                {isLoading ? "Loading..." : "Login"}
            </button>
        </form>
    );
};

export default LoginForm;
