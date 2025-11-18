export const testUsers = {
  donor: {
    email: 'test.donor@example.com',
    password: 'TestPassword123!',
    fullName: 'Test Donor User',
    phone: '+1234567890'
  },
  beneficiary: {
    email: 'test.beneficiary@example.com',
    password: 'TestPassword123!',
    fullName: 'Test Beneficiary',
    phone: '+1234567891'
  },
  admin: {
    email: 'test.admin@example.com',
    password: 'AdminPassword123!',
    fullName: 'Test Admin',
    phone: '+1234567892'
  }
};

export const testDonation = {
  title: 'Test Donation Item',
  description: 'This is a test donation created by Playwright E2E tests',
  category: 'Ropa',
  quantity: 5,
  condition: 'new',
  pickupAddress: {
    street: '123 Test Street',
    city: 'Test City',
    province: 'Test Province',
    postal_code: '12345'
  }
};

export const testCenter = {
  name: 'Test Collection Center',
  description: 'E2E Test Center',
  address: {
    street: '456 Center Ave',
    city: 'Test City',
    province: 'Test Province',
    postal_code: '54321'
  },
  phone: '+1234567893',
  email: 'testcenter@example.com',
  operating_hours: {
    monday_friday: '9:00 AM - 5:00 PM',
    saturday: '10:00 AM - 2:00 PM',
    sunday: 'Closed'
  },
  capacity_info: {
    total: 100,
    used: 0,
    percentage: 0
  }
};

export const testBeneficiary = {
  full_name: 'E2E Test Beneficiary',
  email: 'e2e.beneficiary@test.com',
  phone: '+1234567894',
  address: {
    street: '789 Beneficiary Lane',
    city: 'Test City',
    province: 'Test Province',
    postal_code: '67890'
  },
  needs_description: 'Test needs for E2E testing'
};