const mongoose = require('mongoose');

async function testPersistence() {
  const base = 'http://localhost:3000/api';
  console.log('--- 1. REGISTER NEW REAL USER ---');
  const userEmail = 'realuser_' + Date.now() + '@example.com';
  const regUserRes = await fetch(base + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Real Audit User', email: userEmail, password: 'password123' })
  });
  const regUserData = await regUserRes.json();
  console.log('User registered:', regUserData.user.name, regUserData.user.email);
  const token = regUserData.token;
  const userId = regUserData.user._id;

  console.log('\n--- 2. FETCH COMPETITIONS ---');
  const compsRes = await fetch(base + '/competitions');
  const compsData = await compsRes.json();
  const compId = compsData.competitions[0]._id;
  console.log('Selected competition:', compId, compsData.competitions[0].title);

  console.log('\n--- 3. REGISTER FOR COMPETITION ---');
  const regRes = await fetch(base + '/competitions/' + compId + '/register', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const regData = await regRes.json();
  console.log('Registration status:', regRes.status, regData.message);
  console.log('Registration record:', regData.registration);

  console.log('\n--- 4. SIMULATE REFRESH / RESTART FRONTEND ---');
  const refresh1Res = await fetch(base + '/competitions/' + compId, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const refresh1Data = await refresh1Res.json();
  console.log('After refresh - isRegistered:', refresh1Data.isRegistered);
  if (!refresh1Data.isRegistered) throw new Error('Registration lost after refresh!');

  console.log('\n--- 5. SUBMIT VIDEO URL ---');
  const subUrl = 'https://www.youtube.com/watch?v=real_classical_dance_entry';
  const subRes = await fetch(base + '/competitions/' + compId + '/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ submissionUrl: subUrl })
  });
  const subData = await subRes.json();
  console.log('Submission status:', subRes.status, subData.message);

  console.log('\n--- 6. SIMULATE REFRESH AFTER SUBMISSION ---');
  const refresh2Res = await fetch(base + '/competitions/' + compId, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const refresh2Data = await refresh2Res.json();
  console.log('After refresh - submissionUrl:', refresh2Data.registration?.submissionUrl);
  if (refresh2Data.registration?.submissionUrl !== subUrl) throw new Error('Submission lost after refresh!');

  console.log('\n--- 7. ADD REVIEW ---');
  const revRes = await fetch(base + '/competitions/' + compId + '/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ rating: 5, comment: 'Real verified review from audited user!' })
  });
  const revData = await revRes.json();
  console.log('Review status:', revRes.status, revData.message);

  console.log('\n--- 8. SIMULATE REFRESH AFTER REVIEW ---');
  const revListRes = await fetch(base + '/competitions/' + compId + '/reviews');
  const revListData = await revListRes.json();
  const foundRev = revListData.reviews.find(r => r.userName === 'Real Audit User');
  console.log('Found review in list:', !!foundRev, foundRev?.comment);
  console.log('Total reviews now:', revListData.totalReviews, 'Average rating:', revListData.averageRating);
  if (!foundRev) throw new Error('Review lost after refresh!');

  console.log('\n--- 9. DIRECT MONGODB PERSISTENCE CHECK ---');
  await mongoose.connect('mongodb://127.0.0.1:27017/feedants');
  const dbReg = await mongoose.connection.collection('registrations').findOne({ userId: new mongoose.Types.ObjectId(userId) });
  const dbSub = await mongoose.connection.collection('submissions').findOne({ userId: new mongoose.Types.ObjectId(userId) });
  const dbRev = await mongoose.connection.collection('reviews').findOne({ userId: new mongoose.Types.ObjectId(userId) });

  console.log('Direct DB Check - Registration doc in MongoDB:', !!dbReg, 'paymentStatus:', dbReg.paymentStatus);
  console.log('Direct DB Check - Submission doc in MongoDB:', !!dbSub, 'videoUrl:', dbSub.videoUrl);
  console.log('Direct DB Check - Review doc in MongoDB:', !!dbRev, 'rating:', dbRev.rating, 'comment:', dbRev.comment);

  // Clean up
  await mongoose.connection.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(userId) });
  await mongoose.connection.collection('registrations').deleteOne({ _id: dbReg._id });
  if (dbSub) await mongoose.connection.collection('submissions').deleteOne({ _id: dbSub._id });
  if (dbRev) await mongoose.connection.collection('reviews').deleteOne({ _id: dbRev._id });
  await mongoose.connection.collection('competitions').updateOne({ _id: new mongoose.Types.ObjectId(compId) }, { $inc: { bookedSpots: -1 } });
  await mongoose.disconnect();

  console.log('\n✅ 100% PERSISTENCE VERIFIED! ALL DATA PERSISTS IN MONGODB ACROSS REFRESHES!');
}

testPersistence().catch(err => {
  console.error('Persistence test failed:', err);
  process.exit(1);
});
