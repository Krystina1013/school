<template>
  <div>
    <video
      id="single"
      width="100%"
      :height="height ? height : '375'"
      ref="video"
      controls
      class="video-js"
      playsinline
      muted
      disablePictureInPicture
    ></video>
    <!-- <p class="reflv-replay" v-if="!isPc && replay" @click="retry">点击重试</p>
    <p v-if="!isPc && canplay" @click="can">播放</p> -->
  </div>
</template>

<script>
let player, timer,flvTimer;
import flvjs from "flv.js";
import videojs from "video.js";
import "videojs-contrib-hls";
import { liveUrl } from "@/api/dev";
export default {
  name: "Reflv",
  props: ["url", "height", "isPc",'cameraId'],
  data() {
    return {
      flvPlayer: null,
      hls: null,
      replay: false,
      player:null,
      canplay: false,
      interval: null,
      timeOutNum:false,
      outNum: null,
      reconnecTimer: null,
      flvUrl: null,
      hlsUrl:null,
      expireTime: null,
      liveUrlTime: null
    };
  },
  watch: {
    url() {
      
    },
  },
  mounted() {
    
  },
  methods: {
    //  async getToken() {
    //   let param = {
    //     disableLoading: true,
    //   };
    //   let { code, message, data } = await this.$http.post(
    //     this.$url.common.refresh_token,
    //     param
    //   );
    //   if (code != 200) {
    //     this.$message.error(message);
    //     return;
    //   }
    //   localStorage.user = JSON.stringify(data);
    //   this.reconnection();
    // },
    getLiveUrl() {
      liveUrl({ id: this.cameraId }).then((res) => {
        if (res.data.code == 200) {
          let data = res.data.data;
          if(data && data.length>0) {
            data.map(item => {
              if (item.type === "flv") {
                this.flvUrl = item.url;
                this.expireTime = item.expireTime;
                this.liveUrlTime = setTimeout(() => {
                  this.getLiveUrl();
                }, this.expireTime * 1000)
              }
              if(item.type === "hls") {
                this.hlsUrl = item.url;
              }
            })
          }
          
        }else {
          this.$message.error(res.data.message);
        }
        
      });
    },
    play() {
      this.flvUrl = this.url.flvUrl;
      this.hlsUrl = this.url.hlsUrl;
      let that = this;
      // this.liveUrlTime = setInterval(())
      if (this.liveUrlTime) {
        clearTimeout(this.liveUrlTime);
        this.liveUrlTime = null;
      }
      this.getLiveUrl();
      this.$nextTick(() => {
        this.player = document.getElementById("single");
        if (typeof this.flvPlayer !== "undefined") {
          if (this.flvPlayer != null) {
            this.flvPlayer.unload();
            this.flvPlayer.detachMediaElement();
            this.flvPlayer.destroy();
            this.flvPlayer = null;
          }
        }
        if (flvjs.isSupported()) {
          this.flvPlayer = flvjs.createPlayer(
            {
              type: "flv",
              url: this.flvUrl,
              isLive: true,
            },
            {
              // lazyLoadMaxDuration: 3 * 60,
              isLive: true,
              enableStashBuffer: false,
              stashInitialSize: 128, // 减少首桢显示等待时长
              hasVideo: true,
              enableWorker: true,
              autoCleanupSourceBuffer: true, //自动清除缓存
            }
          );
          this.flvPlayer.attachMediaElement(this.player);
          this.flvPlayer.load(); //加载
          this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
            //  alert("flv error");
            this.reconnection();
           
            // errType是 NetworkError时，对应errDetail有：Exception、HttpStatusCodeInvalid、ConnectingTimeout、EarlyEof、UnrecoverableEarlyEof
            // errType是 MediaError时，对应errDetail是MediaMSEError
          });
          this.player.addEventListener("click", function (e) {
            e.preventDefault();
          });
           this.flvPlayer.on(
            flvjs.Events.MEDIA_SOURCE_ENDED,
            (errType, errDetail) => {
              console.log("错误");
              that.reconnection();
            }
          );
          this.flvPlayer.on(
            flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID,
            () => {
              console.log("错误403/404");
              that.reconnection();
            }
          );
          this.flvPlayer.on(flvjs.ErrorTypes.OTHER_ERROR, () => {
            console.log("错误其他");
            that.reconnection();
          });
          this.flvPlayer.on(
            flvjs.Events.MEDIA_SOURCE_CLOSE,
            () => {
              // alert("请刷新页面，重新播放");
              this.reconnection();
            }
          );
          this.flvPlayer.on(
            flvjs.Events.MEDIA_SOURCE_ENDED,
            () => {
              // alert("请刷新页面，重新播放");
              this.reconnection();
            }
          );
              //waiting w
      this.player.addEventListener("waiting", function (e) {
         console.log('waiting')
        // that.reconnection()
      });
      // 9、pause：暂停监听
      this.player.addEventListener("pause", function (e) {
        // that.isPause = true;
        console.log('pause')
        // console.log(e)
      });
      // playing
      this.player.addEventListener("playing", function (e) {
        // that.isPause = false;
        if (that.outNum) {
          that.timeOutNum = false;
          clearTimeout(that.outNum);
          that.outNum = null;
        }
        // that.reconnection();
      });
          this.flvPlayer.on("statistics_info", function (res) {
            // console.log(res);
            // if (that.isPause) {
            //   return;
            // }
            if (that.lastDecodedFrame == 0) {
              that.lastDecodedFrame = res.decodedFrames;
              return;
            }
            if (that.lastDecodedFrame != res.decodedFrames) {
              that.lastDecodedFrame = res.decodedFrames;
            } else {
              that.lastDecodedFrame = 0;

              if (that.flvPlayer) {
                if (!that.timeOutNum) {
                  that.outNum = setTimeout(() => {
                    that.reconnection();
                  }, 3000);
                }
              }
            }
          });
          setTimeout(() => {
            that.timeOutNum = false;
            that.flvPlayer.play();
            // that.flvPlayer.on("error", (err) => {
            //   // console.log("errrrrrr", err);
            //   if (err == "NetworkError") {
            //     // that.reconnecTimer = setInterval(() => {
            //     //   that.getToken();
            //     // }, 5000);
            //   }
            //   // this.$message.error("视频播放失败。");
            // });
          }, 300);


          if(this.interval) {
            clearInterval(this.interval);
          }
          this.interval = null;
          this.playInterval();
          // let that = this;
          // this.interval = setInterval(() => {
          //   if (that.player) {
          //     // player = document.getElementById("single");
          //     let buffered = that.player.buffered;
          //     if (buffered.length > 0) {
          //       let end = buffered.end(0);
          //       if (isfirstyanchi == 0) {
          //         isfirstyanchi = 1;
          //         sourceyanchi = end - that.player.currentTime;
          //         console.log("sourceyanchi:" + sourceyanchi);
          //       }
          //       console.log(end - that.player.currentTime);
          //       if (end - that.player.currentTime > 5) {
          //         console.warn("dayu");
          //         // player.currentTime = end - 10;
          //         this.reloadVideo();
          //         // sourceyanchi = end - player.currentTime;
          //         // console.log("sourceyanchi:" + sourceyanchi);
          //       }
          //     }
          //   }
          // }, 5000);
        } else {
          if (this.hls != null) {
            this.hls = videojs(this.$refs.video);
            this.hls.src({
              src: this.hlsUrl,
              type: "application/x-mpegURL", //在重新添加视频源的时候需要给新的type的值
            });
            this.hls.load(this.hlsUrl);
            this.hls.play(this.hlhlsUrls);
            return;
          }
          let src = this.hlsUrl;
          let that = this;

          this.hls = videojs(
            this.$refs.video,
            {
              controls: false,
              sources: [
                {
                  src,
                  type: "application/x-mpegURL",
                },
              ],
            },
            function () {
              this.play();
              this.on("error", function (err) {
                timer = setTimeout(() => {
                  that.hls = videojs(that.$refs.video);
                  that.hls.src({
                    src: hlsUrl,
                    type: "application/x-mpegURL", //在重新添加视频源的时候需要给新的type的值
                  });
                  that.hls.load(that.hlsUrl);
                  that.hls.play(that.hlsUrl);
                }, 1000);
              });
              this.on("loadedmetadata", function () {
                console.log("加载完成-");
                // clearTimeout(timer);
                if (!that.isPc) {
                  that.canplay = true;
                }
                that.replay = false;
              });
              this.on("loadstart", function () {
                console.log("开始请求数据 ");
              });
              this.on("progress", function () {
                console.log("正在请求数据 ");
              });
              this.on("canplaythrough", function () {
                console.log("视频源数据加载完成");
                clearTimeout(timer);
                that.replay = false;
                that.canplay = false;
              });
              this.on("waiting", function () {
                console.log("等待数据");
              });
              this.on("play", function () {
                console.log("视频开始播放");
              });
              this.on("playing", function () {
                console.log("视频播放中");
              });
              this.on("pause", function () {
                console.log("视频暂停播放", that.isPc);
                if (!that.isPc) {
                  clearTimeout(timer);
                }
                that.replay = true;
                that.canplay = true;
              });
              this.on("ended", function () {
                console.log("视频播放结束");
              });
            }
          );
        }
      });
    },
     playInterval() {
      let that = this;
      flvTimer = setInterval(() => {
        if (
          that.player &&
          that.player.buffered &&
          that.player.buffered.length
        ) {
          let end = that.player.buffered.end(0); //获取当前buffered值
          let diff = end - that.player.currentTime; //获取buffered与currentTime的差值
          if (diff >= 5) {
            //如果差值大于等于0.5 手动跳帧 这里可根据自身需求来定
            that.player.currentTime = that.player.buffered.end(0); //手动跳帧
          }
        }
      }, 5000);
    },
     reconnection() {
      // console.log('重连',end)
      this.reLoading = true;
      let that = this;
      clearInterval(flvTimer);
      if (!this.flvPlayer) {
        this.retryPlay();
        return;
      }
      this.flvPlayer.pause();
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
      this.retryPlay();
    },
    retryPlay() {
      let that = this;
      that.player = null;
      that.flvPlayer = null;
      that.player = document.getElementById('single');
      let url = that.flvUrl;
      console.log("重连", url);
      console.log("播放", that.flvUrl);
      // this.playReflv(that.cameraId);
      that.flvPlayer = flvjs.createPlayer({
        type: "flv",
        url: url,
        isLive: true,
        enableStashBuffer: false,
        stashInitialSize: 128, // 减少首桢显示等待时长
        autoCleanupMaxBackwardDuration: 12, //    当向后缓冲区持续时间超过此值（以秒为单位）时，请对SourceBuffer进行自动清理
        autoCleanupMinBackwardDuration: 8,
        // hasVideo: true,
        hasAudio: false,
        enableWorker: true,
        autoCleanupSourceBuffer: true, //自动清除缓存
      });
      that.flvPlayer.attachMediaElement(that.player);
      that.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
        // this.reloadVideo();
        console.log(errType);
        console.log(errDetail);
        if (errType == "MediaError") {
          console.log(errDetail);
        }
        console.log("333333333333-wk");
        that.reconnection();
        //alert("flv error");
        // errType是 NetworkError时，对应errDetail有：Exception、HttpStatusCodeInvalid、ConnectingTimeout、EarlyEof、UnrecoverableEarlyEof
        // errType是 MediaError时，对应errDetail是MediaMSEError
      });
      that.flvPlayer.on(
        flvjs.Events.MEDIA_SOURCE_ENDED,
        (errType, errDetail) => {
          console.log("错误");
          that.reconnection();
        }
      );
      that.flvPlayer.on(flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID, () => {
        console.log("错误403/404");
        that.reconnection();
      });
      that.flvPlayer.on(flvjs.ErrorTypes.OTHER_ERROR, () => {
        console.log("错误其他");
        that.reconnection();
      });
      // 定帧问题
      this.flvPlayer.on("statistics_info", function (res) {
        // console.log(res);
        // if (that.isPause) {
        //   return;
        // }
        if (that.lastDecodedFrame == 0) {
          that.lastDecodedFrame = res.decodedFrames;
          return;
        }
        if (that.lastDecodedFrame != res.decodedFrames) {
          that.lastDecodedFrame = res.decodedFrames;
        } else {
          that.lastDecodedFrame = 0;
          if (that.flvPlayer) {
            if (!that.timeOutNum) {
              that.outNum = setTimeout(() => {
                that.reconnection();
              }, 3000);
            }
          }
        }
      });
      // ----------------------------------------

      that.player.addEventListener("ended", function (e) {
        console.log("end");
        that.reconnection();
      });
      that.player.addEventListener("play", function (e) {
        console.log("play");
        that.reLoading = false;
        if (that.reconnecTimer) {
          clearInterval(that.reconnecTimer);
        }
        // clearInterval(that.reconnecTimer);
      });
      //waiting w
      that.player.addEventListener("waiting", function (e) {
         console.log('waiting')
        // that.reconnection()
      });
      // 9、pause：暂停监听
      that.player.addEventListener("pause", function (e) {
        // that.isPause = true;
        console.log('pause')
        // console.log(e)
      });
      // playing
      that.player.addEventListener("playing", function (e) {
        // that.isPause = false;
        if (that.outNum) {
          that.timeOutNum = false;
          clearTimeout(that.outNum);
          that.outNum = null;
        }
        // that.reconnection();
      });
      // 禁止点击暂停
      that.player.addEventListener("click", function (e) {
        e.preventDefault();
      });

      that.flvPlayer.load(); //加载
      console.log("重连啦");
      setTimeout(() => {
        that.timeOutNum = false;
        that.flvPlayer.play();
      }, 300);
      that.playInterval();
    },
    playInterval() {
      let that = this;
      flvTimer = setInterval(() => {
        if (
          that.player &&
          that.player.buffered &&
          that.player.buffered.length
        ) {
          let end = that.player.buffered.end(0); //获取当前buffered值
          let diff = end - that.player.currentTime; //获取buffered与currentTime的差值
          if (diff >= 5) {
            //如果差值大于等于0.5 手动跳帧 这里可根据自身需求来定
            that.player.currentTime = that.player.buffered.end(0); //手动跳帧
          }
        }
      }, 5000);
    },
    reloadVideo() {
      this.flv_destroy();
      this.play();
    },
    retry() {
      let that = this;
      timer = setTimeout(() => {
        that.hls = videojs(that.$refs.video);
        that.hls.src({
          src: hls,
          type: "application/x-mpegURL", //在重新添加视频源的时候需要给新的type的值
        });
        that.hls.load(hls);
        that.hls.play(hls);
      }, 1000);
    },
    can() {
      console.log("play-----", this.hls);
      // this.hls = videojs(this.$refs.video);
      // this.hls.src({
      //   src: hls,
      //   type: "application/x-mpegURL" //在重新添加视频源的时候需要给新的type的值
      // });
      this.hls.load(hls);
      this.hls.play(hls);
    },
    flv_destroy() {
      window.clearInterval(this.interval);
      this.interval = null;
      this.$nextTick(() => {
        if (!this.flvPlayer) {
          return;
        }
        this.flvPlayer.pause();
        this.flvPlayer.unload();
        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy();
        this.flvPlayer = null;
      });
    },
  },
  beforeDestroy() {
    if (this.hls) {
      const videoDom = this.$refs.video;
      videojs(videoDom).dispose();
      return;
    }
    if (this.liveUrlTime) {
      clearTimeout(this.liveUrlTime);
      this.liveUrlTime = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.vjs-modal-dialog-content {
  width: 100%;
  height: 100%;
  display: none;
}
.video-js {
  width: 100%;
  height: 100%;
}
.vjs-error .vjs-error-display:before {
  display: none !important;
}
.reflv-replay {
  cursor: pointer;
}
/* 播放按钮 */
video::-webkit-media-controls-play-button {
  display: none;
}
/* 进度条 */
video::-webkit-media-controls-timeline {
  display: none;
}
/* 观看的当前时间 */
video::-webkit-media-controls-current-time-display {
  display: none;
}
/* 剩余时间 */
video::-webkit-media-controls-time-remaining-display {
  display: none;
}
/* 音量按钮 */
video::-webkit-media-controls-mute-button {
  display: none;
}
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}
/* 音量的控制条 */
video::-webkit-media-controls-volume-slider {
  display: none;
}
// .video-js{
//   pointer-events: none;
// }
</style>