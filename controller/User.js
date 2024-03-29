const { User } = require("../model/User.js");

exports.fetchUserById = async(req, res)=>{
    const {id} = req.user;
    console.log('id isss:: ', id);
    try{
        const user = await User.findById(id); //return only these fields
        // delete user.password;
        // delete user.salt;
        res.status(200).json({id: user.id, addresses: user.addresses, email: user.email, role: user.role});
    }catch(err){
        res.status(400).json(err);
    }
}


exports.updateUser = async(req, res)=>{
    const {id} = req.params;
    try{
        const user = await User.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json(user);
    }catch(err){
        res.status(400).json(err);
    }
    
}