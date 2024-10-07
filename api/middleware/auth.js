import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Not authorized - No token provided",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({
				success: false,
				message: "Not authorized - Invalid token",
			});
		}

		const currentUser = await User.findById(decoded.id);

		req.user = currentUser;

		next();
	} catch (error) {
		console.log("Error in auth middleware: ", error);

		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({
				success: false,
				message: "Not authorized - Invalid token",
			});
		} else {
			return res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}
};
