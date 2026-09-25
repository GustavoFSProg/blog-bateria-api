import md5 from "md5";
import jwt from "jsonwebtoken";

export function encryptPassword(password: any) {
  return md5(password, process.env.SECRET as string & { asBytes: true });
}

export function isEmail(email: any) {
  // eslint-disable-next-line no-useless-escape
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

export function isPassword(password: any) {
  const validade = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
  if (validade.test(password)) return true;
  return false;
}

export async function generateToken(dados: any) {
  const { email, FirstName } = dados;
  return jwt.sign({ email, FirstName }, process.env.SECRET as string, {
    expiresIn: "1d",
  });
}

// export async function decodeToken(token) {
//   return jwt.decode(token,  process.env.SECRET as string & { asBytes: true }))
// }

export async function verifyToken(token: any) {
  return (
    jwt.verify(
      token,
      process.env.SECRET as string & { asBytes: true },
    ) as String,
    (error: any, decode: any) => {
      if (error) return { error } as any;
      return { decode } as any;
    }
  );
}

// export async function isUser(data: any) {
//   const { email, password } = data
//   const user = await User.findOne(
//     password ? { email, password: encryptPassword(password) } : { email }
//   )
//   return user
// }

// export async function createUser(data: any) {
//   const user = await User.create({
//     name: data.name,
//     email: data.email,
//     avatar: data.avatar || null,
//     password: encryptPassword(data.password),
//   })
//   return user
// }

// export async function getCurrentUser(email: any) {
//   const currentUser = await User.findOne({ email })
//   return currentUser
// }
