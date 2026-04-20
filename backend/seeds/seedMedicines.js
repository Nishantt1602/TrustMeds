import Medicine from '../src/models/Medicine.js';

const medicines = [
  {
    name: 'Paracetamol',
    composition: 'Paracetamol 500mg',
    uses: 'Pain relief, fever reduction',
    sideEffects: 'Rare allergic reactions',
    dosage: '500-1000mg every 4-6 hours',
  },
  {
    name: 'Aspirin',
    composition: 'Aspirin 500mg',
    uses: 'Pain relief, anti-inflammatory',
    sideEffects: 'Stomach upset, bleeding',
    dosage: '300-900mg every 4-6 hours',
  },
  {
    name: 'Ibuprofen',
    composition: 'Ibuprofen 400mg',
    uses: 'Pain relief, fever, inflammation',
    sideEffects: 'Stomach upset, kidney issues',
    dosage: '400-600mg every 4-8 hours',
  },
  {
    name: 'Dolo 650',
    composition: 'Paracetamol 650mg',
    uses: 'Pain relief, fever reduction',
    sideEffects: 'Rare liver issues',
    dosage: '1 tablet every 6 hours',
  },
  {
    name: 'Amoxicillin',
    composition: 'Amoxicillin 500mg',
    uses: 'Bacterial infections',
    sideEffects: 'Allergic reactions, nausea',
    dosage: '250-500mg every 8 hours',
  },
  {
    name: 'Cough Syrup',
    composition: 'Dextromethorphan 10mg/5ml',
    uses: 'Cough suppression',
    sideEffects: 'Drowsiness, dizziness',
    dosage: '10ml every 6 hours',
  },
  {
    name: 'Vitamin C',
    composition: 'Ascorbic Acid 500mg',
    uses: 'Immune support, cold prevention',
    sideEffects: 'Stomach cramps in high doses',
    dosage: '1 tablet daily',
  },
  {
    name: 'Multivitamin',
    composition: 'Multivitamin with minerals',
    uses: 'Nutritional supplement',
    sideEffects: 'Rare nausea',
    dosage: '1 tablet daily',
  },
  {
    name: 'Omeprazole',
    composition: 'Omeprazole 20mg',
    uses: 'Acid reflux, GERD',
    sideEffects: 'Headache, nausea',
    dosage: '20-40mg once daily',
  },
  {
    name: 'Antacid',
    composition: 'Aluminum Hydroxide 200mg',
    uses: 'Heartburn relief',
    sideEffects: 'Constipation',
    dosage: '2-4 tablets as needed',
  },
];

const seedMedicines = async () => {
  try {
    const existingMedicines = await Medicine.countDocuments();
    
    if (existingMedicines > 0) {
      console.log(`Database already has ${existingMedicines} medicines. Skipping seed.`);
      return;
    }

    await Medicine.insertMany(medicines);
    console.log(`✅ Successfully seeded ${medicines.length} medicines into the database!`);
  } catch (error) {
    console.error('Error seeding medicines:', error.message);
  }
};

export default seedMedicines;
