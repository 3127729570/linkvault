// LinkVault - Database Seed Script
// Run with: npx tsx prisma/seed.ts

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "开发工具", slug: "dev-tools", icon: "Code2", order: 1 },
  { name: "设计资源", slug: "design-resources", icon: "Palette", order: 2 },
  { name: "学习教程", slug: "learning", icon: "GraduationCap", order: 3 },
  { name: "新闻资讯", slug: "news", icon: "Newspaper", order: 4 },
  { name: "视频娱乐", slug: "entertainment", icon: "Play", order: 5 },
  { name: "社交社区", slug: "social", icon: "Users", order: 6 },
  { name: "购物电商", slug: "shopping", icon: "ShoppingCart", order: 7 },
  { name: "效率工具", slug: "productivity", icon: "Zap", order: 8 },
  { name: "博客论坛", slug: "blogs", icon: "MessageSquare", order: 9 },
  { name: "开源项目", slug: "open-source", icon: "Github", order: 10 },
  { name: "AI 工具", slug: "ai-tools", icon: "Bot", order: 11 },
  { name: "资源下载", slug: "downloads", icon: "Download", order: 12 },
  { name: "金融理财", slug: "finance", icon: "DollarSign", order: 13 },
  { name: "健康医疗", slug: "health", icon: "Heart", order: 14 },
  { name: "云服务", slug: "cloud", icon: "Cloud", order: 15 },
  { name: "其他", slug: "others", icon: "Globe", order: 99 },
];

type SiteSeed = { title: string; url: string; description: string; categorySlug: string; tags: string[]; clicks: number };

const sampleSites: SiteSeed[] = [
  // ===== 开发工具 (dev-tools) =====
  { title: "GitHub", url: "https://github.com", description: "全球最大的代码托管平台，数千万开发者协作的开源社区", categorySlug: "dev-tools", tags: ["代码托管", "开源", "协作"], clicks: 9500 },
  { title: "VS Code", url: "https://code.visualstudio.com", description: "微软出品的免费开源代码编辑器，拥有丰富的插件生态", categorySlug: "dev-tools", tags: ["编辑器", "IDE", "微软"], clicks: 8200 },
  { title: "Stack Overflow", url: "https://stackoverflow.com", description: "全球最大的程序员问答社区，解决编程问题的首选平台", categorySlug: "dev-tools", tags: ["问答", "社区", "编程"], clicks: 7600 },
  { title: "JetBrains", url: "https://www.jetbrains.com", description: "专业开发工具套件，包含 IntelliJ IDEA、PyCharm 等知名 IDE", categorySlug: "dev-tools", tags: ["IDE", "开发工具", "JetBrains"], clicks: 5500 },
  { title: "Postman", url: "https://www.postman.com", description: "API 开发与测试协作平台，简化 API 工作流", categorySlug: "dev-tools", tags: ["API", "测试", "协作"], clicks: 4800 },
  { title: "Docker Hub", url: "https://hub.docker.com", description: "全球最大的容器镜像仓库，DevOps 必备", categorySlug: "dev-tools", tags: ["容器", "Docker", "DevOps"], clicks: 4200 },
  { title: "GitLab", url: "https://gitlab.com", description: "完整的 DevOps 平台，从代码托管到 CI/CD 一站式服务", categorySlug: "dev-tools", tags: ["DevOps", "CI/CD", "代码托管"], clicks: 3800 },
  { title: "CodePen", url: "https://codepen.io", description: "在线前端代码编辑与展示社区，即时预览 HTML/CSS/JS", categorySlug: "dev-tools", tags: ["前端", "在线编辑", "展示"], clicks: 3500 },
  { title: "Replit", url: "https://replit.com", description: "浏览器中的云端 IDE，支持 50+ 编程语言即时编程", categorySlug: "dev-tools", tags: ["在线IDE", "云端", "编程"], clicks: 3200 },
  { title: "Sentry", url: "https://sentry.io", description: "实时错误追踪和性能监控平台，帮助开发者快速定位问题", categorySlug: "dev-tools", tags: ["错误追踪", "监控", "性能"], clicks: 2800 },
  { title: "Vercel", url: "https://vercel.com", description: "前端部署平台，支持 Next.js 等框架的一键部署", categorySlug: "dev-tools", tags: ["部署", "前端", "云平台"], clicks: 4200 },
  { title: "Netlify", url: "https://www.netlify.com", description: "现代 Web 部署平台，支持 Jamstack 架构和 Serverless 函数", categorySlug: "dev-tools", tags: ["部署", "Jamstack", "Serverless"], clicks: 3100 },
  { title: "Bitbucket", url: "https://bitbucket.org", description: "Atlassian 旗下的代码托管与 CI/CD 平台", categorySlug: "dev-tools", tags: ["代码托管", "CI/CD", "Atlassian"], clicks: 2600 },
  { title: "npm", url: "https://www.npmjs.com", description: "Node.js 包管理器，全球最大的 JavaScript 包仓库", categorySlug: "dev-tools", tags: ["npm", "Node.js", "包管理"], clicks: 3700 },
  { title: "Bun", url: "https://bun.sh", description: "快速的全能 JavaScript 运行时与包管理器", categorySlug: "dev-tools", tags: ["运行时", "JavaScript", "包管理"], clicks: 1800 },
  { title: "Supabase", url: "https://supabase.com", description: "开源 Firebase 替代方案，提供数据库、认证、存储等服务", categorySlug: "dev-tools", tags: ["数据库", "BaaS", "开源"], clicks: 2400 },
  { title: "PlanetScale", url: "https://planetscale.com", description: "基于 MySQL 的 Serverless 数据库平台", categorySlug: "dev-tools", tags: ["数据库", "MySQL", "Serverless"], clicks: 1500 },
  { title: "TurboRepo", url: "https://turbo.build", description: "高性能的 JavaScript/TypeScript 构建系统，用于 Monorepo", categorySlug: "dev-tools", tags: ["构建工具", "Monorepo", "JavaScript"], clicks: 1300 },

  // ===== 设计资源 (design-resources) =====
  { title: "Dribbble", url: "https://dribbble.com", description: "全球设计师作品展示与灵感社区，UI/UX 设计风向标", categorySlug: "design-resources", tags: ["设计", "UI", "灵感"], clicks: 6800 },
  { title: "Figma", url: "https://www.figma.com", description: "基于浏览器的协作式 UI 设计工具，团队协作利器", categorySlug: "design-resources", tags: ["UI设计", "协作", "原型"], clicks: 7200 },
  { title: "Unsplash", url: "https://unsplash.com", description: "免费高质量图片素材库，可用于商业用途", categorySlug: "design-resources", tags: ["图片", "素材", "免费"], clicks: 5500 },
  { title: "Behance", url: "https://www.behance.net", description: "Adobe 旗下的创意作品展示平台，设计灵感宝库", categorySlug: "design-resources", tags: ["设计", "创意", "Adobe"], clicks: 4500 },
  { title: "Canva", url: "https://www.canva.com", description: "在线图形设计工具，轻松制作海报、社交媒体图片", categorySlug: "design-resources", tags: ["设计", "在线工具", "图形"], clicks: 6200 },
  { title: "Sketch", url: "https://www.sketch.com", description: "macOS 平台专业 UI 设计工具，矢量图形编辑", categorySlug: "design-resources", tags: ["UI设计", "macOS", "矢量"], clicks: 3200 },
  { title: "Pexels", url: "https://www.pexels.com", description: "免费高清图片和视频素材网站", categorySlug: "design-resources", tags: ["图片", "视频", "免费"], clicks: 3800 },
  { title: "Pixabay", url: "https://pixabay.com", description: "超过 200 万张免费图片和视频素材库", categorySlug: "design-resources", tags: ["图片", "素材", "免费"], clicks: 3400 },
  { title: "ColorHunt", url: "https://colorhunt.co", description: "精选配色方案集合，设计师的配色灵感来源", categorySlug: "design-resources", tags: ["配色", "调色板", "设计"], clicks: 2800 },
  { title: "Font Awesome", url: "https://fontawesome.com", description: "最流行的图标字体和 CSS 框架", categorySlug: "design-resources", tags: ["图标", "字体", "CSS"], clicks: 3100 },
  { title: "Awwwards", url: "https://www.awwwards.com", description: "全球优秀网站设计评选与展示平台", categorySlug: "design-resources", tags: ["网页设计", "评选", "灵感"], clicks: 2200 },
  { title: "Adobe Color", url: "https://color.adobe.com", description: "Adobe 出品的配色方案创建与分享工具", categorySlug: "design-resources", tags: ["配色", "Adobe", "设计"], clicks: 1900 },
  { title: "Coolors", url: "https://coolors.co", description: "快速配色方案生成器，一键生成美丽配色", categorySlug: "design-resources", tags: ["配色", "生成器", "设计"], clicks: 2500 },
  { title: "The Noun Project", url: "https://thenounproject.com", description: "全球最大的图标库，超过 300 万个图标", categorySlug: "design-resources", tags: ["图标", "素材", "设计"], clicks: 1800 },

  // ===== 学习教程 (learning) =====
  { title: "MDN Web Docs", url: "https://developer.mozilla.org", description: "Mozilla 维护的 Web 开发权威文档，前端开发者圣经", categorySlug: "learning", tags: ["Web开发", "文档", "教程"], clicks: 6100 },
  { title: "freeCodeCamp", url: "https://www.freecodecamp.org", description: "免费学习编程的在线平台，含交互式课程和认证", categorySlug: "learning", tags: ["编程", "免费", "课程"], clicks: 4800 },
  { title: "LeetCode", url: "https://leetcode.com", description: "算法面试刷题平台，技术面试必备", categorySlug: "learning", tags: ["算法", "面试", "刷题"], clicks: 8900 },
  { title: "Coursera", url: "https://www.coursera.org", description: "全球顶尖大学在线课程平台，涵盖计算机、数据科学等", categorySlug: "learning", tags: ["在线课程", "大学", "认证"], clicks: 5200 },
  { title: "Udemy", url: "https://www.udemy.com", description: "全球最大的在线学习市场，拥有海量课程", categorySlug: "learning", tags: ["在线课程", "学习", "技能"], clicks: 4500 },
  { title: "W3Schools", url: "https://www.w3schools.com", description: "Web 开发入门教程网站，适合初学者学习", categorySlug: "learning", tags: ["Web开发", "入门", "教程"], clicks: 3800 },
  { title: "GeeksforGeeks", url: "https://www.geeksforgeeks.org", description: "计算机科学学习门户，算法/数据结构/面试题", categorySlug: "learning", tags: ["算法", "数据结构", "面试"], clicks: 3500 },
  { title: "Codecademy", url: "https://www.codecademy.com", description: "交互式编程学习平台，从零开始学编程", categorySlug: "learning", tags: ["编程", "交互", "入门"], clicks: 2800 },
  { title: "Khan Academy", url: "https://www.khanacademy.org", description: "非营利性教育平台，提供免费的各学科课程", categorySlug: "learning", tags: ["教育", "免费", "数学"], clicks: 3200 },
  { title: "edX", url: "https://www.edx.org", description: "哈佛、MIT 等名校创建的在线课程平台", categorySlug: "learning", tags: ["在线课程", "名校", "认证"], clicks: 2400 },
  { title: "Pluralsight", url: "https://www.pluralsight.com", description: "技术技能提升平台，专注 IT 和软件开发", categorySlug: "learning", tags: ["技术", "开发", "技能"], clicks: 2100 },
  { title: "HackerRank", url: "https://www.hackerrank.com", description: "编程挑战与面试准备平台", categorySlug: "learning", tags: ["编程挑战", "面试", "刷题"], clicks: 2600 },
  { title: "Exercism", url: "https://exercism.org", description: "免费编程练习平台，50+ 语言，导师指导", categorySlug: "learning", tags: ["编程练习", "导师", "免费"], clicks: 1400 },

  // ===== 新闻资讯 (news) =====
  { title: "Hacker News", url: "https://news.ycombinator.com", description: "Y Combinator 旗下的科技新闻社区，每日必读", categorySlug: "news", tags: ["科技", "创业", "新闻"], clicks: 4500 },
  { title: "Product Hunt", url: "https://www.producthunt.com", description: "发现最新酷炫产品的社区平台", categorySlug: "news", tags: ["产品", "发现", "创业"], clicks: 3800 },
  { title: "TechCrunch", url: "https://techcrunch.com", description: "全球领先的科技创业媒体报道平台", categorySlug: "news", tags: ["科技", "创业", "媒体"], clicks: 3200 },
  { title: "The Verge", url: "https://www.theverge.com", description: "科技、科学、艺术与文化的前沿资讯", categorySlug: "news", tags: ["科技", "文化", "媒体"], clicks: 2800 },
  { title: "Ars Technica", url: "https://arstechnica.com", description: "深度科技新闻与分析，涵盖 IT、科学、政策", categorySlug: "news", tags: ["科技", "分析", "深度"], clicks: 2100 },
  { title: "Wired", url: "https://www.wired.com", description: "科技如何影响文化、经济和政治的深度报道", categorySlug: "news", tags: ["科技", "文化", "深度"], clicks: 2400 },
  { title: "Dev.to", url: "https://dev.to", description: "开发者社区与科技博客平台", categorySlug: "news", tags: ["开发者", "博客", "社区"], clicks: 1900 },
  { title: "Hackaday", url: "https://hackaday.com", description: "硬件黑客、创客和 DIY 项目社区", categorySlug: "news", tags: ["硬件", "创客", "DIY"], clicks: 1200 },
  { title: "Slashdot", url: "https://slashdot.org", description: "IT 从业者必读的科技新闻社区", categorySlug: "news", tags: ["IT", "新闻", "社区"], clicks: 1500 },
  { title: "The Register", url: "https://www.theregister.com", description: "IT 行业新闻与科技报道，以幽默风格著称", categorySlug: "news", tags: ["IT", "幽默", "新闻"], clicks: 1300 },

  // ===== 视频娱乐 (entertainment) =====
  { title: "YouTube", url: "https://www.youtube.com", description: "全球最大的视频分享平台，海量内容任你观看", categorySlug: "entertainment", tags: ["视频", "娱乐", "学习"], clicks: 12000 },
  { title: "Bilibili", url: "https://www.bilibili.com", description: "国内知名的视频弹幕网站，ACG 文化社区", categorySlug: "entertainment", tags: ["视频", "弹幕", "ACG"], clicks: 11000 },
  { title: "Netflix", url: "https://www.netflix.com", description: "全球流媒体巨头，海量影视剧和原创内容", categorySlug: "entertainment", tags: ["流媒体", "影视", "原创"], clicks: 8500 },
  { title: "Twitch", url: "https://www.twitch.tv", description: "全球最大的游戏直播和内容创作平台", categorySlug: "entertainment", tags: ["直播", "游戏", "社区"], clicks: 6500 },
  { title: "Spotify", url: "https://www.spotify.com", description: "全球领先的音乐流媒体平台", categorySlug: "entertainment", tags: ["音乐", "流媒体", "播客"], clicks: 7200 },
  { title: "Vimeo", url: "https://vimeo.com", description: "高质量视频托管与分享平台，创作者首选", categorySlug: "entertainment", tags: ["视频", "创作", "高质量"], clicks: 2800 },
  { title: "IMDb", url: "https://www.imdb.com", description: "全球最大的影视数据库，电影评分和资讯", categorySlug: "entertainment", tags: ["电影", "数据库", "评分"], clicks: 4200 },
  { title: "Disney+", url: "https://www.disneyplus.com", description: "迪士尼旗下流媒体服务，漫威/星球大战/迪士尼经典", categorySlug: "entertainment", tags: ["流媒体", "迪士尼", "漫威"], clicks: 3800 },
  { title: "SoundCloud", url: "https://soundcloud.com", description: "独立音乐人分享和发现音乐的平台", categorySlug: "entertainment", tags: ["音乐", "独立音乐", "分享"], clicks: 2500 },
  { title: "Rotten Tomatoes", url: "https://www.rottentomatoes.com", description: "电影和电视剧评论聚合网站", categorySlug: "entertainment", tags: ["电影", "评论", "评分"], clicks: 2100 },

  // ===== 社交社区 (social) =====
  { title: "Reddit", url: "https://www.reddit.com", description: "全球最大的论坛社区，涵盖各种话题", categorySlug: "social", tags: ["论坛", "社区", "讨论"], clicks: 7000 },
  { title: "X (Twitter)", url: "https://x.com", description: "全球实时社交网络平台，获取最新资讯", categorySlug: "social", tags: ["社交", "实时", "新闻"], clicks: 6500 },
  { title: "Discord", url: "https://discord.com", description: "游戏玩家和社区的首选聊天平台", categorySlug: "social", tags: ["聊天", "社区", "语音"], clicks: 5800 },
  { title: "LinkedIn", url: "https://www.linkedin.com", description: "全球最大的职业社交平台，职场人脉与求职", categorySlug: "social", tags: ["职业", "求职", "人脉"], clicks: 5200 },
  { title: "Telegram", url: "https://telegram.org", description: "注重隐私的即时通讯应用，支持频道和群组", categorySlug: "social", tags: ["通讯", "隐私", "频道"], clicks: 4800 },
  { title: "Medium", url: "https://medium.com", description: "高质量写作与阅读平台，思想碰撞之地", categorySlug: "social", tags: ["写作", "阅读", "博客"], clicks: 3200 },
  { title: "Quora", url: "https://www.quora.com", description: "知识问答社区，向专家提问获取答案", categorySlug: "social", tags: ["问答", "知识", "社区"], clicks: 2800 },
  { title: "Mastodon", url: "https://mastodon.social", description: "去中心化的开源社交网络", categorySlug: "social", tags: ["社交", "去中心化", "开源"], clicks: 1500 },
  { title: "Pinterest", url: "https://www.pinterest.com", description: "图片灵感发现与收藏平台", categorySlug: "social", tags: ["图片", "灵感", "收藏"], clicks: 3600 },
  { title: "Stack Exchange", url: "https://stackexchange.com", description: "由 170+ 个问答社区组成的网络", categorySlug: "social", tags: ["问答", "社区", "知识"], clicks: 2400 },

  // ===== 购物电商 (shopping) =====
  { title: "Amazon", url: "https://www.amazon.com", description: "全球最大的电商平台之一", categorySlug: "shopping", tags: ["电商", "购物", "全球"], clicks: 5000 },
  { title: "eBay", url: "https://www.ebay.com", description: "全球在线拍卖和购物网站", categorySlug: "shopping", tags: ["拍卖", "购物", "二手"], clicks: 3200 },
  { title: "Shopify", url: "https://www.shopify.com", description: "全球领先的电商建站平台", categorySlug: "shopping", tags: ["电商", "建站", "独立站"], clicks: 2800 },
  { title: "Etsy", url: "https://www.etsy.com", description: "手工艺品和创意商品交易平台", categorySlug: "shopping", tags: ["手工艺", "创意", "独立设计"], clicks: 2400 },
  { title: "AliExpress", url: "https://www.aliexpress.com", description: "阿里巴巴旗下全球零售电商平台", categorySlug: "shopping", tags: ["电商", "零售", "全球"], clicks: 3600 },
  { title: "Best Buy", url: "https://www.bestbuy.com", description: "美国最大的电子产品零售商", categorySlug: "shopping", tags: ["电子", "零售", "家电"], clicks: 1800 },

  // ===== 效率工具 (productivity) =====
  { title: "Notion", url: "https://www.notion.so", description: "全能型笔记与协作工具，个人与团队知识管理", categorySlug: "productivity", tags: ["笔记", "协作", "知识管理"], clicks: 5600 },
  { title: "Linear", url: "https://linear.app", description: "现代项目管理工具，专为软件团队打造", categorySlug: "productivity", tags: ["项目管理", "软件", "团队"], clicks: 3100 },
  { title: "Trello", url: "https://trello.com", description: "看板式项目管理工具，直观管理任务", categorySlug: "productivity", tags: ["项目管理", "看板", "协作"], clicks: 4200 },
  { title: "Asana", url: "https://asana.com", description: "团队协作与项目管理平台", categorySlug: "productivity", tags: ["项目管理", "协作", "团队"], clicks: 3500 },
  { title: "Slack", url: "https://slack.com", description: "团队沟通协作工具，替代邮件的高效选择", categorySlug: "productivity", tags: ["沟通", "协作", "团队"], clicks: 4800 },
  { title: "Airtable", url: "https://airtable.com", description: "像电子表格一样的数据库，灵活构建应用", categorySlug: "productivity", tags: ["数据库", "电子表格", "无代码"], clicks: 2800 },
  { title: "Figma Jam", url: "https://www.figma.com/figjam", description: "在线白板协作工具，头脑风暴和流程图", categorySlug: "productivity", tags: ["白板", "协作", "头脑风暴"], clicks: 1900 },
  { title: "Miro", url: "https://miro.com", description: "在线协作白板，远程团队可视化协作", categorySlug: "productivity", tags: ["白板", "协作", "可视化"], clicks: 2600 },
  { title: "Obsidian", url: "https://obsidian.md", description: "基于本地 Markdown 的知识库管理工具", categorySlug: "productivity", tags: ["笔记", "知识库", "Markdown"], clicks: 2200 },
  { title: "Todoist", url: "https://todoist.com", description: "简洁高效的待办事项管理工具", categorySlug: "productivity", tags: ["待办", "任务管理", "效率"], clicks: 2500 },
  { title: "ClickUp", url: "https://clickup.com", description: "一站式生产力平台，项目管理/文档/目标", categorySlug: "productivity", tags: ["项目管理", "文档", "目标"], clicks: 2100 },
  { title: "Zapier", url: "https://zapier.com", description: "自动化工作流工具，连接 5000+ 应用", categorySlug: "productivity", tags: ["自动化", "工作流", "集成"], clicks: 1800 },
  { title: "IFTTT", url: "https://ifttt.com", description: "If This Then That，简单自动化你的生活", categorySlug: "productivity", tags: ["自动化", "连接", "智能"], clicks: 1400 },

  // ===== 博客论坛 (blogs) =====
  { title: "WordPress", url: "https://wordpress.com", description: "全球最流行的博客和网站构建平台", categorySlug: "blogs", tags: ["博客", "建站", "CMS"], clicks: 4200 },
  { title: "Ghost", url: "https://ghost.org", description: "专注写作与出版的开源博客平台", categorySlug: "blogs", tags: ["博客", "开源", "写作"], clicks: 1600 },
  { title: "Substack", url: "https://substack.com", description: "独立写作与新闻通讯平台", categorySlug: "blogs", tags: ["新闻通讯", "写作", "独立出版"], clicks: 2100 },
  { title: "Hashnode", url: "https://hashnode.com", description: "开发者博客社区，免费搭建技术博客", categorySlug: "blogs", tags: ["技术博客", "开发者", "社区"], clicks: 1400 },
  { title: "Blogger", url: "https://www.blogger.com", description: "Google 旗下的免费博客发布平台", categorySlug: "blogs", tags: ["博客", "免费", "Google"], clicks: 1800 },
  { title: "DEV Community", url: "https://dev.to", description: "开发者分享技术文章和经验的社区", categorySlug: "blogs", tags: ["开发者", "技术文章", "社区"], clicks: 1600 },

  // ===== 开源项目 (open-source) =====
  { title: "React", url: "https://react.dev", description: "Facebook 推出的前端 UI 库，构建用户界面的首选", categorySlug: "open-source", tags: ["前端", "UI", "JavaScript"], clicks: 8500 },
  { title: "Vue.js", url: "https://vuejs.org", description: "渐进式 JavaScript 框架，易于上手且功能强大", categorySlug: "open-source", tags: ["前端", "框架", "JavaScript"], clicks: 6400 },
  { title: "Tailwind CSS", url: "https://tailwindcss.com", description: "实用优先的 CSS 框架，快速构建现代界面", categorySlug: "open-source", tags: ["CSS", "框架", "前端"], clicks: 5300 },
  { title: "Angular", url: "https://angular.io", description: "Google 维护的企业级前端框架", categorySlug: "open-source", tags: ["前端", "框架", "Google"], clicks: 3800 },
  { title: "Svelte", url: "https://svelte.dev", description: "编译型前端框架，将组件编译为高效原生代码", categorySlug: "open-source", tags: ["前端", "框架", "编译型"], clicks: 2800 },
  { title: "Next.js", url: "https://nextjs.org", description: "React 全栈框架，支持 SSR/SSG/ISR", categorySlug: "open-source", tags: ["React", "全栈", "SSR"], clicks: 4500 },
  { title: "Nuxt", url: "https://nuxt.com", description: "Vue 全栈框架，SSR/SSG 一站搞定", categorySlug: "open-source", tags: ["Vue", "全栈", "SSR"], clicks: 2200 },
  { title: "Node.js", url: "https://nodejs.org", description: "JavaScript 运行时，让 JS 运行在服务器端", categorySlug: "open-source", tags: ["运行时", "JavaScript", "后端"], clicks: 5200 },
  { title: "Deno", url: "https://deno.com", description: "Node.js 创始人打造的安全 JavaScript 运行时", categorySlug: "open-source", tags: ["运行时", "JavaScript", "安全"], clicks: 1800 },
  { title: "Python", url: "https://www.python.org", description: "最流行的编程语言之一，简洁优雅", categorySlug: "open-source", tags: ["编程语言", "Python", "后端"], clicks: 6200 },
  { title: "Rust", url: "https://www.rust-lang.org", description: "注重安全与性能的系统编程语言", categorySlug: "open-source", tags: ["编程语言", "系统编程", "安全"], clicks: 3200 },
  { title: "Go", url: "https://go.dev", description: "Google 开发的简洁高效的编程语言", categorySlug: "open-source", tags: ["编程语言", "Google", "后端"], clicks: 2800 },
  { title: "Kubernetes", url: "https://kubernetes.io", description: "容器编排平台，云原生应用的事实标准", categorySlug: "open-source", tags: ["容器", "编排", "云原生"], clicks: 3800 },
  { title: "Linux", url: "https://www.kernel.org", description: "开源操作系统内核，运行在数十亿设备上", categorySlug: "open-source", tags: ["操作系统", "内核", "开源"], clicks: 3500 },
  { title: "TensorFlow", url: "https://www.tensorflow.org", description: "Google 开源的机器学习框架", categorySlug: "open-source", tags: ["机器学习", "AI", "Google"], clicks: 2800 },
  { title: "PyTorch", url: "https://pytorch.org", description: "Facebook 开源的深度学习框架", categorySlug: "open-source", tags: ["深度学习", "AI", "Facebook"], clicks: 2600 },
  { title: "GraphQL", url: "https://graphql.org", description: "API 查询语言，精确获取所需数据", categorySlug: "open-source", tags: ["API", "查询语言", "GraphQL"], clicks: 2400 },
  { title: "PostgreSQL", url: "https://www.postgresql.org", description: "最先进的开源关系型数据库", categorySlug: "open-source", tags: ["数据库", "SQL", "关系型"], clicks: 2800 },
  { title: "Redis", url: "https://redis.io", description: "开源内存数据结构存储，用作数据库/缓存/消息代理", categorySlug: "open-source", tags: ["数据库", "缓存", "内存"], clicks: 2200 },
  { title: "Nginx", url: "https://nginx.org", description: "高性能 HTTP 和反向代理服务器", categorySlug: "open-source", tags: ["服务器", "反向代理", "HTTP"], clicks: 2500 },
  { title: "Electron", url: "https://www.electronjs.org", description: "用 Web 技术构建跨平台桌面应用", categorySlug: "open-source", tags: ["桌面应用", "跨平台", "JavaScript"], clicks: 1900 },
  { title: "Flutter", url: "https://flutter.dev", description: "Google 的跨平台 UI 框架，一套代码多端运行", categorySlug: "open-source", tags: ["移动开发", "跨平台", "Google"], clicks: 3000 },

  // ===== AI 工具 (ai-tools) =====
  { title: "ChatGPT", url: "https://chat.openai.com", description: "OpenAI 推出的对话式 AI 助手", categorySlug: "ai-tools", tags: ["AI", "对话", "助手"], clicks: 15000 },
  { title: "Claude", url: "https://claude.ai", description: "Anthropic 开发的 AI 助手，擅长长文本处理", categorySlug: "ai-tools", tags: ["AI", "助手", "长文本"], clicks: 9200 },
  { title: "Midjourney", url: "https://www.midjourney.com", description: "AI 图像生成工具，创造惊艳的视觉作品", categorySlug: "ai-tools", tags: ["AI", "图像生成", "设计"], clicks: 7800 },
  { title: "DALL-E", url: "https://openai.com/dall-e-3", description: "OpenAI 的 AI 图像生成模型", categorySlug: "ai-tools", tags: ["AI", "图像生成", "OpenAI"], clicks: 5500 },
  { title: "Stable Diffusion", url: "https://stability.ai", description: "开源 AI 图像生成模型，可本地部署", categorySlug: "ai-tools", tags: ["AI", "图像生成", "开源"], clicks: 4200 },
  { title: "Hugging Face", url: "https://huggingface.co", description: "AI 模型社区和平台，模型/数据集/应用", categorySlug: "ai-tools", tags: ["AI", "模型", "社区"], clicks: 3800 },
  { title: "Perplexity AI", url: "https://www.perplexity.ai", description: "AI 驱动的搜索引擎，直接给出答案", categorySlug: "ai-tools", tags: ["AI", "搜索", "问答"], clicks: 3200 },
  { title: "Gemini", url: "https://gemini.google.com", description: "Google 的多模态 AI 助手", categorySlug: "ai-tools", tags: ["AI", "Google", "多模态"], clicks: 4500 },
  { title: "Runway", url: "https://runwayml.com", description: "AI 视频生成与编辑工具", categorySlug: "ai-tools", tags: ["AI", "视频", "编辑"], clicks: 2400 },
  { title: "GitHub Copilot", url: "https://github.com/features/copilot", description: "AI 编程助手，在编辑器中实时补全代码", categorySlug: "ai-tools", tags: ["AI", "编程", "GitHub"], clicks: 5200 },
  { title: "Cursor", url: "https://cursor.sh", description: "AI 优先的代码编辑器，基于 VS Code", categorySlug: "ai-tools", tags: ["AI", "代码编辑器", "编程"], clicks: 3500 },
  { title: "v0 by Vercel", url: "https://v0.dev", description: "AI 驱动的 UI 生成工具，自然语言生成界面", categorySlug: "ai-tools", tags: ["AI", "UI生成", "前端"], clicks: 2800 },

  // ===== 资源下载 (downloads) =====
  { title: "PyPI", url: "https://pypi.org", description: "Python 包索引，Python 开发者必备", categorySlug: "downloads", tags: ["Python", "包管理", "pip"], clicks: 3200 },
  { title: "SourceForge", url: "https://sourceforge.net", description: "开源软件下载平台，拥有海量开源项目", categorySlug: "downloads", tags: ["开源", "软件", "下载"], clicks: 2500 },
  { title: "F-Droid", url: "https://f-droid.org", description: "Android 开源应用商店", categorySlug: "downloads", tags: ["Android", "开源", "应用商店"], clicks: 1400 },
  { title: "Internet Archive", url: "https://archive.org", description: "互联网档案馆，数字图书馆和软件保存", categorySlug: "downloads", tags: ["存档", "图书馆", "历史"], clicks: 1800 },

  // ===== 金融理财 (finance) =====
  { title: "TradingView", url: "https://www.tradingview.com", description: "全球领先的图表分析与交易平台", categorySlug: "finance", tags: ["股票", "图表", "交易"], clicks: 2800 },
  { title: "CoinMarketCap", url: "https://coinmarketcap.com", description: "加密货币市值排名与数据平台", categorySlug: "finance", tags: ["加密货币", "市值", "数据"], clicks: 2200 },
  { title: "Yahoo Finance", url: "https://finance.yahoo.com", description: "免费股票市场数据、新闻和投资组合管理", categorySlug: "finance", tags: ["股票", "财经", "投资"], clicks: 2400 },
  { title: "Investopedia", url: "https://www.investopedia.com", description: "投资和金融教育平台", categorySlug: "finance", tags: ["投资", "教育", "金融"], clicks: 1800 },
  { title: "CoinGecko", url: "https://www.coingecko.com", description: "加密货币数据分析与跟踪平台", categorySlug: "finance", tags: ["加密货币", "数据", "分析"], clicks: 1600 },
  { title: "Bloomberg", url: "https://www.bloomberg.com", description: "全球财经新闻与市场数据终端", categorySlug: "finance", tags: ["财经", "新闻", "数据"], clicks: 2000 },

  // ===== 健康医疗 (health) =====
  { title: "WebMD", url: "https://www.webmd.com", description: "权威的医疗健康信息网站", categorySlug: "health", tags: ["健康", "医疗", "信息"], clicks: 2200 },
  { title: "Mayo Clinic", url: "https://www.mayoclinic.org", description: "世界顶级医疗机构的健康信息平台", categorySlug: "health", tags: ["医疗", "健康", "权威"], clicks: 1800 },
  { title: "Healthline", url: "https://www.healthline.com", description: "健康资讯与医疗建议平台", categorySlug: "health", tags: ["健康", "资讯", "医疗"], clicks: 1600 },
  { title: "MyFitnessPal", url: "https://www.myfitnesspal.com", description: "饮食与运动追踪应用，管理健康生活", categorySlug: "health", tags: ["健身", "饮食", "健康"], clicks: 1400 },
  { title: "Headspace", url: "https://www.headspace.com", description: "冥想与正念应用，改善心理健康", categorySlug: "health", tags: ["冥想", "正念", "心理健康"], clicks: 1200 },

  // ===== 云服务 (cloud) =====
  { title: "AWS", url: "https://aws.amazon.com", description: "亚马逊云服务，全球领先的云计算平台", categorySlug: "cloud", tags: ["云服务", "AWS", "服务器"], clicks: 4000 },
  { title: "Cloudflare", url: "https://www.cloudflare.com", description: "全球 CDN 与网络安全服务提供商", categorySlug: "cloud", tags: ["CDN", "安全", "DNS"], clicks: 3500 },
  { title: "Google Cloud", url: "https://cloud.google.com", description: "Google 云计算平台，AI/ML/数据分析", categorySlug: "cloud", tags: ["云服务", "Google", "AI"], clicks: 3200 },
  { title: "Azure", url: "https://azure.microsoft.com", description: "微软云计算平台，企业级云服务", categorySlug: "cloud", tags: ["云服务", "微软", "企业"], clicks: 3000 },
  { title: "DigitalOcean", url: "https://www.digitalocean.com", description: "开发者友好的云服务商，简单易用", categorySlug: "cloud", tags: ["云服务", "开发者", "简单"], clicks: 2400 },
  { title: "Heroku", url: "https://www.heroku.com", description: "PaaS 云平台，快速部署应用", categorySlug: "cloud", tags: ["PaaS", "部署", "云平台"], clicks: 1800 },
  { title: "Railway", url: "https://railway.app", description: "现代化部署平台，一键部署应用", categorySlug: "cloud", tags: ["部署", "PaaS", "现代化"], clicks: 1200 },
  { title: "Fly.io", url: "https://fly.io", description: "全球边缘部署平台，让你的应用遍布全球", categorySlug: "cloud", tags: ["部署", "边缘计算", "全球"], clicks: 1100 },
  { title: "Render", url: "https://render.com", description: "统一的云平台，托管 Web 服务/数据库/静态站点", categorySlug: "cloud", tags: ["部署", "云平台", "数据库"], clicks: 1000 },

  // ===== 其他 (others) =====
  { title: "Wikipedia", url: "https://www.wikipedia.org", description: "自由的百科全书，人类知识的汇聚", categorySlug: "others", tags: ["百科", "知识", "参考"], clicks: 8000 },
  { title: "Wolfram Alpha", url: "https://www.wolframalpha.com", description: "计算知识引擎，直接计算答案", categorySlug: "others", tags: ["计算", "知识", "数学"], clicks: 1800 },
  { title: "GIPHY", url: "https://giphy.com", description: "GIF 动图搜索与分享平台", categorySlug: "others", tags: ["GIF", "动图", "娱乐"], clicks: 2400 },
  { title: "DuckDuckGo", url: "https://duckduckgo.com", description: "注重隐私的搜索引擎", categorySlug: "others", tags: ["搜索", "隐私", "搜索引擎"], clicks: 2200 },
  { title: "Wayback Machine", url: "https://web.archive.org", description: "互联网档案馆，查看网页历史快照", categorySlug: "others", tags: ["存档", "历史", "网页"], clicks: 1600 },
  { title: "Caniuse", url: "https://caniuse.com", description: "浏览器兼容性查询，前端开发必备", categorySlug: "others", tags: ["浏览器", "兼容性", "前端"], clicks: 2000 },
  { title: "AlternativeTo", url: "https://alternativeto.net", description: "软件替代品推荐平台", categorySlug: "others", tags: ["软件", "替代品", "推荐"], clicks: 1400 },
  { title: "Google Maps", url: "https://maps.google.com", description: "全球最流行的地图导航服务", categorySlug: "others", tags: ["地图", "导航", "Google"], clicks: 9000 },
  { title: "Google Translate", url: "https://translate.google.com", description: "Google 免费翻译服务，支持 100+ 语言", categorySlug: "others", tags: ["翻译", "语言", "Google"], clicks: 7800 },
  { title: "Google Drive", url: "https://drive.google.com", description: "Google 云存储服务，15GB 免费空间", categorySlug: "others", tags: ["云存储", "Google", "协作"], clicks: 6500 },

  // ===== 更多开发工具 =====
  { title: "MongoDB", url: "https://www.mongodb.com", description: "最流行的 NoSQL 文档数据库", categorySlug: "dev-tools", tags: ["数据库", "NoSQL", "MongoDB"], clicks: 4200 },
  { title: "MySQL", url: "https://www.mysql.com", description: "全球最流行的开源关系型数据库", categorySlug: "dev-tools", tags: ["数据库", "SQL", "开源"], clicks: 5000 },
  { title: "Firebase", url: "https://firebase.google.com", description: "Google 的移动和 Web 应用开发平台", categorySlug: "dev-tools", tags: ["BaaS", "Google", "后端"], clicks: 3800 },
  { title: "Express.js", url: "https://expressjs.com", description: "Node.js 最流行的 Web 框架", categorySlug: "dev-tools", tags: ["Node.js", "Web框架", "后端"], clicks: 3400 },
  { title: "Django", url: "https://www.djangoproject.com", description: "Python 高级 Web 框架", categorySlug: "dev-tools", tags: ["Python", "Web框架", "后端"], clicks: 3200 },
  { title: "Flask", url: "https://flask.palletsprojects.com", description: "Python 轻量级 Web 框架", categorySlug: "dev-tools", tags: ["Python", "Web框架", "微框架"], clicks: 2400 },
  { title: "Spring Boot", url: "https://spring.io/projects/spring-boot", description: "Java 企业级应用开发框架", categorySlug: "dev-tools", tags: ["Java", "框架", "企业"], clicks: 2800 },
  { title: "Laravel", url: "https://laravel.com", description: "PHP 最流行的 Web 开发框架", categorySlug: "dev-tools", tags: ["PHP", "框架", "Web"], clicks: 2600 },
  { title: "Ruby on Rails", url: "https://rubyonrails.org", description: "Ruby 全栈 Web 框架", categorySlug: "dev-tools", tags: ["Ruby", "Web框架", "全栈"], clicks: 2200 },
  { title: "Insomnia", url: "https://insomnia.rest", description: "API 开发和测试客户端", categorySlug: "dev-tools", tags: ["API", "测试", "REST"], clicks: 1900 },
  { title: "Swagger", url: "https://swagger.io", description: "API 文档和设计工具", categorySlug: "dev-tools", tags: ["API", "文档", "OpenAPI"], clicks: 2100 },
  { title: "Jest", url: "https://jestjs.io", description: "Facebook 推出的 JavaScript 测试框架", categorySlug: "dev-tools", tags: ["测试", "JavaScript", "Facebook"], clicks: 2500 },
  { title: "Cypress", url: "https://www.cypress.io", description: "现代前端端到端测试框架", categorySlug: "dev-tools", tags: ["测试", "E2E", "前端"], clicks: 2000 },
  { title: "Webpack", url: "https://webpack.js.org", description: "JavaScript 模块打包工具", categorySlug: "dev-tools", tags: ["打包", "构建工具", "JavaScript"], clicks: 2200 },
  { title: "Vite", url: "https://vitejs.dev", description: "下一代前端构建工具", categorySlug: "dev-tools", tags: ["构建工具", "前端", "快速"], clicks: 2800 },

  // ===== 更多设计资源 =====
  { title: "Framer", url: "https://www.framer.com", description: "交互式设计工具与网站构建平台", categorySlug: "design-resources", tags: ["设计", "交互", "原型"], clicks: 2100 },
  { title: "InVision", url: "https://www.invisionapp.com", description: "数字产品设计协作平台", categorySlug: "design-resources", tags: ["设计", "协作", "原型"], clicks: 1800 },
  { title: "Zeplin", url: "https://zeplin.io", description: "设计稿交付与协作工具", categorySlug: "design-resources", tags: ["设计", "协作", "交付"], clicks: 1500 },
  { title: "Illustrator", url: "https://www.adobe.com/products/illustrator", description: "Adobe 矢量图形设计软件", categorySlug: "design-resources", tags: ["矢量", "Adobe", "设计"], clicks: 2800 },
  { title: "Photoshop", url: "https://www.adobe.com/products/photoshop", description: "Adobe 图像编辑与设计软件", categorySlug: "design-resources", tags: ["图像编辑", "Adobe", "设计"], clicks: 3500 },
  { title: "LottieFiles", url: "https://lottiefiles.com", description: "轻量级动画资源平台", categorySlug: "design-resources", tags: ["动画", "Lottie", "设计"], clicks: 1400 },
  { title: "SVG Repo", url: "https://www.svgrepo.com", description: "免费 SVG 图标和矢量图库", categorySlug: "design-resources", tags: ["SVG", "图标", "免费"], clicks: 1200 },

  // ===== 更多学习教程 =====
  { title: "MIT OpenCourseWare", url: "https://ocw.mit.edu", description: "MIT 开放课程，免费学习名校课程", categorySlug: "learning", tags: ["MIT", "开放课程", "免费"], clicks: 1900 },
  { title: "Stanford Online", url: "https://online.stanford.edu", description: "斯坦福大学在线课程平台", categorySlug: "learning", tags: ["斯坦福", "在线课程", "名校"], clicks: 1600 },
  { title: "The Odin Project", url: "https://www.theodinproject.com", description: "免费全栈 Web 开发课程", categorySlug: "learning", tags: ["Web开发", "全栈", "免费"], clicks: 1800 },
  { title: "Scrimba", url: "https://scrimba.com", description: "交互式前端编程学习平台", categorySlug: "learning", tags: ["前端", "交互", "编程"], clicks: 1300 },
  { title: "CSS-Tricks", url: "https://css-tricks.com", description: "CSS 技巧与前端开发教程", categorySlug: "learning", tags: ["CSS", "前端", "教程"], clicks: 1500 },
  { title: "Smashing Magazine", url: "https://www.smashingmagazine.com", description: "Web 设计与开发专业杂志", categorySlug: "learning", tags: ["Web设计", "开发", "教程"], clicks: 1400 },

  // ===== 更多新闻资讯 =====
  { title: "BBC News", url: "https://www.bbc.com/news", description: "BBC 全球新闻报道", categorySlug: "news", tags: ["新闻", "BBC", "全球"], clicks: 5500 },
  { title: "CNN", url: "https://www.cnn.com", description: "美国有线电视新闻网", categorySlug: "news", tags: ["新闻", "CNN", "美国"], clicks: 4800 },
  { title: "Reuters", url: "https://www.reuters.com", description: "路透社全球新闻通讯社", categorySlug: "news", tags: ["新闻", "通讯社", "全球"], clicks: 4200 },
  { title: "The New York Times", url: "https://www.nytimes.com", description: "纽约时报，美国权威新闻媒体", categorySlug: "news", tags: ["新闻", "纽约时报", "媒体"], clicks: 3500 },

  // ===== 更多视频娱乐 =====
  { title: "HBO Max", url: "https://www.max.com", description: "HBO 流媒体服务，提供优质影视内容", categorySlug: "entertainment", tags: ["流媒体", "HBO", "影视"], clicks: 3200 },
  { title: "Hulu", url: "https://www.hulu.com", description: "美国流媒体服务平台", categorySlug: "entertainment", tags: ["流媒体", "影视", "美国"], clicks: 2800 },
  { title: "Apple TV+", url: "https://tv.apple.com", description: "Apple 原创流媒体服务", categorySlug: "entertainment", tags: ["流媒体", "Apple", "原创"], clicks: 2200 },
  { title: "Amazon Prime Video", url: "https://www.primevideo.com", description: "Amazon 流媒体视频服务", categorySlug: "entertainment", tags: ["流媒体", "Amazon", "视频"], clicks: 3000 },
  { title: "TikTok", url: "https://www.tiktok.com", description: "全球流行的短视频社交平台", categorySlug: "entertainment", tags: ["短视频", "社交", "娱乐"], clicks: 9500 },

  // ===== 更多社交社区 =====
  { title: "Facebook", url: "https://www.facebook.com", description: "全球最大的社交网络平台", categorySlug: "social", tags: ["社交", "Facebook", "Meta"], clicks: 8000 },
  { title: "Instagram", url: "https://www.instagram.com", description: "图片和短视频社交平台", categorySlug: "social", tags: ["社交", "图片", "Meta"], clicks: 7500 },
  { title: "WhatsApp", url: "https://www.whatsapp.com", description: "全球流行的即时通讯应用", categorySlug: "social", tags: ["通讯", "WhatsApp", "Meta"], clicks: 7000 },
  { title: "WeChat", url: "https://www.wechat.com", description: "腾讯旗下即时通讯社交平台", categorySlug: "social", tags: ["通讯", "社交", "腾讯"], clicks: 6500 },
  { title: "Snapchat", url: "https://www.snapchat.com", description: "阅后即焚社交应用", categorySlug: "social", tags: ["社交", "阅后即焚", "照片"], clicks: 4200 },

  // ===== 更多购物电商 =====
  { title: "Walmart", url: "https://www.walmart.com", description: "全球最大的零售连锁店", categorySlug: "shopping", tags: ["零售", "超市", "购物"], clicks: 3800 },
  { title: "Target", url: "https://www.target.com", description: "美国大型零售百货公司", categorySlug: "shopping", tags: ["零售", "百货", "美国"], clicks: 2200 },
  { title: "Rakuten", url: "https://www.rakuten.com", description: "日本最大的电商平台", categorySlug: "shopping", tags: ["电商", "日本", "购物"], clicks: 1800 },
  { title: "Zalando", url: "https://www.zalando.com", description: "欧洲领先的时尚电商平台", categorySlug: "shopping", tags: ["时尚", "电商", "欧洲"], clicks: 1600 },
  { title: "Flipkart", url: "https://www.flipkart.com", description: "印度领先的电商平台", categorySlug: "shopping", tags: ["电商", "印度", "购物"], clicks: 2000 },

  // ===== 更多效率工具 =====
  { title: "Google Calendar", url: "https://calendar.google.com", description: "Google 日历服务，日程管理", categorySlug: "productivity", tags: ["日历", "日程", "Google"], clicks: 4500 },
  { title: "Evernote", url: "https://evernote.com", description: "跨平台笔记应用", categorySlug: "productivity", tags: ["笔记", "跨平台", "效率"], clicks: 2800 },
  { title: "OneNote", url: "https://www.onenote.com", description: "微软数字笔记应用", categorySlug: "productivity", tags: ["笔记", "微软", "免费"], clicks: 2200 },
  { title: "Monday.com", url: "https://monday.com", description: "工作操作系统，团队协作平台", categorySlug: "productivity", tags: ["项目管理", "协作", "工作流"], clicks: 1800 },
  { title: "Basecamp", url: "https://basecamp.com", description: "远程团队项目管理工具", categorySlug: "productivity", tags: ["项目管理", "远程", "协作"], clicks: 1500 },
  { title: "Grammarly", url: "https://www.grammarly.com", description: "AI 写作辅助工具", categorySlug: "productivity", tags: ["写作", "AI", "语法"], clicks: 3200 },
  { title: "Calendly", url: "https://calendly.com", description: "在线日程预约工具", categorySlug: "productivity", tags: ["日程", "预约", "效率"], clicks: 1600 },
  { title: "Loom", url: "https://www.loom.com", description: "视频消息录制与分享工具", categorySlug: "productivity", tags: ["视频", "录制", "异步沟通"], clicks: 1400 },

  // ===== 更多博客论坛 =====
  { title: "Tumblr", url: "https://www.tumblr.com", description: "轻博客社区平台", categorySlug: "blogs", tags: ["博客", "社交", "轻博客"], clicks: 2200 },
  { title: "Wix", url: "https://www.wix.com", description: "拖拽式网站建设平台", categorySlug: "blogs", tags: ["建站", "拖拽", "网站"], clicks: 2400 },
  { title: "Squarespace", url: "https://www.squarespace.com", description: "一站式网站建设与托管平台", categorySlug: "blogs", tags: ["建站", "托管", "设计"], clicks: 1800 },
  { title: "Weebly", url: "https://www.weebly.com", description: "简单易用的网站建设工具", categorySlug: "blogs", tags: ["建站", "简单", "拖拽"], clicks: 1200 },

  // ===== 更多开源项目 =====
  { title: "Apache Kafka", url: "https://kafka.apache.org", description: "分布式事件流平台", categorySlug: "open-source", tags: ["事件流", "分布式", "Apache"], clicks: 2000 },
  { title: "Elasticsearch", url: "https://www.elastic.co", description: "分布式搜索和分析引擎", categorySlug: "open-source", tags: ["搜索", "分析", "分布式"], clicks: 2400 },
  { title: "TypeScript", url: "https://www.typescriptlang.org", description: "JavaScript 的超集，添加了类型系统", categorySlug: "open-source", tags: ["JavaScript", "类型", "微软"], clicks: 4000 },
  { title: "Swift", url: "https://www.swift.org", description: "Apple 推出的现代编程语言", categorySlug: "open-source", tags: ["编程语言", "Apple", "iOS"], clicks: 2600 },
  { title: "Kotlin", url: "https://kotlinlang.org", description: "JetBrains 开发的现代编程语言", categorySlug: "open-source", tags: ["编程语言", "JetBrains", "Android"], clicks: 2200 },
  { title: "Docker", url: "https://www.docker.com", description: "容器化平台，简化应用部署", categorySlug: "open-source", tags: ["容器", "Docker", "部署"], clicks: 3500 },
  { title: "Apache Spark", url: "https://spark.apache.org", description: "大数据处理引擎", categorySlug: "open-source", tags: ["大数据", "处理", "Apache"], clicks: 1800 },
  { title: "Terraform", url: "https://www.terraform.io", description: "基础设施即代码工具", categorySlug: "open-source", tags: ["IaC", "基础设施", "HashiCorp"], clicks: 2000 },

  // ===== 更多 AI 工具 =====
  { title: "Notion AI", url: "https://www.notion.so/product/ai", description: "Notion 内置 AI 写作助手", categorySlug: "ai-tools", tags: ["AI", "写作", "Notion"], clicks: 2200 },
  { title: "Jasper", url: "https://www.jasper.ai", description: "AI 内容创作平台", categorySlug: "ai-tools", tags: ["AI", "写作", "内容"], clicks: 1800 },
  { title: "Copy.ai", url: "https://www.copy.ai", description: "AI 营销文案生成工具", categorySlug: "ai-tools", tags: ["AI", "文案", "营销"], clicks: 1600 },
  { title: "Suno", url: "https://suno.ai", description: "AI 音乐生成工具", categorySlug: "ai-tools", tags: ["AI", "音乐", "生成"], clicks: 1400 },
  { title: "Replit AI", url: "https://replit.com/ai", description: "AI 编程助手，在浏览器中写代码", categorySlug: "ai-tools", tags: ["AI", "编程", "在线IDE"], clicks: 1200 },

  // ===== 更多资源下载 =====
  { title: "Chocolatey", url: "https://chocolatey.org", description: "Windows 包管理器", categorySlug: "downloads", tags: ["Windows", "包管理", "软件"], clicks: 1500 },
  { title: "Homebrew", url: "https://brew.sh", description: "macOS 包管理器", categorySlug: "downloads", tags: ["macOS", "包管理", "软件"], clicks: 2000 },
  { title: "FileHippo", url: "https://filehippo.com", description: "Windows 软件下载站", categorySlug: "downloads", tags: ["Windows", "软件", "下载"], clicks: 1100 },

  // ===== 更多金融理财 =====
  { title: "Robinhood", url: "https://robinhood.com", description: "免佣金股票交易平台", categorySlug: "finance", tags: ["股票", "交易", "免佣金"], clicks: 1800 },
  { title: "Coinbase", url: "https://www.coinbase.com", description: "加密货币交易平台", categorySlug: "finance", tags: ["加密货币", "交易", "比特币"], clicks: 2200 },
  { title: "Binance", url: "https://www.binance.com", description: "全球最大的加密货币交易所", categorySlug: "finance", tags: ["加密货币", "交易所", "区块链"], clicks: 2800 },
  { title: "PayPal", url: "https://www.paypal.com", description: "全球在线支付平台", categorySlug: "finance", tags: ["支付", "在线支付", "金融"], clicks: 3500 },
  { title: "Stripe", url: "https://stripe.com", description: "开发者友好的在线支付处理平台", categorySlug: "finance", tags: ["支付", "开发者", "API"], clicks: 2400 },
  { title: "Wise", url: "https://wise.com", description: "国际汇款服务，真实汇率", categorySlug: "finance", tags: ["汇款", "国际", "汇率"], clicks: 1500 },

  // ===== 更多健康医疗 =====
  { title: "World Health Organization", url: "https://www.who.int", description: "世界卫生组织官方网站", categorySlug: "health", tags: ["WHO", "健康", "全球"], clicks: 2000 },
  { title: "CDC", url: "https://www.cdc.gov", description: "美国疾病控制与预防中心", categorySlug: "health", tags: ["CDC", "疾病", "预防"], clicks: 1600 },
  { title: "NHS", url: "https://www.nhs.uk", description: "英国国家医疗服务体系", categorySlug: "health", tags: ["NHS", "医疗", "英国"], clicks: 1400 },
  { title: "Calm", url: "https://www.calm.com", description: "冥想与睡眠应用", categorySlug: "health", tags: ["冥想", "睡眠", "心理健康"], clicks: 1300 },
  { title: "Fitbit", url: "https://www.fitbit.com", description: "健康与健身追踪设备", categorySlug: "health", tags: ["健身", "追踪", "可穿戴"], clicks: 1200 },

  // ===== 更多云服务 =====
  { title: "Oracle Cloud", url: "https://www.oracle.com/cloud", description: "Oracle 企业级云服务", categorySlug: "cloud", tags: ["云服务", "Oracle", "企业"], clicks: 1600 },
  { title: "IBM Cloud", url: "https://www.ibm.com/cloud", description: "IBM 混合云与 AI 平台", categorySlug: "cloud", tags: ["云服务", "IBM", "AI"], clicks: 1400 },
  { title: "Alibaba Cloud", url: "https://www.alibabacloud.com", description: "阿里巴巴旗下云计算服务", categorySlug: "cloud", tags: ["云服务", "阿里巴巴", "亚太"], clicks: 2200 },
  { title: "Linode", url: "https://www.linode.com", description: "开发者友好的 VPS 云服务", categorySlug: "cloud", tags: ["VPS", "云服务", "开发者"], clicks: 1300 },
  { title: "Hetzner", url: "https://www.hetzner.com", description: "德国高性价比云服务商", categorySlug: "cloud", tags: ["云服务", "德国", "性价比"], clicks: 1100 },

  // ===== 更多其他 =====
  { title: "Gmail", url: "https://mail.google.com", description: "Google 免费电子邮件服务", categorySlug: "others", tags: ["邮箱", "Google", "邮件"], clicks: 9500 },
  { title: "Outlook", url: "https://outlook.live.com", description: "微软免费电子邮件服务", categorySlug: "others", tags: ["邮箱", "微软", "邮件"], clicks: 6000 },
  { title: "Yahoo Mail", url: "https://mail.yahoo.com", description: "Yahoo 免费电子邮件服务", categorySlug: "others", tags: ["邮箱", "Yahoo", "邮件"], clicks: 3500 },
  { title: "Proton Mail", url: "https://proton.me/mail", description: "注重隐私的加密电子邮件服务", categorySlug: "others", tags: ["邮箱", "加密", "隐私"], clicks: 1800 },
  { title: "Zoom", url: "https://zoom.us", description: "视频会议与远程协作平台", categorySlug: "others", tags: ["视频会议", "远程", "协作"], clicks: 5500 },
  { title: "Microsoft Teams", url: "https://www.microsoft.com/microsoft-teams", description: "微软团队协作与视频会议", categorySlug: "others", tags: ["团队协作", "微软", "视频会议"], clicks: 4800 },
  { title: "Google Meet", url: "https://meet.google.com", description: "Google 视频会议服务", categorySlug: "others", tags: ["视频会议", "Google", "远程"], clicks: 4200 },
  { title: "Dropbox", url: "https://www.dropbox.com", description: "云存储与文件同步服务", categorySlug: "others", tags: ["云存储", "文件同步", "协作"], clicks: 3800 },
  { title: "Mega", url: "https://mega.io", description: "加密云存储服务，20GB 免费", categorySlug: "others", tags: ["云存储", "加密", "隐私"], clicks: 1600 },
  { title: "OneDrive", url: "https://onedrive.live.com", description: "微软云存储服务", categorySlug: "others", tags: ["云存储", "微软", "Office"], clicks: 2800 },
  { title: "Adobe Acrobat", url: "https://acrobat.adobe.com", description: "PDF 阅读与编辑工具", categorySlug: "others", tags: ["PDF", "Adobe", "文档"], clicks: 3000 },
  { title: "Office 365", url: "https://www.office.com", description: "微软 Office 在线办公套件", categorySlug: "others", tags: ["办公", "微软", "Office"], clicks: 4500 },
  { title: "Google Docs", url: "https://docs.google.com", description: "Google 在线文档编辑", categorySlug: "others", tags: ["文档", "Google", "协作"], clicks: 4000 },
  { title: "Google Sheets", url: "https://sheets.google.com", description: "Google 在线电子表格", categorySlug: "others", tags: ["电子表格", "Google", "协作"], clicks: 3500 },
  { title: "Google Slides", url: "https://slides.google.com", description: "Google 在线演示文稿", categorySlug: "others", tags: ["演示文稿", "Google", "协作"], clicks: 2800 },
];

async function main() {
  console.log("🌱 Seeding database...");

  // ---- Seed Admin User ----
  const adminEmail = "admin@163.com";
  const adminPassword = "123456";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existingAdmin) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword, role: "ADMIN" },
    });
    console.log("✅ Admin user updated:", adminEmail);
  } else {
    await prisma.user.create({
      data: { name: "Admin", email: adminEmail, password: hashedPassword, role: "ADMIN" },
    });
    console.log("✅ Admin user created:", adminEmail);
  }
  console.log(`   Password: ${adminPassword}`);

  // ---- Seed Categories ----
  console.log("\n📂 Seeding categories...");
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, order: cat.order },
      create: { name: cat.name, slug: cat.slug, icon: cat.icon, order: cat.order },
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`✅ ${categories.length} categories seeded.`);

  // ---- Seed Sample Sites ----
  console.log("\n🌐 Seeding sample sites...");
  const existingCount = await prisma.site.count();
  if (existingCount > 0) {
    await prisma.site.deleteMany();
    console.log(`   Cleared ${existingCount} existing sites.`);
  }

  let seeded = 0;
  for (const site of sampleSites) {
    const categoryId = categoryMap[site.categorySlug];
    if (!categoryId) continue;
    try {
      await prisma.site.upsert({
        where: { url: site.url },
        update: {
          title: site.title,
          description: site.description,
          categoryId,
          tags: site.tags,
          isApproved: true,
          clicks: site.clicks,
        },
        create: {
          title: site.title,
          url: site.url,
          description: site.description,
          categoryId,
          tags: site.tags,
          isApproved: true,
          clicks: site.clicks,
          logo: `https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=64`,
        },
      });
      seeded++;
    } catch (e) {
      console.log(`   Skipped duplicate: ${site.title}`);
    }
  }
  console.log(`✅ ${seeded} sample sites seeded.`);

  // ---- Seed Sample Ad Slots ----
  console.log("\n📢 Seeding ad slots...");
  const existingAds = await prisma.adSlot.count();
  if (existingAds === 0) {
    const adSlots = [
      { name: "侧边栏广告位", description: "首页右侧边栏广告", position: "SIDEBAR" as const, type: "CUSTOM" as const },
      { name: "顶部横幅广告", description: "首页顶部横幅", position: "TOP_BANNER" as const, type: "GOOGLE_AD" as const },
      { name: "页脚广告", description: "全站页脚广告", position: "FOOTER" as const, type: "GOOGLE_AD" as const },
      { name: "内容区广告", description: "分类页内容区广告", position: "IN_CONTENT" as const, type: "CUSTOM" as const },
    ];
    for (const ad of adSlots) {
      await prisma.adSlot.create({ data: ad });
    }
    console.log(`✅ ${adSlots.length} ad slots seeded.`);
  } else {
    console.log(`   Skipped - ${existingAds} ads already exist.`);
  }

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });