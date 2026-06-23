const express = require('express');
const router = express.Router();
const db = require('../db/init');

// Login page
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('login', { layout: false, error: req.query.error || '' });
});

// Login action
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  if (!user) {
    return res.redirect('/login?error=用户名或密码错误');
  }
  if (user.status === 'pending') {
    return res.redirect('/login?error=账号待审核，请等待管理员通过');
  }
  if (user.status !== 'active') {
    return res.redirect('/login?error=账号已被禁用');
  }
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.role = user.role;
  res.redirect('/');
});

// Register page
router.get('/register', (req, res) => {
  res.render('register', { layout: false, error: req.query.error || '' });
});

// Register action
router.post('/register', (req, res) => {
  const { username, password, phone, email } = req.body;
  if (!username || !password) {
    return res.redirect('/register?error=用户名和密码不能为空');
  }
  try {
    db.prepare('INSERT INTO users (username, password, phone, email, status) VALUES (?, ?, ?, ?, ?)')
      .run(username, password, phone || '', email || '', 'pending');
    res.redirect('/login?success=注册成功，请等待管理员审核');
  } catch (e) {
    res.redirect('/register?error=用户名已存在');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Dashboard
router.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const stats = {
    contents: db.prepare('SELECT COUNT(*) as cnt FROM contents').get().cnt,
    publishPlans: db.prepare('SELECT COUNT(*) as cnt FROM publish_plans').get().cnt,
    accounts: db.prepare('SELECT COUNT(*) as cnt FROM accounts').get().cnt,
    activities: db.prepare('SELECT COUNT(*) as cnt FROM activities').get().cnt
  };
  const recentPlans = db.prepare('SELECT * FROM publish_plans ORDER BY dataId DESC LIMIT 5').all();
  const topTrends = db.prepare('SELECT * FROM trends ORDER BY CAST(trendImpactScore AS INTEGER) DESC LIMIT 5').all();
  const accountList = db.prepare('SELECT * FROM accounts ORDER BY dataId DESC LIMIT 5').all();
  res.render('index', { username: req.session.username, stats, recentPlans, topTrends, accountList });
});

module.exports = router;
