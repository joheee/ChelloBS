import { db } from "../../../firebase/FirebaseHelper"
import {useState} from 'react'
import CreateNewUser from './RegisterController'
import Login from '../Login/Login'
import MessageDisplay from '../../messages/MessageDisplay'

function RegisterForm () {
    // console.log(db)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [conPass, setConPass] = useState('')
    const [isSame, setIsSame] = useState(false)
    const [login, setLogin] = useState(false)
    
    // console.log(email + " " + password + " " + conPass + " " + isSame)
    
    const [displayMessages, setDisplayMessages] = useState('')
    const checkPassSame = () => {
        setDisplayMessages('')
        if(conPass === password && password !== '' && conPass !== '' && email !== '') {
            setIsSame(true)
            CreateNewUser(email,password)
            setLogin(true)
        }
        else {
            setDisplayMessages('invalid register')
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        checkPassSame()
    }
    
    const handleLogin = () => {
        setLogin(true)
    }
    
    if(login === false){
        return(
            <div>
                <div className="bg-blue-400 p-5 flex items-center justify-center h-screen">
                    <form onSubmit={(e) => handleSubmit(e)} className="bg-blue-200/50 flex flex-col p-2 font-mono items-center rounded">
                        <h1 className="font-black text-3xl my-3">register</h1>
                        <input onChange={(e) => setEmail(e.target.value)} type="text" className="m-2 p-0.5 px-2 rounded" name="" id="" placeholder="email"/>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" className="m-2 p-0.5 px-2 rounded" name="" id="" placeholder="password"/>
                        <input onChange={(e) => setConPass(e.target.value)} type="password" className="m-2 p-0.5 px-2 rounded" name="" id="" placeholder="confirm password"/>
                        <div className='font-black text-red-600'>{displayMessages}</div>
                        <button type="submit" className="bg-blue-700 px-2 w-32 my-3 rounded hover:bg-blue-700/50 text-white">register</button>
                        <button onClick={() => handleLogin()} className="bg-blue-700 px-7 w-32 mb-3 rounded hover:bg-blue-700/50 text-white">login</button>
                    </form>
                </div>
            </div>
        )
    }
    else {
        return (
            <Login/>
        )
    }
}

export default RegisterForm