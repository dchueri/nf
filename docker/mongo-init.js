// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

print('Starting MongoDB initialization...');

// Switch to the admin database
db = db.getSiblingDB('admin');

// Create the application database
db = db.getSiblingDB('central-notas-pj');

// Create a user for the application
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'central-notas-pj'
    }
  ]
});

// Create a user for external connections (like Compass)
db.createUser({
  user: 'compass_user',
  pwd: 'compass_password',
  roles: [
    {
      role: 'readWrite',
      db: 'central-notas-pj'
    },
    {
      role: 'read',
      db: 'admin'
    }
  ]
});

// Create initial collections
db.createCollection('users');
db.createCollection('companies');
db.createCollection('invoices');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "companyId": 1 });
db.users.createIndex({ "role": 1, "status": 1 });

db.companies.createIndex({ "cnpj": 1 }, { unique: true });
db.companies.createIndex({ "ownerId": 1 });
db.companies.createIndex({ "status": 1 });

db.invoices.createIndex({ "companyId": 1, "status": 1 });
db.invoices.createIndex({ "submittedBy": 1 });
db.invoices.createIndex({ "dueDate": 1 });
db.invoices.createIndex({ "issueDate": 1 });

print('MongoDB initialization completed successfully!');
print('Database: central-notas-pj');
print('Users created:');
print('  - app_user (for application)');
print('  - compass_user (for external tools)');
print('Collections: users, companies, invoices');
print('');
print('Connection URIs:');
print('  - Application: mongodb://app_user:app_password@localhost:27017/central-notas-pj');
print('  - Compass: mongodb://compass_user:compass_password@localhost:27017/central-notas-pj');
print('  - Admin: mongodb://admin:password123@localhost:27017/admin');
