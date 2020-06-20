const { hash } = require('bcrypt');
const { validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const { model } = require('mongoose');
const { generate: generateRandomString } = require('randomstring');

const { responseObj } = require('../helpers/utilsHelper');

exports.getUsers = async (req, res) => {
  try {
    const data = await model('User').find().populate('profile');
    if (data.length) {
      return res.json(responseObj(null, true, data));
    } else {
      return res.status(404).json(responseObj('No users found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Internal server error!'));
  }
}

exports.getUser = async (req, res) => {
  try {
    const data = await model('User').findById(req.params.userId).populate('profile');
    if (data) {
      return res.json(responseObj(null, true, data));
    } else {
      return res.status(404).json(responseObj('User not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Internal server error!'));
  }
}

exports.addUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(responseObj(errors.array()));
    }
    const data = await model('User').findOne({ username: req.body.username });
    if (!data) {
      const profile = await model('Profile').create({
        firstName: req.body.firstname,
        middleName: (req.body.middlename) ? req.body.middlename : '',
        lastName: req.body.lastname,
        contact: req.body.contact
      });
      if (profile) {
        const hashedPassword = await hash(req.body.password, 256);
        const user = await model('User').create({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          apiToken: generateRandomString(),
          enabled: (req.body.enabled) ? true : false,
          profile: profile
        });
        if (user) {
          return res.status(201).json(responseObj(null, true, { 'message': 'User added successfully!' }));
        } else {
          return res.status(404).json(responseObj('Could not create user!'));
        }
      } else {
        return res.status(404).json(responseObj('Could not create profile for user!'));
      }
    } else {
      return res.status(404).json(responseObj('Username is already taken, please choose a unique one!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Internal server error!'));
  }
}

exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(responseObj(errors.array()));
    }
    const data = await model('User').findOne({ username: req.body.username });
    if (!data || data._id == req.params.userId) {
      const hashedPassword = await hash(req.body.password, 256);
      const user = await model('User').findByIdAndUpdate(req.params.userId, {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        apiToken: generateRandomString(),
        enabled: (req.body.enabled) ? true : false
      }, { useFindAndModify: false });
      if (user) {
        const profile = await model('Profile').findByIdAndUpdate(user.profile, {
          firstName: req.body.firstname,
          middleName: (req.body.middlename) ? req.body.middlename : '',
          lastName: req.body.lastname,
          contact: req.body.contact
        }, { useFindAndModify: false });
        if (profile) {
          return res.status(201).json(responseObj(null, true, { 'message': 'User updated successfully!' }));
        } else {
          return res.status(404).json(responseObj('Could not update profile!'));
        }
      } else {
        return res.status(404).json(responseObj('Could not update user!'));
      }
    } else {
      return res.status(404).json(responseObj('Username is already taken, please choose a unique one!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Internal server error!'));
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await model('User').findByIdAndDelete(req.params.userId, { useFindAndModify: false });
    if (user) {
      const profile = await model('Profile').findByIdAndDelete(user.profile, { useFindAndModify: false });
      return res.json(responseObj(null, true, { 'message': 'User delete successfully!' }));
    } else {
      return res.status(404).json(responseObj('Nothing to delete!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Internal server error!'));
  }
}
