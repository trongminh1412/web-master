const bcrypt = require('bcrypt');

// mã hóa password
function hash_password(password) {
    var saltRounds = 10; // độ dài

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt); // chè password của mình vào

    return hash;
}

// giải mã password
function compare_password(password, hash) {
    return bcrypt.compareSync(password, hash); // true
}

module.exports = {
    hash_password: hash_password,
    compare_password: compare_password
}