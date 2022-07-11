import { Link, useParams } from "react-router-dom";

const WorkspaceItem = ({yourWorkspace, trigger}) => {
    
    const {id} = useParams()
    
    return ( 
        <div className="">
            <div className="flex flex-wrap justify-center">
                        <div className="bg-blue-200/50 hover:scale-105 duration-300 rounded w-64">
                    <Link to={`/board/${yourWorkspace.workspaceID}/${id}`}>
                            <div className="p-5 flex flex-col font-mono items-center justify-center">
                                <div className="bg-blue-700 w-52 h-20 rounded-lg"></div>
                                <h1 className="font-black text-3xl my-2 break-words text-center">{yourWorkspace.workspaceTitle}</h1>
                                <h1 className="font-black text-2xl text-center">{yourWorkspace.workspaceVisibility}</h1>
                                <div className="flex gap-3 mt-3">
                                </div>
                            </div>
                    </Link>
                        </div>
                </div>
        </div>
    );
}
 
export default WorkspaceItem;