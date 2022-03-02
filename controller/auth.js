import mongoose from 'mongoose';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

const User = mongoose.model('User');

const validPassword = (password, hash, salt) => {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
};

const genPassword = (password) => {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    salt: salt,
    hash: genHash,
  };
};

const issueJWT = (user) => {
  const _id = user._id;

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: '15d',
    algorithm: 'RS256',
  });

  return {
    token: signedToken,
    expires: '15d',
  };
};

const authLogin = (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, msg: 'could not find user' });
      } else {
        const isValid = validPassword(req.body.password, user.hash, user.salt);

        if (isValid) {
          const tokenObject = issueJWT(user);

          res.status(200).json({
            success: true,
            token: tokenObject.token,
            expiresIn: tokenObject.expires,
            id: user._doc._id,
            name: user._doc.name,
          });
        } else {
          res
            .status(401)
            .json({ success: false, msg: 'you entered the wrong password' });
        }
      }
    })
    .catch((err) => {
      res.json({ success: false, msg: err });
    });
};

const userSetting = (req) => {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  return new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
    name: null,
  });
};

const authRegister = (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      const newUser = userSetting(req);
      try {
        newUser.save().then((user) => {
          res.status(201).json({ success: true, user: user });
        });
      } catch (err) {
        res.json({ success: false, msg: err });
      }
    } else {
      res.json({ success: false, msg: 'username already exists' });
    }
  });
};

export default { authLogin, authRegister };
