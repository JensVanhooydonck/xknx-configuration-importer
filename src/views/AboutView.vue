<script lang="ts">
import { Component, Vue } from "vue-facing-decorator"
@Component({})
export default class AboutView extends Vue {}
</script>

<template>
  <main>
    This project is created to convert a knxproj file created by ETS5 or ETS6 to a xKNX-yaml file. This uses the so called <span>Functions</span> in ETS to automaticly convert a group of groupaddresses to the correct group in xKNX.
  </main>
</template>


<style scoped>
main {
  padding: 25px;
}
span {
  color: orange;
  font-style: italic;
}
</style>