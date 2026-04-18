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

export const adminAuthLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 7,
  keyGenerator: (req) => {
    return req.body?.username || ipKeyGenerator(req);
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

export const sublimitteradmin = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    return req.auth.adminId || ipKeyGenerator(req);
  },
  message: {
    success: false,
    error: "Too many attempts. Try again later."
  }
});