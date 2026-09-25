import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { convertBufferToString, uploader } from "../config/uploader";
import md5 from "md5";
import { generateToken } from "../token";

var cloudinary = require("cloudinary");

const prismaDB = new PrismaClient();

var imagem = "";
let figura = null;

async function CreateAdmin(req: Request, res: Response) {
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

    const user = await prismaDB.admin.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: String(
          md5(
            req.body.password,
            process.env.SECRET as string & { asBytes: true },
          ),
        ),
        avatar: secure_url,
      },
    });

    return res
      .status(201)
      .json({ message: "Usuario cadastrado  com sucesso!!", user });
  } catch (error) {
    return res.status(201).json({ message: "ERRO no cadastro!!", error });
  }
}

async function GetAdmin(req: Request, res: Response) {
  try {
    const data = await prismaDB.admin.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(201).json(data);
  } catch (error) {
    return res.status(201).json({ message: "ERRO!!", error });
  }
}

async function Login(req: Request, res: Response) {
  try {
    const data = await prismaDB.admin.findUnique({
      where: {
        email: req.body.email,
        password: String(
          md5(
            req.body.password,
            process.env.SECRET as string & { asBytes: true },
          ),
        ),
      },
    });

    if (!data) {
      return res.status(400).json({
        Mensagem: "Usuário não encontrado, email ou senha incorretos",
      });
    }

    const dados = { email: data.email, name: data.name };

    const token = await generateToken(dados);

    return res.status(200).json({ data, token });
  } catch (error) {
    return res.status(400).json(error);
  }
}

export default { CreateAdmin, GetAdmin, Login };
