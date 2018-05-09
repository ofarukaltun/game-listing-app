import React, { Component } from 'react';
import logo from './dice_logo.png';
import nFound from './n_found.jpg';
import './App.css';
import { Nav, NavItem, NavLink, Label, Media } from 'reactstrap';
import Img from 'react-image';

var dataArray = [];
var genreArray = ['', '', '', '', ''];
var platformDataArray = [];
var platformArray = ['', '', '', '', ''];
var imageDataArray = [];
var imageURLArray = ['', '', '', '', ''];
var imageNameArray = ['', '', '', '', ''];



function findPlatformId(pArr, pName) {
   
    for (var i = 0; i < pArr.length; i++){
        
        if (pArr[i].name === pName) {
            
            return pArr[i].id;}
            
            
}
}
function findGenreId(gArr,gName){
    for(var i=0;i<gArr.length;i++){
        if(gArr[i].name===gName)
            return gArr[i].id;
}
}
function myFunc() {
    
   
    var data = "{\r\n    \"api_header\": {\r\n        \"header\": \"Access-Control-Allow-Origin\",\r\n        \"value\": \"localhost:3000\"\r\n    }\r\n}";
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            dataArray = JSON.parse(xhr.responseText);
            genreArray = [];
            for (var i in dataArray) {
                genreArray.push(dataArray[i].name);
            }
        }
    });
    
   
    xhr.open("GET", "https://igdb-proxy.herokuapp.com/genres/?fields=*&limit=5");
    xhr.setRequestHeader("user-key", "077bf703247ae187ee0aceec01e29039");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(data);
 

   
} 
function platformFetch() {


    var data = "{\r\n    \"api_header\": {\r\n        \"header\": \"Access-Control-Allow-Origin\",\r\n        \"value\": \"localhost:3000\"\r\n    }\r\n}";
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            platformDataArray = JSON.parse(xhr.responseText);
            platformArray = [];
            for (var i in platformDataArray) {
                platformArray.push(platformDataArray[i].name);
            }
        }
    });


    xhr.open("GET", "https://igdb-proxy.herokuapp.com/platforms/?fields=*&limit=5");
    xhr.setRequestHeader("user-key", "077bf703247ae187ee0aceec01e29039");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(data);



} 
function imageFetcingOperation(myapp,pArr,gArr,myActiveGenre,myActivePlatform) {
    
    var data = "{\r\n    \"api_header\": {\r\n        \"header\": \"Access-Control-Allow-Origin\",\r\n        \"value\": \"localhost:3000\"\r\n    }\r\n}";
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", eventListenerFunc);
    function eventListenerFunc() {
        if (this.readyState === 4) {
            imageDataArray = JSON.parse(xhr.responseText);

            
            myapp.state.imageURLs = [];
            myapp.state.imageNames = [];

            for (var i in imageDataArray) {
                if (imageDataArray[i].cover != null)
                    if (myapp.state.imageURLs.length<5)
                        myapp.state.imageURLs.push(imageDataArray[i].cover.url);
                if (imageDataArray[i].name != null)
                    if (myapp.state.imageNames.length < 5)
                        myapp.state.imageNames.push(imageDataArray[i].name);

            }
        }
    }

    xhr.open("GET", "https://igdb-proxy.herokuapp.com/games/?fields=*&filter[platforms][eq]=" + String(findPlatformId(pArr, myActivePlatform)) + "&filter[genres][eq]=" + String(findGenreId(gArr, myActiveGenre)));
    xhr.setRequestHeader("user-key", "077bf703247ae187ee0aceec01e29039");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(data);

}

function genreButtonCreator(genreName, myapp, p , g) {
    return (<NavItem style={{
        marginTop: '50px',
        backgroundColor: (myapp.state.activeTab === genreName) ? 'black' : 'rgb(150,150,150)',
        color: (myapp.state.activeTab === genreName) ? 'white' : 'black',
        maxWidth: '200px',
        maxHeight: '50px',
        minWidth: '200px',
        minHeight: '50px',
        display: 'inline-block',
        marginLeft: '30px',
        padding: '0px',
        cursor: 'pointer'
        }
    } 
        onClick={() => {
            myapp.toggle(genreName);
            if (myapp.state.activeTab != '1' && myapp.state.activeTabPlatform != '1') { imageFetcingOperation(myapp, p, g, genreName, myapp.state.activeTabPlatform);}
           
        }}>
        <NavLink className={"Genre" + genreName} > {genreName} </NavLink></NavItem>);
}

function genreBatchGenerator(genreNames, myapp,pDatas,gDatas) {
    var genreBatch = [];
    for (var i = 0; i < genreNames.length; i++) {
        genreBatch.push(genreButtonCreator(genreNames[i], myapp, pDatas, gDatas));
    }

    return genreBatch;
}

function platformButtonCreator(platformName, myapp,p,g) {
    return (<NavItem style={{
        marginTop: '10px',
        backgroundColor: (myapp.state.activeTabPlatform === platformName) ? 'black' : 'rgb(150,150,150)',
        color: (myapp.state.activeTabPlatform === platformName) ? 'white' : 'black',
        maxWidth: '200px',
        maxHeight: '50px',
        minWidth: '200px',
        minHeight: '50px',
        display: 'inline-block',
        marginLeft: '30px',
        padding: '0px',
        cursor: 'pointer'
    }
    } 
        onClick={() => {
            myapp.togglePlatform(platformName);
            if (myapp.state.activeTab != '1' && myapp.state.activeTabPlatform != '1') { imageFetcingOperation(myapp, p, g, myapp.state.activeTab, platformName); }
                
           
        }}>
        <NavLink className={"Platform" + platformName} > {platformName} </NavLink></NavItem>);
}

function platformBatchGenerator(platformNames, myapp,gDatas,pDatas) {
    var platformBatch = [];
    for (var i = 0; i < platformNames.length; i++) {
        platformBatch.push(platformButtonCreator(platformNames[i], myapp, pDatas,gDatas));
    }
    return platformBatch;
}



function imageBatchGenerator(myapp) {
    var batch = [];
    if (myapp.state.imageNames.length > 0) {
        
        for (var i = 0; i < myapp.state.imageNames.length && i < myapp.state.imageURLs.length; i++) {
            batch.push(<figure style={{ float: 'left', display: 'inline-block' }}><Img src={myapp.state.imageURLs[i]} alt={myapp.state.imageNames[i]} width="110" height="150" style={{ marginLeft: '20px' }} ></Img>
                    <figcaption>{myapp.state.imageNames[i]}</figcaption></figure>)
        }
        if (batch.length < 5) {
            for (var s = batch.length; s < 5; s++) {
                batch.push(<figure style={{ float: 'left', display: 'inline-block' }}><Img src={nFound} alt="NO IMAGE" width="110" height="150" style={{ marginLeft: '20px' }} ></Img></figure>);
            }
        }
    }
    else {
        for (var k = 0; k < 5; k++) {
            batch.push(<Img src={nFound} alt="NO IMAGE" width="110" height="150" style={{marginLeft : '70px'}} ></Img>)
        }
    }
    return (batch);
}


myFunc();
platformFetch();


class App extends Component {

    
    constructor() {
        super();
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            activeTabPlatform: '1',
            imageURLs: [],
            imageNames: [],
            trick: '.'
           };
              
        
    }
         toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
                

            });
           
        }
    }
         togglePlatform(tab) {
             if (this.state.activeTabPlatform !== tab) {
                 this.setState({
                     activeTabPlatform: tab


                 });

             }
         }

         
    render() {
       
        return ([
            <div className="App" >
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Games To Play</h1>
                </header>
        <div>
        <Label style={{
            fontSize: '25px',
            fontFamily: 'Trebuchet MS',
            float: 'left',
            marginLeft: '150px',
            marginRight: '0px',
            marginTop: '80px' ,
            padding: '0px',
            
                }}>Genre&nbsp;&emsp;&nbsp;</Label>
        <div >
                    
                    
                    <Nav tabs activetab={this.state.activeTab} className="GenreTabs" id="NavBar1" >

                        {genreBatchGenerator(genreArray, this, platformDataArray, dataArray)}
                        
          
                     
                    </Nav>
                </div>
        <Label style={{
            fontSize: '25px',
            fontFamily: 'Trebuchet MS',
            float: 'left',
            marginLeft: '150px',
            marginRight: '0px',
            marginTop: '35px',
            padding: '0px',
            
        }}> Platforms </Label>
        <div>
                   
                    <Nav tabs activetab={this.state.activeTabPlatform} className="PlatformTabs" id="NavBar2" >

                        {platformBatchGenerator(platformArray, this, dataArray, platformDataArray)}
                        


                    </Nav>
                    
                </div>

        

        <div style={{ display: 'inline-block' }}>

                    {imageBatchGenerator(this)}
                    
                    
                    
         </div>
        
                </div>
                </div>

   ] );
  }
}

export default App;
