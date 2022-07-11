import LoginForm from './components/auth/Login/Login.jsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Workspace from './components/workspace/Workspace.jsx'
import Profile from './components/profile/Profile.jsx'
import BoardContainer from './components/board/Board.jsx'
import CardListContainer from './cards/CardListContainer.jsx'
import {RefreshPageWorkspace, RefreshPageBoard, RefreshPageCardListAndCard} from './components/refresh/RefreshPage.jsx'
import InvitationWorkspacePageContainer from './components/notification/InvitationPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<LoginForm/>}></Route>
        <Route exact path="/workspace/:id" element={<Workspace/>}></Route>
        <Route exact path="/profile/:id" element={<Profile/>}></Route>
        <Route exact path="/board/:workspaceID/:userID" element={<BoardContainer/>}></Route>
        <Route exact path="/card/:workspaceID/:boardID/:userID/:boardTitle" element={<CardListContainer/>}></Route>
        
        <Route exact path='/refresh/:userID' element={<RefreshPageWorkspace/>}></Route>
        <Route exact path="/refresh/board/:workspaceID/:userID" element={<RefreshPageBoard/>}></Route>
        <Route exact path="/refresh/card/:workspaceID/:boardID/:userID/:boardTitle" element={<RefreshPageCardListAndCard/>}></Route>
        
        <Route exact path="/invitation/workspace/:workspaceID/:userID/:title/:messageID" element={<InvitationWorkspacePageContainer/>}></Route>
        <Route exact path="/invitation/board/:boardID/:userID/:title/:messageID" element={<InvitationWorkspacePageContainer/>}></Route>
        <Route exact path="/invitation/card/:boardID/:cardListID/:cardID/:userID/:title/" element={<InvitationWorkspacePageContainer/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;