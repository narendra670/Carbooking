const Driver = require('../models/Driver');

exports.getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ available: true }).sort({ rating: -1 });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.seedDrivers = async (req, res) => {
  try {
    const count = await Driver.countDocuments();
    if (count > 0) return res.json({ message: 'Drivers already seeded' });
    const drivers = [
      { name: 'Rajesh Kumar', phone: '+91 98765 43210', license: 'DL-2020-12345', rating: 4.8, totalTrips: 342, experience: 8, languages: ['Hindi', 'English', 'Punjabi'], photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { name: 'Suresh Patel', phone: '+91 87654 32109', license: 'MH-2019-67890', rating: 4.6, totalTrips: 215, experience: 5, languages: ['Hindi', 'English', 'Marathi'], photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
      { name: 'Mohammed Ali', phone: '+91 76543 21098', license: 'KA-2021-11223', rating: 4.9, totalTrips: 508, experience: 12, languages: ['Hindi', 'English', 'Kannada', 'Urdu'], photo: 'https://randomuser.me/api/portraits/men/67.jpg' },
      { name: 'Venkat Reddy', phone: '+91 65432 10987', license: 'TS-2020-44556', rating: 4.5, totalTrips: 178, experience: 4, languages: ['Hindi', 'English', 'Telugu'], photo: 'https://randomuser.me/api/portraits/men/22.jpg' },
      { name: 'Arjun Singh', phone: '+91 54321 09876', license: 'RJ-2018-77889', rating: 4.7, totalTrips: 423, experience: 10, languages: ['Hindi', 'English', 'Rajasthani'], photo: 'https://randomuser.me/api/portraits/men/55.jpg' },
    ];
    await Driver.insertMany(drivers);
    res.status(201).json({ message: 'Drivers seeded successfully', count: drivers.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDriverAvailability = async (req, res) => {
  try {
    const { available, currentBooking } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { available, currentBooking },
      { new: true }
    );
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
