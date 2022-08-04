<template>
  <div class="main">
    <div class="register-title">Register</div>
    <div class="register-table">
      <n-form
        ref="formRef"
        :model="registerForm"
        :rules="registerRules"
        size="medium"
      >
        <n-form-item path="username">
          <n-input v-model:value="registerForm.username" size="large" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item path="password">
          <n-input v-model:value="registerForm.password" type="password" size="large" placeholder="请输入密码" />
        </n-form-item>
        <n-form-item path="repassword">
          <n-input v-model:value="registerForm.repassword" type="password" size="large" placeholder="请再次输入密码" />
        </n-form-item>
        <n-form-item path="validcode">
          <n-input v-model:value="registerForm.validcode" size="large" placeholder="请输入验证码" />
          <div id="image-code" @click="getImageCode" v-html="imgdata.data"></div>
        </n-form-item>
        <div class="btn">
          <n-form-item>
            <n-button class="btn-register" attr-type="button" @click="handleRegister">注 册</n-button>
          </n-form-item>
        </div>
        <div class="register" @click="handleToLogin">Go to login</div>
      </n-form>
    </div>
  </div>
</template>

<script setup>
import { fetchImageCode, registerUser } from "../../api/login";
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import { useRouter } from "vue-router";
const router = useRouter()

const formRef = ref()

let registerForm = ref({
  username: '',
  password: '',
  repassword: '',
  validcode: ''
})

let imgdata = ref({
  data: null,
  text: null
})

const registerRules = computed(() => {
  return {
    username: [{
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }],
    password: [{
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }],
    repassword: [{
      require: true,
      message: '请再次确认密码',
      trigger: 'blur'
    }],
    validcode: [{
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    }]
  }
})

const getImageCode = async () => {
  const res = await fetchImageCode()
  if(res.code === 0) {
    imgdata.value = res.data
  }
}

const handleRegister = () => {
  // 注册
  console.log(formRef)
  formRef.value?.validate(async (errors) => {
    if(errors) {
      $message.error('请填写完整信息')
    } else {
      const data = {
        username: registerForm.value.username,
        password: registerForm.value.password
      }
      const res = await registerUser(data)
      if(res.code === 0) {
        $message.success('注册成功')
        router.push('/login')
      }
    }
  })
  // return
  // const data = {
  //   username: registerForm.username,
  //   password: registerForm.password
  // }
  // const res = await registerUser(data)
}

const handleToLogin = () => {
  router.push('/login')
}

onBeforeMount(() => {
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

  .register-title {
    font-size: 30px;
    font-family: "Courier New";
  }

  .register-bg {
    width: 100%;
    position: absolute;
  }

  .register-table {
    padding: 30px 60px;
    box-sizing: border-box;
    width: 400px;
    height: 420px;
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

      .btn-register {
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