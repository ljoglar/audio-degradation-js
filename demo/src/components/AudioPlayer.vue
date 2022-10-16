<template>
  <div :id="playerId">
    <h1><slot>Fallback content</slot></h1>
    <div class="waveformContainer">
      <div :id="waveformId" v-show="showWave"></div>
      <div id="load" v-show="!showWave" @click="enablePlayer"><p>Click to Load Audio</p></div>
    </div>
    <div id="buttons">
      <button class="btn btn-success playerButton" @click="wavePlay" :disabled="!showWave">
        <font-awesome-icon icon="fa-solid fa-play" />
        <font-awesome-icon icon="fa-solid fa-pause" />
<!--        <font-awesome-icon icon="fa-solid fa-play"  v-if="!playing" />-->
<!--        <font-awesome-icon icon="fa-solid fa-pause" v-else />-->
      </button>
      <button class="btn btn-dark playerButton" @click="waveStop" :disabled="!showWave">
        <font-awesome-icon icon="fa-solid fa-stop" />
      </button>
      <button class="btn btn-outline-secondary" @click="executeDegradation" v-if="isDegradation">
        Execute {{degradationName}}
      </button>
    </div>
    <div class="controls">
      <div class="slider">
        <div class="text">
          <p>Volume: </p><output id="rangeValue"> {{ volumeValue }} </output>
        </div>
        <input type="range" class="form-range" min="0" max="1" step="0.05" @change="updateGainValue"  v-model.number="volumeValue" :disabled="!showWave"/>
      </div>
      <div class="slider" v-if="degradationName !== 'control'">
        <div class="text">
          <p>Parameter: </p><output id="rangeValue"> {{ paramValue }} </output>
        </div>
        <input type="range" class="form-range" min="0" max="10" step="1" @change="updateDegradationValue" v-model.number="paramValue" :disabled="!showWave"/>
      </div>
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
  props: {
    isDegradation: {
      default: true
    },
    degradationName: {
      default: "degradation"
    }
  },
  data() {
    return {
      uuid: uuidv4(),
      title: "Default Title",
      showWave: false,
      playing: false,
      volumeValue: 0.4,
      paramValue: 3,
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
    emitter.on('audioLoaded', () => {
      this.audioLoaded = true;
      this.getDefaultAudioBuffer()
    });
  },
  updated() {
    this.updateWaveform();
  },
  mounted() {
    this.wavesurfer = WaveSurfer.create({
      audioContext: audioManager.audioContext,
      container: '#'+this.waveformId,
      waveColor: '#00bd7e',
      progressColor: '#027852',
    });
    this.wavesurfer.setVolume(this.volumeValue);
    this.wavesurfer.on('play', () => {
      console.log("onPlay");
      this.playing = true;
    });
    this.wavesurfer.on('pause', () => {
      console.log("onPause");
      this.playing = false;
    });
  },
  methods: {
    enablePlayer(){
      this.showWave = !this.showWave;
    },
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
      this.wavesurfer.playPause();
    },
    waveStop(){
      this.wavesurfer.stop();
    },
    updateGainValue(e) {
      this.volumeValue = e.target.value;
      this.wavesurfer.setVolume(this.volumeValue);
    },
    updateDegradationValue(e) {
      audioManager.updateHarmonicDistortionValue(e.target.value);
    }
  }
}
</script>

<style scoped>

.playerButton {
  margin: 5px;
  width: 48px;
  height: 44px;
  border-radius: 22px;
}

.waveformContainer{
  margin: 10px 0;
}

#load {
  padding: 51px;
  border: 1px solid lightgray;
  border-radius: 22px;
}

#load p{
  margin: auto;
  display: table;
}

h1{
  margin: 50px 0 25px;
}

.controls {
  margin: 5px 8px;
}

.controls .text {
  display: flex;
  min-width: 100px;
}

.controls .slider {
  display: flex;
  max-width: 50%;
}
</style>
