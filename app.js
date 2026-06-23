const express = require('express');
const session = require('express-session');
const path = require('path');

const indexRoutes = require('./routes/index');
const usersRoutes = require('./routes/users');
const contentsRoutes = require('./routes/contents');
const templatesRoutes = require('./routes/templates');
const publishPlansRoutes = require('./routes/publish-plans');
const publishLogsRoutes = require('./routes/publish-logs');
const accountsRoutes = require('./routes/accounts');
const recommendationsRoutes = require('./routes/recommendations');
const activitiesRoutes = require('./routes/activities');
const trendsRoutes = require('./routes/trends');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'media-content-scheduler-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 }
}));

// Layout middleware
app.use((req, res, next) => {
  const originalRender = res.render.bind(res);
  res.render = (view, options, callback) => {
    const opts = Object.assign({}, options);
    if (opts.layout === false) {
      return originalRender(view, opts, callback);
    }
    originalRender(view, opts, (err, html) => {
      if (err) return callback ? callback(err) : next(err);
      opts.body = html;
      originalRender('layout', opts, callback);
    });
  };
  next();
});

// Auth middleware
const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Routes
app.use('/', indexRoutes);
app.use('/users', authMiddleware, usersRoutes);
app.use('/contents', authMiddleware, contentsRoutes);
app.use('/templates', authMiddleware, templatesRoutes);
app.use('/publish-plans', authMiddleware, publishPlansRoutes);
app.use('/publish-logs', authMiddleware, publishLogsRoutes);
app.use('/accounts', authMiddleware, accountsRoutes);
app.use('/recommendations', authMiddleware, recommendationsRoutes);
app.use('/activities', authMiddleware, activitiesRoutes);
app.use('/trends', authMiddleware, trendsRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('error', { message: '页面不存在', layout: false });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: '服务器内部错误', layout: false });
});

module.exports = app;
