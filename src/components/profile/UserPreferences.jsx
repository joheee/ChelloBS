import { useParams } from "react-router-dom";
import { useState } from 'react'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import {db, storages} from '../../firebase/FirebaseHelper.js'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage' 

const UserPreferences = () => {
    
    const {id} = useParams()
    const [image, setImage] = useState('')
    const [username, setUsername] = useState('lorem')
    const [dob, setDob] = useState('not born yet')    
    
    const renderProfile = async () => {
        const queryStatement = query(collection(db, "Users"), where('uid', '==', id)) 
        let getQuery = await getDocs(queryStatement)
        getQuery.forEach((e) => {
            // render image
            setImage(e.data().image)
            setUsername(e.data().username)
            setDob(e.data().dob)
        })    
    }
    renderProfile()
    
    
    const getBio = async () => {
        const queryStatement = query(collection(db, "Users"), where('uid', '==', id)) 
        let getQuery = await getDocs(queryStatement)
        getQuery.forEach((e) => {
            
            const docRef = doc(db, 'Users', e.id)
            
            updateBio(docRef)
            
        })    
    }
    
    const updateBio = async (docRef) => {
        console.log(urlInput + " " + handleUsernameInput + " " + handleDateInput)
        await updateDoc(docRef, {
            image: urlInput,
            username: handleUsernameInput,
            dob: handleDateInput
        }).then(()=>{
                console.log('success update')
                renderProfile()
            })
    }
    
    var handleUsernameInput = ''
    var handleDateInput = ''
    var urlInput= ''
    const handleUpdateProfile = () => {
        getBio()
    }
     
    const handleImage = async (e) => {
        const file = e.target.files[0].name
        const userRef = ref(storages, `${id}/${file}`)
        const metadata = {contentType : 'profile pic'}
        const uploadTask = await uploadBytes(userRef, e.target.files[0], metadata)
        getDownloadURL(userRef).then((url) => {
            urlInput = url
            console.log(urlInput)
        })
    }
    
    const handleUsername = (e) => {
        handleUsernameInput = e.target.value
        console.log(handleUsernameInput)
    }
    
    const handleDate = (e) => {
        handleDateInput = e.target.value
        console.log(e.target.value + " in var " + handleDateInput)
    }
    
    return ( 
        <div>
            <div className=" flex justify-center items-center font-mono">
                <div className="bg-blue-200/50 w-80 mt-5 px-4 py-6 rounded flex flex-col justify-center items-center">
                    
                    <div className="rounded-full overflow-hidden mb-5">
                        <img src={image} alt="" className="w-44 h-44"/>
                    </div>
                    <input onChange={(e) => handleImage(e)} type="file" src="images" className="mb-5"/>
                    <input onChange={(e) => handleUsername(e)} type="text" className="p-0.5 px-2 mb-5 rounded" name="" id="" placeholder="username"/>
                    <input onChange={(e) => handleDate(e)} type="date" name="" id="" className="px-2"/>
                </div>
                <div className="bg-blue-200/50 m-5 px-4 w-80 py-6 rounded flex text-xl flex-col justify-center items-start">
                    <div>{username}'s profile</div>                
                    <div>date of birth   : {dob}</div>
                    <button onClick={() => handleUpdateProfile()}className="bg-blue-700 w-32 mt-3 rounded hover:bg-blue-700/50 text-white">update</button>
                    
                </div>
            </div>
        </div>
    
    );
}
 
export default UserPreferences;