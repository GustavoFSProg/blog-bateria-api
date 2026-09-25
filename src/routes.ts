import { Request, Response, Router } from "express";
import AdminController from "./Controllers/AdminController";
import { multerConfig } from "./config/uploader";
import PostController from "./Controllers/PostController";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  return res.json("Api Rodando!");
});

// Admin Routes
routes.post("/create-admin", multerConfig, AdminController.CreateAdmin);
routes.get("/get-admins", AdminController.GetAdmin);
routes.post("/login", AdminController.Login);

// posts
routes.post("/create-post", multerConfig, PostController.CreatePost);
routes.get("/get-posts", PostController.GetPosts);

export default routes;
