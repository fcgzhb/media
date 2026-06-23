const express = require('express');
const router = express.Router();
const db = require('../db/init');

const searchFields = [
  { name: 'accountName', label: '账户名称' },
  { name: 'platform', label: '平台' }
];

const listFields = [
  { name: 'accountName', label: '账户名称' },
  { name: 'accountId', label: '账户ID', type: 'badge' },
  { name: 'platform', label: '平台', type: 'badge' },
  { name: 'accountStatus', label: '状态', type: 'status' },
  { name: 'permissions', label: '权限' },
  { name: 'createdDate', label: '创建日期', type: 'date' },
  { name: 'accountEngagementScore', label: '参与度', type: 'score' }
];

const formFields = [
  { name: 'accountId', label: '账户ID', required: true },
  { name: 'accountName', label: '账户名称', required: true },
  { name: 'platform', label: '平台类型', type: 'select', options: ['微博', '抖音', '微信公众号', '小红书', 'LinkedIn', 'B站', '快手', 'Facebook', 'Instagram', 'Twitter'] },
  { name: 'accountStatus', label: '账户状态', type: 'select', options: ['活跃', '休眠', '封禁'] },
  { name: 'permissions', label: '权限设置' },
  { name: 'createdDate', label: '创建日期', type: 'date' },
  { name: 'accountDescription', label: '账户描述', type: 'textarea', col: 12 },
  { name: 'profileImage', label: '头像路径' },
  { name: 'accountEngagementScore', label: '账户参与度评分' }
];

router.get('/', (req, res) => {
  let sql = 'SELECT * FROM accounts WHERE 1=1';
  const params = [];
  const searchValues = {};
  if (req.query.accountName) { sql += ' AND accountName LIKE ?'; params.push(`%${req.query.accountName}%`); searchValues.accountName = req.query.accountName; }
  if (req.query.platform) { sql += ' AND platform = ?'; params.push(req.query.platform); searchValues.platform = req.query.platform; }
  sql += ' ORDER BY dataId DESC';
  res.render('list', { title: '社交账户管理', basePath: '/accounts', searchFields, listFields, rows: db.prepare(sql).all(...params), searchValues });
});

router.get('/new', (req, res) => {
  res.render('form', { title: '社交账户管理', basePath: '/accounts', formFields, row: {}, formAction: '/accounts', isEdit: false });
});

router.post('/', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`INSERT INTO accounts (${f.join(',')}) VALUES (${f.map(() => '?').join(',')})`).run(...vals);
  res.redirect('/accounts');
});

router.get('/:id/edit', (req, res) => {
  const row = db.prepare('SELECT * FROM accounts WHERE dataId = ?').get(req.params.id);
  if (!row) return res.redirect('/accounts');
  res.render('form', { title: '社交账户管理', basePath: '/accounts', formFields, row, formAction: `/accounts/${row.dataId}`, isEdit: true });
});

router.post('/:id', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`UPDATE accounts SET ${f.map(n => n + '=?').join(',')} WHERE dataId=?`).run(...vals, req.params.id);
  res.redirect('/accounts');
});

router.post('/:id/delete', (req, res) => {
  db.prepare('DELETE FROM accounts WHERE dataId = ?').run(req.params.id);
  res.redirect('/accounts');
});

module.exports = router;
