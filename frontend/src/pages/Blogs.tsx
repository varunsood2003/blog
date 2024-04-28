import { useState,useEffect } from "react";
import { Appbar } from "../components/Appbar";
import BlogCard from "./BlogCard";
import axios from "axios";
import  {BACKEND_URL}  from "../config";
import { useNavigate } from "react-router-dom";

export interface Blog{
    id: string;
    author: {
      name: string;
    };
    content: string;
    title: string; 
}

const Blogs = () => {
  const [blogs,useBlogs] = useState<Blog[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData =async ()=>{
      try {
        const token = localStorage.getItem('token');
        if(!token){
          console.log("token not found");
          navigate("/signin")
          return;
        }
        const config = {
          headers:{
            "Authorization": `${token}`
          }
        };
        const data = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,config);
        useBlogs(data.data.blogs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [])
  if(blogs.length === 0){
    return(
      <>
      <Appbar/>
      <div className="pl-5">Loading...</div>
      </>
    );
  }
  return (
    <div>
      <Appbar />
      <div className="flex justify-center p-5 cursor-pointer">
        <div className="max-w-xl">
          {blogs.map((blog)=>{
            return(
              <div key={blog.id} onClick={()=>{
                navigate(`/blog/${blog.id}`)
              }}>
                <BlogCard
              authorName={blog.author.name}
              content={blog.content}
              publishedData="10/10/1000"
              title={blog.title}
              />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
