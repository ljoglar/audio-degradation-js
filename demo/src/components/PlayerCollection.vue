<script>
import AudioPlayer from "./AudioPlayer.vue";

export default {
  components: {
    AudioPlayer
  },
  data() {
    return {
      titleGeneral: 'Control Audio',
      control: 'control',
      titleHarmonicDist: 'Harmonic Distortion'
    }
  }
}
</script>

<template>
  <AudioPlayer :isDegradation="false" :degradationName='control'>{{titleGeneral}}</AudioPlayer>
  <AudioPlayer :degradationName='titleHarmonicDist'>{{titleHarmonicDist}}</AudioPlayer>
</template>

<style scoped>

</style>
