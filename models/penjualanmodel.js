const mongoose = require('mongoose');

const itemPenjualanSchema = new mongoose.Schema({
  id_barang: { type: mongoose.Schema.Types.ObjectId, ref: 'Barang', required: true },
  nama_barang: { type: String, required: true },
  harga_satuan: { type: Number, required: true },
  jumlah: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const penjualanSchema = new mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_harga: { type: Number, required: true },
  tanggal_penjualan: { type: Date, default: Date.now },
  metode_pembayaran: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
  items: [itemPenjualanSchema],
});

const Penjualan = mongoose.model('Penjualan', penjualanSchema);

module.exports = Penjualan;
