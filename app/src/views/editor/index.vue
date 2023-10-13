<template>
  <div class="editor-container">
    <div class="editor-header">
      <div class="left-box">
        <input v-model="articleParams.title" type="text" class="custom-input" placeholder="输入文章标题……" maxlength="80"/>
      </div>
      <div class="right-box">
        <div class="text-tip">{{ tip }}</div>
        <el-button type="default">草稿箱</el-button>
        <el-button type="primary" :disabled="articleParams.title?.length == 0 || articleParams.content?.length == 0"
          @click="drawerVisible = true">{{ isPublish ? '发布' : '更新' }}</el-button>
        <CustomedAvatar class="avatar" :userInfo="userStore.userInfo" @click="router.push('/setting')"></CustomedAvatar>
      </div>
    </div>
    <MdEditor v-model="articleParams.content" :toolbarsExclude="toolbarsExclude" :theme="settingsStore.isDark==1?'dark':'light'" autoFocus @onUploadImg="onUploadImg"
      class="editor" />
    <el-drawer :title="`${isPublish ? '发布' : '更新'}文章`" v-model="drawerVisible" direction="rtl" size="25%"
      :destroy-on-close="true" :show-close="false" :wrapperClosable="true">
      <el-form :model="articleParams" ref="form" :rules="rules" label-width="100px" label-suffix="：">
        <el-form-item label="分类" prop="type">
          <el-tag :type="articleParams.typeId == tl.id ? '' : 'info'" v-for=" tl  in  typeList " :key="tl.id"
            @click="articleParams.typeId = tl.id">{{ tl.name }}</el-tag>
        </el-form-item>
        <el-form-item label="添加标签" prop="tag">
          <el-select v-model="articleParams.tagList" placeholder="请搜索添加标签(最多三个)" filterable multiple>
            <el-option v-for=" tl  in  tagList " :key="tl.id" :label="tl.tag_name" :value="tl.id"
              :disabled="articleParams.tagList.length == 3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章封面">
          <el-upload :file-list="articleParams.cover ? [{ url: articleParams.cover }] : []" class="avatar-uploader"
            name="image" :action="`${BASEURL}/api/upload`" list-type="picture-card" :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <el-icon class="avatar-uploader-icon">
              <Plus />
            </el-icon>
            <template #file>
              <div>
                <img class="el-upload-list__item-thumbnail" :src="`${BASEURL}/${articleParams.cover}`" alt="" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete" @click="delete articleParams.cover">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="publish">确认并{{ isPublish ? '发布' : '更新' }}</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, getCurrentInstance } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import axios from 'axios';
import useUserStore from '@/store/user.js';
import useSettingsStore from '@/store/settings.js';
import { getArticleType, getTag, getArticleDetail, getArticleTags } from '@/api/article.js';
import { reqCreateArticle, reqUpdateArticle, reqPublishArticle } from '@/api/editor.js';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';

const articleParams = ref({
  title: '',
  content: '',
  tagList: []
})
const typeList = ref([])
const tagList = ref([])
const toolbarsExclude = [
  'save',
  'fullscreen',
  'github'
]
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const drawerVisible = ref(false)
const BASEURL = computed(() => import.meta.env.VITE_APP_BASEURL)
const route = useRoute()
const router = useRouter()
const isPublish = ref(true)
const tip = ref('文章将自动保存至草稿箱')
const { proxy } = getCurrentInstance()
const form = ref()

const validateType = (_rule, _value, callback) => {
  if (articleParams.value.typeId) {
    callback()
  } else {
    callback(new Error('请选择文章类型'))
  }
}
const validateTag = (_rule, _value, callback) => {
  if (articleParams.value.tagList.length > 0) {
    callback()
  } else {
    callback(new Error('至少选择一个标签'))
  }
}
const rules = { type: { required: true, validator: validateType }, tag: { required: true, validator: validateTag } }
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append('image', file);

        axios.post(`${BASEURL.value}/api/upload`, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );

  callback(res.map((item) => BASEURL.value + '/' + item.data.filePath));
}
const initData = async () => {
  let result = await getArticleType()
  typeList.value = result.data
  let result2 = await getTag()
  tagList.value = result2.data
}
const handleAvatarSuccess = (response) => {
  articleParams.value.cover = response.filePath
}
const beforeAvatarUpload = (rawFile) => {
  const allowedFormats = ['image/jpeg', 'image/png', 'image/gif' ,'image/webp'];
  if (rawFile.type.includes(allowedFormats)) {
    ElMessage.error('封面图片格式只能为png、jpg、gif或webp!!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('封面图片不能超过4MB!')
    return false
  }
  return true
}
const publish = async () => {
  await form.value.validate()
  articleParams.value.userId = userStore.userInfo.id
  let result = isPublish.value ? await reqPublishArticle(articleParams.value) : await reqUpdateArticle(articleParams.value)
  ElMessage.success(result.message)
  router.push('/detail/' + articleParams.value.id)
}
const autoSave = proxy.$debounce(async () => {
  if (articleParams.value.typeId && form.value) {
    form.value.clearValidate('type')
  }
  await reqUpdateArticle({ ...articleParams.value, userId: userStore.userInfo.id })
  tip.value = '保存中…'
  setTimeout(() => {
    tip.value = '保存成功'
  }, 500);
}, 50)

onMounted(async () => {
  initData()
  if (route.params.id) {
    let result = await getArticleDetail(route.params.id)
    if (!result.data) {
      ElMessage.info(result.message)
      router.push('/404')
      return
    }
    let result2 = await getArticleTags(route.params.id)
    let { id, title, content, cover, type_id: typeId } = result.data
    let tagList = []
    result2.data && (tagList = result2.data.map(item => item.tag_id))
    content == null && (content = '')
    Object.assign(articleParams.value, { id, title, content, cover, typeId, tagList })
    isPublish.value = result.data.status != 1
  } else {
    let result = await reqCreateArticle(userStore.userInfo.id)
    articleParams.value.id = result.data
    router.replace('/editor/' + result.data)
  }
  watch(articleParams.value, autoSave)
})

</script>

<style lang="less" scoped>
.custom-input {
  border: none; /* 去掉输入框的边框 */
  background-color: transparent; /* 设置输入框的背景为透明 */
  outline: none; /* 去掉输入框的默认轮廓样式 */
  width: 100%;
  font-size: 24px;
}
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .editor-header {
    display: flex;
    height: 64px;

    .left-box {
      flex-grow: 1;
      font-size: 24px;
      padding: 14px 20px;
    }

    .right-box {
      display: flex;
      align-items: center;

      .text-tip {
        color: #c9cdd4;
        font-size: 14px;
        margin-right: 18px;
      }

      .avatar {
        margin: 0 18px;
      }
    }
  }

  .editor {
    flex-grow: 1;
  }
}

.el-drawer {
  :deep(& .el-drawer__title) {
    font-size: 18px;
    line-height: 40px;
  }

  :deep(& .el-select__tags .el-tag) {
    background-color: #ecf5ff;
    color: #409eff;
    border: none;
    border-radius: 4px;
    margin: 3px;
  }

  .el-select {
    width: 290px;
  }

  .el-tag {
    cursor: pointer;
  }
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>