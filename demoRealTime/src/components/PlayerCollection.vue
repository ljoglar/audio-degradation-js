<script>
import AudioPlayer from "./AudioPlayer.vue";

export default {
  components: {
    AudioPlayer
  },
  data() {
    return {
      titleGeneral: 'Control Audio',
      titleHarmonicDist: 'Harmonic Distortion'
    }
  }
}
</script>

<template>
  <AudioPlayer>{{titleGeneral}}</AudioPlayer>
  <AudioPlayer>{{titleHarmonicDist}}</AudioPlayer>
</template>

<style scoped>

</style>
