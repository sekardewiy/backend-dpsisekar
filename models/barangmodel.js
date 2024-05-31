const mongoose = require('mongoose');

// Subdokumen untuk menyimpan ukuran dan stok
const ukuranStokSchema = new mongoose.Schema({
  ukuran: { type: Number, required: true },
  stok: { type: Number, default: 0 },
});

const barangSchema = new mongoose.Schema({
  nama_barang: { type: String, required: true },
  deskripsi: { type: String },
  harga: { type: Number, required: true },
  ukuran_stok: [ukuranStokSchema], // Array subdokumen untuk ukuran dan stok
  // Tambahkan atribut lain sesuai kebutuhan
});

const Barang = mongoose.model('Barang', barangSchema);

module.exports = Barang;
