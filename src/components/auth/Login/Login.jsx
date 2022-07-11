import RegisterForm from '../Register/Register'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getAuth, signInWithEmailAndPassword, AuthErrorCodes} from 'firebase/auth'


function LoginForm () {

    const [register, setRegister] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleRegister = async () => {
        setRegister(true)
    }

    const loginSchema = () => {
        LoginUser(email, password)
    }

    const LoginUser = (email, password) =>{
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            navigate(`/workspace/${userCredential.user.uid}`)
        })
        console.log(AuthErrorCodes)
    }

    if(register === true) {
        return (
            <RegisterForm/>
        )
    } else {
        return(
            <div>
                <div className="bg-blue-400 p-5 flex items-center justify-center h-screen">
                    <div className="bg-blue-200/50 flex flex-col p-2 font-mono items-center rounded">
                        <h1 className="font-black text-3xl my-3">login</h1>
                        <input onChange={(e) => setEmail(e.target.value)} type="text" className="m-2 p-0.5 px-2  rounded" name="" id="" placeholder="email"/>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" className="m-2 p-0.5 px-2 rounded" name="" id="" placeholder="password"/>
                        <button onClick={() => loginSchema()} className="bg-blue-700 px-7 w-32 my-3 rounded hover:bg-blue-700/50 text-white">login</button>
                        <button onClick={() => handleRegister()} className="bg-blue-700 w-32 mb-3 rounded hover:bg-blue-700/50 text-white">register</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginForm