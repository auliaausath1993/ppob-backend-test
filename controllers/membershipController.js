const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Regex pattern buat validasi format email biar rapi
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    // Validasi dulu format emailnya bener apa nggak
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ status: 102, message: "Paramter email tidak sesuai format", data: null });
    }

    // Pastiin password minimal 8 karakter
    if (!password || password.length < 8) {
      return res.status(400).json({ status: 102, message: "Password kurang dari 8 karakter", data: null });
    }

    // Cek apakah email ini udah pernah daftar sebelumnya
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ status: 102, message: "Email sudah terdaftar", data: null });
    }

    // Hash passwordnya biar aman, abis itu simpen ke database
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)',
      [email, first_name, last_name, hashedPassword]
    );

    return res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi dulu format emailnya bener apa nggak
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ status: 102, message: "Paramter email tidak sesuai format", data: null });
    }

    // Cari user berdasarkan email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ status: 103, message: "Username atau password salah", data: null });
    }

    // Cocokin password dari input sama yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 103, message: "Username atau password salah", data: null });
    }

    // Kalo cocok semua, buatin token JWT-nya
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });

    return res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: { token }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

const getProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const [rows] = await db.query('SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ status: 104, message: "User tidak ditemukan", data: null });
    }

    const data = rows[0];
    if (!data.profile_image) {
       data.profile_image = "https://yoururlapi.com/profile.jpeg";
    } else {
       if (!data.profile_image.startsWith('http')) {
           const protocol = req.get('host').includes('localhost') ? 'http' : 'https';
           data.profile_image = `${protocol}://${req.get('host')}/uploads/${data.profile_image}`;
       }
    }

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

const updateProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({ status: 102, message: "first_name dan last_name wajib diisi", data: null });
    }

    await db.query(
      'UPDATE users SET first_name = ?, last_name = ? WHERE email = ?',
      [first_name, last_name, email]
    );

    const [rows] = await db.query('SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?', [email]);
    const data = rows[0];
    if (!data.profile_image) data.profile_image = "https://yoururlapi.com/profile.jpeg";
    else if (!data.profile_image.startsWith('http')) {
       const protocol = req.get('host').includes('localhost') ? 'http' : 'https';
       data.profile_image = `${protocol}://${req.get('host')}/uploads/${data.profile_image}`;
    }

    return res.status(200).json({
      status: 0,
      message: "Update Pofile berhasil",
      data: data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const email = req.user.email;
    
    if (!req.file) {
      return res.status(400).json({ status: 102, message: "Format Image tidak sesuai", data: null });
    }

    const fileName = req.file.filename;

    await db.query(
      'UPDATE users SET profile_image = ? WHERE email = ?',
      [fileName, email]
    );

    const [rows] = await db.query('SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?', [email]);
    const data = rows[0];
    if (!data.profile_image.startsWith('http')) {
        const protocol = req.get('host').includes('localhost') ? 'http' : 'https';
        data.profile_image = `${protocol}://${req.get('host')}/uploads/${data.profile_image}`;
    }

    return res.status(200).json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: data
    });
  } catch (err) {
    console.error(err);
    if (err.message === 'Format Image tidak sesuai') {
       return res.status(400).json({ status: 102, message: "Format Image tidak sesuai", data: null });
    }
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfileImage
};
