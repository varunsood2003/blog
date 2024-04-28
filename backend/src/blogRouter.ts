import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, verify, sign } from "hono/jwt";
import { createBlogPost,updateBlog } from "@varunsood/medium-common";
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables:{
    userId: string
  }
}>();

blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization")||"";
    try {
        const user = await verify(authHeader,c.env.JWT_SECRET);
    if(user){
        c.set("userId",user.id);
        await next();
    }else{
        return c.json({
            message: "User not authenticated"
        })
    }
    } catch (error) {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
});

blogRouter.post("/" ,async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const {success} = createBlogPost.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message: "Invalid inputs for blog"
    })
  }
  const authorId = c.get("userId");
  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId
    },
  });
  return c.json({
    id: blog.id,
  });
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const {success} = updateBlog.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message: "Invalid inputs for blog"
    })
  }
  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({
    id: blog.id,
  });
});

blogRouter.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      const blogs = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });
    return c.json({
        blogs
    })
});


blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blog = await prisma.post.findFirst({
        where: {
          id: id,
        },
        select: {
          content: true,
          title: true,
          id: true,
          author: {
              select: {
                  name: true
              }
          }
      }
      });
      console.log(blog);
      return c.json({
        blog,
      });
  } catch (error) {
    c.status(411);
    return c.json({
        message: "Cannot find the blog"
    })
  }
});

blogRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  try {
    const existingBlog = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    
    if (!existingBlog) {
      c.status(404);
      return c.json({
        message: "Blog not found",
      });
    }
    await prisma.post.delete({
      where: {
        id: id,
      },
    });
    return c.json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    c.status(500);
    return c.json({
      message: "Internal server error",
    });
  }
});
