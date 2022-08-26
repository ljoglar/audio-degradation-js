<template>
  <div :id="playerId" class="audioPlayer">
    <h1><slot></slot></h1>
    <div class="progressBar">
      <button class="btn btn-success playerButton" @click="audioPlay" :disabled="!audioLoaded" > {{ playAction }} </button>
      <button class="btn btn-dark playerButton" @click="audioStop">stop</button>
      <ProgressBar :degradationName='this.degradationName' :onPlayerAction ="progressState" />
    </div>
    <div class="controls">
      <div class="slider">
        <div class="text">
          <p>Volume: </p><output id="rangeValue"> {{ volumeValue }} </output>
        </div>
        <input type="range" class="form-range" min="0" max="1" step="0.05" @change="updateGainValue"  v-model.number="volumeValue"/>
      </div>
      <div class="slider" v-if="degradationName !== 'control'">
        <div class="text">
          <p>Parameter: </p><output id="rangeValue"> {{ paramValue }} </output>
        </div>
        <input type="range" class="form-range" min="0" max="10" step="1" @change="updateDegradation" v-model.number="paramValue"/>
      </div>
    </div>
  </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
import ProgressBar from "./ProgressBar.vue";
import {emitter} from "../emitter";
import LottieAnimation from 'lottie-web-vue';

export default {
  name: "audioPlayer",
  components: {ProgressBar, LottieAnimation},
  inject: ['audioManager'],
  props: ['title', 'degradationName'],
  data() {
    return {
      uuid: uuidv4(),
      playAction: 'play', // play, pause
      wavesurfer: null,
      audioLoaded: false,
      progressState: 'stopped', // playing, paused, stopped
      volumeValue: 0.4,
      paramValue: 3
    }
  },
  computed: {
    playerId() {
      return `player_${this.uuid}`;
    }
  },
  created() {
    emitter.on('audioLoaded', () => {
      this.audioLoaded = true;
    });
  },
  methods: {
    audioPlay() {
      console.log("play audio");
      console.log(this.audioManager);
      if (this.playAction === 'play') {
        this.audioManager.playOrPause(true, this.degradationName);
        this.progressState = 'playing';
        this.playAction = 'pause';
      } else if (this.playAction === 'pause') {
        this.audioManager.playOrPause(false, this.degradationName);
        this.playAction = 'play';
        this.progressState = 'paused';
      }
    },

    audioStop() {
      console.log("stop audio");
      this.playAction = 'play';
      this.progressState = 'stopped';
      this.audioManager.stop(this.degradationName);
    },

    updateGainValue(e) {
      this.audioManager.gainVolumeChange( e.target.value, this.degradationName);
    },

    updateDegradation(e) {
      this.audioManager.degradationParamChange( e.target.value, this.degradationName);
    }
  }
}
</script>

<style scoped>
.audioPlayer {
  max-width: 780px;
  padding: 2rem;
  margin: 0 auto;
}

.progressBar {
  display: flex;
  margin: 10px 0px;
}

.controls .text {
  display: flex;
  min-width: 100px;
}

.controls .slider {
  display: flex;
  max-width: 50%;
  margin-left: 5%;
}

.playerButton {
  margin: 5px;
}

.form-range {
  margin: 0 6px;
}

output#rangeValue{
  margin-left: 3px;
}

.playAnim {
  width: 90%;
  max-width: 50px;
  margin-bottom: 30px;
  cursor: pointer;
}

</style>