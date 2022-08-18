<template>
  <div :id="playerId">
    <h1><slot>Fallback content</slot></h1>
    <ProgressBar :onPlayerAction ="progressState" />
    <div id="controls">
      <button @click="audioPlay" :disabled="!audioLoaded">{{ playAction }}</button>
      <button @click="audioStop">stop</button>
      <input type="range" min="0" max="1" step="0.1" @change="updateGainValue"/>
      <input type="range" min="0" max="10" step="1" value="3" @change="updateDegradation"/>
    </div>
  </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
import {audioManager} from "../audioEngine/AudioManager.js"
import ProgressBar from "./ProgressBar.vue";
import {emitter} from "../emitter";

export default {
  name: "audioPlayer",
  components: {ProgressBar},
  data() {
    return {
      uuid: uuidv4(),
      title: "Default Title",
      playAction: 'play', // play, pause
      wavesurfer: null,
      audioLoaded: false,
      progressState: 'stopped', // playing, paused, stopped
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
      if (this.playAction === 'play') {
        audioManager.playOrPause(true);
        this.progressState = 'playing';
        this.playAction = 'pause';
      } else if (this.playAction === 'pause') {
        audioManager.playOrPause(false);
        this.playAction = 'play';
        this.progressState = 'paused';
      }
    },

    audioStop() {
      console.log("stop audio");
      this.playAction = 'play';
      this.progressState = 'stopped';
      audioManager.stop();
    },

    updateGainValue(e) {
      emitter.emit("gainVolumeChange", e.target.value);
    },

    updateDegradation(e) {
      emitter.emit("degradationParamChange", e.target.value);
    }
  }
}
</script>

<style scoped>

</style>