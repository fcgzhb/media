const app = require('./app');
require('./db/init');

const PORT = process.env.PORT || 3400;
app.listen(PORT, () => {
  console.log(`社交媒体内容智能排期软件已启动: http://localhost:${PORT}`);
});
