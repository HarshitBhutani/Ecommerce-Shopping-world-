const { User } = require("../model/User.js");
const crypto = require('crypto');
const { sanitizeUser } = require("../services/common");
const jwt = require('jsonwebtoken');


exports.createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        console.log('i am in jwt backend');
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {            console.log('req body, ', ...req.body);
            const user = new User({ ...req.body, password: hashedPassword, salt });
            console.log('user', user);
            const doc = await user.save();

            req.login(sanitizeUser(doc), (err) => {   // this also calls serializer and adds session
                if (err) {
                    res.status(400).json(err);
                } else {
                    console.log('token', token);
                    const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
                    res.cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true }) // 1 hour session
                    .status(201).json({id: doc.id, role: doc.role});
                }
            })
        })
    } catch (err) {
        console.log('here in error');
        res.status(400).json(err);
    }
}


exports.loginUser = async (req, res) => {
    const user = req.user;
    console.log('i am here in loginUser');

    res.cookie('jwt', req.user.token, { expires: new Date(Date.now() + 3600000), httpOnly: true, })
       .status(201)
       .json({id: user.id, role: user.role});
};

exports.checkAuth = async (req, res) => {
    if(req.user){
        console.log('i am in checkAuth node');
        res.json(req.user);
    }else{
        console.log('i am in checkaurh error node');
        res.sendStatus(401);
    }

}
