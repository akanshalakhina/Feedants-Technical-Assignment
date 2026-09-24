const http = require('http');
const mongoose = require('mongoose');

function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const r = http.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(d) });
        } catch (e) {
          resolve({ status: res.statusCode, body: d });
        }
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  const tag = pass ? '[PASS]' : '[FAIL]';
  console.log(`${tag} ${name}${detail ? ' -> ' + detail : ''}`);
}

async function run() {
  console.log('====================================================');
  console.log('FEEDANTS FINAL PRE-SUBMISSION VERIFICATION PROTOCOL');
  console.log('====================================================\n');

  // 1. Clean backend process & health
  const rHealth = await req('GET', '/health', null, null);
  check('1. Backend health endpoint is live (200)', rHealth.status === 200, `status=${rHealth.body.status}`);

  // 2. Auth: Register real account
  const ts = Date.now();
  const email = `evaluator_${ts}@feedants.test`;
  const rReg = await req('POST', '/api/auth/register', { name: 'Evaluator User', email, password: 'SecurePassword123!' });
  check('2. Create real user account via API (201)', rReg.status === 201 && !!rReg.body.token, `userId=${rReg.body.user?._id}`);
  const token = rReg.body.token;

  // 3. Auth: Login with created account
  const rLogin = await req('POST', '/api/auth/login', { email, password: 'SecurePassword123!' });
  check('3. Login with real user credentials (200)', rLogin.status === 200 && !!rLogin.body.token, `token received`);

  // 4. Competitions: List and verify MongoDB dynamic content
  const rComps = await req('GET', '/api/competitions', null, null);
  const comps = rComps.body.competitions || [];
  check('4. Competitions retrieved from MongoDB', rComps.status === 200 && comps.length >= 4, `found ${comps.length} competitions`);

  const openComp = comps.find(c => c.status === 'registration_open' && c.bookedSpots < c.totalSpots) || comps[0];
  const compId = openComp._id;

  // 5. Competition Details: All visible fields from MongoDB
  const rDetail = await req('GET', `/api/competitions/${compId}`, null, null);
  const c = rDetail.body.competition;
  const hasAllFields = c && c.title && c.prizePool && c.entryFee && c.totalSpots && c.judge && c.judge.name && c.registrationCloseDate && c.submissionStartDate && c.rewards && c.previousWinners;
  check('5. All visible competition info is dynamic from MongoDB', hasAllFields, `title="${c?.title}", judge="${c?.judge?.name}", prize=${c?.prizePool}`);

  // 6. Guest cannot register without authentication
  const rGuestReg = await req('POST', `/api/competitions/${compId}/register`, {}, null);
  check('6. Guest cannot register without auth (401)', rGuestReg.status === 401, `status=${rGuestReg.status}`);

  // 7. Real Persistence Flow: REGISTER
  const rUserReg = await req('POST', `/api/competitions/${compId}/register`, {}, token);
  check('7. Real user registration (201)', rUserReg.status === 201, `paymentStatus=${rUserReg.body?.registration?.paymentStatus}`);
  check('8. No fake payment success (paymentStatus="not_implemented")', rUserReg.body?.registration?.paymentStatus === 'not_implemented', `paymentStatus=${rUserReg.body?.registration?.paymentStatus}`);

  // 8. Refresh app: registration still exists
  const rRefresh1 = await req('GET', `/api/competitions/${compId}`, null, token);
  check('9. Refresh app -> registration still exists', rRefresh1.body.isRegistered === true, `isRegistered=${rRefresh1.body.isRegistered}`);

  // 9. Duplicate registration returns 409
  const rDupReg = await req('POST', `/api/competitions/${compId}/register`, {}, token);
  check('10. Duplicate registration returns 409', rDupReg.status === 409, `message="${rDupReg.body.message}"`);

  // 10. Invalid video URL is rejected (400)
  const rInvalidUrl = await req('POST', `/api/competitions/${compId}/submission`, { submissionUrl: 'ftp://not-valid-url' }, token);
  check('11. Invalid video URL rejected (400)', rInvalidUrl.status === 400, `message="${rInvalidUrl.body.message}"`);

  // 11. Real Persistence Flow: SUBMIT VIDEO URL
  const validUrl = `https://www.youtube.com/watch?v=entry_${ts}`;
  const rSub = await req('POST', `/api/competitions/${compId}/submission`, { submissionUrl: validUrl }, token);
  check('12. Valid video submission accepted (200)', rSub.status === 200, `message="${rSub.body.message}"`);

  // 12. Refresh app: submission still exists
  const rRefresh2 = await req('GET', `/api/competitions/${compId}/participation`, null, token);
  const persistedSubUrl = rRefresh2.body?.registration?.submissionUrl;
  check('13. Refresh app -> submission still exists in MongoDB', persistedSubUrl === validUrl, `submissionUrl="${persistedSubUrl}"`);

  // 13. Invalid review is rejected (400)
  const rInvalidReview = await req('POST', `/api/competitions/${compId}/reviews`, { rating: 10, comment: 'Too high' }, token);
  check('14. Invalid review rating rejected (400)', rInvalidReview.status === 400, `status=${rInvalidReview.status}`);

  // 14. Real Persistence Flow: ADD REVIEW
  const rReview = await req('POST', `/api/competitions/${compId}/reviews`, { rating: 5, comment: `Outstanding competition #${ts}` }, token);
  check('15. Valid review accepted (201)', rReview.status === 201, `rating=5`);

  // 15. Refresh app: review still exists & rating/count recalculated
  const rReviewsList = await req('GET', `/api/competitions/${compId}/reviews`, null, null);
  const foundRev = rReviewsList.body?.reviews?.find(r => r.comment === `Outstanding competition #${ts}`);
  check('16. Refresh app -> review exists in MongoDB', !!foundRev, `reviewer="${foundRev?.userName}"`);
  check('17. Rating and count recalculated dynamically', rReviewsList.body.totalReviews > 0 && rReviewsList.body.averageRating > 0, `avg=${rReviewsList.body.averageRating}, total=${rReviewsList.body.totalReviews}`);

  // 16. Full competition cannot accept another registration (409)
  const fullComp = comps.find(c => c.bookedSpots >= c.totalSpots);
  if (fullComp) {
    const rFull = await req('POST', `/api/competitions/${fullComp._id}/register`, {}, token);
    check('18. Full competition rejects registration (409)', rFull.status === 409, `spots=${fullComp.bookedSpots}/${fullComp.totalSpots}, msg="${rFull.body.message}"`);
  } else {
    check('18. Full competition rejects registration (409)', false, 'No full competition found in seed');
  }

  // 17. Registration cannot happen after deadline (409)
  const pastRegComp = comps.find(c => new Date(c.registrationCloseDate) < new Date());
  if (pastRegComp) {
    const rPast = await req('POST', `/api/competitions/${pastRegComp._id}/register`, {}, token);
    check('19. Registration after deadline rejected (409)', rPast.status === 409, `deadline=${pastRegComp.registrationCloseDate}, msg="${rPast.body.message}"`);
  } else {
    check('19. Registration after deadline rejected (409)', false, 'No past deadline competition found');
  }

  // 18. Submission cannot happen outside submission window (409)
  let outsideWindowComp = null;
  for (const compItem of comps) {
    const detail = await req('GET', `/api/competitions/${compItem._id}`, null, null);
    if (detail.body?.competition?.submissionEndDate && new Date(detail.body.competition.submissionEndDate) < new Date()) {
      outsideWindowComp = detail.body.competition;
      break;
    }
  }

  if (outsideWindowComp) {
    const rOut = await req('POST', `/api/competitions/${outsideWindowComp._id}/submission`, { submissionUrl: 'https://youtube.com/watch?v=test' }, token);
    check('20. Submission outside window rejected (409)', rOut.status === 409, `windowEnd=${outsideWindowComp.submissionEndDate}, msg="${rOut.body.message}"`);
  } else {
    check('20. Submission outside window rejected (409)', false, 'No outside window competition found');
  }

  // 19. No simulation endpoints remain (404)
  const rSim1 = await req('POST', `/api/competitions/${compId}/simulate-booking`, {}, null);
  const rSim2 = await req('POST', `/api/competitions/${compId}/reset-spots`, {}, null);
  check('21. Simulation endpoints removed (404)', rSim1.status === 404 && rSim2.status === 404, `simBooking=${rSim1.status}, resetSpots=${rSim2.status}`);

  console.log('\n====================================================');
  const allPassed = results.every(r => r.pass);
  if (allPassed) {
    console.log('ALL PROTOCOL CHECKS: PASS');
  } else {
    console.log('FAILURES DETECTED:');
    results.filter(r => !r.pass).forEach(r => console.log(`  - ${r.name}: ${r.detail}`));
    process.exitCode = 1;
  }
  console.log('====================================================\n');
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
