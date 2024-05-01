import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the token stored on the client side
    res.clearCookie("token");

    // Optionally, you can send a response indicating successful logout
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { loginUser, logoutUser };
