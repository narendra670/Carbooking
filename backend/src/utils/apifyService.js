const axios = require('axios');

const APIFY_API_URL = process.env.APIFY_API_URL;
const APIFY_TOKEN = process.env.APIFY_TOKEN;

const bodyTypeSeating = {
  SUV: 7,
  Sedan: 5,
  Hatchback: 4,
};

const bodyTypeMileage = {
  SUV: 14,
  Sedan: 16,
  Hatchback: 18,
};

const purposeRecommendations = {
  'family trip': { bodyTypes: ['SUV'], label: 'Family Trip' },
  'office work': { bodyTypes: ['Sedan'], label: 'Office Work' },
  'solo travel': { bodyTypes: ['Hatchback'], label: 'Solo Travel' },
};

const transformCarData = (rawCar) => {
  const bodyType = rawCar.bt || 'Hatchback';
  const fuelType = rawCar.ft || 'Petrol';
  const transmission = rawCar.tt || 'Manual';
  const dailyRate = Math.max(Math.round(rawCar.price * 0.003), 500);

  return {
    used_car_sku_id: rawCar.used_car_sku_id,
    model: rawCar.model || 'Unknown',
    oem: rawCar.oem || 'Unknown',
    variant_name: rawCar.variant_name || '',
    price: rawCar.price || 0,
    formatted_price: rawCar.formatted_price || '',
    image: rawCar.pi || '',
    year: rawCar.myear || 0,
    km: rawCar.km || '0',
    fuelType,
    transmission,
    bodyType,
    city: rawCar.city || '',
    locality: rawCar.loc || '',
    owner: rawCar.owner || 1,
    mileage: bodyTypeMileage[bodyType] || 15,
    seating: bodyTypeSeating[bodyType] || 5,
    dailyRate,
    features: generateFeatures(bodyType, fuelType, transmission, rawCar.myear),
    purpose: recommendPurpose(bodyType),
  };
};

const generateFeatures = (bodyType, fuelType, transmission, year) => {
  const features = [];
  if (bodyType === 'SUV') features.push('High Ground Clearance', 'Spacious Interior');
  if (bodyType === 'Sedan') features.push('Comfortable Ride', 'Large Boot Space');
  if (bodyType === 'Hatchback') features.push('Easy Parking', 'Fuel Efficient');
  if (fuelType === 'Petrol') features.push('Petrol Engine');
  if (transmission === 'Manual') features.push('Manual Transmission');
  if (year && year >= 2016) features.push('Modern Features');
  features.push('AC', 'Power Steering');
  return features;
};

const recommendPurpose = (bodyType) => {
  if (bodyType === 'SUV') return 'Family Trip';
  if (bodyType === 'Sedan') return 'Office Work';
  return 'Solo Travel';
};

const fetchCarsFromApiify = async () => {
  try {
    const response = await axios.get(APIFY_API_URL, {
      params: { token: APIFY_TOKEN },
    });
    const cars = response.data.map(transformCarData);
    return cars;
  } catch (error) {
    console.error('Error fetching cars from Apify:', error.message);
    throw new Error('Failed to fetch cars from external API');
  }
};

const getCarsByBudget = (cars, budget) => {
  return cars.filter(car => car.dailyRate <= budget).sort((a, b) => a.dailyRate - b.dailyRate);
};

const getCarsByPurpose = (cars, purpose) => {
  const recommendation = purposeRecommendations[purpose.toLowerCase()];
  if (!recommendation) return cars.slice(0, 6);
  const recommended = cars.filter(car => recommendation.bodyTypes.includes(car.bodyType));
  const others = cars.filter(car => !recommendation.bodyTypes.includes(car.bodyType));
  return [...recommended.slice(0, 4), ...others.slice(0, 2)];
};

module.exports = {
  fetchCarsFromApiify,
  getCarsByBudget,
  getCarsByPurpose,
  transformCarData,
  purposeRecommendations,
};
