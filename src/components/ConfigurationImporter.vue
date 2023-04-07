<template>
  <main>
    <div class="container">
      <div class="info">
        Select a ETS5 or ETS6 .knxproj file which uses <span>Functions</span> to convert it to a xKNX-yaml file.
      </div>
      <div class="process">
        <label>File
          <input type="file" id="file" ref="fileUpload" v-on:change="handleFileUpload()"/>
        </label>
      </div>
      <div class="buttons">
        <button v-on:click="convertXknxYaml()">Download xKNX-yaml</button>
        <button v-on:click="convertHomeAssistant()">Download Home assistant-yaml</button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-facing-decorator';
import JSZip from 'jszip';
import yaml from 'js-yaml';
import { XMLParser } from "fast-xml-parser";


@Component({})
export default class ConfigurationImporter extends Vue {
  private file: File | undefined;
  private groupAddresses: any[] = [];
  private xknx: any;
  private homeAssistant: any;
  @Ref()
  readonly fileUpload!: HTMLFormElement

  handleFileUpload() {
    this.file = this.fileUpload.files[0];
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

    this.homeAssistant = {
      knx: {
        individual_address: "1.1.132",
        climate: [],
        cover: [],
        light: [],
        sensor: [],
        binary_sensor: [],
        switch: [],
      }
    }
  }

  private exportXKNX(){
    for(let key of Object.keys(this.xknx.groups))
    {
      if(Object.keys(this.xknx.groups[key]).length == 0){
        delete this.xknx.groups[key];
      }
    }
    let xknxYaml = yaml.dump(this.xknx);
    this.download("xknx.yaml", xknxYaml)
  }

  private exportHomeAssistant(){
    for(let key of Object.keys(this.homeAssistant.knx))
    {
      if(Array.isArray(this.homeAssistant.knx[key]) && this.homeAssistant.knx[key].length == 0){
        delete this.homeAssistant.knx[key];
      }
    }
    let homeAssistantYaml = yaml.dump(this.homeAssistant);
    this.download("knx_configruation.yaml", homeAssistantYaml)
  }

  private array(objOrArray: any[] | any) {
    return Array.isArray(objOrArray) ? objOrArray : [objOrArray];
  }

  async convertHomeAssistant() {
    await this.convert()
    this.exportHomeAssistant();
  }

  async convertXknxYaml() {
    await this.convert()
    this.exportXKNX();
  }

  async convert() {
    this.resetXknx();
    if(this.file == undefined) return;
    let etsProject = await JSZip.loadAsync(this.file);
    let fileName = Object.keys(etsProject.files).find(f => f.indexOf("0.xml") != -1);
    if(fileName == undefined) return;
    let projectXML = await etsProject?.file(fileName)?.async("text") || "";
    let projectObj: any = new XMLParser({
          ignoreAttributes: false,
          allowBooleanAttributes: true,
          processEntities: true,
          attributeNamePrefix: "",
          isArray: (name) => name === "Feature" || name === 'Segment', 
        }).parse(projectXML);
    if(!projectObj?.KNX?.Project?.Installations) return;
      for(let installations of this.array(projectObj.KNX.Project.Installations)){
        for(let installation of this.array(installations.Installation))
          this.parseInstallation(installation);
      }
  }

  parseInstallation(installation: {Topology: {Area: any[], GroupAddresses: any[], Locations: any[]}, Locations: any[], GroupAddresses: any[]}){
    console.log(installation)
    if(installation.Locations) {
      this.parseLocations(this.array(installation.Locations), this.array(installation.GroupAddresses))
    }
    if(installation.Topology) {
      if(installation.Topology.Locations) {
      this.parseLocations(this.array(installation.Topology.Locations), this.array(installation.Topology.GroupAddresses))
    }
    }
  }

  parseLocations(locations: any[], groupAddresses: any[]) {
    for(let location of locations)
        if(location.Space) 
          for(let space of this.array(location.Space)){
            this.groupAddresses = this.array(groupAddresses[0].GroupRanges)[0].GroupRange.map(((m: any) => (m.GroupRange || []).map((mm: any) => mm.GroupAddress || []))).reduce((a: any[],b: any) => a.concat(b), []).reduce((a: any[],b: any) => a.concat(b), []);
            this.parseSpace(space, "");
          }
  }

  parseSpace(space: any, topologyString: string){
    if(["Building", "BuildingPart"].indexOf(space.Type) == -1)
      topologyString += (topologyString.length ? "." : "") +space.Name;
    if(space.Space)
      for(let subSpace of this.array(space.Space))
        this.parseSpace(subSpace, topologyString);
    if(space.Function)
      for(let func of this.array(space.Function))
        this.parseFunction(func, topologyString)
  }

  parseFunction(func: any, topologyString: string){
    topologyString += "."  +func.Name;
    if(func.GroupAddressRef == undefined) return;
    switch(func.Type){
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

  parseSwitchableLight(groupAddressesRef: any[] | any, topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    let light: any = {};
    for(let groupAddressRef of this.array(groupAddressesRef)){
      let address = this.getGroupAddress(groupAddressRef);
      if(groupAddressRef.Role == "SwitchOnOff"){
        light.group_address_switch = address;
      }else if(groupAddressRef.Role == "InfoOnOff"){
        light.group_address_switch_state = address;
      }
    }
    if(Object.keys(light).length > 0) {
      this.xknx.groups.light[topologyString] = light;
      this.homeAssistant.knx.light.push({
        name: topologyString,
        address: light.group_address_switch,
        state_address: light.group_address_switch_state
      })
    }
  }

  parseDimmableLight(groupAddressesRef: any[] | any, topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    let light: any = {};
    for(let groupAddressRef of this.array(groupAddressesRef)){
      let address = this.getGroupAddress(groupAddressRef);
      let role = groupAddressRef.Role;
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
    if(Object.keys(light).length > 0) {
      this.xknx.groups.light[topologyString] = light;
      this.homeAssistant.knx.light.push({
        name: topologyString,
        address: light.group_address_switch,
        state_address: light.group_address_switch_state,
        brightness_address: light.group_address_brightness,
        brightness_state_address: light.group_address_brightness_state
      })
    }
  }

  parseScreen(groupAddressesRef: any[] | any, topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    let cover: any = {};
    for(let groupAddressRef of this.array(groupAddressesRef)){
      let address = this.getGroupAddress(groupAddressRef);
      if(address == undefined) continue;
      let role = groupAddressRef.Role;
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
    if(Object.keys(cover).length > 0) {
      this.xknx.groups.cover[topologyString] = cover;
      this.homeAssistant.knx.cover.push({
        name: topologyString,
        move_long_address: cover.group_address_long,
        move_short_address: cover.group_address_short,
        position_address: cover.group_address_position,
        position_state_address: cover.group_address_position_feedback
      })
    }
  }

  parseClimate(groupAddressesRef: any[] | any, topologyString: string){
    topologyString = this.cleanTopologyString(topologyString);
    let climate: any = {};
    for(let groupAddressRef of this.array(groupAddressesRef)){
      let address = this.getGroupAddress(groupAddressRef);
      let role = groupAddressRef.Role;
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
    if(Object.keys(climate).length > 0) {
      this.xknx.groups.climate[topologyString] = climate;
      this.homeAssistant.knx.climate.push({
        name: topologyString,
        temperature_address: climate.group_address_temperature,
        target_temperature_address: climate.group_address_target_temperature,
        operation_mode_address: climate.group_address_operation_mode
      })
    }
  }

  getGroupAddress(groupAddressesRef: any){
    //groupAddresses.find(f => f[" $"])
    let refId = groupAddressesRef.RefId;
    if(refId == undefined || refId.length == 0) return undefined;
    let addressObj = this.groupAddresses.find((f: any) => f.Id == refId);
    if(addressObj == undefined) return undefined;
    return this.convertAddressToGroupAddressString(addressObj.Address);
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

  mounted() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
main {
  padding: 25px;
} 
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .info{
    padding: 10px;
    span {
      color: orange;
      font-style: italic;
    }
  }
  .process, .buttons {
    padding: 10px;
    button, input {
      border: 1px solid transparent;
      padding: 5px 10px;color: rgb(209, 111, 0);
      background: unset;
      transition: 0.4s;
      cursor: pointer;
      &:hover {
        border: 1px solid orange;
        color: #fff;
        background-color: rgb(209, 111, 0, 0.5);
        transition: 0.4s;
      }
    }
  }

  .buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
}
</style>