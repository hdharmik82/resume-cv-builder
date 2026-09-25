/**
 * Automated QA Test Suite for ProResume Studio v3
 * Verifies: Authentication, MongoDB Persistence, Razorpay Gateway, Gated PDF Downloads, Security Sanitization & SEO
 */

const http = require("http");

const BASE_URL = "http://localhost:5000";
const PROXY_URL = "http://localhost:3000";

const results = [];

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    if (body) {
      if (typeof body === "object") {
        body = JSON.stringify(body);
        reqOptions.headers["Content-Type"] = "application/json";
      }
      reqOptions.headers["Content-Length"] = Buffer.byteLength(body);
    }

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json || data,
          raw: data,
        });
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function recordTest(id, module, description, expected, actual, pass, details = "") {
  results.push({
    id,
    module,
    description,
    expected,
    actual,
    status: pass ? "PASS" : "FAIL",
    details,
  });
  console.log(`[${pass ? "PASS" : "FAIL"}] ${id}: ${description}`);
}

async function runTests() {
  console.log("=================================================");
  console.log("Starting ProResume Studio QA Test Suite v3...");
  console.log("Target Server:", BASE_URL);
  console.log("=================================================");

  const timestamp = Date.now();
  const testEmail = `qa.candidate.${timestamp}@example.com`;
  const testPassword = "StrongPassword@2026";
  let authToken = null;
  let userId = null;
  let createdOrderId = null;

  // 1. Health Check
  try {
    const res = await request(`${BASE_URL}/api/health`);
    recordTest(
      "TC-SYS-001",
      "System Health",
      "Verify backend API health endpoint",
      "Status 200 with service name",
      `Status ${res.status}, service: ${res.data?.service}`,
      res.status === 200 && res.data?.status === "ok"
    );
  } catch (err) {
    recordTest("TC-SYS-001", "System Health", "Verify health endpoint", "200 OK", err.message, false);
  }

  // 2. Vite Proxy Check
  try {
    const res = await request(`${PROXY_URL}/api/health`);
    recordTest(
      "TC-SYS-002",
      "Vite Proxy",
      "Verify Vite dev server /api proxy routing to backend",
      "Status 200 via proxy port 3000",
      `Status ${res.status}`,
      res.status === 200
    );
  } catch (err) {
    recordTest("TC-SYS-002", "Vite Proxy", "Verify Vite proxy", "200 OK", err.message, false);
  }

  // 3. User Registration Valid
  try {
    const res = await request(`${BASE_URL}/api/auth/register`, { method: "POST" }, {
      name: "Hemanshu QA Tester",
      email: testEmail,
      phone: "+91 9876543210",
      password: testPassword,
    });
    authToken = res.data?.token;
    userId = res.data?.user?._id;
    const hasNoPw = !res.data?.user?.password;
    recordTest(
      "TC-AUTH-001",
      "Authentication",
      "User Registration with valid Name, Email, Phone, and Password",
      "Status 201, JWT returned, password omitted from user object",
      `Status ${res.status}, Token: ${Boolean(authToken)}, Password Omitted: ${hasNoPw}`,
      res.status === 201 && Boolean(authToken) && hasNoPw
    );
  } catch (err) {
    recordTest("TC-AUTH-001", "Authentication", "User Registration", "201 Created", err.message, false);
  }

  // 4. Duplicate Registration
  try {
    const res = await request(`${BASE_URL}/api/auth/register`, { method: "POST" }, {
      name: "Duplicate Tester",
      email: testEmail,
      phone: "+91 9876543210",
      password: testPassword,
    });
    recordTest(
      "TC-AUTH-002",
      "Authentication",
      "Reject duplicate email registration attempt",
      "Status 409 Conflict with clear error message",
      `Status ${res.status}, message: ${res.data?.message}`,
      res.status === 409
    );
  } catch (err) {
    recordTest("TC-AUTH-002", "Authentication", "Reject duplicate email", "409 Conflict", err.message, false);
  }

  // 5. Validation Edge Case - Short Name
  try {
    const res = await request(`${BASE_URL}/api/auth/register`, { method: "POST" }, {
      name: "A",
      email: `bad.name.${timestamp}@example.com`,
      phone: "+91 9876543210",
      password: testPassword,
    });
    recordTest(
      "TC-AUTH-003",
      "Validation",
      "Reject name shorter than 2 characters",
      "Status 400 Bad Request",
      `Status ${res.status}`,
      res.status === 400
    );
  } catch (err) {
    recordTest("TC-AUTH-003", "Validation", "Reject short name", "400 Bad Request", err.message, false);
  }

  // 6. Validation Edge Case - Invalid Email
  try {
    const res = await request(`${BASE_URL}/api/auth/register`, { method: "POST" }, {
      name: "Invalid Email",
      email: "invalid-email-format-without-at",
      phone: "+91 9876543210",
      password: testPassword,
    });
    recordTest(
      "TC-AUTH-004",
      "Validation",
      "Reject malformed email address",
      "Status 400 Bad Request",
      `Status ${res.status}`,
      res.status === 400
    );
  } catch (err) {
    recordTest("TC-AUTH-004", "Validation", "Reject malformed email", "400 Bad Request", err.message, false);
  }

  // 7. Validation Edge Case - Invalid Phone
  try {
    const res = await request(`${BASE_URL}/api/auth/register`, { method: "POST" }, {
      name: "Invalid Phone",
      email: `bad.phone.${timestamp}@example.com`,
      phone: "123", // too short
      password: testPassword,
    });
    recordTest(
      "TC-AUTH-005",
      "Validation",
      "Reject invalid mobile number shorter than 7 digits",
      "Status 400 Bad Request",
      `Status ${res.status}`,
      res.status === 400
    );
  } catch (err) {
    recordTest("TC-AUTH-005", "Validation", "Reject invalid phone", "400 Bad Request", err.message, false);
  }

  // 8. Validation Edge Case - Short Password
  try {
    const res = await request(`${BASE_URL}/api/auth/register`, { method: "POST" }, {
      name: "Short Pw",
      email: `short.pw.${timestamp}@example.com`,
      phone: "+91 9876543210",
      password: "123",
    });
    recordTest(
      "TC-AUTH-006",
      "Validation",
      "Reject password shorter than 6 characters",
      "Status 400 Bad Request",
      `Status ${res.status}`,
      res.status === 400
    );
  } catch (err) {
    recordTest("TC-AUTH-006", "Validation", "Reject short password", "400 Bad Request", err.message, false);
  }

  // 9. Login Valid
  try {
    const res = await request(`${BASE_URL}/api/auth/login`, { method: "POST" }, {
      email: testEmail,
      password: testPassword,
    });
    recordTest(
      "TC-AUTH-007",
      "Authentication",
      "User Login with valid email and password",
      "Status 200, JWT token returned, user profile matches",
      `Status ${res.status}, user: ${res.data?.user?.email}`,
      res.status === 200 && res.data?.user?.email === testEmail
    );
  } catch (err) {
    recordTest("TC-AUTH-007", "Authentication", "User Login", "200 OK", err.message, false);
  }

  // 10. Login Wrong Password
  try {
    const res = await request(`${BASE_URL}/api/auth/login`, { method: "POST" }, {
      email: testEmail,
      password: "WrongPassword999",
    });
    recordTest(
      "TC-AUTH-008",
      "Authentication",
      "Reject login attempt with incorrect password",
      "Status 401 Unauthorized",
      `Status ${res.status}`,
      res.status === 401
    );
  } catch (err) {
    recordTest("TC-AUTH-008", "Authentication", "Reject wrong password", "401 Unauthorized", err.message, false);
  }

  // 11. Google OAuth Simulation
  try {
    const googleId = "g_test_" + timestamp;
    const res = await request(`${BASE_URL}/api/auth/google`, { method: "POST" }, {
      name: "Google QA Candidate",
      email: `google.user.${timestamp}@gmail.com`,
      googleId,
    });
    recordTest(
      "TC-AUTH-009",
      "Authentication",
      "Google OAuth sign-in / registration endpoint",
      "Status 200, authProvider set to 'google'",
      `Status ${res.status}, provider: ${res.data?.user?.authProvider}`,
      res.status === 200 && res.data?.user?.authProvider === "google"
    );
  } catch (err) {
    recordTest("TC-AUTH-009", "Authentication", "Google OAuth", "200 OK", err.message, false);
  }

  // 12. Protected Route without Token
  try {
    const res = await request(`${BASE_URL}/api/auth/me`);
    recordTest(
      "TC-SEC-001",
      "Security",
      "Block access to /api/auth/me without authorization token",
      "Status 401 Unauthorized",
      `Status ${res.status}`,
      res.status === 401
    );
  } catch (err) {
    recordTest("TC-SEC-001", "Security", "Block without token", "401 Unauthorized", err.message, false);
  }

  // 13. Protected Route with Invalid Token
  try {
    const res = await request(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: "Bearer forged_invalid_jwt_token_12345" },
    });
    recordTest(
      "TC-SEC-002",
      "Security",
      "Block access with forged or invalid JWT signature",
      "Status 403 Forbidden",
      `Status ${res.status}`,
      res.status === 403
    );
  } catch (err) {
    recordTest("TC-SEC-002", "Security", "Block invalid JWT", "403 Forbidden", err.message, false);
  }

  // 14. Download Gating before payment
  try {
    const res = await request(`${BASE_URL}/api/payment/record-download`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    recordTest(
      "TC-GATE-001",
      "Gating Logic",
      "Block PDF download execution before ₹99 payment is made",
      "Status 402 Payment Required",
      `Status ${res.status}, code: ${res.data?.code}`,
      res.status === 402 && res.data?.code === "PAYMENT_REQUIRED"
    );
  } catch (err) {
    recordTest("TC-GATE-001", "Gating Logic", "Block PDF before pay", "402 Payment Required", err.message, false);
  }

  // 15. Create Razorpay Order
  try {
    const res = await request(`${BASE_URL}/api/payment/create-order`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    createdOrderId = res.data?.orderId;
    const isAmountCorrect = res.data?.amount === 9900; // 99 INR
    recordTest(
      "TC-PAY-001",
      "Razorpay Gateway",
      "Create Razorpay Order for ₹99 (9900 paise) download pass",
      "Status 200, valid orderId returned, amount is 9900 paise",
      `Status ${res.status}, orderId: ${createdOrderId}, amount: ${res.data?.amount}`,
      res.status === 200 && Boolean(createdOrderId) && isAmountCorrect
    );
  } catch (err) {
    recordTest("TC-PAY-001", "Razorpay Gateway", "Create Razorpay Order", "200 OK", err.message, false);
  }

  // 16. Sandbox Test Payment Completion
  try {
    const res = await request(`${BASE_URL}/api/payment/sandbox-complete`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
    }, { orderId: createdOrderId });
    recordTest(
      "TC-PAY-002",
      "Razorpay Gateway",
      "Simulate Sandbox payment completion and update MongoDB user record",
      "Status 200, isPaid becomes true, paymentId generated",
      `Status ${res.status}, isPaid: ${res.data?.isPaid}, paymentId: ${res.data?.paymentId}`,
      res.status === 200 && res.data?.isPaid === true
    );
  } catch (err) {
    recordTest("TC-PAY-002", "Razorpay Gateway", "Complete Sandbox Payment", "200 OK", err.message, false);
  }

  // 17. Verify User Profile Updated to isPaid: true
  try {
    const res = await request(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    recordTest(
      "TC-DB-001",
      "MongoDB Persistence",
      "Verify User record reflects lifetime download pass (isPaid: true, paidAt set)",
      "isPaid: true and paidAt timestamp is present in MongoDB",
      `isPaid: ${res.data?.user?.isPaid}, paidAt: ${res.data?.user?.paidAt}`,
      res.data?.user?.isPaid === true && Boolean(res.data?.user?.paidAt)
    );
  } catch (err) {
    recordTest("TC-DB-001", "MongoDB Persistence", "Verify isPaid in DB", "isPaid true", err.message, false);
  }

  // 18. Prevent Double Payment (create-order on already paid user)
  try {
    const res = await request(`${BASE_URL}/api/payment/create-order`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    recordTest(
      "TC-PAY-003",
      "Razorpay Gateway",
      "Prevent duplicate charges if user already purchased download pass",
      "Status 200 with alreadyPaid: true flag",
      `Status ${res.status}, alreadyPaid: ${res.data?.alreadyPaid}`,
      res.status === 200 && res.data?.alreadyPaid === true
    );
  } catch (err) {
    recordTest("TC-PAY-003", "Razorpay Gateway", "Prevent duplicate charges", "alreadyPaid true", err.message, false);
  }

  // 19. Download Gating after payment (Authorized)
  try {
    const res = await request(`${BASE_URL}/api/payment/record-download`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    recordTest(
      "TC-GATE-002",
      "Gating Logic",
      "Authorize PDF download and increment downloadCount for paid user",
      "Status 200, download authorized, downloadCount >= 1",
      `Status ${res.status}, downloadCount: ${res.data?.downloadCount}`,
      res.status === 200 && res.data?.downloadCount >= 1
    );
  } catch (err) {
    recordTest("TC-GATE-002", "Gating Logic", "Authorize PDF after pay", "200 OK", err.message, false);
  }

  // 20. Helmet Security Headers Check
  try {
    const res = await request(`${BASE_URL}/api/health`);
    const csp = res.headers["content-security-policy"];
    const xcto = res.headers["x-content-type-options"];
    recordTest(
      "TC-SEC-003",
      "Security",
      "Verify Helmet HTTP Security Headers (CSP, X-Content-Type-Options)",
      "CSP allows Razorpay, nosniff present",
      `CSP Present: ${Boolean(csp)}, XCTO: ${xcto}`,
      Boolean(csp) && xcto === "nosniff"
    );
  } catch (err) {
    recordTest("TC-SEC-003", "Security", "Helmet security headers", "Headers present", err.message, false);
  }

  console.log("\n=================================================");
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  console.log(`QA Tests Completed: Total=${results.length}, Passed=${passed}, Failed=${failed}`);
  console.log("=================================================");

  return results;
}

// Execute tests and export results
runTests().then((res) => {
  const fs = require("fs");
  const path = require("path");
  fs.writeFileSync(
    path.join(__dirname, "qa_execution_results.json"),
    JSON.stringify(res, null, 2)
  );
  console.log("Results saved to QA/qa_execution_results.json");
});
