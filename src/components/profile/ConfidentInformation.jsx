import { useParams } from "react-router-dom";
import { query, collection, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/FirebaseHelper'
import { getAuth,updateEmail, updatePassword,signInWithEmailAndPassword } from "firebase/auth";

const ConfidentForm = () => {
    
    const {id} = useParams()
    
    let userObj = {userEmail:'', userPass:''}
    const [user, setUser] = useState(userObj)
    
    const[trigger, setTrigger] = useState(0)
    
    useEffect(()=>{
        getUser()
        console.log('perform get user')
    }, [trigger])
    
    const getUser = async () => {
        const queryState = query(collection(db, 'Users'), where('uid', '==', id));
        let queryResult = await getDocs(queryState)
        queryResult.forEach((e) => {
            let queryObj = {userEmail:e.data().email, userPass:e.data().password}
            setUser(queryObj)
        })
        return queryResult
    }
    
    const updateUserMecha = async (e) => {
        console.log('perform update user')
        let updateInputObj = {email:inputEmail, password:inputPass}
        console.log(updateInputObj)
        
        // update in authentication
        const auth = getAuth()
        console.log(e.data().email + " " + e.data().password)
        signInWithEmailAndPassword(auth, e.data().email, e.data().password).
        then((user) => {
            updateEmail(auth.currentUser, updateInputObj.email).then(() => {
                updatePassword(auth.currentUser, updateInputObj.password).then(()=> {
                    console.log('succes change password')
                    updateInDocs(updateInputObj.email, updateInputObj.password, e.id)
                })
            }).then(()=>{
                setTrigger(1)
                console.log('succes update in docs and auth ' + trigger)
                getUser()
            })
        })
    }
    
    const updateInDocs = async (email, password, currentID) =>{
        // update in docs
        console.log(email + " " + password)
        const findUserToUpdate = doc(db,  'Users', currentID)
        const queryUpdateUser = await updateDoc(findUserToUpdate, {
            email: email,
            password: password
        }).then(()=> console.log('success update user in document'))
    }
    
    const updateUser = async () => {
        const getCurrentUser  = await getUser()
        getCurrentUser.forEach((e) => {
            updateUserMecha(e)
        })
    }
    
    const handleChangeEmailPass = () => {
        updateUser()
    }
    
    let inputEmail = ''
    const handleChangeEmail = (e) => {
        inputEmail = e.target.value
    }
    
    let inputPass = ''
    const handleChangePass = (e) => {
        inputPass = e.target.value
    }
    
    return (
        <div>
            <div className="flex items-center justify-center">
                <div className="bg-blue-200/50 w-80 flex flex-col py-6 px-4 font-mono items-center rounded">
                    <h1 className="font-bold text-lg mt-3">email : {user.userEmail}</h1>
                    <h1 className="font-bold text-lg ">password : {user.userPass}</h1>
                    <input onChange={(e) => handleChangeEmail(e)} type="text" className="m-2 p-0.5 px-2  rounded" name="" id="" placeholder="change email"/>
                    <input onChange={(e) => handleChangePass(e)} type="password" className="m-2 p-0.5 px-2 rounded" name="" id="" placeholder="change password"/>
                    <button onClick={() => handleChangeEmailPass()} className="bg-blue-700 px-7 w-32 my-3 rounded hover:bg-blue-700/50 text-white">confirm</button>
                </div>
            </div>
        </div>
    );
}
 
export default ConfidentForm;