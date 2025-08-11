import React from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate()


    const goto =() =>{
        navigate('/driver-travels')
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4f8]">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sign In to Admin Account</h1>
      {/* Sign in form */}
      <form className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            placeholder="Enter phone number"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={goto}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Signup;
