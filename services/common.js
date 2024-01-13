const passport = require('passport');

exports.isAuth = (req, res, done)=> {
    return passport.authenticate('jwt')
}

exports.sanitizeUser = (user)=> {
    return {id: user.id, role: user.role};
} 

exports.cookieExtractor = function(req){
    let token = null;
    if(req && req.cookies){
        token = req.cookies['jwt'];
    }
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWQwZTY2NWE0M2IyOTgyOTQ4MWZkOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA1MTU2OTAzfQ.h9NQzYzvsrz1vFzZ9Dr9wQfeCq0wg7Nfh0oHQirjLqA"
    return token;
}

