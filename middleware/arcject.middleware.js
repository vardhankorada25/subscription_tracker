import aj from "../config/arcjet.js";
import { NODE_ENV } from "../config/env.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        // Allow local development traffic to avoid blocking authenticated testing flows.
        const isLocalRequest = req.ip === "::1" || req.ip === "127.0.0.1" || req.hostname === "localhost";
        if (NODE_ENV === "development" && isLocalRequest) {
            return next();
        }

        const decision = await aj.protect(req, { requested: 1 });
        if (decision.conclusion === "DENY") {
            const reasonType = decision.reason?.type;
            if (reasonType === "BOT") return res.status(403).json({ error: "Access denied: Bot detected" });
            if (reasonType === "RATE_LIMIT") return res.status(429).json({ error: "Too many requests: Rate limit exceeded" });
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    } catch (err) {
        console.error("Error in Arcjet middleware:", err);
        next(err);
    }
};
export default arcjetMiddleware;