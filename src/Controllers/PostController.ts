import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { convertBufferToString, uploader } from "../config/uploader";
import md5 from "md5";
import { generateToken } from "../token";

var cloudinary = require("cloudinary");

const prismaDB = new PrismaClient();

async function CreatePost(req: Request, res: Response) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const file = convertBufferToString(req);

    if (file === undefined)
      return res
        .status(400)
        .json({ error: "Error converting buffer to string" });

    const { secure_url } = await uploader.upload(file);

    const post = await prismaDB.posts.create({
      data: {
        title: req.body.title,
        image: secure_url,
        text: req.body.text,
        description: req.body.text,
        likes: req.body.likes,
        views: req.body.views,
      },
    });

    return res
      .status(201)
      .json({ message: "Post cadastrado  com sucesso!!", post });
  } catch (error) {
    return res
      .status(201)
      .json({ message: "ERRO no cadastro do post!!", error });
  }
}

async function GetPosts(req: Request, res: Response) {
  try {
    const data = await prismaDB.posts.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(201).json(data);
  } catch (error) {
    return res.status(201).json({ message: "ERRO!!", error });
  }
}

async function GetOnePost(req: Request, res: Response) {
  try {
    const data = await prismaDB.posts.findUnique({
      where: { id: req.body.id },
    });

    if (!data) {
      return res.json("Erro na requisição do post!");
    }

    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
}

export default { CreatePost, GetOnePost, GetPosts };
