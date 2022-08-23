<template>
  <div :id="playerId">
    <h1><slot></slot></h1>
    <ProgressBar :onPlayerAction ="progressState" />
    <div id="controls">
      <button @click="audioPlay" :disabled="!audioLoaded">{{ playAction }}</button>
      <button @click="audioStop">stop</button>
      <input type="range" min="0" max="1" step="0.1" value="0.4" @change="updateGainValue"/>
      <input type="range" min="0" max="10" step="1" value="3" @change="updateDegradation"/>
    </div>
  </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
// import {audioManager} from "../audioEngine/AudioManager.js"
import ProgressBar from "./ProgressBar.vue";
import {emitter} from "../emitter";

export default {
  name: "audioPlayer",
  components: {ProgressBar},
  inject: ['audioManager'],
  props: ['title', 'degradationName'],
  data() {
    return {
      //audioManager: this.audioManager,
      uuid: uuidv4(),
      //title: "Default Title",
      playAction: 'play', // play, pause
      wavesurfer: null,
      audioLoaded: false,
      progressState: 'stopped', // playing, paused, stopped
    }
  },
  computed: {
    playerId() {
      // console.log(this.audioManager);
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

</style>