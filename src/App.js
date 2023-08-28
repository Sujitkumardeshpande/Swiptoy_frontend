import "./App.css";
import AddStory from "./components/AddStory/AddStory";
import Bookmark from "./components/Bookmarkpage/Bookmark";
import EditStory from "./components/EditStory/EditStory";
import NotFound from "./components/Notfound/Notfound";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import StoryPage from "./pages/StoryPage";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Registerpage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/story/:id" element={<StoryPage />} />
        <Route path="/addstory" element={<AddStory />} />
        <Route path="/editstory/:id" element={<EditStory />} />
        <Route path="/bookmarked" element={<Bookmark />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
