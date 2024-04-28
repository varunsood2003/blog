import { Hono } from 'hono'
import { userRouter } from './userRouter';
import { blogRouter } from './blogRouter';
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings:{
    DATABASE_URL : string
  }
}>()
const corsOptions = {
  origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);


export default app
