const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
//Bearer aAHhuhsdhdah21h423huhfasoehfashfdoa
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não informado ou invalido!'})
    }

    const token = authHeader.split(' ')[1]
    console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.userId = decoded.id_usuario;
        next();
    } catch (error) {
        return res.status(403).json({message: 'token invalido'})
    }
}
module.exports = authenticateJWT;