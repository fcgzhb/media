const express = require('express');
const router = express.Router();
const db = require('../db/init');

const searchFields = [
  { name: 'username', label: '用户名' },
  { name: 'email', label: '邮箱' }
];

const listFields = [
  { name: 'username', label: '用户名' },
  { name: 'email', label: '邮箱' },
  { name: 'phone', label: '手机号' },
  { name: 'role', label: '角色', type: 'badge' },
  { name: 'status', label: '状态', type: 'status' },
  { name: 'createdAt', label: '注册时间', type: 'date' }
];

const formFields = [
  { name: 'username', label: '用户名', required: true },
  { name: 'password', label: '密码', required: true },
  { name: 'email', label: '邮箱' },
  { name: 'phone', label: '手机号' },
  { name: 'role', label: '角色', type: 'select', options: ['admin', 'user'] },
  { name: 'status', label: '状态', type: 'select', options: ['active', 'pending', 'disabled'] }
];

// List
router.get('/', (req, res) => {
  let sql = 'SELECT * FROM users WHERE 1=1';
  const params = [];
  const searchValues = {};
  if (req.query.username) { sql += ' AND username LIKE ?'; params.push(`%${req.query.username}%`); searchValues.username = req.query.username; }
  if (req.query.email) { sql += ' AND email LIKE ?'; params.push(`%${req.query.email}%`); searchValues.email = req.query.email; }
  sql += ' ORDER BY id DESC';
  const rows = db.prepare(sql).all(...params);
  res.render('list', { title: '用户管理', basePath: '/users', searchFields, listFields, rows, searchValues });
});

// New form
router.get('/new', (req, res) => {
  res.render('form', { title: '用户管理', basePath: '/users', formFields, row: {}, formAction: '/users', isEdit: false });
});

// Create
router.post('/', (req, res) => {
  const { username, password, email, phone, role, status } = req.body;
  try {
    db.prepare('INSERT INTO users (username, password, email, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)')
      .run(username, password || '123456', email, phone, role || 'user', status || 'active');
  } catch (e) { /* ignore duplicate */ }
  res.redirect('/users');
});

// Edit form
router.get('/:id/edit', (req, res) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!row) return res.redirect('/users');
  res.render('form', { title: '用户管理', basePath: '/users', formFields, row, formAction: `/users/${row.id}`, isEdit: true });
});

// Update
router.post('/:id', (req, res) => {
  const { username, password, email, phone, role, status } = req.body;
  db.prepare('UPDATE users SET username=?, password=?, email=?, phone=?, role=?, status=? WHERE id=?')
    .run(username, password || '123456', email, phone, role, status, req.params.id);
  res.redirect('/users');
});

// Delete
router.post('/:id/delete', (req, res) => {
  if (parseInt(req.params.id) !== req.session.userId) {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  }
  res.redirect('/users');
});

module.exports = router;
