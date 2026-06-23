const express = require('express');
const router = express.Router();
const db = require('../db/init');

const searchFields = [
  { name: 'activityName', label: '活动名称' },
  { name: 'activityType', label: '活动类型' }
];

const listFields = [
  { name: 'activityName', label: '活动名称' },
  { name: 'activityType', label: '活动类型', type: 'badge' },
  { name: 'targetAudience', label: '目标受众' },
  { name: 'startDate', label: '开始日期', type: 'date' },
  { name: 'keyPerformanceIndicators', label: 'KPI' },
  { name: 'activityEffectivenessScore', label: '效果评分', type: 'score' }
];

const formFields = [
  { name: 'activityName', label: '活动名称', required: true },
  { name: 'activityDescription', label: '活动描述', type: 'textarea', col: 12 },
  { name: 'targetAudience', label: '目标受众' },
  { name: 'activityType', label: '活动类型', type: 'select', options: ['促销', '品牌推广', '用户互动', '产品推广', '品牌', '活动'] },
  { name: 'keyPerformanceIndicators', label: '关键绩效指标' },
  { name: 'startDate', label: '开始日期', type: 'date' },
  { name: 'activityPlan', label: '活动计划', type: 'textarea', col: 12 },
  { name: 'contentAssets', label: '内容资产' },
  { name: 'activityEffectivenessScore', label: '活动效果评分' }
];

router.get('/', (req, res) => {
  let sql = 'SELECT * FROM activities WHERE 1=1';
  const params = [];
  const searchValues = {};
  if (req.query.activityName) { sql += ' AND activityName LIKE ?'; params.push(`%${req.query.activityName}%`); searchValues.activityName = req.query.activityName; }
  if (req.query.activityType) { sql += ' AND activityType = ?'; params.push(req.query.activityType); searchValues.activityType = req.query.activityType; }
  sql += ' ORDER BY dataId DESC';
  res.render('list', { title: '活动策略管理', basePath: '/activities', searchFields, listFields, rows: db.prepare(sql).all(...params), searchValues });
});

router.get('/new', (req, res) => {
  res.render('form', { title: '活动策略管理', basePath: '/activities', formFields, row: {}, formAction: '/activities', isEdit: false });
});

router.post('/', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`INSERT INTO activities (${f.join(',')}) VALUES (${f.map(() => '?').join(',')})`).run(...vals);
  res.redirect('/activities');
});

router.get('/:id/edit', (req, res) => {
  const row = db.prepare('SELECT * FROM activities WHERE dataId = ?').get(req.params.id);
  if (!row) return res.redirect('/activities');
  res.render('form', { title: '活动策略管理', basePath: '/activities', formFields, row, formAction: `/activities/${row.dataId}`, isEdit: true });
});

router.post('/:id', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`UPDATE activities SET ${f.map(n => n + '=?').join(',')} WHERE dataId=?`).run(...vals, req.params.id);
  res.redirect('/activities');
});

router.post('/:id/delete', (req, res) => {
  db.prepare('DELETE FROM activities WHERE dataId = ?').run(req.params.id);
  res.redirect('/activities');
});

module.exports = router;
