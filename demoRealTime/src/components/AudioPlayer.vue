<template>
  <div :id="playerId">
    <h1><slot>Fallback content</slot></h1>
    <slider v-model="value" :max="30"></slider>
    <div id="controls">
      <button @click="audioPlay">{{ playState }}</button>
      <button @click="audioStop">stop</button>
    </div>
  </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
import {audioManager} from "../audioEngine/AudioManager.js"

export default {
  name: "audioPlayer",
  data() {
    return {
      uuid: uuidv4(),
      title: "Default Title",
      playState: 'Play',
      wavesurfer: null
    }
  },
  methods: {
    audioPlay() {
      console.log("play audio");
      audioManager.play();
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