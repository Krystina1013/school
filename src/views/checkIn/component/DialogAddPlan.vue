<template>
  <div>
    <el-dialog title="添加" class="newDialog" :visible.sync="dialogAddPlanSync" width="670px" :before-close="closeDialogPlan" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="名称：" prop="explain">
          <el-input v-model.trim="ruleForm.explain" :maxlength="10" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="日期：" prop="date">
          <el-date-picker style="width:100%" v-model="ruleForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否工作日：" required>
          <el-radio v-model="ruleForm.isWork" :label="true">工作日</el-radio>
          <el-radio v-model="ruleForm.isWork" :label="false">假日</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialogPlan">取 消</el-button>
        <el-button size="small" type="primary" style="margin-left:18px" @click="submit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { attendanceGroupPlan } from "@/api/peopleApi";
@Component({})
export default class DialogAddPlan extends Vue {
  @Prop({ default: false }) dialogAddPlanSync: any;
  @Prop({ default: "" }) id: any;
  ruleForm: any = {
    explain: "",
    date: "",
    isWork: true,
  };
  loading: boolean = false;
  rules: any = {
    explain: [{ required: true, message: "请输入名称", trigger: "blur" }],
    date: [{ required: true, message: "请选择日期", trigger: "change" }],
  };
  closeDialogPlan() {
    this.ruleForm = {
      explain: "",
      date: "",
      isWork: true,
    };
    this.$emit("close");
  }
  submit() {
    this.$refs["ruleForm"]["validate"]((valid) => {
      if (valid) {
        this.loading = true;
        let param = { ...this.ruleForm };
        param.groupId = this.id;
        attendanceGroupPlan(param)
          .then((res) => {
            this.loading = false;
            this.$emit("submit");
            this.$refs["ruleForm"]["resetFields"]();
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
</style>