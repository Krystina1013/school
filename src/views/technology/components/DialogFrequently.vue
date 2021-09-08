<template>
  <div>
    <common-dialog
      :visible="visible"
      :width="`${(1200 / width_w) * 100}%`"
      @close="handleClose"
      :showCancel="false"
      :showSubmit="false"
      title="详情"
    >
      <template slot="dialogContent">
        <div>
          <ScrollList
            ref="scrollList"
            :height="height_w - 370"
            :canPullUp="canPullUp"
            @scrollToBottom="scrollToBottom"
          >
            <div class="scollList" v-if="list.length > 0">
              <div>
                <div class="list" v-for="(item, i) in list" :key="i">
                  <div class="face" @click="showDialogPersonDetail(item)">
                    <img :src="item.faceUrl | domainName" alt />
                  </div>
                  <p class="flex align-items-center">
                    摄像机：
                    <span
                      v-if="item.cameraName"
                      :title="item.cameraName"
                      class="moreWord"
                      >{{ item.cameraName }}</span
                    >
                    <span v-else class="moreWord">--</span>
                  </p>
                  <p class="flex align-items-center">
                    抓拍地址：
                    <span
                      v-if="item.address"
                      class="moreWord"
                      :title="item.address"
                      >{{ item.address }}</span
                    >
                    <span v-else class="moreWord">--</span>
                  </p>
                  <p>时间：{{ item.recentTime }}</p>
                </div>
              </div>
            </div>
            <p v-else class="empty">未查询到相关记录！</p>
          </ScrollList>
        </div>
      </template>
    </common-dialog>
    <DialogPersonDetail
      :visible="dialogPersonDetail.visible"
      :form="dialogPersonDetail.form"
      @close="dialogPersonDetail.visible = false"
      :frequently='true'
    ></DialogPersonDetail>
  </div>
</template>

<script>
import CommonDialog from './CommonDialog.vue'
import DialogPersonDetail from './DialogPersonDetail.vue'
export default {
  props: ["visible", "data", "date"],
  components: { CommonDialog, DialogPersonDetail},
  data() {
    return {
      height_w: window.innerHeight,
      width_w: window.innerWidth,
      canPullUp: true,
      pagination: {
        show: false,
        total: 0,
        page: 1,
        pageSize: 30,
      },
      total: 0,
      list: [],
    dialogPersonDetail: {
        visible: false,
        form: {}
      }
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this.search();
      }
    },
  },
  methods: {
    handleClose() {
        this.$emit("close")
    },
    scrollToBottom() {
      this.canPullUp = false;
      this.pagination.page++;
      this.search();
    },
    async search() {
      let param = {
        endTime: this.date[1],
        startTime: this.date[0],
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        archivesId: this.data.archivesId,
        cameraId: this.data.cameraId,
      };
      let { code, message, data } = await this.$http.get(
        this.$url.tech.csia_personArchives_passInfo,
        param
      );
      if (code != 200) {
        if (message) {
          this.$message.error(message);
        }
        return;
      }
      console.log(data);
      this.total = data.total;
      if (data.records.length == 0) {
        this.canPullUp = false;
      }
      if (this.pagination.page == 1) {
        this.list = data.records;
        this.$refs.scrollList.scrollToTop();
      } else {
        this.list = [...this.list, ...data.records];
      }
    },
    showDialogPersonDetail(item){
      this.dialogPersonDetail.visible = true;
      let currentRow = { ...item };
      currentRow.frequently = true;
      currentRow.hiddenPerson = false;
      currentRow.cameraMetadataId = item.metaDataId;
      this.dialogPersonDetail.form = currentRow;
      console.log(currentRow)
    }
  },
};
</script>

<style lang='scss' scoped>
.scollList {
  .list {
    display: inline-block;
  }
}

  .list {
    margin: 0 20px 15px 0;
    img,
    .face {
      width: 200px;
      height: 200px;
      object-fit: contain;
      cursor: pointer;
    }
    font-size: 14px;
    line-height: 24px;
    p {
      width: 200px;
    }
    .moreWord {
      width: 130px;
    }
  }

</style>