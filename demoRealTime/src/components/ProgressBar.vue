<template>
    <div class="slider">
      <output id="rangeValue"> {{ currentDateString }} </output>
      <input type="range" class="form-range" min="0" max="100" step="0.1" @change="updateTime" v-model="value" />
      <p id="maxValue">00:00</p>
    </div>
</template>

<script>

export default {
  name: "ProgressBar",
  inject: ['audioManager'],
  props: ['onPlayerAction', 'degradationName'],
  data() {
    return {
      value: 0,
      maxValue: 100,
      currentTime: 0,
      currentDate: new Date(1000),
      currentDateString: '00:00',
      state: 'stopped'
    }
  },
  methods: {
    updateTime(e) {
      this.currentTime = e.target.value;
      this.updateDate();
      const isPaused = this.state !== 'playing';
      this.audioManager.updatePosition(this.degradationName, isPaused, this.currentTime);
    },

    updateDate() {
      this.currentDate = new Date(this.currentTime * 1000);
      this.currentDateString = this.currentDate.toISOString().substr(14, 5);
    },

    startProgress() {
      this.interval = setInterval(() => {
        this.value = parseFloat(this.value) + 0.1;
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
      this.state = newVal;
      switch (this.state) {
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
.slider {
  width: 100%;
  display: flex;
  padding-top: 12px;
  height: 32px;
  margin-left: 5px;
}

input {
  padding: 0px 7px;
}

#maxValue, output {
  top: -1px;
}
</style>
