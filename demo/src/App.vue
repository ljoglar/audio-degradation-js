<script setup>
import HelloWorld from './components/HelloWorld.vue'
import PlayerCollection from './components/PlayerCollection.vue'
import "./emitter";
</script>

<template>
  <header>
    <div class="wrapper">
      <img alt="Vue logo" class="logo" src="../assets/logo.svg" width="125" height="125" />
      <HelloWorld msg="Audio Degradation Toolkit in Javascript" />
    </div>
  </header>
  <main>
    <PlayerCollection/>
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
  /*header {*/
  /*  display: flex;*/
  /*  place-items: center;*/
  /*  padding-right: calc(var(--section-gap) / 2);*/
  /*}*/

  /*.logo {*/
  /*  margin: 0 2rem 0 0;*/
  /*}*/

  /*header .wrapper {*/
  /*  display: flex;*/
  /*  place-items: flex-start;*/
  /*  flex-wrap: wrap;*/
  /*}*/
}
</style>
