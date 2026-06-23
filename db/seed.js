const db = require('./init');

const userCount = db.prepare('SELECT COUNT(*) as cnt FROM users').get();
if (userCount.cnt === 0) {
  db.prepare('INSERT INTO users (username, password, email, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)')
    .run('admin', 'admin123', 'admin@example.com', '13800000000', 'admin', 'active');
  console.log('默认管理员账号已创建: admin / admin123');
}

const tables = ['contents', 'templates', 'publish_plans', 'publish_logs', 'accounts', 'recommendations', 'activities', 'trends'];

tables.forEach(table => {
  const cnt = db.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get();
  if (cnt.cnt === 0) {
    seedTable(table);
  }
});

function seedTable(table) {
  const inserts = {
    contents: [
      ['2024年社交媒体营销策略', '分析当前社交媒体趋势和最佳实践，制定全年内容营销计划', '文本', '营销,策略,社交媒体', '营销策划', '/images/thumb1.jpg', '年度重点内容', '2024-01-15 10:00:00'],
      ['产品发布会短视频', '展示新产品核心功能和使用场景的30秒短视频', '视频', '产品,发布,短视频', '产品推广', '/images/thumb2.jpg', '配合新品上市', '2024-02-20 14:30:00'],
      ['用户案例分享图集', '展示真实用户使用产品的成功案例和效果对比图', '图片', '用户案例,效果对比', '客户故事', '/images/thumb3.jpg', '收集5个典型案例', '2024-03-10 09:15:00'],
      ['节日促销活动海报', '针对春节、618、双11等节日设计系列促销海报', '图片', '促销,节日,海报', '促销活动', '/images/thumb4.jpg', '全年节日覆盖', '2024-04-01 16:00:00'],
      ['行业知识科普文章', '定期发布行业相关的知识科普内容，提升品牌专业形象', '文本', '科普,知识,行业', '内容营销', '', '每周一篇', '2024-05-05 11:00:00']
    ],
    templates: [
      ['产品推广模板', '【新品上市】{产品名称}，{核心卖点}，限时优惠{折扣}！', '/templates/promo.tpl', '微博', '推广,产品', '适用于新产品上线推广', '促销', '2024-01-10 10:00:00'],
      ['品牌故事模板', '品牌故事系列：{品牌理念}，{发展历程}，{愿景使命}', '/templates/brand.tpl', '微信公众号', '品牌,故事', '品牌形象建设', '品牌', '2024-02-15 14:00:00'],
      ['活动邀请模板', '诚邀您参加{活动名称}，时间{日期}，地点{地址}', '/templates/event.tpl', '全平台', '活动,邀请', '线下活动邀请函', '活动', '2024-03-20 09:00:00'],
      ['用户评价模板', '用户真实反馈：{用户名}使用{产品}后说"{评价}"', '/templates/review.tpl', '小红书', '评价,用户', '用户口碑传播', '口碑', '2024-04-05 16:00:00'],
      ['数据分析报告模板', '{时间段}社交媒体数据报告：粉丝增长{增长率}，互动率{互动数据}', '/templates/report.tpl', '内部', '数据,报告', '月度运营数据汇报', '报告', '2024-05-12 11:00:00']
    ],
    publish_plans: [
      ['C001', '春季营销活动启动', '微博', '促销', '年轻女性群体', '2024-03-15 10:00:00', '春季新品推广计划，包含3轮预热', '/images/campaign1.jpg', '85'],
      ['C002', '618大促预热内容', '抖音', '促销', '全年龄段消费者', '2024-06-01 20:00:00', '618预热短视频系列', '/images/campaign2.jpg', '92'],
      ['C003', '品牌周年庆内容', '微信公众号', '品牌', '现有粉丝', '2024-07-20 08:00:00', '品牌5周年庆祝系列活动', '/images/campaign3.jpg', '78'],
      ['C004', '行业白皮书发布', 'LinkedIn', '教育', '行业专业人士', '2024-04-10 09:00:00', '发布年度行业趋势白皮书', '/images/campaign4.jpg', '88'],
      ['C005', '用户互动活动', '小红书', '互动', 'Z世代用户', '2024-05-25 12:00:00', '话题挑战赛：分享你的使用体验', '/images/campaign5.jpg', '76']
    ],
    publish_logs: [
      ['P001', '情人节营销内容', '微博', '4.5%', '图文', '情人节,营销', '2024-02-14 10:00:00', '情人节品牌故事和互动活动', '图片x3', '82'],
      ['P002', '春节祝福视频', '抖音', '8.2%', '视频', '春节,祝福', '2024-02-10 08:00:00', '春节品牌祝福短视频', '视频x1', '95'],
      ['P003', '产品评测文章', '微信公众号', '3.1%', '文本', '产品,评测', '2024-03-05 14:00:00', '旗舰产品深度评测', '', '65'],
      ['P004', '618首波预热', '小红书', '6.7%', '图文', '618,预热', '2024-06-01 18:00:00', '618好物推荐清单', '图片x8', '89'],
      ['P005', '品牌联合推广', '全平台', '5.3%', '视频', '联名,推广', '2024-04-20 10:00:00', '与知名IP联名推广活动', '视频x2,图片x5', '78']
    ],
    accounts: [
      ['ACC001', '官方微博', '微博', '活跃', '发布,编辑,分析', '2023-01-15 10:00:00', '品牌官方微博账号，日常运营和粉丝互动', '/avatars/weibo.png', '88'],
      ['ACC002', '品牌抖音号', '抖音', '活跃', '发布,编辑,直播', '2023-03-20 14:00:00', '短视频内容运营和直播带货', '/avatars/douyin.png', '92'],
      ['ACC003', '微信公众号', '微信公众号', '活跃', '发布,编辑,菜单管理', '2022-06-10 09:00:00', '品牌官方公众号，深度内容运营', '/avatars/wechat.png', '85'],
      ['ACC004', '小红书官方号', '小红书', '活跃', '发布,编辑,评论', '2023-08-01 16:00:00', '种草和用户口碑运营', '/avatars/xiaohongshu.png', '80'],
      ['ACC005', 'LinkedIn企业号', 'LinkedIn', '休眠', '发布,编辑', '2023-05-15 11:00:00', '面向海外市场和行业影响力建设', '/avatars/linkedin.png', '45']
    ],
    recommendations: [
      ['图文', '微博', '2024-06-15 10:00:00', '18-35岁女性', '品牌曝光', '图文', '品牌故事系列', '结合618大促节点', '82'],
      ['视频', '抖音', '2024-06-15 20:00:00', '全年龄段', '转化导向', '短视频', '产品展示视频', '晚间流量高峰', '90'],
      ['图文', '小红书', '2024-06-16 12:00:00', 'Z世代女性', '种草推荐', '图文', '种草笔记', '午休时间发布', '85'],
      ['文本', '微信公众号', '2024-06-16 08:00:00', '职场人士', '品牌建设', '深度文章', '行业洞察文章', '早间阅读时间', '78'],
      ['视频', 'B站', '2024-06-14 18:00:00', '15-25岁学生', '互动传播', '长视频', '产品体验Vlog', '周末晚间', '72']
    ],
    activities: [
      ['618年中大促', '618期间全平台联合促销活动，包含预售、秒杀和直播', '全年龄段消费者', '促销', 'GMV目标500万,ROI>3,新增粉丝10万', '2024-06-01', '分3阶段：预热(6.1-6.13)、爆发(6.14-6.18)、返场(6.19-6.20)', '促销海报,短视频,直播脚本', '87'],
      ['品牌周年庆典', '品牌成立5周年线上线下联动庆祝活动', '现有粉丝+潜在用户', '品牌推广', '品牌曝光量提升50%,互动率提升30%', '2024-07-15', '线上话题营销+线下粉丝见面会', '品牌视频,纪念周边,互动H5', '75'],
      ['新品发布线上发布会', '旗舰新品线上直播发布会，展示产品核心功能', '科技爱好者+媒体', '产品推广', '直播间观看量100万,预售转化率>5%', '2024-08-20', '预热(8.10-8.19)+发布会直播(8.20)+返场(8.21-8.31)', '产品视频,发布会PPT,媒体素材', '90'],
      ['社交媒体粉丝节', '感谢粉丝支持的回馈活动，增强粉丝粘性', '现有粉丝', '用户互动', '活动参与率20%,UGC内容1000条', '2024-09-01', '话题挑战+抽奖+粉丝专属福利', '活动海报,抽奖模板,话题引导', '68']
    ],
    trends: [
      ['AI内容创作', '人工智能辅助内容创作工具和技术趋势', 'AI,内容创作,AIGC', '技术趋势', '全平台', '2024-01-01', 'AI生成内容在各平台的应用持续增长', '热度数据,竞品分析', '92'],
      ['短视频社交', '短视频内容在各社交平台的持续增长趋势', '短视频,直播,社交电商', '内容趋势', '抖音,快手,小红书', '2023-06-01', '短视频仍然是内容消费的主要形式', '观看量数据,用户偏好', '88'],
      ['私域流量运营', '品牌私域流量池建设和精细化运营策略', '私域,社群,会员', '运营趋势', '微信公众号,企业微信', '2024-02-01', '越来越多品牌重视私域流量建设', '转化率数据,留存分析', '76'],
      ['直播电商2.0', '直播电商的升级趋势和新模式探索', '直播,电商,带货', '商业趋势', '抖音,淘宝,快手', '2024-03-01', '直播电商进入精细化运营阶段', '销售数据,品类分析', '83'],
      ['社交媒体本地化', '本地生活和社区团购在社交媒体平台的融合发展', '本地生活,社区团购,O2O', '平台趋势', '美团,抖音,小红书', '2024-04-01', '社交平台加大本地生活布局', '区域数据,消费习惯', '71']
    ]
  };

  const columns = {
    contents: 'contentTitle, contentDescription, contentFormat, contentTags, contentCategory, contentThumbnail, contentNotes, creationDate',
    templates: 'templateName, content, templateFile, platform, tags, description, templateType, createdDate',
    publish_plans: 'contentId, contentTitle, platform, publishType, targetAudience, scheduledTime, contentDescription, thumbnailImage, engagementScore',
    publish_logs: 'postId, contentTitle, platform, interactionRate, postType, tags, publishDate, contentDescription, mediaFiles, contentHeatIndex',
    accounts: 'accountId, accountName, platform, accountStatus, permissions, createdDate, accountDescription, profileImage, accountEngagementScore',
    recommendations: 'contentType, platformSelection, optimalPublishDate, targetAudience, recommendationStrategy, contentFormat, contentAssets, additionalNotes, engagementScore',
    activities: 'activityName, activityDescription, targetAudience, activityType, keyPerformanceIndicators, startDate, activityPlan, contentAssets, activityEffectivenessScore',
    trends: 'trendName, trendDescription, keyword, trendType, platforms, trendStartDate, analysisNotes, trendData, trendImpactScore'
  };

  const stmt = db.prepare(`INSERT INTO ${table} (${columns[table]}) VALUES (${inserts[table][0].map(() => '?').join(',')})`);
  const insertMany = db.transaction((rows) => {
    for (const row of rows) stmt.run(...row);
  });
  insertMany(inserts[table]);
  console.log(`${table} 示例数据已创建`);
}

console.log('数据库初始化完成');
