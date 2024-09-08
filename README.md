# 简介
![image](./app/src/assets/logo.png)<br/>
🔥 Vue3 + Express + Mysql 前后端分离的论坛系统。

## 预览
![image](./app/src/assets/screenshots.gif)

## 技术栈
* 前端：Vue3 + vite + vue-router + pinia + Element-Plus + md-editor-v3
* 后端：Node + express + mysql

## 快速开始
```javascript 
1.克隆项目
  git clone https://github.com/9-Andrew/JueJin.git
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
登录账号root，密码root

## 目标功能
- [X] 注册、登录(JWT)
- [X] 文章列表展示
- [X] 文章详情
- [X] 搜索模块
- [X] 文章的发表和更新
- [X] 标签页
- [ ] 评论模块
- [ ] 个人中心
- [X] 支持 markdown
- [X] 第三方登录授权(github)
- [X] 适配夜间模式


## 项目目录
```
├─README.md
├─server
|   ├─app.js
|   ├─config.js
|   ├─juejin.sql
|   ├─package-lock.json
|   ├─package.json
|   ├─uploadConfig.js
|   ├─routes_handler
|   |       ├─article.js
|   |       ├─editor.js
|   |       ├─interaction.js
|   |       ├─search.js
|   |       ├─user.js
|   |       └userinfo.js
|   ├─routes
|   |   ├─article.js
|   |   ├─editor.js
|   |   ├─interaction.js
|   |   ├─search.js
|   |   ├─user.js
|   |   └userinfo.js
|   ├─db
|   | └index.js
├─app
|  ├─.env
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
|  |  |   ├─user
|  |  |   ├─TagArticle
|  |  |   ├─setting
|  |  |   ├─search
|  |  |   ├─layout
|  |  |   |   ├─LoginDialog
|  |  |   ├─forum
|  |  |   ├─editor
|  |  |   ├─detail
|  |  |   |   ├─comment
|  |  |   ├─404
|  |  ├─utils
|  |  |   └request.js
|  |  ├─store
|  |  |   ├─search.js
|  |  |   ├─settings.js
|  |  |   └user.js
|  |  ├─router
|  |  |   └index.js
|  |  ├─components
|  |  |     ├─index.js
|  |  |     ├─UserItem
|  |  |     ├─SvgIcon
|  |  |     ├─CustomedAvatar
|  |  |     ├─ArticleItem
|  |  ├─api
|  |  |  ├─article.js
|  |  |  ├─editor.js
|  |  |  ├─interaction.js
|  |  |  ├─search.js
|  |  |  ├─user.js
|  |  |  └userinfo.js
```

## 最后
如果觉得我的项目还不错的话 👏，就给个 star ⭐ 鼓励一下吧~
