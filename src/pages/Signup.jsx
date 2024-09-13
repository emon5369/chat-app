import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

function Signup() {
    const { user, handleSignup } = useAuth()
    const [credentials, setCredentials] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const navigate= useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    }

    return (
        <div className="h-full flex items-center justify-center">
            <div className="border border-blue-500 py-6 px-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Create your account!
                </h2>

                <form onSubmit={(e) => { handleSignup(e, credentials) }}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Enter your name"
                            value={credentials.name}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                            value={credentials.email}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Enter your password"
                            value={credentials.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Confirm your password"
                            value={credentials.confirmPassword}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-500 text-white text-lg font-semibold font-mono rounded-lg hover:bg-blue-700 transition duration-200"
                    >Sign up</button>
                </form>

                <p className="pt-2 text-center text-gray-400">Already have an account? <Link to='/login' className='text-white font-semibold hover:text-green-600'>Login</Link> </p>
            </div>
        </div>
    )
}

export default Signup