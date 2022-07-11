import NavBar from "../navigationBar/NavigationBar";
import {useParams} from "react-router-dom"
import UserPreferences from "./UserPreferences";
import LogoutForm from "./Logout";
import ConfidentForm from "./ConfidentInformation";
import NotificationForm from "./NotificationProfile";

const Profile = () => {
    
    const {id} = useParams()
    
    return ( 
        
        <div>
            <NavBar id={id}/>
            <div className="h-screen">
                <UserPreferences id={id}/>
                <div className="flex m-5 justify-center">
                    <ConfidentForm id={id}/>
                    <div className="">
                        <NotificationForm id={id}/>
                        <LogoutForm/>
                    </div>
                </div>
            </div>
        </div>
    
    );
}
 
export default Profile;