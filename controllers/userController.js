const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();

const userCreate = async (req, res, next) => {
    try {
        const { username, password, email, role, mobile } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            username, password: hashedPassword, email, role, mobile
        });
        await newUser.save();
        res.json({ message: 'User registered successfully.' })
    } catch (error) {
        next(error)
    }
}

const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' })
        }
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid login credentials." })
        }
        const token = jwt.sign(
            {
                user: {
                    id: user._id,
                    role: user.role,
                    email: user.email
                }
            },
            process.env.secret_key,
            { expiresIn: '1h' }
        );
        res.cookie('token', token);
        res.json({ message: "Login successfull." });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

const getAllUsers = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

const getUserbyId = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).send('Server error');
    }
}

const deleteUser = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not autherized' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({message:'User not found'});
    }
    await user.remove();
    res.json({message:'User removed'});
}

const updateUser = async (req, res, next) => {
    try {
      // 1. Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      // 2. Extract fields from request body
      const { username, email, mobile, role } = req.body;
      const updates = { username, email, mobile };
  
      // 3. Check if the request is from an ADMIN or the USER THEMSELVES
      const isAdmin = req.user.role === 'admin';
      const isSelfUpdate = req.user.id === req.params.id;
  
      // 4. If not admin AND not self-update → Block
      if (!isAdmin && !isSelfUpdate) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      // 5. Only admins can update 'role'
      if (role && !isAdmin) {
        return res.status(403).json({ message: 'Only admins can change roles' });
      }
      if (role) updates.role = role; // Admins can update role
  
      // 6. Update the user
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true }
      ).select('-password');
  
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  };

module.exports = { userCreate, userLogin, getAllUsers, getUserbyId, deleteUser, updateUser }