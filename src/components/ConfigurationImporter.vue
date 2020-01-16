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
const parseString = require("xml2js").parseString;

@Component
export default class ConfigurationImporter extends Vue {
  @Prop() private msg!: string;
  private file: File | undefined;
  private groupAddresses: any[] = [];
  $refs!: {
    file: HTMLFormElement
  }

  handleFileUpload() {
    this.file = this.$refs.file.files[0];
  }

  async convert() {
    if(this.file == undefined) return;
    let etsProject = await JSZip.loadAsync(this.file);
    let fileName = Object.keys(etsProject.files).find(f => f.indexOf("0.xml") != -1);
    if(fileName == undefined) return;
    let projectXML = await etsProject.file(fileName).async("text");
    let projectObj: any = await new Promise((resolve, reject) => {
      parseString(projectXML, function(err: Error, result: object) {
      if (err) reject(err);
      resolve(result);
    });
  });
    if(projectObj == undefined || projectObj.KNX == undefined || projectObj.KNX.Project == undefined) return;
    for(let project of projectObj.KNX.Project){
      for(let installations of project.Installations){
        for(let installation of installations.Installation)
        this.parseInstallation(installation);
      }
    }
  }

  parseInstallation(installation: {Topology: any[], Locations: any[], GroupAddresses: any[]}){
    for(let location of installation.Locations)
      if(location.Space) 
        for(let space of location.Space){
          this.groupAddresses = installation.GroupAddresses[0].GroupRanges[0].GroupRange.map(((m: any) => (m.GroupRange || []).map((mm: any) => mm.GroupAddress || []))).reduce((a: any[],b: any) => a.concat(b), []).reduce((a: any[],b: any) => a.concat(b), []);
          this.parseSpace(space, "");
        }
  }

  parseSpace(space: any, topologyString: string){
    if(["Building", "BuildingPart"].indexOf(space["$"].Type) == -1)
      topologyString += (topologyString.length ? "." : "") +space["$"].Name;
    if(space.Space)
      for(let subSpace of space.Space)
        this.parseSpace(subSpace, topologyString);
    if(space.Function)
      for(let func of space.Function)
        this.parseFunction(func, topologyString)
  }

  parseFunction(func: any, topologyString: string){
    topologyString += "."  +func["$"].Name;
    switch(func["$"].Type){
      case "FT-0": //Custom
        break;
      case "FT-1": //Switchable Light
        this.parseSwitchableLight(func.GroupAddressRef, topologyString);
        break;
      case "FT-6": // Dimmable Light
        this.parseDimmableLight(func.GroupAddressRef, topologyString);
        break;
      case "FT-7": // Screens
        this.parseScreen(func.GroupAddressRef, topologyString);
        break;
      case "FT-9": //Climate
        this.parseClimate(func.GroupAddressRef, topologyString);
        break;
    }
  }

  parseSwitchableLight(groupAddressesRef: any[], topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    console.log(topologyString + ":");
    for(let groupAddressRef of groupAddressesRef){
      let address = this.getGroupAddress(groupAddressRef);
      if(groupAddressRef["$"].Role == "SwitchOnOff"){
        console.log("\t" + "SwitchOnOff " + address);
      }else if(groupAddressRef["$"].Role == "InfoOnOff"){
        console.log("\t" +"InfoOnOff " + address);
      }
    }
  }

  parseDimmableLight(groupAddressesRef: any[], topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    console.log(topologyString + ":");
    for(let groupAddressRef of groupAddressesRef){
      let address = this.getGroupAddress(groupAddressRef);
      let role = groupAddressRef["$"].Role;
      if(role == "SwitchOnOff"){
        console.log("\t" + "SwitchOnOff " + address);
      }else if(role == "InfoOnOff"){
        console.log("\t" +"InfoOnOff " + address);
      }else if(role == "DimmingControl"){
        console.log("\t" +"DimmingControl " + address)
      }else if(role == "DimmingValue"){
        console.log("\t" +"DimmingValue " + address)
      }else if(role == "InfoDimmingValue"){
        console.log("\t" +"InfoDimmingValue " + address)
      }
    }
  }

  parseScreen(groupAddressesRef: any[], topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    console.log(topologyString + ":");
    for(let groupAddressRef of groupAddressesRef){
      let address = this.getGroupAddress(groupAddressRef);
      if(address == undefined) continue;
      let role = groupAddressRef["$"].Role;
      if(role == "MoveUpDown"){
        console.log("\t" + "MoveUpDown " + address);
      }else if(role == "StopStepUpDown"){
        console.log("\t" +"StopStepUpDown " + address);
      }else if(role == "CurrentAbsolutePositionBlindsPercentage"){
        console.log("\t" +"CurrentAbsolutePositionBlindsPercentage " + address)
       }else if(role == "AbsolutePositionBlindsPercentage"){
        console.log("\t" +"AbsolutePositionBlindsPercentage " + address)
      }else if(role != undefined){
       console.log(role);
      }
    }
  }

  parseClimate(groupAddressesRef: any[], topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    console.log(topologyString + ":");
    for(let groupAddressRef of groupAddressesRef){
      let address = this.getGroupAddress(groupAddressRef);
      let role = groupAddressRef["$"].Role;
      if(role == "HVACMode"){
        console.log("\t" + "HVACMode " + address);
      }else if(role == "ValvePosition"){
        console.log("\t" +"ValvePosition " + address);
      }else if(role == "WindowStatus"){
        console.log("\t" +"WindowStatus " + address)
      }else if(role == "TempRoomSetpoint"){
        console.log("\t" +"TempRoomSetpoint " + address)
      }else if(role == "TempRoom"){
        console.log("\t" +"TempRoom " + address)
      }else{
       console.log(role);
      }
    }
  }

  getGroupAddress(groupAddressesRef: any){
    //groupAddresses.find(f => f[" $"])
    let refId = groupAddressesRef["$"].RefId;
    if(refId == undefined || refId.length == 0) return undefined;
    let addressObj = this.groupAddresses.find((f: any) => f["$"].Id == refId);
    if(addressObj == undefined) return undefined;
    return this.convertAddressToGroupAddressString(addressObj["$"].Address);
  }

  convertAddressToGroupAddressString(address: string | number){
    address = +address;
    let x = Math.floor(address / 2048);
    let y = Math.floor((address % 2048) / 256);
    let z =(address % 2048) % 256;
    return x + "/" + y + "/" + z;
  }

  cleanTopologyString(topologyString: string){
    let str = topologyString.trim().replace(/ /g, "_"); 
    if(!isNaN(+str[0])) str = "_" + str;
    if(str[str.length - 1] == ".") str += "x";
    return str;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
