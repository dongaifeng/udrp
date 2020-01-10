<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <template>
        <!-- 换肤 -->
        <!-- <el-tooltip content="主题" effect="dark" placement="bottom">
          <theme-picker class="right-menu-item hover-effect" @change="themeChange" />
        </el-tooltip> -->

        <el-tooltip content="修改密码" effect="dark" placement="bottom"  >
          <div class="right-menu-item hover-effect" @click="dialogUpdatePwd = true">
             <svg-icon :iconClass="'lock'" />
            修改密码</div>
        </el-tooltip>

        <el-tooltip content="退出登录" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect" @click="logout">
             <svg-icon :iconClass="'switch'" />
            退出登录</div>
        </el-tooltip>

      </template>

      <!-- 头像 -->
      <el-dropdown v-if='false' class="avatar-container right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
          <!-- 添加用名名称 -->
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span class="avatar-name">{{ name || 'no name' }}</span>
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>

        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>返回首页</el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="dialogUpdatePwd = true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 修改密码窗口 -->
    <el-dialog title="修改密码" :visible.sync="dialogUpdatePwd" width="30%" append-to-body>
      <el-form ref="refUpdatePwd" :model="formUpdatePwd" :rules="rules">
        <el-form-item label="原密码" prop="pwd">
          <el-input v-model="formUpdatePwd.pwd" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newpwd">
          <el-input v-model="formUpdatePwd.newpwd" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="rpnewpwd">
          <el-input v-model="formUpdatePwd.rpnewpwd" autocomplete="off" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdatePwd = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdatePwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ThemePicker from '@/components/ThemePicker'
import { apiUpdatePwd } from '@/api/user'
import { validatePassword } from '@/utils/validate'

export default {
  components: {
    // Breadcrumb,
    Hamburger
    // ThemePicker
  },
  data() {
    const validateRpNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formUpdatePwd.newpwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogUpdatePwd: false,
      formUpdatePwd: {
        pwd: '',
        newpwd: '',
        rpnewpwd: ''
      },
      rules: {
        pwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newpwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePassword(), trigger: 'blur' }
        ],
        rpnewpwd: [
          { validator: validateRpNewPwd, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // window.location.reload()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // updatePwd() {
    //   this.dialogUpdatePwd = true
    // },
    submitUpdatePwd() {
      this.$refs.refUpdatePwd.validate((valid) => {
        if (valid) {
          apiUpdatePwd(this.formUpdatePwd).then(res => {
            this.dialogUpdatePwd = false
          })
        }
      })
    },

    // 主题点击
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(#3a8ac9, #235b94);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    color: #fff !important;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 14px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 10px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .avatar-name {
          cursor: pointer;
          position: relative;
          right: -4px;
          top: -13px;
          font-size: 16px;
          color: #fff;
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
