const mongoose = require('mongoose');
const Keranjang = require('../models/keranjangmodel');
const Barang = require('../models/barangmodel');
const User = require('../models/usermodel');

const keranjangController = {
  // Mendapatkan semua item di keranjang
  getAllKeranjang: async (req, res) => {
    try {
      const keranjang = await Keranjang.find().populate('id_user').populate('id_barang');
      res.status(200).json(keranjang);
    } catch (error) {
      console.error('Error mendapatkan semua keranjang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Mendapatkan semua item di keranjang berdasarkan ID pengguna
  getAllItemOnKeranjangByUserId: async (req, res) => {
    try {
      const { id_user } = req.params;

      console.log(`Received id_user: ${id_user}`);

      if (!mongoose.Types.ObjectId.isValid(id_user)) {
        console.error(`Invalid ObjectId: ${id_user}`);
        return res.status(400).json({ error: 'ID pengguna tidak valid' });
      }

      // Retrieve all items in the cart for the given user ID and populate the fields
      const keranjang = await Keranjang.find({ id_user: id_user })
        .populate('id_user')
        .populate('id_barang');

      if (!keranjang || keranjang.length === 0) {
        return res.status(404).json({ error: 'Keranjang tidak ditemukan untuk pengguna ini' });
      }

      res.status(200).json(keranjang);
    } catch (error) {
      console.error('Error mendapatkan keranjang berdasarkan ID pengguna:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Menambahkan barang ke keranjang
  addBarangIntoKeranjang: async (req, res) => {
    try {
      const { id_user, id_barang, jumlah_barang, ukuran } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id_user) || !mongoose.Types.ObjectId.isValid(id_barang)) {
        return res.status(400).json({ error: 'ID pengguna atau ID barang tidak valid' });
      }

      // Dapatkan harga barang dari koleksi Barang
      const barang = await Barang.findById(id_barang);
      if (!barang) {
        return res.status(404).json({ error: 'Barang tidak ditemukan' });
      }

      const ukuranStok = barang.ukuran_stok.find(item => item.ukuran === ukuran);
      if (!ukuranStok || ukuranStok.stok < jumlah_barang) {
        return res.status(400).json({ error: 'Stok tidak mencukupi atau ukuran tidak ditemukan' });
      }

      const harga_satuan = barang.harga;

      const newKeranjang = new Keranjang({
        id_user,
        id_barang,
        jumlah_barang,
        harga_satuan,
        ukuran
      });

      await newKeranjang.save();
      res.status(201).json({ message: 'Barang berhasil ditambahkan ke keranjang', keranjang: newKeranjang });
    } catch (error) {
      console.error('Error menambahkan barang ke keranjang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Menghapus item dari keranjang berdasarkan ID barang
  deleteItemFromKeranjangByIdBarang: async (req, res) => {
    try {
      const { id_user, id_barang } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id_user) || !mongoose.Types.ObjectId.isValid(id_barang)) {
        return res.status(400).json({ error: 'ID pengguna atau ID barang tidak valid' });
      }

      const deletedItem = await Keranjang.findOneAndDelete({ id_user, id_barang });
      if (!deletedItem) {
        return res.status(404).json({ error: 'Item tidak ditemukan di keranjang' });
      }

      res.status(200).json({ message: 'Item berhasil dihapus dari keranjang', keranjang: deletedItem });
    } catch (error) {
      console.error('Error menghapus item dari keranjang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Memperbarui barang di keranjang berdasarkan ID barang
  updateBarangOnKeranjangByIdBarang: async (req, res) => {
    try {
      const { id_user, id_barang, jumlah_barang, ukuran } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id_user) || !mongoose.Types.ObjectId.isValid(id_barang)) {
        return res.status(400).json({ error: 'ID pengguna atau ID barang tidak valid' });
      }

      const updatedItem = await Keranjang.findOneAndUpdate(
        { id_user, id_barang },
        { jumlah_barang, ukuran },
        { new: true }
      );
      if (!updatedItem) {
        return res.status(404).json({ error: 'Item tidak ditemukan di keranjang' });
      }

      res.status(200).json({ message: 'Item berhasil diperbarui di keranjang', keranjang: updatedItem });
    } catch (error) {
      console.error('Error memperbarui item di keranjang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Memperbarui jumlah barang di keranjang berdasarkan ID barang
  updateJumlahBarangOnKeranjangByIdBarang: async (req, res) => {
    try {
      const { id_user, id_barang, jumlah_barang } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id_user) || !mongoose.Types.ObjectId.isValid(id_barang)) {
        return res.status(400).json({ error: 'ID pengguna atau ID barang tidak valid' });
      }

      const updatedItem = await Keranjang.findOneAndUpdate(
        { id_user, id_barang },
        { jumlah_barang },
        { new: true }
      );
      if (!updatedItem) {
        return res.status(404).json({ error: 'Item tidak ditemukan di keranjang' });
      }

      res.status(200).json({ message: 'Jumlah barang berhasil diperbarui di keranjang', keranjang: updatedItem });
    } catch (error) {
      console.error('Error memperbarui jumlah barang di keranjang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Menghitung subtotal
  sumSubtotal: async (req, res) => {
    try {
      const { id_user } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id_user)) {
        return res.status(400).json({ error: 'ID pengguna tidak valid' });
      }

      const keranjang = await Keranjang.find({ id_user });
      if (!keranjang || keranjang.length === 0) {
        return res.status(404).json({ error: 'Keranjang tidak ditemukan' });
      }

      const subtotal = keranjang.reduce((sum, item) => sum + (item.harga_satuan * item.jumlah_barang), 0);

      res.status(200).json({ subtotal });
    } catch (error) {
      console.error('Error menghitung subtotal:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },
};

module.exports = keranjangController;
