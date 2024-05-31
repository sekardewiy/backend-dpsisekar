const Barang = require('../models/barangmodel');

const barangController = {
  // Menambahkan barang baru
  addBarang: async (req, res) => {
    try {
      const { nama_barang, deskripsi, harga, ukuran_stok } = req.body;

      const newBarang = new Barang({
        nama_barang,
        deskripsi,
        harga,
        ukuran_stok
      });

      await newBarang.save();
      res.status(201).json({ message: 'Barang berhasil ditambahkan', barang: newBarang });
    } catch (error) {
      console.error('Error menambahkan barang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Menghapus barang berdasarkan ID
  deleteBarang: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedBarang = await Barang.findByIdAndDelete(id);
      if (!deletedBarang) {
        return res.status(404).json({ error: 'Barang tidak ditemukan' });
      }

      res.status(200).json({ message: 'Barang berhasil dihapus', barang: deletedBarang });
    } catch (error) {
      console.error('Error menghapus barang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Memperbarui stok barang berdasarkan ukuran
  updateStokBarang: async (req, res) => {
    try {
      const { id } = req.params;
      const { ukuran, stok } = req.body;

      const barang = await Barang.findById(id);
      if (!barang) {
        return res.status(404).json({ error: 'Barang tidak ditemukan' });
      }

      const ukuranStok = barang.ukuran_stok.find(item => item.ukuran === ukuran);
      if (!ukuranStok) {
        return res.status(404).json({ error: 'Ukuran tidak ditemukan' });
      }

      ukuranStok.stok = stok;
      await barang.save();

      res.status(200).json({ message: 'Stok barang berhasil diperbarui', barang });
    } catch (error) {
      console.error('Error memperbarui stok barang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Mendapatkan barang berdasarkan ID
  getBarangById: async (req, res) => {
    try {
      const { id } = req.params;

      const barang = await Barang.findById(id);
      if (!barang) {
        return res.status(404).json({ error: 'Barang tidak ditemukan' });
      }

      res.status(200).json(barang);
    } catch (error) {
      console.error('Error mendapatkan barang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Mendapatkan ukuran barang berdasarkan ID
  getSizeBarangById: async (req, res) => {
    try {
      const { id } = req.params;

      const barang = await Barang.findById(id);
      if (!barang) {
        return res.status(404).json({ error: 'Barang tidak ditemukan' });
      }

      res.status(200).json(barang.ukuran_stok);
    } catch (error) {
      console.error('Error mendapatkan ukuran barang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Mendapatkan ukuran yang tersedia (stok > 0) berdasarkan ID barang
  getSizeReadyByIdBarang: async (req, res) => {
    try {
      const { id } = req.params;

      const barang = await Barang.findById(id);
      if (!barang) {
        return res.status(404).json({ error: 'Barang tidak ditemukan' });
      }

      const ukuranSiap = barang.ukuran_stok.filter(item => item.stok > 0);
      res.status(200).json(ukuranSiap);
    } catch (error) {
      console.error('Error mendapatkan ukuran siap barang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Mendapatkan semua barang
  getAllBarang: async (req, res) => {
    try {
      const barang = await Barang.find();
      res.status(200).json(barang);
    } catch (error) {
      console.error('Error mendapatkan semua barang:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = barangController;
