<template>
  <div class="app-container">
    <el-row type="flex" justify="end">
      <el-col :span="1" style="margin-bottom: 20px;">
        <el-button type="primary">刷新内存</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border :show-header="false" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="address">
        <template slot-scope="scope">
          <span>{{scope.row.ConfigName}}</span>
          <div class="selectBox">
            <el-select v-model="scope.row.ConfigContent" placeholder="请选择">
              <el-option
                v-for="item in selects.SystemConfig"
                :key="item.ClassCode"
                :label="item.ClassName"
                :value="item.ClassCode"
              ></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>

      <el-table-column label width="80">
        <template slot-scope="scope">
          <el-button type="primary" @click="ConfigUplConfig(scope.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ConfigGetConfig, ConfigUplConfig } from '@/api/system'
export default {
  components: {},
  data() {
    return {
      selects: {
        SystemConfig: []
      },
      tableData: []
    }
  },
  mounted() {
    this.initTable()
    this.initSelect()
  },
  methods: {
    async initSelect() {
      this.selects.SystemConfig = await this.$store.dispatch(
        'select/GetSelect',
        'SystemConfig'
      )
    },
    initTable(rows) {
      ConfigGetConfig().then(res => {
        this.tableData = res
      })
    },
    ConfigUplConfig(rows) {
      ConfigUplConfig(rows).then(res => {
        this.$message('保存成功')
      })
    }
  }
}
</script>

<style scoped>
.selectBox {
  width: 200px;
  display: inline-block;
}
</style>

