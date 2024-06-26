import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import  {BACKEND_URL}  from "../config";
import { Avator } from "../pages/BlogCard";
import { Appbar } from "../components/Appbar";

export interface Blog {
  title: string;
  content: string;
  author: {
    name: string;
  };
}

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState({} as Blog | (() => Blog))

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setBlog(res.data.blog);
        console.log(res.data.blog);
      });
  }, [id]);

  if (!blog || !blog.title || !blog.author) {
    const token = localStorage.getItem("token");
    if(!token){
      return("You are not logged in, Kindly Log in first")
    }
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <Appbar/>
      <div className="flex justify-center">
        <div className="flex flex-col px-10 w-full pt-200 max-w-screen-xl pt-12">
          <div className="col-span-8">
            <div className="text-5xl font-extrabold">{blog.title}</div>
            <div className="pt-4">{blog.content}</div>
          </div>
          <div className="col-span-4 pt-15">
            <div className="text-slate-600 text-lg">Author</div>
            <div className="flex w-full">
              <div className="pr-4 flex flex-col justify-center">
                <Avator name={blog.author.name} />
              </div>
              <div>
                <div className="text-xl font-bold">{blog.author.name}</div>
                <div className="pt-2 text-slate-500">
                  Random catch phrase about the author's ability to grab the user's attention
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
