<template>
  <div>
    <el-dialog
      title="人脸特征信息"
      :visible="show"
      :width="`${(800 / width_w) * 100}%`"
      :before-close="handleClose"
    >
      <div class="personDetail title-list"  >
        <h2 class="title">» 图片信息：</h2>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="commonRow">
            <div class="label">性别：</div>
            <div class="value" :title="form.gender == 2?'男':'女'">
              {{ form.gender == 2?'男':'女'}}
            </div>
          </div>
        </el-col>
          <el-col :span="12" >
              <div class="commonRow">
              <div class="label">年龄：</div>
              <div class="value" :title="form.age">
                {{ form.age }}
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="commonRow">
            <div class="label">图片质量：</div>
            <div class="value" :title="form.faceBlur">
              {{ form.faceBlur }}
            </div>
          </div>
        </el-col>
          <el-col :span="12" v-if="form.angle" >
              <div class="commonRow">
              <div class="label">俯仰角度：</div>
              <div class="value" :title="form.angle.pitch">
                {{ form.angle.pitch}}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="personDetail title-list" v-if="form.occlusion">
        <h2 class="title">» 遮挡比例：</h2>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="commonRow">
              <div class="label">左眼：</div>
              <div class="value" >
                {{ form.occlusion.left_eye }}
              </div>
            </div>
          </el-col>
          <el-col :span="12" >
            <div class="commonRow">
              <div class="label">右眼：</div>
              <div class="value" >
                {{ form.occlusion.right_eye}}
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="commonRow">
              <div class="label">鼻子：</div>
              <div class="value" >
                {{ form.occlusion.nose   }}
              </div>
            </div>
          </el-col>
          <el-col :span="12" >
            <div class="commonRow">
              <div class="label">嘴巴：</div>
              <div class="value" >
                {{ form.occlusion.mouth}}
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="commonRow">
              <div class="label">左脸颊：</div>
              <div class="value" >
                {{ form.occlusion.left_cheek   }}
              </div>
            </div>
          </el-col>
          <el-col :span="12" >
            <div class="commonRow">
              <div class="label">右脸颊：</div>
              <div class="value" >
                {{ form.occlusion.right_cheek}}
              </div>
            </div>
          </el-col>
           <el-col :span="12" >
            <div class="commonRow">
              <div class="label">下巴：</div>
              <div class="value" >
                {{  form.occlusion.chin_contour}}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- <div >
        <div class="flex mg-l-20">
          <p class="angle-con">图片质量：<span>{{ form.faceBlur }}</span></p>
          <p v-if="form.angle" class="angle-con">俯仰角度：<span>{{ form.angle.pitch  }}</span></p>
        </div>
        <div class="face-score" v-if="form.occlusion">
          <p class="face-title">遮挡比例</p>
          <div class="flex">
            <p>左眼：<span>{{ form.occlusion.left_eye }}</span></p>
            <p>右眼：<span>{{ form.occlusion.right_eye }}</span></p>
          </div>
          <div class="flex">
            <p>鼻子：<span>{{ form.occlusion.nose }}</span></p>
            <p>嘴巴：<span>{{ form.occlusion.mouth }}</span></p>
          </div>
          <div class="flex">
            <p>左脸颊：<span>{{ form.occlusion.left_cheek }}</span></p>
            <p>右脸颊：<span>{{ form.occlusion.right_cheek }}</span></p>
          </div>
          <div class="flex">
            <p>下巴：<span>{{ form.occlusion.chin_contour }}</span></p>
            <p v-if="form.angle">摄像机俯仰角度：<span>{{form.angle.pitch }}</span></p>
          </div>
        </div>
      </div> -->
    </el-dialog>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @(Prop({ default: false })!) show: boolean;
  @Prop() form: object;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  handleClose() {
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.face-title {
  font-size: 14px;
  margin: 10px 0 10px;
}
.face-score {
  .flex {
    margin-bottom: 10px;
    margin-left:20px;
    p {
      width: 50%;
    }
  }
}
.angle-con{
  width: 50%;
}
.mg-l-20{
  margin-left:20px;
}
.title-list {
    .title {
      // margin-left: 10px;
      margin-bottom: 15px;
      margin-bottom: 5px;
      display: flex;
      font-size: 12px;
      color: #606266;
    }
  }
  // .cameraDetail {
  // margin-top: 15px;
  // }
  .commonRow {
    display: flex;
    margin-bottom: 5px;
    font-size: 12px;
    color: #333;
    background: #f8f8f8;
    line-height: 34px;
    padding-left: 6px;
    padding-right: 6px;
    > .label {
      // width: 100px;
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
</style>