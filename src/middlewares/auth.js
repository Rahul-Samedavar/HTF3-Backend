import { verifyToken ,} from "../utils/jwt.js";

export const authenticate = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token missing' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid auth header format' });
  }

  const token = parts[1];

  const data = verifyToken(token)
  if (!data.valid || ! typeof(data.decoded) == 'object') 
    return res.status(400).json({ error: 'Unautherized' });

  const { userID, email, username} = data.decoded
  if (!userID | !email | !username) 
    return res.status(400).json({ error: 'Unautherized' });

  req.auth = {userID, username, email}
  next()
}