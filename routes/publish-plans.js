const express = require('express');
const router = express.Router();
const db = require('../db/init');

const searchFields = [
  { name: 'contentTitle', label: '内容标题' },
  { name: 'platform', label: '平台' }
];

const listFields = [
  { name: 'contentTitle', label: '标题' },
  { name: 'contentId', label: '内容编号', type: 'badge' },
  { name: 'platform', label: '平台', type: 'badge' },
  { name: 'publishType', label: '发布类型', type: 'badge' },
  { name: 'targetAudience', label: '目标受众' },
  { name: 'scheduledTime', label: '计划时间', type: 'date' },
  { name: 'engagementScore', label: '互动评分', type: 'score' }
];

const formFields = [
  { name: 'contentId', label: '内容编号', required: true },
  { name: 'contentTitle', label: '内容标题', required: true },
  { name: 'platform', label: '社交平台', type: 'select', options: ['微博', '抖音', '微信公众号', '小红书', 'LinkedIn', 'B站', '全平台'] },
  { name: 'publishType', label: '发布类型', type: 'select', options: ['促销', '品牌', '教育', '互动', '产品推广'] },
  { name: 'targetAudience', label: '目标受众' },
  { name: 'scheduledTime', label: '计划发布时间', type: 'date' },
  { name: 'contentDescription', label: '内容描述', type: 'textarea', col: 12 },
  { name: 'thumbnailImage', label: '缩略图路径' },
  { name: 'engagementScore', label: '互动潜力评分' }
];

router.get('/', (req, res) => {
  let sql = 'SELECT * FROM publish_plans WHERE 1=1';
  const params = [];
  const searchValues = {};
  if (req.query.contentTitle) { sql += ' AND contentTitle LIKE ?'; params.push(`%${req.query.contentTitle}%`); searchValues.contentTitle = req.query.contentTitle; }
  if (req.query.platform) { sql += ' AND platform = ?'; params.push(req.query.platform); searchValues.platform = req.query.platform; }
  sql += ' ORDER BY dataId DESC';
  res.render('list', { title: '发布计划管理', basePath: '/publish-plans', searchFields, listFields, rows: db.prepare(sql).all(...params), searchValues });
});

router.get('/new', (req, res) => {
  res.render('form', { title: '发布计划管理', basePath: '/publish-plans', formFields, row: {}, formAction: '/publish-plans', isEdit: false });
});

router.post('/', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`INSERT INTO publish_plans (${f.join(',')}) VALUES (${f.map(() => '?').join(',')})`).run(...vals);
  res.redirect('/publish-plans');
});

router.get('/:id/edit', (req, res) => {
  const row = db.prepare('SELECT * FROM publish_plans WHERE dataId = ?').get(req.params.id);
  if (!row) return res.redirect('/publish-plans');
  res.render('form', { title: '发布计划管理', basePath: '/publish-plans', formFields, row, formAction: `/publish-plans/${row.dataId}`, isEdit: true });
});

router.post('/:id', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`UPDATE publish_plans SET ${f.map(n => n + '=?').join(',')} WHERE dataId=?`).run(...vals, req.params.id);
  res.redirect('/publish-plans');
});

router.post('/:id/delete', (req, res) => {
  db.prepare('DELETE FROM publish_plans WHERE dataId = ?').run(req.params.id);
  res.redirect('/publish-plans');
});

module.exports = router;
