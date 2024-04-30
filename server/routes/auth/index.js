import { Router } from "express";
import dbConfig from "../../../db-connect.js";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * from login Where email = ? and password = ?";
  console.log("SQL Query:", sql);

  dbConfig.query(sql, [email, password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "teachers", email: email },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

authRouter.get("/logout", (req, res) => {
  console.log("Logout route hit");
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    path: "/",
  });
  res.status(200).json({ status: "Success", message: "Logout successful" });
});

export default authRouter;
