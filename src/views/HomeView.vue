<script lang="ts">
import ConfigurationImporter from '../components/ConfigurationImporter.vue'
import { Component, Vue } from "vue-facing-decorator"
@Component({
    components: {
      ConfigurationImporter
    }
})
export default class HomeView extends Vue {}
</script>

<template>
  <main>
    <ConfigurationImporter />
  </main>
</template>
