const { User } = require("../model/User.js");
const crypto = require('crypto');
const { sanitizeUser } = require("../services/common");
const jwt = require('jsonwebtoken');


exports.createUser = async (req, res) => {
    try {
        let user = new User(req.body);
        console.log('i am in  create user');
        console.log('user in create user coming, ', user);
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            if (err) {
                console.log('Error in hashing password:', err);
                return res.status(500).json({ error: 'Error in hashing password' });
            }
            console.log('req body, ', req.body);
            user = new User({ ...req.body, password: hashedPassword, salt });
            console.log('this is the new user made ', user);

            try {
                const doc = await user.save();

                req.login(sanitizeUser(doc), (err) => {   // this also calls serializer and adds session
                    if (err) {
                        console.log('we are in the error of create user');
                        res.status(400).json(err);
                    } else {
                        console.log('user created successfully');
                        const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
                        res.cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true }) // 1 hour session
                            .status(201).json({ id: doc.id, role: doc.role });
                    }
                })
            } catch (err) {
                console.log('Error saving user:', err);
                res.status(400).json(err);
            }
        })
    } catch (err) {
        console.log('Error in try block:', err);
        res.status(400).json(err);
    }
}


exports.loginUser = async (req, res) => {
    const user = req.user;
    console.log('i am here in loginUser');

    res.cookie('jwt', req.user.token, { expires: new Date(Date.now() + 3600000), httpOnly: true, })
        .status(201)
        .json({ id: user.id, role: user.role });
};

exports.checkAuth = async (req, res) => {
    if (req.user) {
        console.log('i am in checkAuth node');
        res.json(req.user);
    } else {
        console.log('i am in checkaurh error node');
        res.sendStatus(401);
    }

}
