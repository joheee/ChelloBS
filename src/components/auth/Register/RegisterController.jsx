import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import {db} from '../../../firebase/FirebaseHelper'
import {collection, addDoc} from 'firebase/firestore'  

function CreateNewUser(email, password) {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
    .then( e => {
        console.log(e.user.uid + " " + e.user.email + " " + password)
        try {
            const colls = collection(db, 'Users')
            const docRef = addDoc(colls, {
                uid: e.user.uid,
                email: e.user.email, 
                password: password
            }).then(() => console.log('success added'))
        } catch (error) {
        }
    })
}


export default CreateNewUser