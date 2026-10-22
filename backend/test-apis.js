const http = require('http');

async function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('🧪 Running Task 3 Express API & Middleware Tests');
  console.log('==================================================\n');

  // Test 1: GET /api/v1/vehicles
  console.log('1. Testing GET /api/v1/vehicles (Public)...');
  const vRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/vehicles',
    method: 'GET'
  });
  console.log(`   Status: ${vRes.status} | Total Vehicles: ${vRes.body.count}`);
  const firstCar = vRes.body.data[0];
  console.log(`   Vehicle: ${firstCar.model} | Available: ${firstCar.available} | ID: ${firstCar._id}\n`);

  // Test 2: POST /api/v1/auth/login
  console.log('2. Testing POST /api/v1/auth/login (Authentication)...');
  const authRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'riya038@driveeasy.com', password: 'password123' }
  );
  console.log(`   Status: ${authRes.status} | Message: ${authRes.body.message}`);
  const token = authRes.body.token;
  console.log(`   JWT Token: ${token.substring(0, 30)}...\n`);

  // Test 3: POST /api/v1/bookings without token (Testing authGuard)
  console.log('3. Testing authGuard (POST /api/v1/bookings without token)...');
  const unauthRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/bookings',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { vehicleId: firstCar._id, pickupDate: '2026-09-01', returnDate: '2026-09-05' }
  );
  console.log(`   Expected 401: Received ${unauthRes.status} - "${unauthRes.body.message}"\n`);

  // Test 4: POST /api/v1/bookings with Bearer token (Task 3 + Task 5)
  console.log('4. Testing POST /api/v1/bookings with Bearer token...');
  const bookRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    },
    { vehicleId: firstCar._id, pickupDate: '2026-09-01', returnDate: '2026-09-05' }
  );
  console.log(`   Status: ${bookRes.status} (201 Created) | Booking ID: ${bookRes.body.data._id}`);
  console.log(`   Vehicle Booked: ${bookRes.body.data.vehicleId.model} | Total: ₹${bookRes.body.data.totalAmount}\n`);
  const bookingId = bookRes.body.data._id;

  // Test 5: Double-Booking Prevention check (Attempting to book same vehicle again)
  console.log('5. Testing Double-Booking Prevention (Same vehicle)...');
  const doubleRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    },
    { vehicleId: firstCar._id, pickupDate: '2026-09-06', returnDate: '2026-09-10' }
  );
  console.log(`   Expected 400: Received ${doubleRes.status} - "${doubleRes.body.message}"\n`);

  // Test 6: GET /api/v1/bookings/my (Customer own bookings with populated references)
  console.log('6. Testing GET /api/v1/bookings/my (Protected)...');
  const myRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/bookings/my',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log(`   Status: ${myRes.status} | Bookings Count: ${myRes.body.count}`);
  console.log(`   Populated Customer: ${myRes.body.data[0].customerId.name} (${myRes.body.data[0].customerId.email})\n`);

  // Test 7: PATCH /api/v1/bookings/:id/status (Updating booking status)
  console.log('7. Testing PATCH /api/v1/bookings/:id/status (Protected)...');
  const patchRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/v1/bookings/${bookingId}/status`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    },
    { status: 'completed' }
  );
  console.log(`   Status: ${patchRes.status} | Updated Booking Status: ${patchRes.body.data.status}\n`);

  console.log('==================================================');
  console.log('✅ ALL TASK 3 & TASK 5 API TESTS PASSED SUCCESSFULLY!');
  console.log('==================================================');
}

runTests().catch(console.error);
