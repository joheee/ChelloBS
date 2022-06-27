import { createContext } from "react";
import { useParams } from "react-router-dom";
import MessageDisplay from "../messages/MessageDisplay";
import NavBar from "../navigationBar/NavigationBar";
import NotificationContainer from "../notification/Notification";
import WorkspaceContainer from "./workspaceComponent/WorkspaceContainer";

export const CurrentUserContext = createContext()
 
const Workspace = () => {
    
    // passing through props
    const {id} = useParams()
    // console.log(id)

    return ( 
        <div>
            {/* <MessageDisplay text={'you have been invited to lorem\'s workspace'}/> */}
            <NavBar id={id}/>
            <CurrentUserContext.Provider value={id}>
                <div className="flex flex-col items-center">
                    <div className="text-7xl font-black text-blue-500 my-5">Personal information</div>
                    <NotificationContainer/>
                    <div className="text-7xl font-black text-blue-500 my-5">Your workspace</div>
                    <WorkspaceContainer/>
                </div>
            </CurrentUserContext.Provider>
        </div>
    );
}
 
export default Workspace;