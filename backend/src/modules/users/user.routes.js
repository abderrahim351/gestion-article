const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const userController = require('./user.controller');

// admin
router.get('/', authenticate, userController.getAllUsers);
router.patch('/:id/role', authenticate, userController.updateUserRole);

// profil
router.get('/me', authenticate, userController.getMe);
router.patch('/me', authenticate, userController.updateMe);

module.exports = router;
