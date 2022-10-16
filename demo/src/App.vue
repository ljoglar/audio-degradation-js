<script setup>
import PlayerCollection from './components/PlayerCollection.vue'
import "./emitter";
import Top from './components/Top.vue'
import Foot from './components/Foot.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <Top/>
    </div>
  </header>

  <main>
    <PlayerCollection/>
  </main>

  <footer>
    <Foot/>
  </footer>
</template>

<style scoped>
header {
  line-height: 1.5;
  height: 700px;
  background-image: url("/assets/img/header.jpg");
  background-position: bottom;
  padding: 0 !important;
}

main {
  max-width: 1280px;
  padding: 2rem;
  margin: 0 auto;
}

.wrapper {
  max-width: 980px;
  height: 460px;
  padding: 5rem;
  margin: 0 auto;
  background-color: #7fd6ff21;
  border-radius: 20pt;
  text-align: center;
}

footer {
  min-height: 160px;
  background-color: grey;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
