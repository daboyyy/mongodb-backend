import mongoose from 'mongoose';

const User = mongoose.model('User');

const updateUser = (req, res) => {
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

export default { updateUser };
