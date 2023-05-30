<template>
  <div class="container">
    <div class="content">
      <h1 class="article_title">VUE中常用的4种高级方法</h1>
      <div class="author_info_wrapper">
        <el-avatar size="normal" shape="circle">123</el-avatar>
        <div class="author_info">
          <div class="author_name">阿虎二</div>
          <div class="meta_info">2023年04月25日 19:35 · 阅读 26085</div>
        </div>
      </div>
      <div class="article_body">
        provide/inject 是 Vue.js
        中用于跨组件传递数据的一种高级技术，它可以将数据注入到一个组件中，然后让它的所有子孙组件都可以访问到这个数据。通常情况下，我们在父组件中使用
        provide 来提供数据，然后在子孙组件中使用 inject 来注入这个数据。 使用 provide/inject
        的好处是可以让我们在父组件和子孙组件之间传递数据，而无需手动进行繁琐的 props
        传递。它可以让代码更加简洁和易于维护。但需要注意的是，provide/inject
        的数据是非响应式的，这是因为provide/inject是一种更加底层的
        API，它是基于依赖注入的方式来传递数据，而不是通过响应式系统来实现数据的更新和同步。
        具体来说，provide方法提供的数据会被注入到子组件中的inject属性中，但是这些数据不会自动触发子组件的重新渲染，如果provide提供的数据发生了变化，子组件不会自动感知到这些变化并更新。
        如果需要在子组件中使用provide/inject提供的数据，并且希望这些数据能够响应式地更新，可以考虑使用Vue的响应式数据来代替provide/inject。例如，可以将数据定义在父组件中，并通过props将其传递给子组件，子组件再通过$emit来向父组件发送数据更新的事件，从而实现响应式的数据更新。
        下面是一个简单的例子，展示了如何在父组件中提供数据，并在子孙组件中注入这个数据：
      </div>
      <div class="article_end">
        <span class="tag_title">分类:</span>
        <el-tag type="info" size="large" effect="light"> 前端 </el-tag>
        <span class="separate"></span>
        <span class="tag_title">标签:</span>
        <el-tag size="large" effect="light" class="el-tag--default"> 前端 </el-tag>
        <el-tag size="large" effect="light" class="el-tag--default"> 前端 </el-tag>
        <el-tag size="large" effect="light" class="el-tag--default"> 前端 </el-tag>
      </div>
    </div>
    <div class="sidebar">
      <div class="author_info">
        <div class="author_info_wrapper">
          <el-avatar size="normal" shape="circle">123</el-avatar>
          <div class="author_name">阿虎二</div>
        </div>
        <div class="operate_btn">
          <el-button type="primary">关注</el-button>
          <el-button type="default">私信</el-button>
        </div>
      </div>
      <div class="article_content">目录</div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.container {
  width: 1300px;
  margin: auto;
  display: flex;
  justify-content: space-around;
  .content {
    width: 1000px;
    padding: 32px;
    background-color: #fff;
    border-radius: var(--box-radius);
    .article_title {
      font-weight: 700;
      margin-top: 0;
    }
    .author_info_wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .author_info {
        margin-left: 12px;
        .meta_info {
          font-size: 14px;
          color: #8a919f;
        }
      }
    }
    .article_body {
      font: 16px 'Segoe UI', Roboto, Ubun;
      color: #252933;
      line-height: 28px;
    }
    .article_end {
      padding-top: 30px;
      .tag_title {
        margin-right: 8px;
      }
      .el-tag {
        margin-left: 8px;
      }
      .separate {
        width: 32px;
        display: inline-block;
      }
      .el-tag--info{
        color: #515767;
      }
      .el-tag--default{
        color: var(--theme-color);
      }
    }
  }
  .sidebar {
    width: 250px;
    .author_info {
      margin-bottom: 20px;
      background-color: #fff;
      border-radius: var(--box-radius);
      padding: 20px;
      .author_info_wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 17px;
        .author_name {
          margin-left: 12px;
        }
      }
      .operate_btn {
        display: flex;
        justify-content: space-between;
        .el-button {
          flex-grow: 1;
        }
      }
    }
    .article_content {
      border-radius: var(--box-radius);
      background-color: #fff;
    }
  }
}
</style>
