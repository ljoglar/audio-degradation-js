<template>
    <div class="slider">
      <output id="rangeValue"> {{ currentDateString }} </output>
      <input type = "range" min="0" max="100" @change="updateValue"/>
      <p id="maxValue">00:00</p>
    </div>
</template>

<script>
import {audioManager} from "../audioEngine/AudioManager.js"
import {emitter} from "../emitter";

export default {
  name: "ProgressBar",
  data() {
    return {
      currentTime: 0,
      currentDate: new Date(1000),
      currentDateString: '00:00'
    }
  },
  mounted() {
    emitter.on('playSound', () => {
      this.startProgress();
    });
    emitter.on('pauseSound', () => {
      this.pauseProgress();
    });
    emitter.on('stopSound', () => {
      this.stopProgress();
    });
  },
  methods: {
    updateValue(e) {
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
        this.currentTime = this.currentTime + 1;
        this.updateDate();
      }, 1000);
    },

    pauseProgress() {
      clearInterval(this.interval);
    },

    stopProgress() {
      clearInterval(this.interval);
      this.currentTime = 0;
      this.currentDateString = '00:00';
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