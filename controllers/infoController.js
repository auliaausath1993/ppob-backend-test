const db = require('../config/db');

const getBanners = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT banner_name, banner_image, description FROM banners');
    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: rows
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

const getServices = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT service_code, service_name, service_icon, service_tariff FROM services');
    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: rows
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

module.exports = {
  getBanners,
  getServices
};
