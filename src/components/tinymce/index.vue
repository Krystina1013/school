<template>
  <div>
    <editor :id="id" v-model="content" :init="init"></editor>
    <!-- 上传图片 -->
    <el-dialog top="10vh" :close-on-click-modal="false" width="300px" title="上传图片" :visible.sync="uploadFaceVisible">
      <el-upload ref="upload" class="alignLeft avatar-uploader" :action="config.v1 + '/admin/common/upBack'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="
            uploadFaceVisible = false;
            uploadImageUrl = '';
          ">取 消</el-button>
        <el-button type="primary" :loading="upfaceLoading" :disabled="faceDisabled" @click="confirmUploadFace">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import tinymce from "tinymce";
import Editor from "@tinymce/tinymce-vue";

import "tinymce/themes/silver/theme";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
// import "tinymce/plugins/table";
import "tinymce/plugins/lists";
// import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
// import "tinymce/plugins/colorpicker";
// import "tinymce/plugins/textcolor";
// import "tinymce/plugins/media";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/preview";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/hr";
import "tinymce/plugins/paste";
import "tinymce/plugins/codesample";
import "tinymce/icons/default/icons";
// import plugins from "./plugins";
// import toolbar from "./toolbar";

console.log(tinymce);
import config from "@/api/config";
import { getBase64 } from "@/utils/index.js";
import { uploadFile } from "@/api/houseApi";

@Component({ name: "TinymceEditer", components: { Editor } })
export default class extends Vue {
  //设置prop id
  @Prop({ default: "vue-tinymce-" + +new Date() }) id!: string;

  //默认高度
  @Prop({ default: 300 }) height!: number;

  @Prop({ default: "" })
  private value!: string;

  private content: string = "";

  @Watch("value")
  private onChangeValue(newVal: string) {
    this.content = newVal;
  }

  @Watch("content")
  private onChangeContent(newVal: string) {
    this.$emit("input", newVal);
  }
  uploadFaceVisible: boolean = false;
  upfaceLoading: boolean = false;
  faceDisabled: boolean = true;
  config: any = config;
  imageUrl: string = ""; //64上传图片
  imageUrlFile: string = ""; //上传图片

  //富文本框init配置
  private get init() {
    return {
      selector: "#" + this.id, //富文本编辑器的id
      language: "zh_CN", //语言
      language_url: "/tinymce/zh_CN.js", //语言包
      skin_url: "/tinymce/skins/ui/oxide", //编辑器需要一个skin才能正常工作，所以要设置一个skin_url指向之前复制出来的skin文件
      menubar: false, //菜单条
      plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
      toolbar: ['searchreplace fontsizeselect fontselect bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript hr bullist numlist link imageUpload charmap preview anchor table emoticons forecolor backcolor fullscreen'],
      //初始化前执行
      setup: (editor: any) => {
        editor.ui.registry.addButton("imageUpload", {
          tooltip: "插入图片",
          icon: "image",
          onAction: () => {
            this.uploadFaceVisible = true;
            this.imageUrl = "";
          },
        });
      },
      font_formats:
        "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
      fontsize_formats: "11px 12px 14px 16px 18px 24px 36px 48px 64px 72px", //文字大小
      height: this.height, //高度
      branding: true, //水印
      elementpath: false, //底部元素路径
      paste_data_images: true, //允许粘贴图片
      //实例化执行
      init_instance_callback: (editor: any) => {
        this.content && editor.setContent(this.content);

        //this.hasInit = true
        editor.on("NodeChange Change KeyUp SetContent", () => {
          //this.hasChange = true
          this.content = editor.getContent();
        });
      },

      //视频设置回调
      // video_template_callback: (data: any) => {
      //   return `<video width="
      //               ${data.width} " height="${data.height}"
      //               ${data.poster ? 'poster="' + data.poster + '"' : ""}
      //               controls="controls">
      //               <source src="${data.source}"/>
      //           </video>`;
      // },

      //粘贴图片回调
      images_upload_handler: (
        blobInfo: any,
        success: Function,
        failure: Function
      ) => {
        this.handleImgUpload(blobInfo, success, failure);
      },
    };
  }

  private mounted() {
    this.content = this.value;
  }

  //上传图片
  private handleImgUpload(blobInfo: any, success: Function, failure: Function) {
    this.$emit("upload", blobInfo, success, failure);
  }
  confirmUploadFace() {
    if (this.imageUrl == "") {
      this.$message.error("请先添加图片");
      return;
    }
    this.upfaceLoading = true;
    const formData = new FormData();
    formData.append("file", this.imageUrlFile);
    uploadFile(formData).then((res: any) => {
      this.upfaceLoading = false;
      if (res.data.code == 200) {
        let win: any = window;
        this.$emit("imageChanage", res.data.data.key);
        win.tinymce
          .get(this.id)
          .insertContent(`<img class="wscnph" src="${res.data.data.url}" >`);
        this.$message.success("上传成功");
        this.uploadFaceVisible = false;
      }
    });
  }
  beforeAvatarUpload(file) {
    this.imageUrlFile = file.raw;
    getBase64(file.raw).then((res) => {
      this.faceDisabled = false;
      // debugger;
      this.imageUrl = res;
    });
  }
}
</script>

<style lang="scss" scoped>
.tox-tinymce-aux {
  z-index: 3000 !important;
}
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: auto;
    display: block;
  }
  .alignLeft {
    text-align: center;
  }
  .el-button--mini {
    padding: 5px 10px;
  }
  .el-dialog__body {
    padding-top: 10px;
  }
}
</style>
