import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/FirebaseHelper'
import { query, collection, doc, where, getDocs, updateDoc } from 'firebase/firestore'

const NotificationForm = () => {
    
    const {id} = useParams()
    const [notification, setNotification] = useState() 
    
    let inputRadio = 2
    const handleRadio = (e) => {
        inputRadio = e.target.value
    }
    
    useEffect(()=>{
        renderNotification()
    }, [])
    
    const renderNotification = async () => {
        const queryStatement = query(collection(db, 'Users'), where('uid', '==', id))
        let getQuery = await getDocs(queryStatement)
        console.log(getQuery)
        getQuery.forEach((e)=>{
            if(e.data().notification == 1) setNotification(1 + ' hour')
            if(e.data().notification == 2) setNotification(2 + ' hours')
            if(e.data().notification == 99) setNotification('never')  
        })
    }
    
    const getNotification = async () => {
        const queryStatement = query(collection(db, 'Users'), where('uid', '==', id))
        let getQuery = await getDocs(queryStatement)
        console.log(getQuery)
        getQuery.forEach((e)=>{
            const docRef = doc(db, 'Users', e.id)
            updateCurrentNotification(docRef)
        })
    }
        
    const updateCurrentNotification = async (docRef) => {
        await updateDoc(docRef, {
            notification: inputRadio
        }).then(()=> {
            setUINotification()       
            console.log('success update notification in docs')
        })
    }
    
    const setUINotification = () => {
        if(inputRadio == 1) setNotification(1 + ' hour')
        if(inputRadio == 2) setNotification(2 + ' hours')
        if(inputRadio == 3) setNotification(3 + ' hours')
        if(inputRadio == 99) setNotification('never')
    }
    
    const handleConfirm = () => {
        console.log(inputRadio)
        getNotification()
    }
    
    return (  
        <div>
        <div className=" flex items-center justify-center ml-5 mb-5">
            <div className="bg-blue-200/50 w-80 flex flex-col py-6 px-4 font-mono items-center rounded">
                
                <div className="text-lg font-bold">
                    notification status : {notification}
                </div>
                
                <div className="div">
                    <div className="flex">
                        <input className="appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" value={1} name="johe" onChange={(e)=> handleRadio(e)}/>
                        <label className="text-gray-800">
                        1 hour
                        </label>
                    </div>
                    <div className="flex align-center">
                        <input className="appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" value={2} name="johe" onChange={(e)=> handleRadio(e)}/>
                        <label className="text-gray-800">
                        2 hour
                        </label>
                    </div>
                
                    <div className="flex align-center">
                        <input className="appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" value={99} name="johe" onChange={(e)=> handleRadio(e)}/>
                        <label className="text-gray-800 no-underline">
                        never
                        </label>
                    </div>
                </div>
                
                <button className="bg-blue-700 px-7 w-32 my-3 rounded hover:bg-blue-700/50 text-white" onClick={()=> handleConfirm()}>confirm</button>
            </div>
        </div>
    </div>
    );
}
 
export default NotificationForm;