const mongoose = require('mongoose');

const keranjangSchema = new mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id_barang: { type: mongoose.Schema.Types.ObjectId, ref: 'Barang', required: true },
  jumlah_barang: { type: Number, required: true },
  harga_satuan: { type: Number, required: true }, // Menyimpan harga barang pada saat ditambahkan
  ukuran: { type: Number, required: true }, // Menyimpan ukuran barang yang dipilih
  tanggal_ditambahkan: { type: Date, default: Date.now },
});

const Keranjang = mongoose.model('Keranjang', keranjangSchema);

module.exports = Keranjang;
