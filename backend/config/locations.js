const locations = [
  { city: 'Visakhapatnam', district: 'Visakhapatnam', region: 'North Coastal Andhra', travelKmFromBase: 0, highlights: ['Beach Road', 'Rushikonda', 'MVP Colony', 'Simhachalam'] },
  { city: 'Vizianagaram', district: 'Vizianagaram', region: 'North Coastal Andhra', travelKmFromBase: 62, highlights: ['Fort area', 'Ramatheertham', 'Bobbili'] },
  { city: 'Srikakulam', district: 'Srikakulam', region: 'North Coastal Andhra', travelKmFromBase: 116, highlights: ['Arasavalli', 'Baruva Beach', 'Kalingapatnam'] },
  { city: 'Kakinada', district: 'Kakinada', region: 'Godavari', travelKmFromBase: 154, highlights: ['Uppada Beach', 'Hope Island', 'Pithapuram'] },
  { city: 'Rajahmundry', district: 'East Godavari', region: 'Godavari', travelKmFromBase: 200, highlights: ['Godavari Bridge', 'Dowleswaram', 'Kadiyam'] },
  { city: 'Eluru', district: 'Eluru', region: 'Godavari', travelKmFromBase: 302, highlights: ['Kolleru Lake', 'Denduluru', 'Vatluru'] },
  { city: 'Vijayawada', district: 'NTR', region: 'Krishna', travelKmFromBase: 350, highlights: ['Benz Circle', 'Bhavani Island', 'Kanaka Durga Temple'] },
  { city: 'Guntur', district: 'Guntur', region: 'Capital Region', travelKmFromBase: 385, highlights: ['Brodipet', 'Amaravati', 'Uppalapadu'] },
  { city: 'Ongole', district: 'Prakasam', region: 'South Coastal Andhra', travelKmFromBase: 484, highlights: ['Vodarevu Beach', 'Chirala', 'Kothapatnam'] },
  { city: 'Nellore', district: 'SPSR Nellore', region: 'South Coastal Andhra', travelKmFromBase: 613, highlights: ['Mypadu Beach', 'Pulicat Lake', 'Tada'] },
  { city: 'Tirupati', district: 'Tirupati', region: 'Rayalaseema', travelKmFromBase: 757, highlights: ['Tirumala', 'Alipiri', 'Kapila Theertham'] },
  { city: 'Kadapa', district: 'YSR Kadapa', region: 'Rayalaseema', travelKmFromBase: 705, highlights: ['Gandikota', 'Ameen Peer Dargah', 'Ontimitta'] },
  { city: 'Kurnool', district: 'Kurnool', region: 'Rayalaseema', travelKmFromBase: 759, highlights: ['Orvakal', 'Konda Reddy Fort', 'Nandyal'] },
  { city: 'Anantapur', district: 'Anantapuramu', region: 'Rayalaseema', travelKmFromBase: 850, highlights: ['Lepakshi', 'Dharmavaram', 'Hindupur'] }
];

function getTravelCharge(km) {
  if (km <= 25) return 0;
  if (km <= 75) return 699;
  if (km <= 150) return 1499;
  if (km <= 350) return 2499;
  if (km <= 650) return 3999;
  return 5999;
}

module.exports = { locations, getTravelCharge };
