const express = require('express');
const router = express.Router();
const db = require('../db/init');

const searchFields = [
  { name: 'contentTitle', label: '内容标题' },
  { name: 'contentCategory', label: '内容分类' }
];

const listFields = [
  { name: 'contentTitle', label: '标题' },
  { name: 'contentFormat', label: '格式', type: 'badge' },
  { name: 'contentCategory', label: '分类', type: 'badge' },
  { name: 'contentTags', label: '标签' },
  { name: 'creationDate', label: '创建时间', type: 'date' }
];

const formFields = [
  { name: 'contentTitle', label: '内容标题', required: true },
  { name: 'contentDescription', label: '内容描述', type: 'textarea', col: 12 },
  { name: 'contentFormat', label: '内容格式', type: 'select', options: ['文本', '图片', '视频', '图文', '音频'] },
  { name: 'contentCategory', label: '内容分类', type: 'select', options: ['营销策划', '产品推广', '客户故事', '促销活动', '内容营销', '品牌建设'] },
  { name: 'contentTags', label: '内容标签' },
  { name: 'contentThumbnail', label: '缩略图路径' },
  { name: 'contentNotes', label: '内容备注', type: 'textarea', col: 12 }
];

router.get('/', (req, res) => {
  let sql = 'SELECT * FROM contents WHERE 1=1';
  const params = [];
  const searchValues = {};
  if (req.query.contentTitle) { sql += ' AND contentTitle LIKE ?'; params.push(`%${req.query.contentTitle}%`); searchValues.contentTitle = req.query.contentTitle; }
  if (req.query.contentCategory) { sql += ' AND contentCategory = ?'; params.push(req.query.contentCategory); searchValues.contentCategory = req.query.contentCategory; }
  sql += ' ORDER BY dataId DESC';
  res.render('list', { title: '内容库管理', basePath: '/contents', searchFields, listFields, rows: db.prepare(sql).all(...params), searchValues });
});

router.get('/new', (req, res) => {
  res.render('form', { title: '内容库管理', basePath: '/contents', formFields, row: {}, formAction: '/contents', isEdit: false });
});

router.post('/', (req, res) => {
  const f = formFields.map(f => f.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`INSERT INTO contents (${f.join(',')}) VALUES (${f.map(() => '?').join(',')})`).run(...vals);
  res.redirect('/contents');
});

router.get('/:id/edit', (req, res) => {
  const row = db.prepare('SELECT * FROM contents WHERE dataId = ?').get(req.params.id);
  if (!row) return res.redirect('/contents');
  res.render('form', { title: '内容库管理', basePath: '/contents', formFields, row, formAction: `/contents/${row.dataId}`, isEdit: true });
});

router.post('/:id', (req, res) => {
  const f = formFields.map(f => f.name);
  const vals = f.map(n => req.body[n] || '');
  db.prepare(`UPDATE contents SET ${f.map(n => n + '=?').join(',')} WHERE dataId=?`).run(...vals, req.params.id);
  res.redirect('/contents');
});

router.post('/:id/delete', (req, res) => {
  db.prepare('DELETE FROM contents WHERE dataId = ?').run(req.params.id);
  res.redirect('/contents');
});

module.exports = router;
