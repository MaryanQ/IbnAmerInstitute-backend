import dbConfig from "../../db-connect.js";
import jwt from "jsonwebtoken";

const AuthModel = {
  loginUser: (email, password, callback) => {
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    dbConfig.query(sql, [email, password], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      if (results.length > 0) {
        return callback(null, results[0]);
      } else {
        return callback(null, null);
      }
    });
  },

  generateToken: (user) => {
    const token = jwt.sign(
      { role: "teachers", email: user.email },
      "jwt_secret_key",
      { expiresIn: "1d" }
    );
    return token;
  },
};

export default AuthModel;
