// Demo data for the inventory management system

// Products Data
export const products = [
  {
    id: 'p1',
    name: 'Cement (50kg)',
    category: 'Building Materials',
    price: 1200,
    cost: 950,
    quantity: 250,
    unit: 'bags',
    lowStockThreshold: 50,
    vendorId: 'v1'
  },
  {
    id: 'p2',
    name: 'Bricks (Standard)',
    category: 'Building Materials',
    price: 25,
    cost: 18,
    quantity: 5000,
    unit: 'pieces',
    lowStockThreshold: 1000,
    vendorId: 'v2'
  },
  {
    id: 'p3',
    name: 'Steel Rebar (12mm)',
    category: 'Steel & Metals',
    price: 2800,
    cost: 2200,
    quantity: 120,
    unit: 'rods',
    lowStockThreshold: 30,
    vendorId: 'v3'
  },
  {
    id: 'p4',
    name: 'Paint (20L, White)',
    category: 'Finishes',
    price: 8500,
    cost: 6200,
    quantity: 25,
    unit: 'buckets',
    lowStockThreshold: 10,
    vendorId: 'v4'
  },
  {
    id: 'p5',
    name: 'Sand (Fine)',
    category: 'Building Materials',
    price: 5000,
    cost: 3500,
    quantity: 45,
    unit: 'tons',
    lowStockThreshold: 15,
    vendorId: 'v1'
  },
  {
    id: 'p6',
    name: 'Electrical Wire (1.5mm)',
    category: 'Electrical',
    price: 85,
    cost: 62,
    quantity: 1200,
    unit: 'meters',
    lowStockThreshold: 300,
    vendorId: 'v5'
  },
  {
    id: 'p7',
    name: 'PVC Pipes (4-inch)',
    category: 'Plumbing',
    price: 950,
    cost: 720,
    quantity: 8,
    unit: 'pieces',
    lowStockThreshold: 15,
    vendorId: 'v6'
  },
  {
    id: 'p8',
    name: 'Tiles (24x24 inches)',
    category: 'Flooring',
    price: 350,
    cost: 260,
    quantity: 800,
    unit: 'pieces',
    lowStockThreshold: 100,
    vendorId: 'v4'
  }
];

// Vendors Data
export const vendors = [
  {
    id: 'v1',
    name: 'Lucky Cement Ltd.',
    contact: 'Ali Ahmed',
    phone: '+92 321-1234567',
    email: 'ali@luckycement.pk',
    address: 'Peeru Goth, Karachi, Sindh',
    balance: 450000
  },
  {
    id: 'v2',
    name: 'Lahore Bricks Supply',
    contact: 'Saima Khan',
    phone: '+92 300-2345678',
    email: 'saima@lahorebricks.pk',
    address: 'Kot Lakhpat, Lahore, Punjab',
    balance: 230000
  },
  {
    id: 'v3',
    name: 'Amreli Steels Ltd.',
    contact: 'Imran Malik',
    phone: '+92 333-3456789',
    email: 'imran@amrelisteels.pk',
    address: 'SITE Area, Karachi, Sindh',
    balance: 780000
  },
  {
    id: 'v4',
    name: 'Diamond Paints',
    contact: 'Fatima Raza',
    phone: '+92 305-4567890',
    email: 'fatima@diamondpaints.pk',
    address: 'Rashid Minhas Road, Karachi, Sindh',
    balance: 120000
  },
  {
    id: 'v5',
    name: 'Pakistan Cables',
    contact: 'Aziz Khan',
    phone: '+92 311-5678901',
    email: 'aziz@pakistancables.pk',
    address: 'I-9 Industrial Area, Islamabad',
    balance: 370000
  },
  {
    id: 'v6',
    name: 'Dadex Pipes',
    contact: 'Ayesha Tariq',
    phone: '+92 335-6789012',
    email: 'ayesha@dadexpipes.pk',
    address: 'Korangi Industrial Area, Karachi, Sindh',
    balance: 90000
  }
];

// Customers Data
export const customers = [
  {
    id: 'c1',
    name: 'Bahria Town Constructions',
    contact: 'Rashid Ali',
    phone: '+92 321-7890123',
    email: 'rashid@bahriatown.pk',
    address: 'Bahria Town, Rawalpindi, Punjab',
    balance: 1250000
  },
  {
    id: 'c2',
    name: 'Habib Construction Services',
    contact: 'Zahid Mahmood',
    phone: '+92 333-8901234',
    email: 'zahid@habibconstruction.pk',
    address: 'DHA Phase 5, Lahore, Punjab',
    balance: 870000
  },
  {
    id: 'c3',
    name: 'Chapal Builders',
    contact: 'Mehmood Khan',
    phone: '+92 300-9012345',
    email: 'mehmood@chapalbuilders.pk',
    address: 'F-10 Markaz, Islamabad',
    balance: 0
  },
  {
    id: 'c4',
    name: 'Saif Builders',
    contact: 'Naveed Ahmed',
    phone: '+92 335-0123456',
    email: 'naveed@saifbuilders.pk',
    address: 'Gulberg, Peshawar, KPK',
    balance: 320000
  }
];

// Get current date and month
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();
const currentDate = now.toISOString().split('T')[0];

// Helper to generate a date for the current month
const getCurrentMonthDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Helper to generate a date for a specific past month
const getPastMonthDate = (month, day) => {
  const date = new Date();
  date.setMonth(month);
  date.setDate(day);
  return date.toISOString().split('T')[0];
};

// Sales Transactions
export const sales = [
  // Previous months (April) sales
  {
    id: 's1',
    date: getPastMonthDate(3, 5), // April 5
    customerId: 'c1',
    items: [
      { productId: 'p1', quantity: 50, price: 1200 },
      { productId: 'p3', quantity: 15, price: 2800 }
    ],
    total: 102000,
    paid: 102000,
    due: 0,
    status: 'completed'
  },
  {
    id: 's2',
    date: getPastMonthDate(3, 12), // April 12
    customerId: 'c2',
    items: [
      { productId: 'p2', quantity: 1000, price: 25 },
      { productId: 'p5', quantity: 5, price: 5000 }
    ],
    total: 50000,
    paid: 30000,
    due: 20000,
    status: 'partial'
  },
  {
    id: 's3',
    date: getPastMonthDate(3, 18), // April 18
    customerId: 'c3',
    items: [
      { productId: 'p4', quantity: 8, price: 8500 },
      { productId: 'p6', quantity: 200, price: 85 }
    ],
    total: 85000,
    paid: 85000,
    due: 0,
    status: 'completed'
  },
  {
    id: 's4',
    date: getPastMonthDate(3, 25), // April 25
    customerId: 'c4',
    items: [
      { productId: 'p7', quantity: 12, price: 950 }
    ],
    total: 11400,
    paid: 0,
    due: 11400,
    status: 'unpaid'
  },
  
  // Previous months (May) sales
  {
    id: 's5',
    date: getPastMonthDate(4, 3), // May 3
    customerId: 'c1',
    items: [
      { productId: 'p1', quantity: 30, price: 1200 },
      { productId: 'p2', quantity: 500, price: 25 }
    ],
    total: 48500,
    paid: 48500,
    due: 0,
    status: 'completed'
  },
  {
    id: 's6',
    date: getPastMonthDate(4, 10), // May 10
    customerId: 'c2',
    items: [
      { productId: 'p8', quantity: 150, price: 350 },
      { productId: 'p4', quantity: 3, price: 8500 }
    ],
    total: 77500,
    paid: 50000,
    due: 27500,
    status: 'partial'
  },
  {
    id: 's7',
    date: getPastMonthDate(4, 17), // May 17
    customerId: 'c3',
    items: [
      { productId: 'p3', quantity: 10, price: 2800 }
    ],
    total: 28000,
    paid: 28000,
    due: 0,
    status: 'completed'
  },
  {
    id: 's8',
    date: getPastMonthDate(4, 24), // May 24
    customerName: 'Gulf Builders',
    customerPhone: '+92 345-1234567',
    items: [
      { productId: 'p6', quantity: 500, price: 85 }
    ],
    total: 42500,
    paid: 20000,
    due: 22500,
    status: 'partial'
  },
  
  // Current month sales
  {
    id: 's9',
    date: getCurrentMonthDate(25), // Early current month
    customerId: 'c4',
    items: [
      { productId: 'p5', quantity: 6, price: 5000 }
    ],
    total: 30000,
    paid: 30000,
    due: 0,
    status: 'completed'
  },
  {
    id: 's10',
    date: getCurrentMonthDate(22),
    customerId: 'c2',
    items: [
      { productId: 'p3', quantity: 8, price: 2800 },
      { productId: 'p8', quantity: 100, price: 350 }
    ],
    total: 57400,
    paid: 30000,
    due: 27400,
    status: 'partial'
  },
  {
    id: 's11',
    date: getCurrentMonthDate(20),
    customerId: 'c1',
    items: [
      { productId: 'p1', quantity: 40, price: 1200 }
    ],
    total: 48000,
    paid: 48000,
    due: 0,
    status: 'completed'
  },
  {
    id: 's12',
    date: getCurrentMonthDate(18),
    customerName: 'City Developers',
    customerPhone: '+92 333-9876543',
    items: [
      { productId: 'p2', quantity: 2000, price: 25 },
      { productId: 'p6', quantity: 300, price: 85 }
    ],
    total: 75500,
    paid: 0,
    due: 75500,
    status: 'unpaid'
  },
  {
    id: 's13',
    date: getCurrentMonthDate(15),
    customerId: 'c3',
    items: [
      { productId: 'p4', quantity: 5, price: 8500 }
    ],
    total: 42500,
    paid: 42500,
    due: 0,
    status: 'completed'
  },
  {
    id: 's14',
    date: getCurrentMonthDate(12),
    customerName: 'Khan Brothers',
    customerPhone: '+92 312-5555555',
    items: [
      { productId: 'p7', quantity: 10, price: 950 },
      { productId: 'p8', quantity: 50, price: 350 }
    ],
    total: 27000,
    paid: 15000,
    due: 12000,
    status: 'partial'
  },
  {
    id: 's15',
    date: getCurrentMonthDate(10),
    customerId: 'c4',
    items: [
      { productId: 'p1', quantity: 25, price: 1200 },
      { productId: 'p3', quantity: 5, price: 2800 }
    ],
    total: 44000,
    paid: 44000,
    due: 0,
    status: 'completed'
  },
  {
    id: 's16',
    date: getCurrentMonthDate(8),
    customerId: 'c2',
    items: [
      { productId: 'p5', quantity: 3, price: 5000 }
    ],
    total: 15000,
    paid: 0,
    due: 15000,
    status: 'unpaid'
  },
  {
    id: 's17',
    date: getCurrentMonthDate(5),
    customerName: 'Lahore Construction Co.',
    customerPhone: '+92 321-7777777',
    items: [
      { productId: 'p2', quantity: 1000, price: 25 },
      { productId: 'p6', quantity: 200, price: 85 }
    ],
    total: 42000,
    paid: 42000,
    due: 0,
    status: 'completed'
  },
  {
    id: 's18',
    date: getCurrentMonthDate(3),
    customerId: 'c1',
    items: [
      { productId: 'p4', quantity: 2, price: 8500 },
      { productId: 'p8', quantity: 75, price: 350 }
    ],
    total: 43250,
    paid: 30000,
    due: 13250,
    status: 'partial'
  },
  {
    id: 's19',
    date: getCurrentMonthDate(1),
    customerId: 'c3',
    items: [
      { productId: 'p1', quantity: 35, price: 1200 },
      { productId: 'p3', quantity: 7, price: 2800 }
    ],
    total: 61600,
    paid: 61600,
    due: 0,
    status: 'completed'
  },
  {
    id: 's20',
    date: currentDate, // Today
    customerName: 'Walk-in Customer',
    customerPhone: '+92 333-1234567',
    items: [
      { productId: 'p2', quantity: 500, price: 25 },
      { productId: 'p7', quantity: 3, price: 950 }
    ],
    total: 15350,
    paid: 15350,
    due: 0,
    status: 'completed'
  }
];

// Purchase Transactions
export const purchases = [
  {
    id: 'pur1',
    date: '2023-06-25',
    vendorId: 'v1',
    items: [
      { productId: 'p1', quantity: 100, cost: 950 },
      { productId: 'p5', quantity: 10, cost: 3500 }
    ],
    total: 130000,
    paid: 130000,
    due: 0,
    status: 'completed'
  },
  {
    id: 'pur2',
    date: '2023-06-28',
    vendorId: 'v3',
    items: [
      { productId: 'p3', quantity: 50, cost: 2200 }
    ],
    total: 110000,
    paid: 80000,
    due: 30000,
    status: 'partial'
  },
  {
    id: 'pur3',
    date: '2023-07-02',
    vendorId: 'v4',
    items: [
      { productId: 'p4', quantity: 15, cost: 6200 }
    ],
    total: 93000,
    paid: 0,
    due: 93000,
    status: 'unpaid'
  },
  {
    id: 'pur4',
    date: '2023-07-05',
    vendorId: 'v2',
    items: [
      { productId: 'p2', quantity: 2000, cost: 18 }
    ],
    total: 36000,
    paid: 36000,
    due: 0,
    status: 'completed'
  },
  {
    id: 'pur5',
    date: getCurrentMonthDate(15),
    vendorId: 'v5',
    items: [
      { productId: 'p6', quantity: 500, cost: 62 }
    ],
    total: 31000,
    paid: 31000,
    due: 0,
    status: 'completed'
  },
  {
    id: 'pur6',
    date: getCurrentMonthDate(8),
    vendorId: 'v6',
    items: [
      { productId: 'p7', quantity: 15, cost: 720 }
    ],
    total: 10800,
    paid: 5000,
    due: 5800,
    status: 'partial'
  },
  {
    id: 'pur7',
    date: getCurrentMonthDate(3),
    vendorId: 'v4',
    items: [
      { productId: 'p8', quantity: 200, cost: 260 }
    ],
    total: 52000,
    paid: 52000,
    due: 0,
    status: 'completed'
  }
];

// Helper function to get current month's sales
export function getCurrentMonthSales() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });
}

// Helper function to get current month's purchases
export function getCurrentMonthPurchases() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.date);
    return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
  });
}

// Helper function to get low stock items
export function getLowStockItems() {
  return products.filter(product => product.quantity <= product.lowStockThreshold);
}

// Helper function to calculate total inventory value
export function getTotalInventoryValue() {
  return products.reduce((total, product) => total + (product.cost * product.quantity), 0);
}

// Helper function to calculate total customer dues
export function getTotalCustomerDues() {
  return customers.reduce((total, customer) => total + customer.balance, 0);
}

// Helper function to calculate total vendor dues
export function getTotalVendorDues() {
  return vendors.reduce((total, vendor) => total + vendor.balance, 0);
}

// Helper function to get a customer by ID
export function getCustomerById(id) {
  return customers.find(customer => customer.id === id);
}

// Helper function to get a vendor by ID
export function getVendorById(id) {
  return vendors.find(vendor => vendor.id === id);
}

// Helper function to get a product by ID
export function getProductById(id) {
  return products.find(product => product.id === id);
}

// Helper function to get vendor purchases
export function getVendorPurchases(vendorId) {
  return purchases.filter(purchase => purchase.vendorId === vendorId);
} 