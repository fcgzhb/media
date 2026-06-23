const express = require('express');
const router = express.Router();
const db = require('../db/init');

const searchFields = [
  { name: 'recommendationStrategy', label: '推荐策略' },
  { name: 'platformSelection', label: '平台' }
];

const listFields = [
  { name: 'contentType', label: '内容类型', type: 'badge' },
  { name: 'platformSelection', label: '推荐平台', type: 'badge' },
  { name: 'recommendationStrategy', label: '推荐策略', type: 'badge' },
  { name: 'targetAudience', label: '目标受众' },
  { name: 'optimalPublishDate', label: '最佳时间', type: 'date' },
  { name: 'engagementScore', label: '互动评分', type: 'score' }
];

const formFields = [
  { name: 'contentType', label: '内容类型', type: 'select', options: ['图文', '视频', '文本', '音频', '直播'] },
  { name: 'platformSelection', label: '平台选择', type: 'select', options: ['微博', '抖音', '微信公众号', '小红书', 'LinkedIn', 'B站', '全平台'] },
  { name: 'optimalPublishDate', label: '最佳发布时间', type: 'date' },
  { name: 'targetAudience', label: '目标受众' },
  { name: 'recommendationStrategy', label: '推荐策略', type: 'select', options: ['品牌曝光', '转化导向', '种草推荐', '品牌建设', '互动传播'] },
  { name: 'contentFormat', label: '内容格式', type: 'select', options: ['图文', '短视频', '长视频', '深度文章', '直播'] },
  { name: 'contentAssets', label: '内容资产' },
  { name: 'additionalNotes', label: '附加备注', type: 'textarea', col: 12 },
  { name: 'engagementScore', label: '互动评分' }
];

router.get('/', (req, res) => {
  let sql = 'SELECT * FROM recommendations WHERE 1=1';
  const params = [];
  const searchValues = {};
  if (req.query.recommendationStrategy) { sql += ' AND recommendationStrategy = ?'; params.push(req.query.recommendationStrategy); searchValues.recommendationStrategy = req.query.recommendationStrategy; }
  if (req.query.platformSelection) { sql += ' AND platformSelection = ?'; params.push(req.query.platformSelection); searchValues.platformSelection = req.query.platformSelection; }
  sql += ' ORDER BY dataId DESC';
  res.render('list', { title: '智能推荐设置', basePath: '/recommendations', searchFields, listFields, rows: db.prepare(sql).all(...params), searchValues });
});

router.get('/new', (req, res) => {
  res.render('form', { title: '智能推荐设置', basePath: '/recommendations', formFields, row: {}, formAction: '/recommendations', isEdit: false });
});

router.post('/', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`INSERT INTO recommendations (${f.join(',')}) VALUES (${f.map(() => '?').join(',')})`).run(...vals);
  res.redirect('/recommendations');
});

router.get('/:id/edit', (req, res) => {
  const row = db.prepare('SELECT * FROM recommendations WHERE dataId = ?').get(req.params.id);
  if (!row) return res.redirect('/recommendations');
  res.render('form', { title: '智能推荐设置', basePath: '/recommendations', formFields, row, formAction: `/recommendations/${row.dataId}`, isEdit: true });
});

router.post('/:id', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`UPDATE recommendations SET ${f.map(n => n + '=?').join(',')} WHERE dataId=?`).run(...vals, req.params.id);
  res.redirect('/recommendations');
});

router.post('/:id/delete', (req, res) => {
  db.prepare('DELETE FROM recommendations WHERE dataId = ?').run(req.params.id);
  res.redirect('/recommendations');
});

module.exports = router;
