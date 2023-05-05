var mysql = require("mysql");

var dbConnect = {
  getConnection: function () {
    var conn = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "pa$$woRD123",
      database: "ades_ca1",
      dateStrings: true,
    });

    return conn;
  },
};
module.exports = dbConnect;
