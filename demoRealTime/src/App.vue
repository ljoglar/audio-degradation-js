<script>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import AudioManager from './audioEngine/AudioManager.js'

const audioContext = new (window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext)();

// const audioManager = new AudioManager(audioContext, './src/assets/audio/cello.wav');

export default {
  components: { HelloWorld, TheWelcome, AudioPlayer},
  provide() {
    return {
      audioContext: audioContext,
      audioManager: new AudioManager(audioContext, './src/assets/audio/cello.wav'),
    }
  },
  data() {
    return {
      titleGeneral: 'Control Audio',
      controlId: null,
      titleHarmonicDist: 'Harmonic Distortion',
      harmonicDistId: 'harmonicDistortion',
    }
  }
}

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
    <AudioPlayer :degradationName='controlId' > {{titleGeneral}}</AudioPlayer>
    <AudioPlayer :degradationName='harmonicDistId'>{{titleHarmonicDist}}</AudioPlayer>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
