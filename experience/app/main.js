/**
 * @fileoverview 
 * This is our main A-Frame application.
 * It defines the main A-Frame Scene which gets mounted root div.
 */

import { h, Component } from 'preact'
import { Entity, Scene } from 'aframe-react'

class Main extends Component {

  render() {
    AFRAME.registerComponent('starthandler', {
      init:function() {
        let audio = document.querySelector("#audio");
        // let welcomevideo = document.querySelector("#welcomevideo");
        let skybox = document.querySelector("#skybox");

        this.el.addEventListener('click', () => {
                  audio.play();
                  // welcomevideo.pause();
                  // welcomevideo.components.material.material.map.image.pause();
                  // welcomevideo.remove();
                  skybox.setAttribute("scale","-1 1 1");

        });
      }
    })
    AFRAME.registerComponent('hotspots',{
      init:function(){
          this.el.addEventListener('reloadspots',function(evt){
          
          //get the entire current spot group and scale it to 0
          var currspotgroup=document.getElementById(evt.detail.currspots);
          currspotgroup.setAttribute("scale","0 0 0");
          
          //get the entire new spot group and scale it to 1
          var newspotgroup=document.getElementById(evt.detail.newspots);
          newspotgroup.setAttribute("scale","1 1 1");
        });
      }
    });
    AFRAME.registerComponent('spot',{
      schema:{
        linkto:{type:"string",default:""},
        spotgroup:{type:"string",default:""}
      },
      init:function(){
        
        //add image source of hotspot icon
        this.el.setAttribute("src","#hotspot");
        //make the icon look at the camera all the time
        this.el.setAttribute("look-at","#cam");
        
        var data=this.data;
        
        this.el.addEventListener('click',function(){
          let cursor = document.querySelector("#cursor");
          cursor.setAttribute('scale', {x: 1, y: 1, z: 1});

          //set the skybox source to the new image as per the spot
          var sky=document.getElementById("skybox");
          sky.setAttribute("src",data.linkto);
          
          var spotcomp=document.getElementById("spots");
          var currspots=this.parentElement.getAttribute("id");
          //create event for spots component to change the spots data
          spotcomp.emit('reloadspots',{newspots:data.spotgroup,currspots:currspots});
        });
      }
    });
    return (
      <Scene>
        <a-assets>
          <audio crossOrigin id="audio" src="snd/birds.mp3" loop="true"></audio>
          <img crossOrigin id="hotspot" src="img/immerso-btn.png"></img>
          <img crossOrigin id="point1" src="img/bg360.png"></img>
          <img crossOrigin id="point2" src="img/lacatalina.jpg"></img>
          <img crossOrigin id="point3" src="img/rancho.jpg"></img>
        </a-assets>
        
        <Entity id="spots" hotspots>
          <Entity id="group-point1">
            <a-image spot="linkto:#point2;spotgroup:group-point2" position="0 2.1 -2" starthandler></a-image>
          </Entity>
          <Entity id="group-point2" scale="0 0 0">
            <a-image spot="linkto:#point3;spotgroup:group-point3" position="5 1.6 2.5"></a-image>
          </Entity>
          <Entity id="group-point3" scale="0 0 0">
            <a-image spot="linkto:#point2;spotgroup:group-point2" position="-5 1.6 1"></a-image>
          </Entity>
        </Entity>

        <Entity primitive="a-camera" id="cam">
          <Entity
            id="cursor"
            primitive="a-cursor"
            material="shader:flat;color:#00F0A1"
            cursor="fuse:true;fuseTimeout:2000"
            animation__mouseenter="property:scale;to:3 3 3;startEvents:mouseenter;endEvents:mouseleave;dur:300;"
            animation__mouseleave="property:scale;to:1 1 1;startEvents:mouseleave;endEvents:mouseenter;dur:300;"
          />
        </Entity>

        <Entity
          primitive="a-sky"
          id="skybox"
          src="#point1"
        />
        
      </Scene>
    )
  }
}

export default Main
