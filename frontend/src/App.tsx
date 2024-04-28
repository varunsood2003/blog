import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Blog from "./pages/blog";
import Blogs from "./pages/Blogs";
import NewBlog from "./pages/NewBlog";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
         <Route path='/' element={<Navigate to='/signin' />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/blog/:id?" element={<Blog/>}/>
          <Route path="/blogs" element={<Blogs/>}/>
          <Route path="/publish" element={<NewBlog/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
