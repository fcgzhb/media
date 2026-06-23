const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'data', 'scheduler.db');
const dir = path.dirname(dbPath);

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'active',
    createdAt TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS contents (
    dataId INTEGER PRIMARY KEY AUTOINCREMENT,
    contentTitle TEXT DEFAULT '',
    contentDescription TEXT DEFAULT '',
    contentFormat TEXT DEFAULT '',
    contentTags TEXT DEFAULT '',
    contentCategory TEXT DEFAULT '',
    contentThumbnail TEXT DEFAULT '',
    contentNotes TEXT DEFAULT '',
    creationDate TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS templates (
    dataId INTEGER PRIMARY KEY AUTOINCREMENT,
    templateName TEXT DEFAULT '',
    content TEXT DEFAULT '',
    templateFile TEXT DEFAULT '',
    platform TEXT DEFAULT '',
    tags TEXT DEFAULT '',
    description TEXT DEFAULT '',
    templateType TEXT DEFAULT '',
    createdDate TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS publish_plans (
    dataId INTEGER PRIMARY KEY AUTOINCREMENT,
    contentId TEXT DEFAULT '',
    contentTitle TEXT DEFAULT '',
    platform TEXT DEFAULT '',
    publishType TEXT DEFAULT '',
    targetAudience TEXT DEFAULT '',
    scheduledTime TEXT DEFAULT '',
    contentDescription TEXT DEFAULT '',
    thumbnailImage TEXT DEFAULT '',
    engagementScore TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS publish_logs (
    dataId INTEGER PRIMARY KEY AUTOINCREMENT,
    postId TEXT DEFAULT '',
    contentTitle TEXT DEFAULT '',
    platform TEXT DEFAULT '',
    interactionRate TEXT DEFAULT '',
    postType TEXT DEFAULT '',
    tags TEXT DEFAULT '',
    publishDate TEXT DEFAULT '',
    contentDescription TEXT DEFAULT '',
    mediaFiles TEXT DEFAULT '',
    contentHeatIndex TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS accounts (
    dataId INTEGER PRIMARY KEY AUTOINCREMENT,
    accountId TEXT DEFAULT '',
    accountName TEXT DEFAULT '',
    platform TEXT DEFAULT '',
    accountStatus TEXT DEFAULT '',
    permissions TEXT DEFAULT '',
    createdDate TEXT DEFAULT (datetime('now','localtime')),
    accountDescription TEXT DEFAULT '',
    profileImage TEXT DEFAULT '',
    accountEngagementScore TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS recommendations (
    dataId INTEGER PRIMARY KEY AUTOINCREMENT,
    contentType TEXT DEFAULT '',
    platformSelection TEXT DEFAULT '',
    optimalPublishDate TEXT DEFAULT '',
    targetAudience TEXT DEFAULT '',
    recommendationStrategy TEXT DEFAULT '',
    contentFormat TEXT DEFAULT '',
    contentAssets TEXT DEFAULT '',
    additionalNotes TEXT DEFAULT '',
    engagementScore TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS activities (
    dataId INTEGER PRIMARY KEY AUTOINCREMENT,
    activityName TEXT DEFAULT '',
    activityDescription TEXT DEFAULT '',
    targetAudience TEXT DEFAULT '',
    activityType TEXT DEFAULT '',
    keyPerformanceIndicators TEXT DEFAULT '',
    startDate TEXT DEFAULT '',
    activityPlan TEXT DEFAULT '',
    contentAssets TEXT DEFAULT '',
    activityEffectivenessScore TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS trends (
    dataId INTEGER PRIMARY KEY AUTOINCREMENT,
    trendName TEXT DEFAULT '',
    trendDescription TEXT DEFAULT '',
    keyword TEXT DEFAULT '',
    trendType TEXT DEFAULT '',
    platforms TEXT DEFAULT '',
    trendStartDate TEXT DEFAULT '',
    analysisNotes TEXT DEFAULT '',
    trendData TEXT DEFAULT '',
    trendImpactScore TEXT DEFAULT ''
  );
`);

module.exports = db;
