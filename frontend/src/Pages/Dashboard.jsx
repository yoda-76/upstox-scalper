import React, { useState } from 'react';
import { Link } from 'react-router-dom';


export default function Dashboard() {
    const {isAccessTokenGenerated,keyAndSecretExist,key}=JSON.parse(sessionStorage.getItem("data"))
    const email=sessionStorage.getItem("email")

    const [form, setForm] = useState({ Key: "", secret: "" });

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
        try {
            const response = await fetch("http://localhost:4000/profile/saveKeyAndSecret", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept":"/",
                    "token":sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    key: form.Key,
                    secret: form.secret
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to save key and secret');
            }
    
            const data = await response.json();
            console.log("key and secret saved", data); 
            // sessionStorage.setItem('token', data.token);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const generateTokenHandler =()=>{
        const url=`https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${key}&redirect_uri=http://localhost:4000/auth&state=${email}`
        window.open(url, '_blank');
        // console.log(email, key
        // )
    }
    

    return (
        <div className='bg-gray-800 h-screen flex flex-col justify-between items-center text-white'>
            <div className='bg-sky-600 w-min h-min p-10 mt-40'>
            <h1 className='text-white text-3xl text-center'> Add Your upstox key and secret</h1>
            <form className='bg-black flex flex-col gap-1 justify-center items-center' onSubmit={handleSubmit}>
                <div className='m-2 flex items-center'>
                    <label htmlFor='Key' className='text-white'>Key:</label>
                    <input
                        type='Key'
                        name='Key'
                        value={form.Key}
                        onChange={handleChange}
                        className='flex-grow bg-gray-200 text-black px-2 py-1 rounded-md ml-2'
                    />
                </div>
                <div className='flex m-2 justify-between'>
                    <label htmlFor='secret'  className='text-white'>secret:</label>
                    <input
                        type='secret'
                        name='secret'
                        value={form.secret}
                        onChange={handleChange}
                        className='bg-gray-200 text-black px-2 py-1 rounded-md'
                    />
                </div>
                <button type="submit" className='w-6/12 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md'>
                    Submit
                </button>
            </form>

            </div>

            <div className='w-full flex justify-end  bg-black align-bottom'>
                {isAccessTokenGenerated?<div className="text-center w-1/5 m-10 bg-green-500 text-white font-bold py-2 rounded-md">Generate Token</div>:<button onClick={generateTokenHandler} className="w-1/5 m-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md">Generate Token</button>}
                <button onClick={()=>{
                    window.location.href = "/tradingConsole";
                }} className="w-1/5 m-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md">Trade Now</button>

            </div>
        
        </div>
    );
}
