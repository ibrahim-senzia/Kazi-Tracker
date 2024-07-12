import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from './Context/UserContext'

function Register() {

    const { register } = useContext(UserContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [name, setName] = useState('')

    console.log(email, password, repeatPassword, name);

    function handleSubmit(e){
        e.preventDefault();

        register(name, email, password);
    }

    return (
        <div className='bg-white px-10 py-20 rounded-3xl border-2 border-gray-50'>
            <h1 className="text-5xl font-semibold">Welcome to Kazi-Tracker</h1>
            <p className='font-medium text-lg text-gray-500 mt-4'>Please Enter your details.</p>
            <form onSubmit={handleSubmit}>
                <div className='mt-8'>
                    <div>
                        <label className='text-lg font-medium' for='firstName'>Name</label>
                        <input className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent' placeholder='Enter your name' type='text' id='firstName' value={name || "" } onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className='text-lg font-medium'>Email</label>
                        <input className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent' placeholder='Enter your email' type='email' value={email || ""} onChange={(e)=> setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className='text-lg font-medium'>Password</label>
                        <input className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent' placeholder='Enter your password' type='password' value={password || ""} onChange={(e)=> setPassword(e.target.value)} ame="password" id="password" required />
                    </div>
                    <div>
                        <label className='text-lg font-medium'>Confirm Password</label>
                        <input className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent' placeholder='Confirm password' type='password' value={repeatPassword || ""} onChange={(e)=> setRepeatPassword(e.target.value)} name="password" id="password"/>
                    </div>
                    <div className='mt-8 flex flex-col gap-y-4'>
                        <button className='active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold' type='submit'>Sign Up</button>

                    </div>
                    <div className='mt-8 flex justify-between items-center'>
                        <p className='font-medium text-base'>Have an account already?</p>
                        <button className='text-violet-500 text-base font-medium' type='button'> <Link to='/LogIn'>LogIn</Link></button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register