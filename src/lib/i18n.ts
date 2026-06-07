// i18n translations for LinkVault - Chinese & English

export type Lang = "zh" | "en";

export type TranslationKey = keyof typeof translations;

const translations = {
  // Navigation
  "nav.home": { zh: "首页", en: "Home" },
  "nav.categories": { zh: "分类", en: "Categories" },
  "nav.browseCategories": { zh: "浏览分类", en: "Browse Categories" },
  "nav.noCategories": { zh: "暂无分类", en: "No categories yet" },
  "nav.login": { zh: "登录", en: "Login" },
  "nav.register": { zh: "注册", en: "Register" },
  "nav.dashboard": { zh: "控制台", en: "Dashboard" },
  "nav.admin": { zh: "管理后台", en: "Admin" },
  "nav.logout": { zh: "退出登录", en: "Logout" },
  "nav.menu": { zh: "菜单", en: "Menu" },
  "nav.search": { zh: "搜索网站...", en: "Search websites..." },
  "nav.searchShortcut": { zh: "搜索", en: "Search" },
  "nav.submitSite": { zh: "提交网站", en: "Submit Site" },

  // Home page
  "home.title": { zh: "发现优质网站", en: "Discover Quality Websites" },
  "home.subtitle": { zh: "LinkVault 汇集了来自社区的精选网站资源", en: "LinkVault collects curated websites from the community" },
  "home.featured": { zh: "热门推荐", en: "Featured" },
  "home.latest": { zh: "最新收录", en: "Latest" },
  "home.categories": { zh: "浏览分类", en: "Browse Categories" },
  "home.viewAll": { zh: "查看全部", en: "View All" },
  "home.empty": { zh: "暂无推荐，快去提交网站吧", en: "No sites yet. Be the first to submit!" },
  "home.submitNow": { zh: "立即提交", en: "Submit Now" },

  // Category page
  "category.sortLatest": { zh: "最新", en: "Latest" },
  "category.sortPopular": { zh: "热门", en: "Popular" },
  "category.sortName": { zh: "名称", en: "Name" },
  "category.noSites": { zh: "该分类暂无网站", en: "No sites in this category" },

  // Site detail
  "site.visit": { zh: "访问网站", en: "Visit Website" },
  "site.similarSites": { zh: "同类推荐", en: "Similar Sites" },
  "site.tags": { zh: "标签", en: "Tags" },
  "site.category": { zh: "分类", en: "Category" },
  "site.clicks": { zh: "次点击", en: " clicks" },
  "site.submittedBy": { zh: "提交者", en: "Submitted by" },
  "site.pending": { zh: "待审核", en: "Pending" },
  "site.approved": { zh: "已通过", en: "Approved" },
  "site.rejected": { zh: "已驳回", en: "Rejected" },

  // Search
  "search.title": { zh: "搜索结果", en: "Search Results" },
  "search.placeholder": { zh: "输入关键词搜索网站", en: "Enter keywords to search" },
  "search.noResults": { zh: "未找到相关网站，尝试其他关键词", en: "No results found. Try different keywords." },
  "search.viewAll": { zh: "查看全部结果", en: "View All Results" },
  "search.noQuery": { zh: "请输入关键词搜索网站", en: "Enter keywords to search for websites" },

  // Auth
  "auth.welcomeBack": { zh: "欢迎回来", en: "Welcome Back" },
  "auth.signIn": { zh: "登录你的账号", en: "Sign in to your account" },
  "auth.createAccount": { zh: "创建账号", en: "Create Account" },
  "auth.joinCommunity": { zh: "加入 LinkVault 社区", en: "Join LinkVault today" },
  "auth.email": { zh: "邮箱", en: "Email" },
  "auth.password": { zh: "密码", en: "Password" },
  "auth.name": { zh: "用户名", en: "Name" },
  "auth.confirmPassword": { zh: "确认密码", en: "Confirm Password" },
  "auth.loginBtn": { zh: "登录", en: "Sign In" },
  "auth.registerBtn": { zh: "注册", en: "Sign Up" },
  "auth.noAccount": { zh: "还没有账号？", en: "Don't have an account?" },
  "auth.hasAccount": { zh: "已有账号？", en: "Already have an account?" },
  "auth.googleLogin": { zh: "使用 Google 登录", en: "Sign in with Google" },
  "auth.githubLogin": { zh: "使用 GitHub 登录", en: "Sign in with GitHub" },
  "auth.orContinue": { zh: "或继续使用", en: "Or continue with" },
  "auth.passwordMismatch": { zh: "两次密码不一致", en: "Passwords do not match" },
  "auth.registerSuccess": { zh: "注册成功", en: "Registration successful" },
  "auth.registerFailed": { zh: "注册失败", en: "Registration failed" },
  "auth.loginFailed": { zh: "登录失败，请检查邮箱和密码", en: "Login failed. Please check your email and password." },
  "auth.pleaseLogin": { zh: "请先登录", en: "Please login first" },

  // Dashboard
  "dashboard.title": { zh: "个人控制台", en: "Dashboard" },
  "dashboard.profile": { zh: "个人资料", en: "Profile" },
  "dashboard.mySubmissions": { zh: "我的提交", en: "My Submissions" },
  "dashboard.myFavorites": { zh: "我的收藏", en: "My Favorites" },
  "dashboard.editProfile": { zh: "编辑资料", en: "Edit Profile" },
  "dashboard.changePassword": { zh: "修改密码", en: "Change Password" },
  "dashboard.currentPassword": { zh: "当前密码", en: "Current Password" },
  "dashboard.newPassword": { zh: "新密码", en: "New Password" },
  "dashboard.save": { zh: "保存", en: "Save" },
  "dashboard.noSubmissions": { zh: "暂无提交的网站", en: "No submissions yet" },
  "dashboard.noFavorites": { zh: "暂无收藏的网站", en: "No favorites yet" },
  "dashboard.submitTab": { zh: "提交网站", en: "Submit Site" },
  "dashboard.submitSite": { zh: "提交网站", en: "Submit a Site" },

  // Site submit
  "submit.title": { zh: "提交网站", en: "Submit Site" },
  "submit.description": { zh: "提交您发现的优质网站，审核通过后即可展示", en: "Submit a quality website for review" },
  "submit.siteTitle": { zh: "网站名称", en: "Site Title" },
  "submit.url": { zh: "网站地址", en: "URL" },
  "submit.siteDescription": { zh: "网站描述", en: "Description" },
  "submit.category": { zh: "分类", en: "Category" },
  "submit.tags": { zh: "标签（逗号分隔）", en: "Tags (comma separated)" },
  "submit.submitBtn": { zh: "提交审核", en: "Submit for Review" },
  "submit.success": { zh: "网站已提交审核", en: "Site submitted for review" },
  "submit.failed": { zh: "提交失败", en: "Submission failed" },
  "submit.selectCategory": { zh: "选择分类", en: "Select a category" },

  // Admin
  "admin.title": { zh: "管理后台", en: "Admin Panel" },
  "admin.dashboard": { zh: "仪表盘", en: "Dashboard" },
  "admin.sites": { zh: "网站管理", en: "Sites" },
  "admin.categories": { zh: "分类管理", en: "Categories" },
  "admin.ads": { zh: "广告管理", en: "Ads" },
  "admin.users": { zh: "用户管理", en: "Users" },
  "admin.totalSites": { zh: "网站总数", en: "Total Sites" },
  "admin.pendingSites": { zh: "待审核", en: "Pending" },
  "admin.totalUsers": { zh: "用户总数", en: "Total Users" },
  "admin.totalClicks": { zh: "总点击量", en: "Total Clicks" },
  "admin.approve": { zh: "通过", en: "Approve" },
  "admin.reject": { zh: "驳回", en: "Reject" },
  "admin.edit": { zh: "编辑", en: "Edit" },
  "admin.delete": { zh: "删除", en: "Delete" },
  "admin.addCategory": { zh: "添加分类", en: "Add Category" },
  "admin.addAd": { zh: "添加广告", en: "Add Ad" },
  "admin.moveUp": { zh: "上移", en: "Move Up" },
  "admin.moveDown": { zh: "下移", en: "Move Down" },
  "admin.confirmDelete": { zh: "确认删除？", en: "Confirm Delete?" },
  "admin.confirmDeleteDesc": { zh: "此操作不可撤销", en: "This action cannot be undone." },
  "admin.accessDenied": { zh: "无权访问", en: "Access Denied" },
  "admin.roleUser": { zh: "用户", en: "User" },
  "admin.roleAdmin": { zh: "管理员", en: "Admin" },
  "admin.toggleRole": { zh: "切换角色", en: "Toggle Role" },
  "admin.siteTitle": { zh: "标题", en: "Title" },
  "admin.url": { zh: "链接", en: "URL" },
  "admin.category": { zh: "分类", en: "Category" },
  "admin.clicks": { zh: "点击", en: "Clicks" },
  "admin.status": { zh: "状态", en: "Status" },
  "admin.actions": { zh: "操作", en: "Actions" },
  "admin.name": { zh: "名称", en: "Name" },
  "admin.slug": { zh: "标识", en: "Slug" },
  "admin.order": { zh: "排序", en: "Order" },
  "admin.position": { zh: "位置", en: "Position" },
  "admin.type": { zh: "类型", en: "Type" },
  "admin.validity": { zh: "有效期", en: "Validity" },
  "admin.email": { zh: "邮箱", en: "Email" },
  "admin.role": { zh: "角色", en: "Role" },
  "admin.joined": { zh: "加入时间", en: "Joined" },
  "admin.all": { zh: "全部", en: "All" },
  "admin.active": { zh: "激活", en: "Active" },
  "admin.inactive": { zh: "停用", en: "Inactive" },
  "admin.unlimited": { zh: "无限制", en: "Unlimited" },
  "admin.manageSites": { zh: "管理网站", en: "Manage Sites" },
  "admin.manageCategories": { zh: "管理分类", en: "Manage Categories" },
  "admin.manageAds": { zh: "管理广告", en: "Manage Ads" },
  "admin.manageUsers": { zh: "管理用户", en: "Manage Users" },
  "admin.logs": { zh: "日志管理", en: "Logs" },
  "admin.quickActions": { zh: "快捷操作", en: "Quick Actions" },
  "admin.addSite": { zh: "添加网站", en: "Add Site" },

  // Footer
  "footer.rights": { zh: "版权所有", en: "All rights reserved" },
  "footer.adSpace": { zh: "广告位招租", en: "Ad Space Available" },

  // General
  "general.loading": { zh: "加载中...", en: "Loading..." },
  "general.error": { zh: "出错了", en: "Something went wrong" },
  "general.retry": { zh: "重试", en: "Try Again" },
  "general.cancel": { zh: "取消", en: "Cancel" },
  "general.save": { zh: "保存", en: "Save" },
  "general.back": { zh: "返回", en: "Back" },
  "general.close": { zh: "关闭", en: "Close" },
  "general.confirm": { zh: "确认", en: "Confirm" },
  "general.notFound": { zh: "页面未找到", en: "Page Not Found" },
  "general.notFoundDesc": { zh: "您访问的页面不存在", en: "The page you're looking for doesn't exist." },
  "general.goHome": { zh: "返回首页", en: "Go Home" },
  "general.language": { zh: "语言", en: "Language" },
  "general.zh": { zh: "中文", en: "中文" },
  "general.en": { zh: "English", en: "English" },
} as const;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? key;
}

export function getTranslation(lang: Lang) {
  return function translate(key: TranslationKey): string {
    return t(key, lang);
  };
}