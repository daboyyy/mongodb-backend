import mongoose from 'mongoose';

const User = mongoose.model('User');

const getUser = (req, res) => {
  User.findById(req.jwt.sub)
    .then((user) => {
      if (user) {
        res.status(200).json({ success: true, data: user });
      } else {
        res.status(400).json('User not found!');
      }
    })
    .catch((err) => res.status(400).json('Error: ' + err));
};

const updateUser = (req, res) => {
  /* console.log(req.jwt);
  console.log('JWT Expired', new Date(req.jwt.exp));
  console.log('Current Date', new Date()); */
  User.findById(req.params.id)
    .then((user) => {
      user.name = req.body.name;
      user
        .save()
        .then(() =>
          res.status(200).json({ success: true, msg: 'user updated!' })
        )
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
};

export default { getUser, updateUser };
