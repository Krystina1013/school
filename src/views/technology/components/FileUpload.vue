<template>
  <div v-if="show" class="FileUpload" @click="handleClick">
    <input @change="handleChange" hidden ref="file" type="file" name id class="none" accept='image/*' v-if='$util.myBrowser()=="FF"'/>
    <input @change="handleChange" hidden ref="file" type="file" name id class="none" accept='image/jpg,image/jpeg,image/png,image/bmp' v-else/>
    <img v-if="imageUrl" :src="imageUrl" class="image" />
    <img v-else-if="url" :src="url" class="image" />
    <i v-else class="el-icon-plus upload-icon"></i>
  </div>
</template>
<script>
export default {
  name: "FileUpload",
  components: {},
  props: ["url","disableChoosePic"],
  data() {
    return {
      imageUrl:"",
      show:true,
    };
  },
  watch: {
    url(){
      if(this.url==''){
        this.imageUrl='';
      }
    },
    imageUrl(val) {
      if (!val) {
        this.show=false;
        this.$nextTick(() => {
          this.show=true;
        })
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClick() {
      if(this.disableChoosePic){
        return;
      }
      this.$refs.file.click();
    },
    handleChange(e) {
      let arr = ['image/jpg','image/jpeg','image/png','image/bmp']
      if(arr.indexOf(e.target.files[0].type)==-1){
        this.$message.error('请上传jpg、JPEG、png、bmp格式图片！')
        return
      }
      if(this.disableChoosePic){
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.$emit("change",this.imageUrl?this.imageUrl:this.url)
      };
    },
    
  }
};
</script>
<style lang="scss" scoped>
.FileUpload {
  width: 130px;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    border-color: #409eff;
  }
  .image {
    max-width: 100%;
    max-height: 100%;
    width:100%;
    height: 100%;
    // margin-top: -40px;
  }
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    // margin-top: 15px;
  }
}
</style>