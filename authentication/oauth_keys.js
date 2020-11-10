require('dotenv').config();

module.exports = {
    google:{
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    },
    jwt : process.env.JWT_SECRET,
};  
