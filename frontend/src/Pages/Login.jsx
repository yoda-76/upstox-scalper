import React, { useState } from 'react';
import { Link } from 'react-router-dom';


export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        // console.log(form)
        const { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form)
        try {
            const response = await fetch("https://3.109.144.101/profile/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept":"/"
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            });
            if (!response.ok) {
                throw new Error('Failed to log in');
            }
    
            const data = await response.json();
            console.log("logged in"); 
            console.log(data)
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('data', JSON.stringify(data.data));
            sessionStorage.setItem("email",form.email)
            window.location.href = "/dashboard";


        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    

    return (
        <div className='bg-gray-800 h-screen flex flex-col justify-center items-center text-white'>
            <div className='bg-sky-600 w-min h-min p-10'>
            <h1 className='text-white text-3xl text-center'>Login</h1>
            <form className='bg-black flex flex-col gap-1 justify-center items-center' onSubmit={handleSubmit}>
                <div className='m-2 flex items-center'>
                    <label htmlFor='email' className='text-white'>Email:</label>
                    <input
                        type='email'
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                        className='flex-grow bg-gray-200 text-black px-2 py-1 rounded-md ml-2'
                    />
                </div>
                <div className='flex m-2 justify-between'>
                    <label htmlFor='password'  className='text-white'>Password:</label>
                    <input
                        type='password'
                        name='password'
                        value={form.password}
                        onChange={handleChange}
                        className='bg-gray-200 text-black px-2 py-1 rounded-md'
                    />
                </div>
                <button type="submit" className='w-6/12 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md'>
                    Submit
                </button>
            </form>

        </div>
        <div className='mt-4 flex items-center justify-around gap-3 	'>
            <p className='text-gray-300'>New User?</p>
                <Link to="/register" className='bg-blue-500 hover:bg-blue-600 text-white font-bold  px-4 rounded'>
                    Register
                </Link>
        </div>
        </div>
    );
}
