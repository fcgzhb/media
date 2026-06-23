const express = require('express');
const router = express.Router();
const db = require('../db/init');

const searchFields = [
  { name: 'trendName', label: '趋势名称' },
  { name: 'trendType', label: '趋势类型' }
];

const listFields = [
  { name: 'trendName', label: '趋势名称' },
  { name: 'keyword', label: '关键词', type: 'badge' },
  { name: 'trendType', label: '趋势类型', type: 'badge' },
  { name: 'platforms', label: '平台', type: 'badge' },
  { name: 'trendStartDate', label: '开始日期', type: 'date' },
  { name: 'trendImpactScore', label: '影响力', type: 'score' }
];

const formFields = [
  { name: 'trendName', label: '趋势名称', required: true },
  { name: 'trendDescription', label: '趋势描述', type: 'textarea', col: 12 },
  { name: 'keyword', label: '关键词' },
  { name: 'trendType', label: '趋势类型', type: 'select', options: ['技术趋势', '内容趋势', '运营趋势', '商业趋势', '平台趋势'] },
  { name: 'platforms', label: '社交平台', type: 'select', options: ['全平台', '抖音,快手,小红书', '微信公众号,企业微信', '微博,抖音', '美团,抖音,小红书'] },
  { name: 'trendStartDate', label: '趋势开始日期', type: 'date' },
  { name: 'analysisNotes', label: '分析备注', type: 'textarea', col: 12 },
  { name: 'trendData', label: '趋势数据表' },
  { name: 'trendImpactScore', label: '趋势影响力评分' }
];

router.get('/', (req, res) => {
  let sql = 'SELECT * FROM trends WHERE 1=1';
  const params = [];
  const searchValues = {};
  if (req.query.trendName) { sql += ' AND trendName LIKE ?'; params.push(`%${req.query.trendName}%`); searchValues.trendName = req.query.trendName; }
  if (req.query.trendType) { sql += ' AND trendType = ?'; params.push(req.query.trendType); searchValues.trendType = req.query.trendType; }
  sql += ' ORDER BY dataId DESC';
  res.render('list', { title: '趋势监测管理', basePath: '/trends', searchFields, listFields, rows: db.prepare(sql).all(...params), searchValues });
});

router.get('/new', (req, res) => {
  res.render('form', { title: '趋势监测管理', basePath: '/trends', formFields, row: {}, formAction: '/trends', isEdit: false });
});

router.post('/', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`INSERT INTO trends (${f.join(',')}) VALUES (${f.map(() => '?').join(',')})`).run(...vals);
  res.redirect('/trends');
});

router.get('/:id/edit', (req, res) => {
  const row = db.prepare('SELECT * FROM trends WHERE dataId = ?').get(req.params.id);
  if (!row) return res.redirect('/trends');
  res.render('form', { title: '趋势监测管理', basePath: '/trends', formFields, row, formAction: `/trends/${row.dataId}`, isEdit: true });
});

router.post('/:id', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`UPDATE trends SET ${f.map(n => n + '=?').join(',')} WHERE dataId=?`).run(...vals, req.params.id);
  res.redirect('/trends');
});

router.post('/:id/delete', (req, res) => {
  db.prepare('DELETE FROM trends WHERE dataId = ?').run(req.params.id);
  res.redirect('/trends');
});

module.exports = router;
