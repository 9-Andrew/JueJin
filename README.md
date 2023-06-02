# 简介
![image](./app/src/assets/logo.png)<br/>
🔥 Vue3 + Express + Mysql 前后端分离的论坛系统

## 预览

## 技术栈
* 前端：Vue3 + vite + vue-router + pinia + Element-Plus
* 后端：Node + express + mysql

## 快速开始
```javascript 
1.克隆项目
  git clone https://github.com/Anjiu1/JueJin.git
  cd JueJin
2.创建数据库
  mysql -u用户名 -p密码 <.\server\juejin.sql
3.启动后端
  cd server
  npm i
  npm start
4.启动前端
  cd ../app
  npm i
  npm run dev
```

## 目标功能
- [X] 注册、登录(JWT)
- [X] 文章列表渲染
- [X] 文章详情
- [ ] 评论功能
- [ ] 支持 markdown
- [ ] 文章的发表
- [ ] 富文本框编辑
- [ ] 个人中心
- [ ] 头像上传

## 项目目录
```
├─LICENSE
├─README.md
├─server
|   ├─app.js
|   ├─config.js
|   ├─juejin.sql
|   ├─package-lock.json
|   ├─package.json
|   ├─routes_handler
|   |       ├─article.js
|   |       ├─user.js
|   |       └userinfo.js
|   ├─routes
|   |   ├─article.js
|   |   ├─user.js
|   |   └userinfo.js
|   ├─public
|   |   ├─images
|   ├─db
|   | └index.js
|   ├─bin
|   |  └www
├─app
|  ├─.eslintrc.cjs
|  ├─.prettierrc.json
|  ├─index.html
|  ├─package-lock.json
|  ├─package.json
|  ├─vite.config.js
|  ├─src
|  |  ├─App.vue
|  |  ├─main.js
|  |  ├─views
|  |  |   ├─404.vue
|  |  |   ├─layout
|  |  |   |   ├─index.vue
|  |  |   |   └LoginDialog.vue
|  |  |   ├─forum
|  |  |   |  ├─ArticleList.vue
|  |  |   |  └index.vue
|  |  ├─utils
|  |  |   └request.js
|  |  ├─stores
|  |  |   └index.js
|  |  ├─router
|  |  |   └index.js
|  |  ├─api
|  |  |  ├─article.js
|  |  |  ├─user.js
|  |  |  └userinfo.js
|  ├─public
|  |   └favicon.ico
```

## 最后
如果觉得我的项目还不错的话 👏，就给个 star ⭐ 鼓励一下吧~
