const Penjualan = require('../models/penjualanmodel');

const penjualanController = {
  // Menambahkan penjualan baru
  addPenjualan: async (req, res) => {
    try {
      const { id_user, total_harga, metode_pembayaran, items } = req.body;

      // Calculate total price from items
      const calculatedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      if (total_harga !== calculatedTotal) {
        return res.status(400).json({ error: 'Total harga tidak sesuai dengan subtotal item' });
      }

      const newPenjualan = new Penjualan({
        id_user,
        total_harga,
        metode_pembayaran,
        items
      });

      await newPenjualan.save();
      res.status(201).json({ message: 'Penjualan berhasil ditambahkan', penjualan: newPenjualan });
    } catch (error) {
      console.error('Error menambahkan penjualan:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Mendapatkan penjualan berdasarkan ID
  getPenjualanById: async (req, res) => {
    try {
      const { id } = req.params;

      const penjualan = await Penjualan.findById(id).populate('id_user').populate('items.id_barang');
      if (!penjualan) {
        return res.status(404).json({ error: 'Penjualan tidak ditemukan' });
      }

      res.status(200).json(penjualan);
    } catch (error) {
      console.error('Error mendapatkan penjualan:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Mendapatkan semua penjualan pada tanggal tertentu
  getAllPenjualanOnDate: async (req, res) => {
    try {
      const { date } = req.query;
      const targetDate = new Date(date);

      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({ error: 'Format tanggal tidak valid. Gunakan YYYY-MM-DD.' });
      }

      // Normalisasi tanggal untuk mengabaikan bagian waktu
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      const penjualan = await Penjualan.find({ tanggal_penjualan: { $gte: startOfDay, $lte: endOfDay } });

      res.status(200).json(penjualan);
    } catch (error) {
      console.error('Error mendapatkan penjualan pada tanggal tertentu:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Mendapatkan semua penjualan dalam rentang tanggal
  getAllPenjualanRangeDate: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error:'Format tanggal tidak valid. Gunakan YYYY-MM-DD.' });
      }

      const penjualan = await Penjualan.find({ tanggal_penjualan: { $gte: start, $lte: end } });

      res.status(200).json(penjualan);
    } catch (error) {
      console.error('Error mendapatkan penjualan dalam rentang tanggal:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Menghapus penjualan berdasarkan ID
  deletePenjualan: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedPenjualan = await Penjualan.findByIdAndDelete(id);
      if (!deletedPenjualan) {
        return res.status(404).json({ error: 'Penjualan tidak ditemukan' });
      }

      res.status(200).json({ message: 'Penjualan berhasil dihapus', penjualan: deletedPenjualan });
    } catch (error) {
      console.error('Error menghapus penjualan:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Memperbarui penjualan berdasarkan ID
  updatePenjualan: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_user, total_harga, metode_pembayaran, status, items } = req.body;

      // Calculate total price from items if items are provided
      let calculatedTotal = total_harga;
      if (items) {
        calculatedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        if (total_harga !== calculatedTotal) {
          return res.status(400).json({ error: 'Total harga tidak sesuai dengan subtotal item' });
        }
      }

      const updatedPenjualan = await Penjualan.findByIdAndUpdate(
        id,
        { id_user, total_harga: calculatedTotal, metode_pembayaran, status, items },
        { new: true }
      );
      if (!updatedPenjualan) {
        return res.status(404).json({ error: 'Penjualan tidak ditemukan' });
      }

      res.status(200).json({ message: 'Penjualan berhasil diperbarui', penjualan: updatedPenjualan });
    } catch (error) {
      console.error('Error memperbarui penjualan:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Menghitung total harga penjualan pada tanggal tertentu
  sumTotalHargaOnDate: async (req, res) => {
    try {
      const { date } = req.query;
      const targetDate = new Date(date);

      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({ error: 'Format tanggal tidak valid. Gunakan YYYY-MM-DD.' });
      }

      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      const penjualan = await Penjualan.find({ tanggal_penjualan: { $gte: startOfDay, $lte: endOfDay } });
      const totalHarga = penjualan.reduce((sum, item) => sum + item.total_harga, 0);

      res.status(200).json({ totalHarga });
    } catch (error) {
      console.error('Error menghitung total harga penjualan pada tanggal tertentu:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Menghitung total harga penjualan dalam rentang tanggal
  sumTotalHargaRangeDate: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Format tanggal tidak valid. Gunakan YYYY-MM-DD.' });
      }

      const penjualan = await Penjualan.find({ tanggal_penjualan: { $gte: start, $lte: end } });
      const totalHarga = penjualan.reduce((sum, item) => sum + item.total_harga, 0);

      res.status(200).json({ totalHarga });
    } catch (error) {
      console.error('Error menghitung total harga penjualan dalam rentang tanggal:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = penjualanController;
