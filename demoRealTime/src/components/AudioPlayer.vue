<template>
  <div :id="playerId">
    <h1><slot>Fallback content</slot></h1>
    <ProgressBar />
    <div id="controls">
      <button @click="audioPlay">{{ playState }}</button>
      <button @click="audioStop">stop</button>
    </div>
  </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
import {audioManager} from "../audioEngine/AudioManager.js"
import ProgressBar from "./ProgressBar.vue";

export default {
  name: "audioPlayer",
  components: {ProgressBar},
  data() {
    return {
      uuid: uuidv4(),
      title: "Default Title",
      playState: 'play',
      wavesurfer: null
    }
  },
  methods: {
    audioPlay() {
      console.log("play audio");
      if (this.playState === 'play') {
        audioManager.playOrPause(true);
        this.playState = 'pause';
      } else if (this.playState === 'pause') {
        audioManager.playOrPause(false);
        this.playState = 'play';
      }
    },
    audioStop() {
      console.log("stop audio");
      audioManager.stop();
    }
  }
}
</script>

<style scoped>

</style>