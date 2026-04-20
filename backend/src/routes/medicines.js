import express from 'express';
import Medicine from '../models/Medicine.js';
import Inventory from '../models/Inventory.js';

const router = express.Router();

// Search medicines by name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    // Find medicines matching query
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { composition: { $regex: q, $options: 'i' } },
      ],
    }).limit(20);

    if (medicines.length === 0) {
      return res.json([]);
    }

    // For each medicine, get all store listings sorted by price
    const results = await Promise.all(
      medicines.map(async (medicine) => {
        const inventories = await Inventory.find({ medicineId: medicine._id })
          .sort({ price: 1 })
          .populate('vendorId', 'storeName address isVerified');

        const stores = inventories.map((inv) => ({
          inventoryId: inv._id,
          vendorId: inv.vendorId?._id ?? null,
          vendorName: inv.vendorId?.storeName ?? inv.storeName,
          storeName: inv.storeName,
          address: inv.address,
          price: inv.price,
          stock: inv.stock,
          isVerified: inv.isVerified,
        }));

        return {
          medicineInfo: {
            _id: medicine._id,
            name: medicine.name,
            composition: medicine.composition,
            uses: medicine.uses,
            sideEffects: medicine.sideEffects,
          },
          cheapestPrice: stores.length > 0 ? stores[0].price : null,
          stores,
        };
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all medicines (for vendor dropdown)
router.get('/master', async (req, res) => {
  try {
    const medicines = await Medicine.find().select('_id name composition').limit(100);
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
