import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathToPubKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');

const authMiddleware = (req, res, next) => {
  const tokenParts = req.headers.authorization.split(' ');

  if (
    tokenParts[0] === 'Bearer' &&
    tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
  ) {
    try {
      const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
        algorithms: ['RS256'],
      });
      req.jwt = verification;
      next();
    } catch (err) {
      res.status(401).json({
        success: false,
        msg: 'You are not authorized to visit this route',
      });
    }
  } else {
    res.status(401).json({
      success: false,
      msg: 'You are not authorized to visit this route',
    });
  }
};

export default authMiddleware;
