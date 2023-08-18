<template>
  <div class="container">
    <div class="main">
      <div class="content">
        <h1 class="article_title">{{ articleInfo.title }}</h1>
        <div class="author_info_wrapper">
          <CustomedAvatar :userInfo="articleInfo"></CustomedAvatar>
          <div class="author_info">
            <div class="author_name">{{ articleInfo.nickname || articleInfo.username }}</div>
            <div class="meta_info">
              {{ proxy.$moment(articleInfo.create_time).format('YYYY年MM月DD日 HH:mm')
              }}<span>·</span>阅读 {{ articleInfo.view_num }}
            </div>
          </div>
        </div>
        <div class="article_body">
          <MdPreview :editorId="id" :modelValue="articleInfo.content" :showCodeRowNumber="true"
            @onGetCatalog="onGetCatalog" />
        </div>
        <div class="article_end">
          <span class="tag_title">分类:</span>
          <el-tag type="info" size="large" effect="light"> {{ articleInfo.article_type }} </el-tag>
          <span class="separate"></span>
          <span class="tag_title">标签:</span>
          <el-tag v-for="t in tags" :key="t.tag_id" size="large" effect="light" class="el-tag--default">{{ t.tag_name }}
          </el-tag>
        </div>
      </div>
      <div v-show="!isImmerse" class="comment">评论</div>
    </div>
    <div class="sidebar">
      <div v-show="!isImmerse" class="author_info">
        <div class="author_info_wrapper">
          <CustomedAvatar :userInfo="articleInfo"></CustomedAvatar>
          <div class="author_name">{{ articleInfo.nickname || articleInfo.username }}</div>
        </div>
        <div class="operate_btn">
          <el-button type="primary">关注</el-button>
          <el-button type="default">私信</el-button>
        </div>
      </div>
      <div v-if="isShowCatalog" class="article_catalog" :class="{ fixed: isFixed }" ref="catalog">
        <div class="title_box">
          <div class="catalog_title">目录</div>
        </div>
        <MdCatalog :editorId="id" :scrollElement="scrollElement" />
      </div>
    </div>
  </div>
  <div class="article_suspend_panel">
    <el-badge v-show="!isImmerse" type="info" :value="articleInfo.like_num" :max="99999">
      <div class="circle">
        <SvgIcon name="dianzan1"></SvgIcon>
      </div>
    </el-badge>
    <el-badge v-show="!isImmerse" type="info" value="0">
      <div class="circle">
        <SvgIcon name="pinglun1"></SvgIcon>
      </div>
    </el-badge>
    <el-badge v-show="!isImmerse" type="info" value="0">
      <div class="circle">
        <SvgIcon name="shoucang"></SvgIcon>
      </div>
    </el-badge>
    <el-badge v-show="!isImmerse" type="info">
      <div class="circle">
        <SvgIcon name="fenxiang"></SvgIcon>
      </div>
    </el-badge>
    <el-badge v-show="!isImmerse"> <el-divider></el-divider></el-badge>
    <el-badge type="info">
      <div class="circle" @click="isImmerse = !isImmerse">
        <SvgIcon name="jujiao1" class="icon jujiao" :class="{ focus: isImmerse }"></SvgIcon>
      </div>
    </el-badge>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleDetail, getArticleTags } from '@/api/article.js'
import { MdPreview, MdCatalog } from 'md-editor-v3'
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css'
const id = 'preview-only'
const scrollElement = document.documentElement

// TODO 点赞功能
let articleInfo = reactive({})
let tags = reactive([])
const route = useRoute()
const isFixed = ref(false)
const { proxy } = getCurrentInstance()
const isImmerse = ref(false)
const isShowCatalog = ref(false)
let handleScroll = proxy.$throttle(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  isFixed.value = scrollTop > 130
})
function onGetCatalog(list) {
  isShowCatalog.value = list.length > 0
}

onMounted(async () => {
  let result = await getArticleDetail(route.params.id)
  Object.assign(articleInfo, result.data)
  let tagResult = await getArticleTags(route.params.id)
  tagResult.data && tags.push(...tagResult.data)
  window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="less" scoped>
.container {
  width: 1300px;
  margin: auto;
  display: flex;
  justify-content: space-around;

  .main {
    width: 1000px;

    .content {
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

            span {
              padding: 10px;
            }
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

        .el-tag--info {
          color: #515767;
        }

        .el-tag--default {
          color: var(--theme-color);
        }
      }
    }

    .comment {
      margin-top: 20px;
      padding: 32px;
      background-color: #fff;
      border-radius: var(--box-radius);
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

    .article_catalog {
      border-radius: var(--box-radius);
      background-color: #fff;

      .title_box {
        padding: 0 20px;

        .catalog_title {
          padding: 16px 0px;
          border-bottom: 1px solid #e4e6eb;
        }
      }

      .md-editor-catalog {
        padding: 12px;
        margin-right: 5px;
        overflow: auto;
        max-height: 600px;

        &::-webkit-scrollbar {
          width: 6px;
          /* 滚动条宽度 */
        }

        &::-webkit-scrollbar-track {
          background-color: #fff;
          /* 滚动条背景颜色 */
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #e4e6eb;
          /* 滚动条滑块颜色 */
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background-color: #e4e6eb;
          /* 滚动条滑块悬停时颜色 */
        }
      }
    }

    .fixed {
      position: fixed;
      top: 75px;
      width: 250px;
    }
  }
}

.article_suspend_panel {
  position: fixed;
  top: 150px;
  display: flex;
  flex-direction: column;

  .el-badge {
    cursor: pointer;
    width: 100%;
    margin-bottom: 20px;

    &:hover .circle {
      .icon {
        fill: #515767;
      }

      .jujiao {
        stroke: #515767;
      }
    }

    .circle {
      width: 48px;
      height: 48px;
      border-radius: 50% 50%;
      box-shadow: 0 2px 8px rgba(50, 50, 50, 0.04);
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translate(14%, -14%);

      .icon {
        width: 20px;
        height: 20px;
        fill: #8a919f;
      }

      .jujiao {
        stroke: #8a919f;
        stroke-width: 70px;
      }

      .focus {
        fill: var(--theme-color) !important;
        stroke: var(--theme-color) !important;
      }
    }

    :deep(.el-badge__content--info) {
      background-color: #c2c8d1;
    }

    .el-divider {
      transform: translate(14%, -14%);
      margin: 0;
      margin-bottom: 8px;
    }
  }
}</style>
