# 简介
![image](./app/src/assets/logo.png)<br/>
🔥 Vue+ Express + Mysql 前后端分离的论坛系统

## 快速开始

```javascript 
1.克隆项目
  git clone https://github.com/Anjiu1/JueJin.git
2.创建数据库
3.启动后端
  cd server
  npm i
  npm start
4.启动前端
  cd ../app
  npm i
  npm run dev
```

#### 项目目录
```
├─LICENSE
├─README.md
├─server
|   ├─app.js
|   ├─config.js
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
