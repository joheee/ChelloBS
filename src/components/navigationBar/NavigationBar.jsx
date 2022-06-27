import { Link } from "react-router-dom"
import { useEffect, useState } from 'react'
import { query, collection, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/FirebaseHelper'

function NavBar ({id}) {
    // console.log(id)
    
    const [img, setImg] = useState('')
    
    useEffect(() => {
        handleRenderImage()
        // console.log('render')
    }, [])
    
    const handleRenderImage = async () => {
        const queryStatement = query(collection(db, "Users"), where('uid', '==', id)) 
        let getQuery = await getDocs(queryStatement)
        getQuery.forEach((e) => {
            // render image
            setImg(e.data().image)
        })
    }
     
    
    return (
        <div className="flex justify-between p-1 bg-blue-500 px-10 text-white font-mono text-xl">
            <div className="flex">
                <Link to="" className="mr-10 hover:bg-blue-200/50  p-1 rounded">CHello</Link>
                <Link to={`/workspace/${id}`} className="hover:bg-blue-200/50 p-1 rounded">workspace</Link>
            </div>
            <Link to={`/profile/${id}`} className="hover:bg-blue-200/50 p-1 rounded flex">
                <div className="rounded-full mr-3 overflow-hidden">
                    <img src={img} className="w-8"/>
                </div>
                <div className="">profile</div>
            </Link>
        </div>
    )
}

export default NavBar