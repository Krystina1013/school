<template>
  <div>
    <el-table :data="data" stripe border height="calc(100vh - 350px)" v-loading="tableLoading">
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="img" align="center" label="人脸">
        <template slot-scope="scope">
          <img v-if="scope.row.face" class="capture-img" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.face)" :src="scope.row.face" alt />
          <span v-else> -- </span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" align="center" />
      <el-table-column prop="userType" label="类型" align="center" />
      <el-table-column prop="attendanceGroupName" label="分组" align="center" :show-overflow-tooltip="true"/>
    </el-table>
    <BigImg :centerDialogVisible="imgVisible" bigTitle="人脸" :bigImg="bigImg" />
  </div>
</template>

<script>
import BigImg from "@/components/BigImg/index.vue";
export default {
  props: {
    tableData: Array
  },
  components: {BigImg },
  watch: {
    tableData: {
      handler(n, o) {
        this.data = n
      },
      deep: true
    },
  },

  data() {
    return {
      data: [],
      imgVisible: false, // 控制放大图片的visible
      bigImg: "",
      tableLoading: false
      // tableData: []
    }
  }
}
</script>