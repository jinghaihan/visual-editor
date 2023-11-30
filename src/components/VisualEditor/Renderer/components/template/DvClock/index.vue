<template>
  <div
    class="visual-dv-clock"
    :style="
      propsData
        ? {
            fontSize: propsData.font.fontSize + 'px',
            color: propsData.font.color,
          }
        : {}
    "
  >
    <p class="time">{{ time }}</p>
    <p class="date">{{ date }}</p>
  </div>
</template>

<script lang="ts">
  import { ref, onBeforeUnmount, defineComponent } from 'vue'

  export default defineComponent({
    name: 'VisualDvClock',
    setup() {
      const propsData = ref(null)
      const time = ref('')
      const date = ref('')

      function updateTime() {
        const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

        const cd = new Date()
        time.value =
          zeroPadding(cd.getHours(), 2) +
          ':' +
          zeroPadding(cd.getMinutes(), 2) +
          ':' +
          zeroPadding(cd.getSeconds(), 2)

        date.value =
          cd.getHours() < 12
            ? 'am'
            : 'pm' +
              ' ' +
              week[cd.getDay()] +
              ' ' +
              zeroPadding(cd.getFullYear(), 4) +
              '/' +
              zeroPadding(cd.getMonth() + 1, 2) +
              '/' +
              zeroPadding(cd.getDate(), 2)
      }
      updateTime()

      function zeroPadding(num, digit) {
        let zero = ''
        for (var i = 0; i < digit; i++) {
          zero += '0'
        }
        return (zero + num).slice(-digit)
      }
      const timerId = setInterval(updateTime, 1000)

      onBeforeUnmount(() => {
        clearInterval(timerId)
      })

      return {
        propsData,
        date,
        time,
      }
    },
  })
</script>

<style lang="less" scoped>
  .visual-dv-clock {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    color: @primary-color;

    > p {
      margin: 0;
      padding: 0;
    }

    .time {
      font-size: 1em;
    }

    .date {
      font-size: 0.5em;
    }
  }
</style>
