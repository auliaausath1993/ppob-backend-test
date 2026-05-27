### 1. Register & Login (Public)

**A. Registrasi**
- Coba *request* `POST /registration` dengan tipe *body* `raw` JSON.
```json
{
  "email": "ausathaulia@gmail.com",
  "first_name": "Aulia",
  "last_name": "Ausath",
  "password": "NutechInt2026!@#"
}
```

**B. Login**
- Coba *request* `POST /login` dengan tipe *body* `raw` JSON.
```json
{
  "email": "ausathaulia@gmail.com",
  "password": "NutechInt2026!@#"
}
```
- Copy **token** yang ada di respons JSON.

### 2. Pengaturan Token (Akses Private Endpoints)
- Di Postman, masuk ke tab **Authorization** -> pilih *type* **Bearer Token** -> paste token nya.

### 3. Uji Coba Fitur Utama

**A. Get Profile**
- Coba *request* `GET /profile`. (Tanpa *body*).

**B. Cek Saldo**
- Coba *request* `GET /balance`. (Tanpa *body*).

**C. Update Profile**
- Coba *request* `PUT /profile/update` dengan tipe *body* `raw` JSON.
```json
{
  "first_name": "Aulia",
  "last_name": "Ausath"
}
```

**D. Top Up Saldo**
- Coba *request* `POST /topup` dengan tipe *body* `raw` JSON.
```json
{
  "top_up_amount": 100000
}
```

**E. Dapatkan List Layanan & Banner**
- Coba *request* `GET /services`
- Coba *request* `GET /banner`

**F. Lakukan Transaksi (Pembayaran)**
- Coba *request* `POST /transaction` dengan tipe *body* `raw` JSON. Saldo akan otomatis terpotong sesuai tarif layanan.
```json
{
  "service_code": "PULSA"
}
```

**G. Dapatkan History Transaksi**
- Coba *request* `GET /transaction/history` (Bisa ditambahkan params `?offset=0&limit=3`).

**H. Mengganti Foto Profil**
- Coba *request* `PUT /profile/image`. 
- Pada Postman, pake tab **Body -> form-data**, kasih nama key `file`, ubah tipe menjadi **File**, abis itu pilih gambar.
