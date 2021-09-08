<template>
  <el-dialog  :append-to-body='true' :visible="visible" :title="Title" width="850px" :before-close="handleClose">
    <div class="flex">
      <div class="leftContern">
        <div class="commonRow">
          <div class="label">姓&emsp;&emsp;名：</div>
          <div class="value" style="word-break: break-all" :title="form.name">
            {{ form.name }}
          </div>
        </div>
        <div class="commonRow">
          <div class="label">出生日期：</div>
          <div class="value">{{ form.birthday | date }}</div>
        </div>
        <div class="commonRow">
          <div class="label">性&emsp;&emsp;别：</div>
          <div class="value">{{ sexMap[form.sex] }}</div>
        </div>
        <div class="commonRow">
          <div class="label">国&emsp;&emsp;籍：</div>
          <div class="value" :title="form.country">{{ form.country }}</div>
        </div>
        <div class="commonRow">
          <div class="label">籍&emsp;&emsp;贯：</div>
          <div class="value" :title="form.homeTown">{{ form.homeTown }}</div>
        </div>
        <div class="commonRow">
          <div class="label">电&emsp;&emsp;话：</div>
          <div class="value">{{ form.phone }}</div>
        </div>
        <div class="commonRow">
          <div class="label">证件类型：</div>
          <div class="value">{{ form.cardType }}</div>
        </div>
        <!-- <div class="commonRow" v-if="form.cardType == '其他'">
          <div class="label">证件类型：</div>
          <div class="value">{{ form.cardNo }}</div>
        </div> -->
        <div class="commonRow">
          <div class="label">证件号码：</div>
          <div class="value" :title="form.cardNo">{{ form.cardNo }}</div>
        </div>

        <div class="commonRow">
          <div class="label">工作单位：</div>
          <div class="value" :title="form.jobAddress">
            {{ form.jobAddress }}
          </div>
        </div>

        <div class="commonRow">
          <div class="label">住&emsp;&emsp;址：</div>
          <div class="value" :title="form.address">{{ form.address }}</div>
        </div>
        <div class="commonRow">
          <div class="label">备&emsp;&emsp;注：</div>
          <div style="width: 80%;">{{ form.remark || form.note }}</div>
        </div>
      </div>
      <div class="rightContern">
        <div class="imgRow">
          <div class="portraitLabel">照片：</div>
          <div class="commonPicWrapper" style="border: 1px solid rgb(216, 216, 216);">
            <img class="pic" :src="form.faceUrl || form.face" />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  components: {},
  props: ["visible", "title", "form"],
  watch: {
    visible(val) {
      if (this.visible) {
        this.Title = this.title
      }
    },
  },
  data() {
    return {
      height_w: window.innerHeight,
      width_w: window.innerWidth,
      Title: '人像详情',
      sexMap: {
        1: "男",
        2: "女",
        3: "不详",
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
.leftContern {
  width: 50%;
}
.rightContern {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.imgRow {
  margin-bottom: 15px;
}
.commonRow {
  display: flex;
  margin-bottom: 15px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 13px;
  background: #f8f8f8;
  line-height: 40px;
  color: #666;
  > .label {
    width: 80px;
    text-align: right;
    font-weight: 600;
  }
  > .value {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.portraitLabel {
  margin-bottom: 10px;
}
.commonPicWrapper {
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  .pic {
    max-width: 300px;
    max-height: 300px;
    width: auto !important;
    height: auto !important;
  }
}
::v-deep {
  .el-dialog__header {
    border:0;
  }
  
}
</style>