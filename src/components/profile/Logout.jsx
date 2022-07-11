import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from 'firebase/auth'

const LogoutForm = () => {
    const navigate = useNavigate()
    
    const logoutSchema = () => {
        const auth = getAuth()
        signOut(auth).then(() => {
            navigate('/')
        })
    }
        
    return ( 
        <div className="flex justify-center h-7 ml-5">
            <button onClick={() => logoutSchema()} className="bg-blue-700 px-7 h-full w-32 rounded hover:bg-blue-700/50 text-white">logout</button>
        </div>
    );
}
 
export default LogoutForm;