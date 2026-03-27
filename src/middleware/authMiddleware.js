import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Header se token nikalna
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // User ki ID request mein save kar dena
        next(); // Agle function par jao
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized! Invalid token." });
    }
};