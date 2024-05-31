const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const router = express.Router();
const port = 3001;
app.use(express.json());
app.use(cors());
app.use('/sepatu', router);


// Replace <password> with your actual password
const uri = "mongodb+srv://dbsekar:dbsekar@cluster0.wl9e6ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const barangController = require('./controller/barangcontroller');
const keranjangController = require('./controller/keranjangcontroller');
const penjualanController = require('./controller/penjualancontroller');

const login = require("./controller/usercontroller");
const registerUser = require('./controller/usercontroller');
const getAllUsers = require('./controller/usercontroller');
const getUserByObjectId = require('./controller/usercontroller');
const {isAuthenticated,isManager} = require("./middleware/authmiddleware");


router.post('/register',registerUser.registerUser); //register
router.post('/login',login.login); //login
router.get('/pengguna',getAllUsers.getAllUsers);
router.get('/pengguna/:id',getUserByObjectId.getUserByObjectId);

// Mendapatkan semua item di keranjang
router.get('/keranjang', keranjangController.getAllKeranjang);

router.get('/keranjang/user/:id',keranjangController.getAllItemOnKeranjangByUserId);
// Menambahkan barang ke keranjang
router.post('/keranjang', keranjangController.addBarangIntoKeranjang);

// Menghapus item dari keranjang berdasarkan ID barang
router.delete('/keranjang', keranjangController.deleteItemFromKeranjangByIdBarang);

// Memperbarui barang di keranjang berdasarkan ID barang
router.put('/keranjang', keranjangController.updateBarangOnKeranjangByIdBarang);

// Memperbarui jumlah barang di keranjang berdasarkan ID barang
router.put('/keranjang/jumlah', keranjangController.updateJumlahBarangOnKeranjangByIdBarang);

// Menghitung subtotal
router.get('/keranjang/subtotal/:id_user', keranjangController.sumSubtotal);

// Tambahkan barang baru
router.post('/barang', barangController.addBarang);

// Hapus barang berdasarkan ID
router.delete('/barang/:id', barangController.deleteBarang);

// Update stok barang berdasarkan ukuran
router.put('/barang/stok', barangController.updateStokBarang);

// Dapatkan barang berdasarkan ID
router.get('/barang/:id', barangController.getBarangById);

// Dapatkan ukuran barang berdasarkan ID
router.get('/barang/size/:id', barangController.getSizeBarangById);

// Dapatkan ukuran yang tersedia (stok > 0) berdasarkan ID barang
router.get('/barang/size-ready/:id', barangController.getSizeReadyByIdBarang);

// Dapatkan semua barang
router.get('/barang', barangController.getAllBarang);

// Menambahkan penjualan baru
router.post('/penjualan', penjualanController.addPenjualan);

// Mendapatkan penjualan berdasarkan ID
router.get('/penjualan/:id', penjualanController.getPenjualanById);

// Mendapatkan semua penjualan pada tanggal tertentu
router.get('/penjualan/date', penjualanController.getAllPenjualanOnDate);

// Mendapatkan semua penjualan dalam rentang tanggal
router.get('/penjualan/range', penjualanController.getAllPenjualanRangeDate);

// Menghapus penjualan berdasarkan ID
router.delete('/penjualan/:id', penjualanController.deletePenjualan);

// Memperbarui penjualan berdasarkan ID
router.put('/penjualan/:id', penjualanController.updatePenjualan);

// Menghitung total harga penjualan pada tanggal tertentu
router.get('/penjualan/sum/date', penjualanController.sumTotalHargaOnDate);

// Menghitung total harga penjualan dalam rentang tanggal
router.get('/penjualan/sum/range', penjualanController.sumTotalHargaRangeDate);


mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
