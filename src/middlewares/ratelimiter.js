import rateLimit, { ipKeyGenerator }  from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 7,
  keyGenerator: (req) => {
    return req.body?.email || ipKeyGenerator(req);
  },
  message: {
    success: false,
    error: "Too many attempts. Try again later."
  }
});

export const sublimitter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    return req.auth.userID || ipKeyGenerator(req);
  },
  message: {
    success: false,
    error: "Too many attempts. Try again later."
  }
});