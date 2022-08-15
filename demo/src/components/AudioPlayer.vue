<template>
  <div :id="playerId">
    <h1><slot>Fallback content</slot></h1>
    <div :id="waveformId" v-show="showWave"></div>
    <div id="load" v-show="!showWave" @click='this.showWave = !this.showWave'><p>click to load audio</p></div>
    <div id="controls">
      <button @click="executeDegradation">execute</button>
      <button @click="wavePlay">{{ playState }}</button>
      <button @click="waveStop">stop</button>
    </div>
  </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
import WaveSurfer from 'wavesurfer.js'
import {audioManager} from "../audioEngine/AudioManager.js"
import {emitter} from "../emitter.js";

export default {
  name: "audioPlayer",
  data() {
    return {
      uuid: uuidv4(),
      title: "Default Title",
      showWave: false,
      playState: 'Play',
      wavesurfer: null
    }
  },
  computed: {
    playerId() {
      return `player_${this.uuid}`;
    },
    waveformId(){
      return `waveform_${this.uuid}`;
    }
  },
  created() {
    emitter.on('buffer_loaded', this.getDefaultAudioBuffer);
  },
  updated() {
    this.updateWaveform();
  },
  mounted() {
    this.wavesurfer = WaveSurfer.create({
      container: '#'+this.waveformId,
      waveColor: '#00bd7e',
      progressColor: '#027852',
    });
  },
  methods: {
    getDefaultAudioBuffer(){
      this.audio =  audioManager.audioBuffer;
    },
    executeDegradation(){
      this.audio = audioManager.addHarmonicDistortion();
      this.updateWaveform();
    },
    updateWaveform(){
      if(this.showWave){
        this.wavesurfer.loadDecodedBuffer(this.audio);
      }
    },
    wavePlay(){
      this.wavesurfer.play();
    },
    waveStop(){
      this.wavesurfer.stop();
    }
  }
}
</script>

<style scoped>
</style>
