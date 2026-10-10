# HTF3-Backend

Backend infrastructure for **Hack To Future 3.0**, a national-level hackathon organized at KLS Gogte Institute of Technology in association with TCS, serving 650+ users across five states.

I independently developed and deployed the backend, supporting event workflows, authentication, and email OTP verification.

### Key Highlights
- Designed a round-robin email OTP delivery system capable of handling 4,500 OTPs/day at zero cost.
- Deployed on a **6 GB RAM DigitalOcean Droplet**, configured and managed by me.
- Configured **Nginx as a reverse proxy** for the Node.js application.
- Implemented JWT authentication, rate limiting, and PostgreSQL integration.

### Tech Stack
`Node.js` · `Express.js` · `PostgreSQL` · `JWT` · `Nodemailer` · `Nginx` · `DigitalOcean`

**Note:** The Vercel deployment URL is a placeholder. The original production deployment was hosted on DigitalOcean.
