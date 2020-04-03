<template>
  <div class="app-container">

    <DictDefinition :member-maintain-visible.sync="memberMaintainVisible" :rows.sync="rows" />

    <!-- 新建 -->
    <el-dialog
      v-if="memberMaintainVisible"
      :close-on-click-modal="false"
      title="成员维护"
      :visible.sync="memberMaintainVisible"
      custom-class="no-padding"
      width="90%"
    >
      <MemberMaintain :rows.sync="rows" />
    </el-dialog>

  </div>
</template>

<script>
import DictDefinition from './components/DictDefinition'
import MemberMaintain from './components/MemberMaintain'
export default {
  components: { DictDefinition, MemberMaintain },
  data() {
    return {
      memberMaintainVisible: false,
      rows: {}
    }
  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
