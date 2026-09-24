export const CATEGORIES = [
  { id: 'electronics',    label: 'Electronics',       icon: '💻' },
  { id: 'fashion',        label: 'Fashion & Apparel',  icon: '👗' },
  { id: 'home',           label: 'Home & Garden',      icon: '🏡' },
  { id: 'sports',         label: 'Sports & Outdoors',  icon: '⚽' },
  { id: 'toys',           label: 'Toys & Hobbies',     icon: '🎮' },
  { id: 'books',          label: 'Books & Media',      icon: '📚' },
  { id: 'vehicles',       label: 'Vehicles & Parts',   icon: '🚗' },
  { id: 'jewelry',        label: 'Jewelry & Watches',  icon: '💍' },
  { id: 'art',            label: 'Art & Collectibles', icon: '🎨' },
  { id: 'health',         label: 'Health & Beauty',    icon: '💊' },
  { id: 'music',          label: 'Musical Instruments',icon: '🎸' },
  { id: 'pets',           label: 'Pet Supplies',       icon: '🐾' },
  { id: 'food',           label: 'Food & Beverages',   icon: '🍎' },
  { id: 'tools',          label: 'Tools & Equipment',  icon: '🔧' },
  { id: 'other',          label: 'Other',              icon: '📦' },
]

export const CONDITIONS = [
  { id: 'new',       label: 'New' },
  { id: 'like_new',  label: 'Like New' },
  { id: 'used',      label: 'Used' },
  { id: 'for_parts', label: 'For Parts' },
]

export const CONDITION_COLORS = {
  new:       'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  like_new:  'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  used:      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  for_parts: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

export const LISTING_STATUSES = [
  { id: 'active', label: 'Active' },
  { id: 'sold',   label: 'Sold' },
  { id: 'draft',  label: 'Draft' },
]

export const SORT_OPTIONS = [
  { id: 'newest',     label: 'Newest First' },
  { id: 'oldest',     label: 'Oldest First' },
  { id: 'price_asc',  label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
]

export const ORDER_STATUSES = [
  { id: 'pending',    label: 'Pending',    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { id: 'confirmed',  label: 'Confirmed',  color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'shipped',    label: 'Shipped',    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'delivered',  label: 'Delivered',  color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  { id: 'cancelled',  label: 'Cancelled',  color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
]

export const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize',
  'Benin','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Bulgaria','Burkina Faso',
  'Cambodia','Cameroon','Canada','Chile','China','Colombia','Congo','Costa Rica','Croatia',
  'Cuba','Cyprus','Czech Republic','Denmark','Dominican Republic','Ecuador','Egypt',
  'El Salvador','Estonia','Ethiopia','Finland','France','Georgia','Germany','Ghana','Greece',
  'Guatemala','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland',
  'Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan',
  'Latvia','Lebanon','Libya','Lithuania','Luxembourg','Malaysia','Maldives','Mali','Malta',
  'Mexico','Moldova','Mongolia','Morocco','Mozambique','Myanmar','Nepal','Netherlands',
  'New Zealand','Nicaragua','Nigeria','North Korea','Norway','Oman','Pakistan','Palestine',
  'Panama','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia',
  'Rwanda','Saudi Arabia','Senegal','Serbia','Singapore','Slovakia','Slovenia','Somalia',
  'South Africa','South Korea','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria',
  'Taiwan','Tajikistan','Tanzania','Thailand','Tunisia','Turkey','Uganda','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Venezuela',
  'Vietnam','Yemen','Zambia','Zimbabwe',
]
