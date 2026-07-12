const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { car, pickupDate, returnDate, withDriver } = req.body;
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const totalDays = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
    if (totalDays <= 0) return res.status(400).json({ message: 'Invalid dates' });

    const dailyRate = car.dailyRate || Math.round(car.price * 0.003);
    const driverCharge = withDriver ? 500 * totalDays : 0;
    const totalAmount = (dailyRate * totalDays) + driverCharge;

    const booking = new Booking({
      user: req.user.id,
      car,
      pickupDate: pickup,
      returnDate: returnD,
      totalDays,
      totalAmount,
      withDriver,
      driverCharge,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.razorpayOrderId = razorpayOrderId;
    booking.razorpayPaymentId = razorpayPaymentId;
    booking.razorpaySignature = razorpaySignature;
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = status;
    if (!booking.bookingStatusTimeline) booking.bookingStatusTimeline = [];
    const stepNames = { pending: 'Booked', confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled' };
    const stepName = stepNames[status] || status;
    const existingIdx = booking.bookingStatusTimeline.findIndex(t => t.step === stepName);
    if (existingIdx >= 0) {
      booking.bookingStatusTimeline[existingIdx].completed = true;
      booking.bookingStatusTimeline[existingIdx].timestamp = new Date();
    } else {
      booking.bookingStatusTimeline.push({ step: stepName, timestamp: new Date(), completed: true });
    }
    const order = ['Booked', 'Confirmed', 'Driver Assigned', 'In Progress', 'Completed'];
    booking.bookingStatusTimeline.forEach(t => {
      if (t.step === stepName) return;
      if (order.indexOf(stepName) >= order.indexOf(t.step)) {
        t.completed = true;
      }
    });
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({
      _id: booking._id,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      timeline: booking.bookingStatusTimeline || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.assignDriver = async (req, res) => {
  try {
    const { driverId, driverName, driverPhone, driverPhoto, driverRating } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.driverDetails = {
      driverId, name: driverName, phone: driverPhone, photo: driverPhoto, rating: driverRating,
    };
    if (!booking.bookingStatusTimeline) booking.bookingStatusTimeline = [];
    const exists = booking.bookingStatusTimeline.find(t => t.step === 'Driver Assigned');
    if (!exists) {
      booking.bookingStatusTimeline.push({ step: 'Driver Assigned', timestamp: new Date(), completed: true });
    }
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
