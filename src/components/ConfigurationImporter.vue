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
const yaml = require('js-yaml');
const parseString = require("xml2js").parseString;

@Component
export default class ConfigurationImporter extends Vue {
  @Prop() private msg!: string;
  private file: File | undefined;
  private groupAddresses: any[] = [];
  private xknx: any;
  $refs!: {
    file: HTMLFormElement
  }

  handleFileUpload() {
    this.file = this.$refs.file.files[0];
  }

  private resetXknx(){
    this.xknx = {
      general: {
        own_address: "1.1.132",
      },
      groups: {
        climate: {},
        cover: {},
        light: {},
        sensor: {},
        binary_sensor: {},
        switch: {},
        time: {
          "General.Time": "9/0/1"
        }
      }
    };
  }

  private exportXKNX(){
    for(let key of Object.keys(this.xknx.groups))
    {
      if(Object.keys(this.xknx.groups[key]).length == 0){
        delete this.xknx.groups[key];
      }
    }
    let xknxYaml = yaml.safeDump(this.xknx);
    this.download("xknx.yaml", xknxYaml)
    console.log(xknxYaml);
  }

  async convert() {
    this.resetXknx();
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
    this.exportXKNX();
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
    let light: any = {};
    for(let groupAddressRef of groupAddressesRef){
      let address = this.getGroupAddress(groupAddressRef);
      if(groupAddressRef["$"].Role == "SwitchOnOff"){
        light.group_address_switch = address;
      }else if(groupAddressRef["$"].Role == "InfoOnOff"){
        light.group_address_switch_state = address;
      }
    }
    if(Object.keys(light).length > 0)
      this.xknx.groups.light[topologyString] = light;
  }

  parseDimmableLight(groupAddressesRef: any[], topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    let light: any = {};
    for(let groupAddressRef of groupAddressesRef){
      let address = this.getGroupAddress(groupAddressRef);
      let role = groupAddressRef["$"].Role;
      if(role == "SwitchOnOff"){
        light.group_address_switch = address;
      }else if(role == "InfoOnOff"){
        light.group_address_switch_state = address;
      }else if(role == "DimmingControl"){
        console.log("\t" +"DimmingControl " + address)
      }else if(role == "DimmingValue"){
        light.group_address_brightness = address;
      }else if(role == "InfoDimmingValue"){
        light.group_address_brightness_state = address;
      }
    }
    if(Object.keys(light).length > 0)
      this.xknx.groups.light[topologyString] = light;
  }

  parseScreen(groupAddressesRef: any[], topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    let cover: any = {};
    for(let groupAddressRef of groupAddressesRef){
      let address = this.getGroupAddress(groupAddressRef);
      if(address == undefined) continue;
      let role = groupAddressRef["$"].Role;
      if(role == "MoveUpDown"){
        cover.group_address_long = address;
      }else if(role == "StopStepUpDown"){
        cover.group_address_short = address;
      }else if(role == "CurrentAbsolutePositionBlindsPercentage"){
        cover.group_address_position_feedback = address;
       }else if(role == "AbsolutePositionBlindsPercentage"){
         cover.group_address_position = address;
      }else if(role != undefined){
       console.log(role);
      }
    }
    if(Object.keys(cover).length > 0)
      this.xknx.groups.cover[topologyString] = cover;
  }

  parseClimate(groupAddressesRef: any[], topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    let climate: any = {};
    for(let groupAddressRef of groupAddressesRef){
      let address = this.getGroupAddress(groupAddressRef);
      let role = groupAddressRef["$"].Role;
      if(role == "HVACMode"){
        climate.mode = {
          group_address_operation_mode : address
        };
      }else if(role == "ValvePosition"){
        console.log("\t" +"ValvePosition " + address);
      }else if(role == "WindowStatus"){
        console.log("\t" +"WindowStatus " + address)
      }else if(role == "TempRoomSetpoint"){
        climate.group_address_target_temperature = address;
      }else if(role == "TempRoom"){
        climate.group_address_temperature = address;
      }else{
       console.log(role);
      }
    }
    if(Object.keys(climate).length > 0)
      this.xknx.groups.climate[topologyString] = climate;
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
    if(str[0] == ".") str = str.slice(1, str.length);
    return str;
  }

  download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
