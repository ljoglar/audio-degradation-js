<template>
  <div :id="playerId" class="audioPlayer">
    <h1><slot></slot></h1>
    <div class="progressBar">
      <button class="btn btn-success playerButton" @click="audioPlay" :disabled="!audioLoaded" >
        <font-awesome-icon icon="fa-solid fa-play" v-if="!isPlaying" />
        <font-awesome-icon icon="fa-solid fa-pause" v-else />
      </button>
      <button class="btn btn-dark playerButton" @click="audioStop">
        <font-awesome-icon icon="fa-solid fa-stop" />
      </button>
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

export default {
  name: "audioPlayer",
  components: {ProgressBar},
  inject: ['audioManager'],
  props: ['title', 'degradationName'],
  data() {
    return {
      uuid: uuidv4(),
      wavesurfer: null,
      audioLoaded: false,
      progressState: 'stopped', // playing, paused, stopped
      volumeValue: 0.4,
      paramValue: 3,
      isPlaying: false,
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
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.audioManager.playOrPause(this.isPlaying, this.degradationName);
        this.progressState = 'playing';
        // this.playAction = 'pause';
      } else {
        this.isPlaying = false;
        this.audioManager.playOrPause(this.isPlaying, this.degradationName);
        // this.playAction = 'play';
        this.progressState = 'paused';
      }
    },

    audioStop() {
      console.log("stop audio");
      this.isPlaying = false;
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
  width: 48px;
  height: 44px;
  border-radius: 22px;
}

.form-range {
  margin: 0 6px;
}

output#rangeValue{
  margin-left: 3px;
}

</style>