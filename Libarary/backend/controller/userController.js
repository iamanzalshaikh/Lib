import genToken from "../config/token.js";
import bcrypt from 'bcryptjs';
import User from "../model/userModel.js";



// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password, role  } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: "User already exists" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    
    });

    const token = genToken(user._id);

res.cookie("token", token, {
  httpOnly: true,
  sameSite: "none",   // cross-site (Netlify → Render)
  secure: true,       // ✅ required for production HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000, 
});

    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = genToken(user._id);

 res.cookie("token", token, {
  httpOnly: true,
  sameSite: "none",   // cross-site (Netlify → Render)
  secure: true,       // ✅ required for production HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000, 
});
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login error" });
  }
};

// LOGOUT
export const logout = (req, res) => {
  try {
  res.cookie("token", token, {
  httpOnly: true,
  sameSite: "none",   // cross-site (Netlify → Render)
  secure: true,       // ✅ required for production HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: "/",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout error" });
  }
};
