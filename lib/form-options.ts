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
  preferredDistricts: [] as string[],
  preferredBranches: [] as string[],
};

export const homeDistrictGroups = [
  'Chhatrapati Sambhajinagar, Beed, Jalna, Dharashiv',
  'Nanded, Hingoli, Latur, Nanded, Parbhani',
  'Mumbai City, Mumbai Suburban, Ratnagiri, Raigad, Palghar, Sindhudurg, Thane',
  'Jalgaon Dhule, Jalgaon, Nandurbar',
  'Pune, Ahmednagar, Nashik',
  'Kolhapur, Sangli, Satara',
  'Solapur',
  'Akola, Amravati, Buldana, Washim, Yavatmal',
  'Bhandara, Gondia, Nagpur, Wardha',
  'Chandrapur, Gadchiroli',
];

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
