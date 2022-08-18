<template>
    <div class="slider">
      <output id="rangeValue"> {{ currentDateString }} </output>
      <input type="range" min="0" max="100" step="0.1" @change="updateTime" v-model="value"/>
      <p id="maxValue">00:00</p>
    </div>
</template>

<script>

export default {
  name: "ProgressBar",
  props: ['onPlayerAction'],
  data() {
    return {
      value: 0,
      maxValue: 100,
      currentTime: 0,
      currentDate: new Date(1000),
      currentDateString: '00:00'
    }
  },
  methods: {
    updateTime(e) {
      console.log(e.target.value);
      this.currentTime = e.target.value;
      this.updateDate();
    },

    updateDate() {
      this.currentDate = new Date(this.currentTime * 1000);
      this.currentDateString = this.currentDate.toISOString().substr(14, 5);
    },

    startProgress() {
      this.interval = setInterval(() => {
        this.value = this.value + 0.1;
        this.currentTime = this.value;
        this.updateDate();
      }, 100);
    },

    pauseProgress() {
      clearInterval(this.interval);
    },

    stopProgress() {
      clearInterval(this.interval);
      this.currentTime = 0;
      this.value = 0;
      this.currentDateString = '00:00';
    }
  },
  watch: {
    onPlayerAction: function(newVal) {
      switch (newVal) {
        case 'playing':
          this.startProgress();
          break;
        case 'paused':
          this.pauseProgress();
          break;
        case 'stopped':
          this.stopProgress();
          break;
      }
    }
  }
}

</script>

<style scoped>
/*.container {*/
/*  display: flex;*/
/*  width: 500px;*/
/*  height: 500px;*/
/*  margin: auto;*/
/*  text-alignt: center;*/
/*}*/
.slider {
  width: 100%;
  /*margin: 50% auto;*/
}

input {
  width: 80%;
}

#maxValue {
  width: 10%;
  display: inline;
}

</style>