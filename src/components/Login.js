import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png'; // Adjust the path
import bgImage from '../assets/bg.jpg'; // Replace with your actual image name and path


function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'Kangkan@2025') {
            onLogin();
            navigate('/');
        } else {
            alert('Incorrect password!');
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <form
                onSubmit={handleSubmit}
                className="relative z-10 bg-white/90 p-10 rounded-xl shadow-xl w-full max-w-sm backdrop-blur-md"
            >
                <div className="flex justify-center mb-2">
                    <img src={logo} alt="Logo" className="h-14" />
                </div>

                <h2 className="text-center text-2xl font-bold text-[#b91c1c] mb-1">Admin Login</h2>
                <p className="text-center italic text-gray-600 mb-6">Droplog – Delivery Entry</p>

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-2 border-gray-300 px-4 py-3 rounded-md w-full pr-10 focus:outline-none focus:border-[#b91c1c]"
                    />
                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>

                <button
                    type="submit"
                    className="mt-6 bg-[#b91c1c] text-white font-semibold py-3 rounded-md w-full hover:bg-red-800 transition cursor-pointer"
                >
                    LOGIN
                </button>
            </form>
        </div>
    );
}

export default Login;
