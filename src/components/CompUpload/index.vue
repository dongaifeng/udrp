<template>
  <div class="upload-btn">

    <el-upload
      class="upload-btn"
      :action="baseUrl + action"
      :data="data"
      name="FormFile"
      :show-file-list="false"
      :on-change="handlePreview"
      :on-success="onSuccess"
      :headers="headers"
    >
      <el-button :loading="loading" type="primary">{{ label }}</el-button>
    </el-upload>

  </div>
</template>

<script>

import { getToken } from '@/utils/auth'
export default {

  props: {
    data: [Object],
    action: [String],
    label: [String],
    onSuccess: [Function]
  },
  data() {
    const baseUrl = process.env.VUE_APP_BASE_API
    const token = getToken()
    return {
      baseUrl,
      headers: { F_token: token },
      loading: false

    }
  },

  methods: {
    handlePreview(file, fileList) {
      this.loading = true
      if (file.status === 'success') {
        this.loading = false
        this.$message('上传成功')
      }
      if (file.status === 'error') {
        this.$message('上传失败')
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-btn{
  display: inline-block;
}
</style>
