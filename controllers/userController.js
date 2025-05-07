const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();

const userCreate = async (req, res, next) => {
    try {
        const { username, password, email, mobile } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            username, password: hashedPassword, email, mobile, cartData: new Map()
        });
        console.log('Pre-save:', newUser.cartData);
        await newUser.save();
        res.json({success:true, message: 'User registered successfully.' })


        const savedUser = await User.findById(newUser._id);
        console.log('Post-save:', savedUser.cartData)

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
                    email: user.email
                }
            },
            process.env.secret_key,
            { expiresIn: '1h' }
        );
        res
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })
            .json({ success: true, message: "Login successful" });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            token = jwt.sign(email + password, process.env.secret_key);
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
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
        if (req.user.id !== req.params.id) {
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
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne({ id: req.params.id });
    res.json({ message: 'User removed' });
}

const logoutUser = (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true, // true if using HTTPS
      sameSite: 'Lax' // or 'None' if cross-site
    });
    res.status(200).json({ message: 'Logged out successfully' });
  };

const updateUser = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { username, email, mobile, role } = req.body;
        const updates = { username, email, mobile };
        const isSelfUpdate = req.user.id === req.params.id;

        if (!isSelfUpdate) {
            return res.status(403).json({ message: 'Not authorized' });
        }


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

module.exports = { userCreate, userLogin, adminLogin, getAllUsers, getUserbyId, deleteUser, updateUser, logoutUser }