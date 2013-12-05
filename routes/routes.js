exports.index = function (req, res) {
    res.render("index", {
        user: req.user
    });
};

exports.home = function (req, res) {
    res.render("mariage", {
        id: 'Home',
        user: req.user
    });
};

exports.forbidden = function (req, res) {
    res.render('forbidden');
};