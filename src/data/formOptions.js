export const defaultFormData = {
  mobileNumber: '',
  rank: '',
  gender: 'Male',
  caste: 'OPEN',
  ews: 'No',
  pwd: 'No',
  def: 'No',
  tfws: 'No',
  orphan: 'No',
  mi: 'No',
  homeUniversity: '',
  preferredDistricts: [],
  preferredBranches: [],
};

export const districtUniversityMap = {
  'Chhatrapati Sambhajinagar, Beed, Jalna, Dharashiv': 'Dr. Babasaheb Ambedkar Marathwada University',
  'Nanded, Hingoli, Latur, Nanded, Parbhani': 'Swami Ramanand Teerth Marathwada University, Nanded',
  'Mumbai City, Mumbai Suburban, Ratnagiri, Raigad, Palghar, Sindhudurg, Thane': 'Mumbai University',
  'Jalgaon Dhule, Jalgaon, Nandurbar': 'Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon',
  'Pune, Ahmednagar, Nashik': 'Savitribai Phule Pune University',
  'Kolhapur, Sangli, Satara': 'Shivaji University',
  Solapur: 'Punyashlok Ahilyadevi Holkar Solapur University',
  'Akola, Amravati, Buldana, Washim, Yavatmal': 'Sant Gadge Baba Amravati University',
  'Bhandara, Gondia, Nagpur, Wardha': 'Rashtrasant Tukadoji Maharaj Nagpur University',
  'Chandrapur, Gadchiroli': 'Gondwana University',
};

export const homeDistrictGroups = Object.keys(districtUniversityMap);

export const districtList = [
  'Amravati', 'Yavatmal', 'Buldhana', 'Akola', 'Washim', 'Chhatrapati Sambhajinagar',
  'Nanded', 'Jalna', 'Latur', 'Osmanabad', 'Dharashiv', 'Beed', 'Parbhani',
  'Mumbai City', 'Mumbai Suburban', 'Raigad', 'Ratnagiri', 'Thane', 'Palghar',
  'Sindhudurg', 'Chandrapur', 'Nagpur', 'Wardha', 'Bhandara', 'Jalgaon', 'Dhule',
  'Nashik', 'Ahmednagar', 'Nandurbar', 'Pune', 'Satara', 'Sangli', 'Kolhapur', 'Solapur',
];

export const branchList = [
  'Computer Science', 'Information Technology', 'Data Science', 'Artificial Intelligence',
  'Electronics and Computer Engineering', 'Electrical Engineering',
  'Electronics and Communication Engineering', 'Automation and Robotics', 'Cyber Security',
  'Internet of Things (IoT)', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Aeronautical Engineering', 'Agricultural Engineering',
  'Bio Medical Engineering', 'Textile Technology', 'Food Technology',
  'Instrumentation Engineering', 'Paper and Pulp Technology',
];

export const casteOptions = ['OPEN', 'OBC', 'SEBC', 'SC', 'ST', 'VJ', 'NT'];
