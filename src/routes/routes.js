const express = require('express');
const { check } = require('express-validator');
const router = new express.Router();

const userController = require('../controllers/userController');
const { responseObj } = require('../helpers/utilsHelper');

router.route('/users')
  .get(userController.getUsers)
  .post([
    check('firstname')
      .matches(/^[A-Za-z\s]+$/).withMessage('The firstname must be alphabetic!')
      .isLength({ min: 5 }).withMessage('The firstname must be more than 5 characters!'),
    check('middlename')
      .matches(/^[A-Za-z\s]+$/).withMessage('The middlename must be alphabetic!'),
    check('lastname')
      .matches(/^[A-Za-z\s]+$/).withMessage('The lastname must be alphabetic!')
      .isLength({ min: 5 }).withMessage('The lastname must be more than 5 characters!'),
    check('contact')
      .matches(/^[0-9\s]+$/).withMessage('The contact must be numeric only!')
      .isLength({ min: 8, max: 15 }).withMessage('The contact must be between 8 to 15 digits!'),
    check('username')
      .matches(/^[A-Za-z0-9\s]+$/).withMessage('The username must be alphabetic or alphanumeric only!')
      .isLength({ min: 5, max: 15 }).withMessage('The username must be between 8 to 15 digits!'),
    check('email').isEmail().normalizeEmail(),
    check('password', '...')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").withMessage('The password must contain atleast 1 uppercase, 1 lowercase and 1 number!'),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match with password!');
      }

      // Indicates the success of this synchronous custom validator
      return true;
    })
  ], userController.addUser);

router.route('/users/:userId')
  .get(userController.getUser)
  .put([
    check('firstname')
      .matches(/^[A-Za-z\s]+$/).withMessage('The firstname must be alphabetic!')
      .isLength({ min: 5 }).withMessage('The firstname must be more than 5 characters!'),
    check('middlename')
      .matches(/^[A-Za-z\s]+$/).withMessage('The middlename must be alphabetic!'),
    check('lastname')
      .matches(/^[A-Za-z\s]+$/).withMessage('The lastname must be alphabetic!')
      .isLength({ min: 5 }).withMessage('The lastname must be more than 5 characters!'),
    check('contact')
      .matches(/^[0-9\s]+$/).withMessage('The contact must be numeric only!')
      .isLength({ min: 8, max: 15 }).withMessage('The contact must be between 8 to 15 digits!'),
    check('username')
      .matches(/^[A-Za-z0-9\s]+$/).withMessage('The username must be alphabetic or alphanumeric only!')
      .isLength({ min: 5, max: 15 }).withMessage('The username must be between 8 to 15 digits!'),
    check('email').isEmail().normalizeEmail(),
    check('password', '...')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").withMessage('The password must contain atleast 1 uppercase, 1 lowercase and 1 number!'),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match with password!');
      }

      // Indicates the success of this synchronous custom validator
      return true;
    })
  ], userController.updateUser)
  .delete(userController.deleteUser);

// Handles 404 requests
router.use('/', (req, res) => res.status(404).json(responseObj('Route not found!')));

module.exports = router
