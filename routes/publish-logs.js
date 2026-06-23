const express = require('express');
const router = express.Router();
const db = require('../db/init');

const searchFields = [
  { name: 'contentTitle', label: '内容标题' },
  { name: 'platform', label: '平台' }
];

const listFields = [
  { name: 'contentTitle', label: '标题' },
  { name: 'postId', label: '发布ID', type: 'badge' },
  { name: 'platform', label: '平台', type: 'badge' },
  { name: 'postType', label: '内容类型', type: 'badge' },
  { name: 'interactionRate', label: '互动率', type: 'score' },
  { name: 'publishDate', label: '发布时间', type: 'date' },
  { name: 'contentHeatIndex', label: '热度指数', type: 'score' }
];

const formFields = [
  { name: 'postId', label: '发布内容ID', required: true },
  { name: 'contentTitle', label: '内容标题', required: true },
  { name: 'platform', label: '发布平台', type: 'select', options: ['微博', '抖音', '微信公众号', '小红书', 'LinkedIn', 'B站', '全平台'] },
  { name: 'interactionRate', label: '互动率' },
  { name: 'postType', label: '内容类型', type: 'select', options: ['图文', '视频', '纯文本', '直播', '音频'] },
  { name: 'tags', label: '标签' },
  { name: 'publishDate', label: '发布时间', type: 'date' },
  { name: 'contentDescription', label: '内容描述', type: 'textarea', col: 12 },
  { name: 'mediaFiles', label: '媒体文件' },
  { name: 'contentHeatIndex', label: '内容热度指数' }
];

router.get('/', (req, res) => {
  let sql = 'SELECT * FROM publish_logs WHERE 1=1';
  const params = [];
  const searchValues = {};
  if (req.query.contentTitle) { sql += ' AND contentTitle LIKE ?'; params.push(`%${req.query.contentTitle}%`); searchValues.contentTitle = req.query.contentTitle; }
  if (req.query.platform) { sql += ' AND platform = ?'; params.push(req.query.platform); searchValues.platform = req.query.platform; }
  sql += ' ORDER BY dataId DESC';
  res.render('list', { title: '发布日志管理', basePath: '/publish-logs', searchFields, listFields, rows: db.prepare(sql).all(...params), searchValues });
});

router.get('/new', (req, res) => {
  res.render('form', { title: '发布日志管理', basePath: '/publish-logs', formFields, row: {}, formAction: '/publish-logs', isEdit: false });
});

router.post('/', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`INSERT INTO publish_logs (${f.join(',')}) VALUES (${f.map(() => '?').join(',')})`).run(...vals);
  res.redirect('/publish-logs');
});

router.get('/:id/edit', (req, res) => {
  const row = db.prepare('SELECT * FROM publish_logs WHERE dataId = ?').get(req.params.id);
  if (!row) return res.redirect('/publish-logs');
  res.render('form', { title: '发布日志管理', basePath: '/publish-logs', formFields, row, formAction: `/publish-logs/${row.dataId}`, isEdit: true });
});

router.post('/:id', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`UPDATE publish_logs SET ${f.map(n => n + '=?').join(',')} WHERE dataId=?`).run(...vals, req.params.id);
  res.redirect('/publish-logs');
});

router.post('/:id/delete', (req, res) => {
  db.prepare('DELETE FROM publish_logs WHERE dataId = ?').run(req.params.id);
  res.redirect('/publish-logs');
});

module.exports = router;
