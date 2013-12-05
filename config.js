var development = {
    facebook: {
        CallbackURL: "http://localhost:8080/auth/facebook/callback",
        clientID: "746060212089675",
        clientSecret: "7baa38955f71413ded8a33441e4440b5"
    },  
    env : global.process.env.NODE_ENV || 'development'
};

var production = {
    facebook: {
        CallbackURL: "http://mariage-GuillaumeAnneCath.zygonie.com/auth/facebook/callback",
        clientID: "1376996505875116",
        clientSecret: "46729b7a0ec0f28809a7c8368d431fda"
    },  
    env : global.process.env.NODE_ENV || 'production'
};

exports.Config = global.process.env.NODE_ENV === 'production' ? production : development;