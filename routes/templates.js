const express = require('express');
const router = express.Router();
const db = require('../db/init');

const searchFields = [
  { name: 'templateName', label: '模板名称' },
  { name: 'platform', label: '平台' }
];

const listFields = [
  { name: 'templateName', label: '模板名称' },
  { name: 'platform', label: '平台', type: 'badge' },
  { name: 'templateType', label: '类型', type: 'badge' },
  { name: 'tags', label: '标签' },
  { name: 'createdDate', label: '创建时间', type: 'date' }
];

const formFields = [
  { name: 'templateName', label: '模板名称', required: true },
  { name: 'content', label: '模板内容', type: 'textarea', col: 12 },
  { name: 'templateFile', label: '模板文件路径' },
  { name: 'platform', label: '适用平台', type: 'select', options: ['微博', '微信公众号', '抖音', '小红书', 'LinkedIn', 'B站', '全平台', '内部'] },
  { name: 'templateType', label: '模板类型', type: 'select', options: ['促销', '品牌', '活动', '口碑', '报告'] },
  { name: 'tags', label: '标签' },
  { name: 'description', label: '描述', type: 'textarea', col: 12 }
];

router.get('/', (req, res) => {
  let sql = 'SELECT * FROM templates WHERE 1=1';
  const params = [];
  const searchValues = {};
  if (req.query.templateName) { sql += ' AND templateName LIKE ?'; params.push(`%${req.query.templateName}%`); searchValues.templateName = req.query.templateName; }
  if (req.query.platform) { sql += ' AND platform = ?'; params.push(req.query.platform); searchValues.platform = req.query.platform; }
  sql += ' ORDER BY dataId DESC';
  res.render('list', { title: '内容模板管理', basePath: '/templates', searchFields, listFields, rows: db.prepare(sql).all(...params), searchValues });
});

router.get('/new', (req, res) => {
  res.render('form', { title: '内容模板管理', basePath: '/templates', formFields, row: {}, formAction: '/templates', isEdit: false });
});

router.post('/', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`INSERT INTO templates (${f.join(',')}) VALUES (${f.map(() => '?').join(',')})`).run(...vals);
  res.redirect('/templates');
});

router.get('/:id/edit', (req, res) => {
  const row = db.prepare('SELECT * FROM templates WHERE dataId = ?').get(req.params.id);
  if (!row) return res.redirect('/templates');
  res.render('form', { title: '内容模板管理', basePath: '/templates', formFields, row, formAction: `/templates/${row.dataId}`, isEdit: true });
});

router.post('/:id', (req, res) => {
  const f = formFields.map(n => n.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`UPDATE templates SET ${f.map(n => n + '=?').join(',')} WHERE dataId=?`).run(...vals, req.params.id);
  res.redirect('/templates');
});

router.post('/:id/delete', (req, res) => {
  db.prepare('DELETE FROM templates WHERE dataId = ?').run(req.params.id);
  res.redirect('/templates');
});

module.exports = router;
