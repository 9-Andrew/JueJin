<template>
  <div class="container">
    <div class="nav">
      <a href.stop="" @click="router.push('/user/' + userInfoStore.userInfo.id)">
        <SvgIcon name="fanhui"></SvgIcon>
        返回个人主页
      </a>
    </div>
    <div class="setting-view">
      <div class="sidebar">
        <ul class="catalog">
          <li v-for="(c, index) in catalog" :key="index" @click="catalogIndex = index"
            :class="{ active: index == catalogIndex }">
            <SvgIcon :name="c.icon"></SvgIcon>{{ c.text }}
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="title">{{ catalog[catalogIndex].text }}</div>
        <div class="personal-profile" v-if="catalogIndex == 0">
          <div class="info-input">
            <el-divider direction="horizontal"></el-divider>
            <div class="item">
              <span class="label">用户 ID </span><input type="text" value="123" disabled>
            </div>
            <el-divider direction="horizontal"></el-divider>
            <div class="item">
              <span class="label">用户昵称</span><input type="text" placeholder="填写你的用户昵称">
            </div>
            <el-divider direction="horizontal"></el-divider>
            <div class="item">
              <span class="label">邮箱</span><input type="text" placeholder="填写你的邮箱">
            </div>
            <el-divider direction="horizontal"></el-divider>
            <div class="item">
              <span class="label"></span> <el-button type="primary">保存修改</el-button>
            </div>
          </div>
          <div class="avatar-input">
            <el-upload ref="uploadRef" class="upload-demo"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :auto-upload="false">
              <template #trigger>
                <div class="avatar">
                  <SvgIcon name="geren2"></SvgIcon>
                  <div class="cover">
                    <SvgIcon name="jiahao"></SvgIcon>
                    <div>点击修改头像</div>
                  </div>
                </div>
              </template>
              <template #tip>
                <div class="el-upload__tip">
                  支持 jpg、png、jpeg 格式大小 5M 以内的图片
                </div>
              </template>
            </el-upload>
          </div>
        </div>
        <div class="account-settings" v-else-if="catalogIndex == 1">
          <el-divider direction="horizontal"></el-divider>
          <div class="item">
            <span class="label">密码 </span><a href="">重置</a>
          </div>
          <el-divider direction="horizontal"></el-divider>
          <div class="item">
            <span class="label">账户注销</span><a href="">注销</a>
          </div>
          <el-divider direction="horizontal"></el-divider>
        </div>
        <div class="general-settings" v-else>
          <el-divider direction="horizontal"></el-divider>
          <div class="sub-title">页面设置</div>
          <p>该设置仅在当前浏览器生效，目前已支持部分核心页面，更多页面适配持续进行中。</p>
          <el-radio-group v-model="settingsStore.isDark" class="radio-group">
            <div class="radio-item" @click="settingsStore.setDark(0)">
              <el-skeleton />
              <div class="radio-btn" :class="{ active: settingsStore.isDark == 0 }"><el-radio :label="0"
                  size="large">浅色模式</el-radio>
              </div>
            </div>
            <div class="radio-item" @click="settingsStore.setDark(1)">
              <el-skeleton dark />
              <div class="radio-btn" :class="{ active: settingsStore.isDark == 1 }"><el-radio :label="1"
                  size="large">深色模式</el-radio>
              </div>
            </div>
            <div class="radio-item" @click="settingsStore.setDark(2)">
              <div class="thumbnail-wrapper" style="display:flex;">
                <el-skeleton />
                <el-skeleton dark />
              </div>
              <div class="radio-btn" :class="{ active: settingsStore.isDark == 2 }"><el-radio :label="2"
                  size="large">跟随系统</el-radio>
              </div>
            </div>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import useUserInfoStore from '@/store/user.js';
import useSettingsStore from '@/store/settings.js';

const router = useRouter()
const userInfoStore = useUserInfoStore()
const settingsStore = useSettingsStore()
const catalogIndex = ref(0)
const catalog = [{ text: '个人资料', icon: 'zhanghu' }, { text: '账户设置', icon: 'geren2' }, { text: '通用设置', icon: 'shezhi' }]

onMounted(() => {
  document.querySelector('.el-main').style.minHeight = "80vh"
})
onBeforeUnmount(() => {
  document.querySelector('.el-main').style.minHeight = "100vh"
})
</script>

<style lang="less" scoped>
.container {
  width: 1100px;
  margin: 0 auto;

  .nav {
    background-color: var(--background-color);
    padding: 10px 22px;
    margin-bottom: 15px;

    a {
      cursor: pointer;
    }
  }

  .setting-view {
    height: 626px;
    display: flex;

    .sidebar {
      background-color: var(--background-color);
      width: 230px;
      margin-right: 24px;
      padding: 8px;

      ul {

        li {
          height: 48px;
          line-height: 48px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 5px;

          &:hover,
          &.active {
            color: var(--theme-color);
            background-color: var(--settings-btn-hover);

            svg {
              fill: var(--theme-color);
            }
          }

          svg {
            margin: 0 12px 0 24px;
          }
        }
      }
    }

    .content {
      background-color: var(--background-color);
      flex-grow: 1;
      padding: 20px;

      .title {
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 15px;
      }

      .personal-profile {
        display: flex;
        justify-content: space-between;

        .info-input {
          width: 60%;

          .item {
            display: flex;
            align-items: center;

            .label {
              margin: 0 30px 0 20px;
              width: 60px;
            }

            input {
              flex-grow: 1;
              margin-right: 25px;
              border: none;
              outline: none;
              /* 使用父元素的字体 */
              font-family: inherit;
              /* 使用父元素的字体大小 */
              font-size: inherit;
              background-color: var(--input-background-color);
              padding: 8px 12px;
              caret-color: red;

              &:focus {
                outline: 1px solid var(--theme-color);
                background-color: transparent;
              }

              &::placeholder {
                color: #bcc0c8;
              }
            }
          }
        }

        .avatar-input {
          width: 20%;
          margin-right: 80px;

          .avatar {
            width: 90px;
            height: 90px;
            background-color: #f3f3f3;
            border-radius: 50% 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;

            &>svg {
              width: 66%;
              height: 80%;
              fill: #caced7;
            }

            .cover {
              opacity: 0;
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50% 50%;
              background-color: rgba(255, 255, 255, .5);
              color: #575b66;
              font-size: 12px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;

              &>svg {
                width: 20px;
                height: 20px;
              }
            }

            &:hover .cover {
              opacity: 1;
            }
          }

        }
      }

      .account-settings {
        overflow: hidden;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 25px;
        }
      }

      .general-settings {
        overflow: hidden;

        p {
          margin: 4px 0 20px;
          font-size: 13px;
          color: #8a919f;
        }

        .radio-group {
          display: flex;
          justify-content: space-between;

          .radio-item {
            width: 240px;
            border-radius: 5px;
            border: 1px solid var(--border-color);
            overflow: hidden;
            cursor: pointer;

            &:hover .radio-btn {
              background-color: var(--settings-btn-hover);
            }

            .radio-btn {
              padding-left: 18px;

              &.active {
                background-color: var(--settings-btn-hover);
              }
            }
          }
        }
      }
    }
  }
}

.el-divider {
  margin: 12px 0;
}

.upload-demo {
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.el-skeleton {
  padding: 16px;

  :deep(.el-skeleton__item) {
    height: 12px;
    background-color: #e4e6eb;

    &:not(.is-first) {
      margin-top: 8px;
    }
  }

  &[dark] {
    background-color: #181818;

    :deep(.el-skeleton__item) {
      background-color: #464646;
    }
  }
}
</style>