<template>
  <div>
    <this-dialog :is-show="isShowCheckDialog" @on-close="checkStatus">
      请检查你的支付状态！
      <div class="button" @click="checkStatus">
        支付成功
      </div>
      <div class="button" @click="checkStatus">
        支付失败
      </div>
    </this-dialog>
    <this-dialog :is-show="isShowSuccessDialog" @on-close="toOrderList">
      购买成功！
    </this-dialog>
    <this-dialog :is-show="isShowFailDialog" @on-close="toOrderList">
      购买失败！
    </this-dialog>
  </div>
</template>

<script>
import thisDialog from './base/dialog'
export default {
  components: {
    thisDialog
  },
  props: {
    isShowCheckDialog: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      isShowSuccessDialog: false,
      isShowFailDialog: false
    }
  },
  methods: {
    checkStatus () {
      let reqParams = new URLSearchParams();
      reqParams.append('orderId',this.orderId)
      this.$http.post('http://127.0.0.1:3000/api/checkOrder', reqParams)
      .then((res) => {
        if(res.data.ok === 200){
          this.isShowSuccessDialog = true
          this.$emit('on-close-check-dialog')
        }else if(res.data.ok === 400){
          this.isShowFailDialog = true
          this.$emit('on-close-check-dialog')
        }
      }, (err) => {
        console.log(err)
      })
    },
    toOrderList () {
      this.$router.push({path: '/orderList'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
