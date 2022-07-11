import { Link } from "react-router-dom";

const WorkspaceList = ({idWorkspace, workspaceRender, idUser}) => {
    
    
    let count = 0
    return ( 
        <div className="flex flex-wrap justify-center">
            {workspaceRender.map((workspaceItem) => (
                <div key={count}>
                        <div className="bg-blue-200/50  rounded w-64 m-5">
                    <Link to={`/board/${idWorkspace[count++]}/${idUser}`}>
                            <div className="p-5 flex flex-col font-mono items-center justify-center">
                                <div className="bg-blue-700 w-52 h-20 rounded-lg"></div>
                                <h1 className="font-black text-3xl my-2 break-words text-center">{workspaceItem.workspaceTitle}</h1>
                                <h1 className="font-black text-2xl text-center">{workspaceItem.workspaceVisibility}</h1>
                                <div className="flex gap-3 mt-3">
                                    {workspaceItem.workspaceAdmin.filter(admin => admin === idUser).map(e => (
                                        <div key={count} className="bg-green-300 px-2 rounded">admin</div>    
                                    ))}
                                    <div className="bg-yellow-200 px-2 rounded">{workspaceItem.workspaceMember.length} member(s)</div>
                                </div>
                            </div>
                    </Link>
                        </div>
                </div>
            ))}
        </div>
    );
}
 
export default WorkspaceList;