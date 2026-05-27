const db = require('../config/db');

const getBalance = async (req, res) => {
  try {
    const email = req.user.email;
    const [rows] = await db.query('SELECT balance FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ status: 104, message: "User tidak ditemukan", data: null });
    }

    return res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: rows[0].balance
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

const topUp = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const email = req.user.email;
    const { top_up_amount } = req.body;

    // Validasi inputannya dulu nih
    if (top_up_amount === undefined || typeof top_up_amount !== 'number' || top_up_amount <= 0) {
      connection.release();
      return res.status(400).json({ 
        status: 102, 
        message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0", 
        data: null 
      });
    }

    await connection.beginTransaction();

    // Kunci baris datanya pake FOR UPDATE biar ga bentrok saldonya pas ada request barengan
    const [userRows] = await connection.query('SELECT balance FROM users WHERE email = ? FOR UPDATE', [email]);
    if (userRows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ status: 104, message: "User tidak ditemukan", data: null });
    }

    const currentBalance = userRows[0].balance;
    const newBalance = currentBalance + top_up_amount;

    // Timpa saldo lamanya jadi saldo baru
    await connection.query('UPDATE users SET balance = ? WHERE email = ?', [newBalance, email]);

    // Jangan lupa catet riwayat transaksinya
    const invoiceNumber = `INV${Date.now()}`;
    await connection.query(
      `INSERT INTO transactions (invoice_number, user_email, service_code, transaction_type, total_amount, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [invoiceNumber, email, null, 'TOPUP', top_up_amount, 'Top Up balance']
    );

    await connection.commit();
    connection.release();

    return res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        balance: newBalance
      }
    });

  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error(err);
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

const transaction = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const email = req.user.email;
    const { service_code } = req.body;

    if (!service_code) {
      connection.release();
      return res.status(400).json({ status: 102, message: "Service Code wajib diisi", data: null });
    }

    await connection.beginTransaction();

    // Cek layanannya beneran ada apa nggak
    const [serviceRows] = await connection.query('SELECT * FROM services WHERE service_code = ?', [service_code]);
    if (serviceRows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ status: 102, message: "Service atau Layanan tidak ditemukan", data: null });
    }
    const service = serviceRows[0];

    // Cek saldo cukup apa nggak sekaligus dikunci barisnya (Pessimistic Locking)
    const [userRows] = await connection.query('SELECT balance FROM users WHERE email = ? FOR UPDATE', [email]);
    const currentBalance = userRows[0].balance;

    if (currentBalance < service.service_tariff) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ status: 102, message: "Saldo tidak mencukupi", data: null });
    }

    const newBalance = currentBalance - service.service_tariff;
    
    // Langsung potong saldonya
    await connection.query('UPDATE users SET balance = ? WHERE email = ?', [newBalance, email]);

    // Simpen riwayat transaksinya
    const invoiceNumber = `INV${Date.now()}`;
    await connection.query(
      `INSERT INTO transactions (invoice_number, user_email, service_code, transaction_type, total_amount, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [invoiceNumber, email, service_code, 'PAYMENT', service.service_tariff, service.service_name]
    );

    await connection.commit();
    connection.release();

    return res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number: invoiceNumber,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: 'PAYMENT',
        total_amount: service.service_tariff,
        created_on: new Date().toISOString()
      }
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error(err);
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const email = req.user.email;
    let limit = req.query.limit;
    const offsetStr = req.query.offset || '0';
    let offset = parseInt(offsetStr, 10);
    
    let queryStr = `
      SELECT invoice_number, transaction_type, description, total_amount, created_at as created_on 
      FROM transactions 
      WHERE user_email = ? 
      ORDER BY created_at DESC
    `;
    let queryParams = [email];

    if (limit) {
      limit = parseInt(limit, 10);
      queryStr += ` LIMIT ? OFFSET ?`;
      queryParams.push(limit, offset);
    }

    const [rows] = await db.query(queryStr, queryParams);

    return res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset: offset,
        limit: limit ? limit : null,
        records: rows
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Internal server error", data: null });
  }
};

module.exports = {
  getBalance,
  topUp,
  transaction,
  getTransactionHistory
};
