import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '48h';

export function signToken (payload, expires_in = JWT_EXPIRES_IN) {
  if (!JWT_SECRET) 
    throw new Error('JWT_SECRET is not defined');

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};


// returns {valid: bool, errorType?, decoded?:payload }
export function verifyToken(token){
  if (!JWT_SECRET) 
    throw new Error('JWT_SECRET is not defined');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (err) {
    return {
      valid: false,
      error: err.name,
    };
  }
};



export const prepareAuthPayload = (userID, email, username) => ({ userID, email, username})
export const prepareAdminAuthPayload = (id, username) => ({ id,username})