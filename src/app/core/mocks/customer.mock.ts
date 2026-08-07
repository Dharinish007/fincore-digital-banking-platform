import { Customer, CustomerStatus, CustomerType, KycStatus } from '../../features/customer/models/customer.model';

export const CUSTOMER_BRANCHES_MOCK = ['Downtown', 'Westside', 'Northgate', 'Eastview', 'Southpark'];

export const CUSTOMERS_MOCK: Customer[] = [
  {
    id: 'CUST-0001', firstName: 'James', lastName: 'Harrison', email: 'james.harrison@example.com',
    phone: '+1-555-0101', dateOfBirth: '1985-03-15', gender: 'MALE',
    customerType: CustomerType.PREMIUM, status: CustomerStatus.ACTIVE, kycStatus: KycStatus.VERIFIED,
    branch: 'Downtown', linkedAccountsCount: 3,
    address: { street: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'USA' },
    createdAt: '2021-04-10T09:00:00Z', updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'CUST-0002', firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.mitchell@example.com',
    phone: '+1-555-0202', dateOfBirth: '1992-07-22', gender: 'FEMALE',
    customerType: CustomerType.RETAIL, status: CustomerStatus.ACTIVE, kycStatus: KycStatus.VERIFIED,
    branch: 'Westside', linkedAccountsCount: 1,
    address: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', postalCode: '90001', country: 'USA' },
    createdAt: '2022-01-15T09:00:00Z', updatedAt: '2024-02-10T08:00:00Z'
  },
  {
    id: 'CUST-0003', firstName: 'Robert', lastName: 'Chen', email: 'robert.chen@example.com',
    phone: '+1-555-0303', dateOfBirth: '1978-11-08', gender: 'MALE',
    customerType: CustomerType.CORPORATE, status: CustomerStatus.ACTIVE, kycStatus: KycStatus.VERIFIED,
    branch: 'Northgate', linkedAccountsCount: 5,
    address: { street: '789 Corporate Blvd', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'USA' },
    createdAt: '2020-09-20T09:00:00Z', updatedAt: '2024-03-01T14:00:00Z'
  },
  {
    id: 'CUST-0004', firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.rodriguez@example.com',
    phone: '+1-555-0404', dateOfBirth: '1995-02-28', gender: 'FEMALE',
    customerType: CustomerType.RETAIL, status: CustomerStatus.INACTIVE, kycStatus: KycStatus.PENDING,
    branch: 'Eastview', linkedAccountsCount: 1,
    address: { street: '321 Pine St', city: 'Houston', state: 'TX', postalCode: '77001', country: 'USA' },
    createdAt: '2023-06-01T09:00:00Z', updatedAt: '2023-12-15T11:00:00Z'
  },
  {
    id: 'CUST-0005', firstName: 'Michael', lastName: 'Thompson', email: 'michael.thompson@example.com',
    phone: '+1-555-0505', dateOfBirth: '1980-09-14', gender: 'MALE',
    customerType: CustomerType.SME, status: CustomerStatus.SUSPENDED, kycStatus: KycStatus.REJECTED,
    branch: 'Southpark', linkedAccountsCount: 2,
    address: { street: '654 Elm Drive', city: 'Phoenix', state: 'AZ', postalCode: '85001', country: 'USA' },
    createdAt: '2022-11-05T09:00:00Z', updatedAt: '2024-01-20T09:30:00Z'
  },
  {
    id: 'CUST-0006', firstName: 'Jessica', lastName: 'Williams', email: 'jessica.williams@example.com',
    phone: '+1-555-0606', dateOfBirth: '1990-05-19', gender: 'FEMALE',
    customerType: CustomerType.RETAIL, status: CustomerStatus.ACTIVE, kycStatus: KycStatus.VERIFIED,
    branch: 'Downtown', linkedAccountsCount: 2,
    address: { street: '987 Maple Way', city: 'Philadelphia', state: 'PA', postalCode: '19101', country: 'USA' },
    createdAt: '2021-08-22T09:00:00Z', updatedAt: '2024-02-28T16:00:00Z'
  },
  {
    id: 'CUST-0007', firstName: 'David', lastName: 'Anderson', email: 'david.anderson@example.com',
    phone: '+1-555-0707', dateOfBirth: '1975-12-01', gender: 'MALE',
    customerType: CustomerType.PREMIUM, status: CustomerStatus.ACTIVE, kycStatus: KycStatus.VERIFIED,
    branch: 'Westside', linkedAccountsCount: 4,
    address: { street: '111 Birch Court', city: 'San Antonio', state: 'TX', postalCode: '78201', country: 'USA' },
    createdAt: '2019-03-10T09:00:00Z', updatedAt: '2024-03-05T12:00:00Z'
  },
  {
    id: 'CUST-0008', firstName: 'Amanda', lastName: 'Garcia', email: 'amanda.garcia@example.com',
    phone: '+1-555-0808', dateOfBirth: '1988-04-07', gender: 'FEMALE',
    customerType: CustomerType.RETAIL, status: CustomerStatus.PENDING, kycStatus: KycStatus.PENDING,
    branch: 'Northgate', linkedAccountsCount: 0,
    address: { street: '222 Spruce Lane', city: 'San Diego', state: 'CA', postalCode: '92101', country: 'USA' },
    createdAt: '2024-04-01T09:00:00Z', updatedAt: '2024-04-01T09:00:00Z'
  }
];
