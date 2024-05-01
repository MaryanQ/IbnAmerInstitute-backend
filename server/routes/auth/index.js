import { Router } from "express";
import dbConfig from "../../../db-connect.js";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const queryString = "SELECT * FROM Users WHERE username = ?";

  dbConfig.query(queryString, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching user data" });
      return;
    }

    if (results.length > 0) {
      const user = results[0]; // Get the first result of the query
      if (bcrypt.compareSync(password, user.passwordHash)) {
        // Correct password, create JWT
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else {
        // Incorrect password
        res.status(401).send("Invalid credentials");
      }
    } else {
      // No user found
      res.status(404).send("User not found");
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
