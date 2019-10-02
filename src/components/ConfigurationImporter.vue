<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>File
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
      </label>
        <button v-on:click="convert()">Submit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import JSZip from 'jszip';

@Component
export default class ConfigurationImporter extends Vue {
  @Prop() private msg!: string;
  private file: File | undefined;
  $refs!: {
    file: HTMLFormElement
  }

  handleFileUpload() {
    this.file = this.$refs.file.files[0];
  }

  async convert() {
    if(this.file == undefined) return;
    let project = await JSZip.loadAsync(this.file);
    project.forEach(function (relativePath: string, zipEntry: any) {  // 2) print entries
      console.log(zipEntry.name);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
