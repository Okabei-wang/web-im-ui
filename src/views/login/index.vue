<template>
  <div class="main">
    <div class="login-title">Login</div>
    <div class="login-table">
      <n-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        size="medium"
      >
        <n-form-item path="username">
          <n-input v-model:value="loginForm.username" size="large" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item path="password">
          <n-input v-model:value="loginForm.password" type="password" size="large" placeholder="请输入密码" />
        </n-form-item>
        <n-form-item path="validcode">
          <n-input v-model:value="loginForm.validcode" size="large" placeholder="请输入验证码" />
          <div id="image-code" @click="getImageCode" v-html="imgdata.data"></div>
        </n-form-item>
        <div class="btn">
          <n-form-item>
            <n-button class="btn-login" attr-type="button" @click="handleLogin">登 录</n-button>
          </n-form-item>
        </div>
        <div class="register" @click="handleToRegister">Go to register</div>
      </n-form>
    </div>
  </div>
</template>

<script setup>
import { fetchImageCode, loginUser } from "../../api/login";
import { UserStore } from "../../store/modules/user"
import { useRouter } from "vue-router";
import { ref, onBeforeMount, onMounted } from 'vue'
const router = useRouter()

const formRef = ref()
const userStore = UserStore()

let loginForm = ref({
  username: '',
  password: '',
  validcode: ''
})

let imgdata = ref({
  data: null,
  text: null
})

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  },
  validcode: {
    required: true,
    message: '请输入验证码',
    trigger: 'blur'
  }
}

const getImageCode = async () => {
  const res = await fetchImageCode()
  if(res.code === 0) {
    imgdata.value = res.data
  }
}

const handleLogin = async () => {
  // 登录按钮
  formRef.value?.validate(async (errors) => {
    if(errors) {
      $message.error('请填写完整登录信息')
      return
    }
    const data = {
      username: loginForm.value.username,
      password: loginForm.value.password
    }
    const res = await loginUser(data)
    if(res.code === 0) {
      $message.success('登录成功')
      const data = res.data
      // 拿到token存起来
      await userStore.setToken(res.data)
      // 跳转到首页
      router.push('/home')
    }
  })
}

const handleToRegister = async () => {
  // 注册按钮
  router.push('/register')
}

onBeforeMount(() => {
  userStore.setInfo('')
  userStore.setToken('')
  getImageCode()
})
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  text-align: center;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .login-title {
    font-size: 30px;
    font-family: "Courier New";
  }

  .login-bg {
    width: 100%;
    position: absolute;
  }

  .login-table {
    padding: 30px 60px;
    box-sizing: border-box;
    width: 400px;
    height: 340px;
    border-radius: 30px;
    margin-top: 20px;
    background: linear-gradient(
      to right bottom,
      rgba(255,255,255,0.5),
      rgba(255,255,255,0.1)
    );
    backdrop-filter: blur(5px);
    box-shadow: 10px 10px 10px rgba(255, 255, 255, 0.1);

    #image-code {
      width: 100px;
      height: 40px;
      border: 1px solid white
    }

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;

      .btn-login {
        width: 140px;
      }
    }

    .register {
      cursor: pointer;
    }

    :deep(.n-form-item) {
      display: block;
      margin-top: 5px;
    }

    // ::v-deep(.n-form-item-feedback-wrapper) {
    //   display: none;
    // }
  }
  
  
}
</style>