<template>
  <div>
    <el-dialog v-model="loginDialogVisible" :title="`登录${TITLE}畅享更多权益`" width="24%" center @opened="addEventListener"
      @closed="removeEventListener">
      <el-form>
        <el-form-item>
          <el-input v-model="username" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" placeholder="密 码" type="password" show-password clearable></el-input>
        </el-form-item>
        <el-form-item v-if="!isLogin">
          <el-input v-model="password2" placeholder="确认密码" type="password" show-password clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginOrRegister()">{{ buttonTitle }}</el-button>
        </el-form-item>
        <el-form-item class="loginMethod">
          <span>
            <ul v-show="isLogin">
              <li>其他登录：</li>
              <li>
                <SvgIcon name="github" @click="githubAuth"></SvgIcon>
              </li>
              <li>
                <SvgIcon name="weixin"></SvgIcon>
              </li>
              <li>
                <SvgIcon name="weibo"></SvgIcon>
              </li>
            </ul>
          </span>
          <span @click="isLogin = !isLogin" style="cursor: pointer">立即{{ linkTitle }}</span></el-form-item>
      </el-form>
      <div class="policy">
        注册登录即表示同意 <a href="javascript:void(0)">用户协议</a> 和
        <a href="javascript:void(0)">隐私政策</a>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { login, register } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import useUserstore from '@/store/user.js';

// 对话框显式双向绑定
let props = defineProps(['loginDialogVisible'])
let emits = defineEmits(['update:loginDialogVisible'])
const reset = () => {
  username.value = ''
  password.value = ''
  password2.value = ''
}
let loginDialogVisible = computed({
  get() {
    return props.loginDialogVisible
  },
  set(value) {
    emits('update:loginDialogVisible', value)
    reset()
  }
})
// 初始化数据
const username = ref('')
const password = ref('')
const password2 = ref('')
const isLogin = ref(true)
let buttonTitle = ref(),
  linkTitle = ref()
const store = useUserstore()
watchEffect(() => {
  buttonTitle.value = isLogin.value ? '登录' : '注册'
  linkTitle.value = isLogin.value ? '注册' : '登录'
  reset()
})
let TITLE = computed(() => {
  return import.meta.env.VITE_APP_TITLE
})

const loginOrRegister = async () => {
  let result
  if (isLogin.value) {
    result = await login({
      username: username.value,
      password: password.value
    })
    emits('update:loginDialogVisible', false)
    store.initUserInfo()
  } else {
    result = await register({
      username: username.value,
      password: password.value
    })
    isLogin.value = true
  }
  ElMessage.success(result.message)
}

const enterHandler = (event) => {
  if (event.key == 'Enter') {
    loginOrRegister()
  }
}
const addEventListener = () => {
  window.addEventListener('keyup', enterHandler)
}
const removeEventListener = () => {
  window.removeEventListener('keyup', enterHandler)
}
const githubAuth = async () => {
  window.location.href = `https://github.com/login/oauth/authorize?client_id=3c8ad4de2df49076331b&scope=user:email`
}
</script>

<style lang="less" scoped>
.el-dialog__header {
  border-bottom: 1px solid #f1f2f5;
  margin: 0;
}

.el-button--primary {
  //需要更改的按钮类型 type='primary'
  background: var(--theme-color) !important;
  border-color: var(--theme-color) !important;
  width: 100%;
}

//移入时按钮样式 type='primary'
.el-button--primary:hover {
  background: #0e5bc0 !important;
  border-color: #0e5bc0 !important;
  color: #fff !important;
  opacity: 0.8;
}

:deep(.el-dialog__body) {
  padding: 25px calc(var(--el-dialog-padding-primary) + 70px) 30px !important;
}

.loginMethod {
  :deep(.el-form-item__content) {
    justify-content: space-between;

    ul {
      display: flex;
      padding: 0;

      li {
        display: flex;
        align-items: center;

        svg {
          cursor: pointer;
          margin: 0 3px;
        }
      }
    }
  }
}

.policy {
  text-align: center;
  color: #8a919f;
}
</style>
