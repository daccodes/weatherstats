const axios = require('axios');
import './style.css';

const apikey=process.env.API_KEY;

const showCurrentLocation=(data:any, array:any, coordinate:any)=>{
  const div:HTMLDivElement=document.createElement('div');
  let testo="";
  
  if(data.data=="Unknown station"){
      testo+='Mi dispiace, a queste coordinate('+coordinate+'), non è presente alcuna stazione';
  }
  else{
    const params:any=['pm25', 'pm10', 'o3', 'no2', 't', 'p', 'h'];
    const val:any=[];

    for(const v in params){
      if(data.iaqi[params[v]] == undefined){
        val.push("-");
      }
      else{
        val.push(data.iaqi[params[v].replace(/\"/g, "")].v);
      }
    }
    div.innerHTML=
        '<div class="head">'+data.city.name+'</div>'+
        '<div class="cube25">'+array[5]+' : '+val[0]+'</span></div>'+
        '<div class="cube">'+array[4]+' : '+val[1]+'</div>'+
        '<div class="cube">'+array[2]+' : '+val[2]+'</div>'+
        '<div class="cube">'+array[1]+' : '+val[3]+'</div>'+
        '<div class="cube">'+array[6]+' : '+val[4]+'</div>'+
        '<div class="cube">'+array[3]+' : '+val[5]+'</div>'+
        '<div class="cube">'+array[0]+' : '+val[6]+'</div>';
    div.className='container1'
    document.body.appendChild(div)
  }
}

const showStationName=(data:any, array:any)=>{
  const radio1=document.getElementById('scelta1') as HTMLInputElement;
  const text=document.getElementById('citystation') as HTMLInputElement;
  if(data[0]==undefined){
    alert('Questa stazione non esiste, riprovare.');
    radio1.checked=true;
    text.focus();
  }
  else{
    const stationCoords=data[0].station.geo.toString().replace(',',';');
    getCityByLatLng(stationCoords);
  }
}

const showCityName=(data:any, array:any)=>{
  const div:HTMLDivElement=document.createElement('div');
  const params:any=['pm25', 'pm10', 'o3', 'no2', 't', 'p', 'h'];
  const val:any=[];

  for(const v in params){
    if(data.iaqi[params[v]] == undefined){
      val.push("-");
    }
    else{
      val.push(data.iaqi[params[v].replace(/\"/g, "")].v);
    }
  }
  div.innerHTML=
      '<div class="head">'+data.city.name+'</div>'+
      '<div class="cube25">'+array[5]+' : '+val[0]+'</span></div>'+
      '<div class="cube">'+array[4]+' : '+val[1]+'</div>'+
      '<div class="cube">'+array[2]+' : '+val[2]+'</div>'+
      '<div class="cube">'+array[1]+' : '+val[3]+'</div>'+
      '<div class="cube">'+array[6]+' : '+val[4]+'</div>'+
      '<div class="cube">'+array[3]+' : '+val[5]+'</div>'+
      '<div class="cube">'+array[0]+' : '+val[6]+'</div>';
  div.className='container1'
  document.body.appendChild(div);
}

const setData=(data:any, val:Number, coords:any)=>{
  const newTitles=['Umidità', 'NO2', 'O3', 'Pressione', 'PM10', 'PM25', 'Temp.'];

  const loader=document.getElementById('loader') as HTMLDivElement;
  const button=document.getElementById('button') as HTMLButtonElement;
  loader.style.visibility='hidden';
  button.style.visibility = 'visible';
  switch(val){
    case val=0:
      showCityName(data.data.data, newTitles);
      break;
    case val=1:
      showCityName(data.data.data, newTitles)
      break;
    case val=2:
      showStationName(data.data.data, newTitles);
      break;
    case val=3:
      showCurrentLocation(data.data.data,newTitles, coords);
      break;
  }
}
/*la seguente api non è molto precisa poichè si basa sull'IP per tracciare la posizione*/
const getNearestStation=async()=>{
  try {
    const response = await axios.get('https://api.waqi.info/feed/here/?token='+apikey);
    setData(response, 0, null);
  } catch (error) {
    console.error(error);
  }
}

const getCityByName=async(city:String)=> {
  try {
    const response=await axios.get('https://api.waqi.info/feed/'+city+'/?token='+apikey);
    if(response.data.data=="Unknown station"){
      let question=confirm("Stazione sconosciuta, vuoi visualizzare la stazione più vicino a te?");
      if(question==true){ 
        getNearestStation();
      }
    }else{
      setData(response, 1, null);
    }
  } catch (error) {
    console.error(error);
  }
}

const getStationByName=async(citystation:String)=>{
  try{
    const response = await axios.get('https://api.waqi.info/search/?keyword='+citystation+'&token='+apikey);
    setData(response, 2, null);
  } catch(error){
    console.error(error);
  }
}
const getCoords=async()=>{
  navigator.geolocation.getCurrentPosition(async getPosition=>{
    const response=await getPosition.coords.latitude.toFixed(2).toString()+";"+getPosition.coords.longitude.toFixed(2).toString();
    getCityByLatLng(response);
  }, errorCallback);
}
const errorCallback=(error:any)=>{
  const loader=document.getElementById('loader') as HTMLDivElement;
  const button=document.getElementById('button') as HTMLButtonElement;

  if(error.code==error.PERMISSION_DENIED){
    switch(error.code){
      case 0:
        loader.style.visibility='hidden';
        button.style.visibility = 'visible';
        alert("Errore Sconosciuto");
        break;
      case 1:     
        loader.style.visibility='hidden';
        button.style.visibility = 'visible';
        alert("Accesso negato dall'utente!");
        break;
      case 2:
        loader.style.visibility='hidden';
        button.style.visibility = 'visible';
        alert("Posizione non disponibile");
        break;
      case 3:
        loader.style.visibility='hidden';
        button.style.visibility = 'visible';
        alert("Tempo scaduto!");
    }
  }
}

const getCityByLatLng=async(coordinate:any)=>{
  try {
      const response = await axios.get('https://api.waqi.info/feed/geo:'+coordinate.toString()+'/?token='+apikey);
      setData(response, 3, coordinate); 
    } catch (error) {
      console.error(error);
  }
}

const searchFunction=()=>{
  try {
    const loader=document.getElementById('loader') as HTMLDivElement;
    const button=document.getElementById('button') as HTMLButtonElement;
    const text=document.getElementById('citystation') as HTMLInputElement;
    const radio=document.querySelectorAll<HTMLInputElement>('input[name="radio"]') ;
    let selectedValue:String;
    
    radio.forEach(el=>{
      if(el.checked){
        selectedValue=el.value;
      }
    });
    /*controllo l'inserimento*/
    
    switch(selectedValue){
      case '1':
        if(text.value==""){
          text.classList.add('redinput');
          text.placeholder="Questo campo non può essere vuoto";
          text.focus();
          }
          else{
            text.classList.remove('redinput'); 
            getCityByName(text.value);
            text.placeholder="";

            button.style.visibility='hidden';
            loader.style.visibility = 'visible';
          }
        
        break;
      case '2':
        if(text.value==""){
          text.classList.add('redinput');
          text.placeholder="Non puoi lasciare lo spazio vuoto!";
          
          text.focus();
          }
          else{
            text.classList.remove('redinput'); 
            getStationByName(text.value);
            text.placeholder="";

            button.style.visibility='hidden';
            loader.style.visibility = 'visible';
          } 
        
        break;
      case '3':
        getCoords();

        button.style.visibility='hidden';
        loader.style.visibility = 'visible';
        break;
    }
    /*Pulisco gli input */
    radio.forEach(el=>{
      el.checked=false;
    });
    text.value="";

  } catch (error) {
    console.error(error);
  }   
}



const modinptext=()=>{
  try {
    const text=document.getElementById('citystation') as HTMLInputElement;
    const radio=document.querySelectorAll<HTMLInputElement>('input[name="radio"]') ;
    let selectedValue:String;
    radio.forEach(el=>{
      if(el.checked){
        selectedValue=el.value;
      }
    });
    switch(selectedValue){
      case '1':
        text.value="";
        text.hidden=false;
        text.placeholder="Inserisci il nome della città"
        text.focus();
        break;
      case '2':
        text.value="";
        text.hidden=false;
        text.placeholder="Inserisci il nome della stazione meteo"
        text.focus();
        break;
      case '3':
        text.hidden=true;
        text.focus();
        break;
    }
  } catch (error) {
    console.error(error);
  }   
}


function drawPage(){ 
  const div0:HTMLParagraphElement=document.createElement("div");
  const div: HTMLDivElement=document.createElement('div');
  const div1: HTMLDivElement=document.createElement('div');
  const p:HTMLParagraphElement=document.createElement('p');
  const inpText: HTMLInputElement=document.createElement('input');
  const inpRadio1: HTMLInputElement=document.createElement('input');
  const label1:HTMLLabelElement=document.createElement('label');
  const inpRadio2: HTMLInputElement=document.createElement('input');
  const label2:HTMLLabelElement=document.createElement('label');
  const inpRadio3: HTMLInputElement=document.createElement('input');
  const label3:HTMLLabelElement=document.createElement('label');
  const btn: HTMLButtonElement=document.createElement('button');
  const loader:HTMLDivElement=document.createElement('div');

  loader.className='lds-dual-ring';
  loader.id='loader';

  div0.className='box';
  p.className='title';
  p.innerHTML="Seleziona la tipologia di ricerca:"
  div.className='container';
  
  div1.className='radiobox';

  inpText.className='textinput';
  inpText.id='citystation';
  
  inpRadio1.type='radio';
  inpRadio1.name='radio';
  inpRadio1.value='1';
  inpRadio1.id='scelta1';
  inpRadio1.className='cube1';
  inpRadio1.onchange=modinptext;
  
  label1.htmlFor='scelta1';
  label1.innerText='Città';
  label1.className='';

  inpRadio2.type='radio';
  inpRadio2.name='radio';
  inpRadio2.value='2';
  inpRadio2.id='scelta2';
  inpRadio2.className='cube1';
  inpRadio2.onchange=modinptext;
  label2.htmlFor='scelta2';
  label2.innerText='Stazione Meteo';

  inpRadio3.type='radio';
  inpRadio3.name='radio';
  inpRadio3.value='3';
  inpRadio3.id='scelta3';
  inpRadio3.className='cube1';
  inpRadio3.onchange=modinptext;
  label3.htmlFor='scelta3';
  label3.innerText='La tua Posizione';
  
  btn.id='button';
  btn.className='button';
  btn.innerText="Search";
  btn.onclick=searchFunction;

  div0.appendChild(div);
  div.appendChild(p);
  div.appendChild(div1);
  div1.appendChild(inpRadio1);
  div1.appendChild(label1);
  div1.appendChild(inpRadio2);
  div1.appendChild(label2);
  div1.appendChild(inpRadio3);
  div1.appendChild(label3);
  div.appendChild(inpText);
  div.appendChild(btn);
  div.appendChild(loader);

  return div0;
}

document.body.appendChild(drawPage())

document.body.onload=()=>{
  const radio1=document.getElementById('scelta1') as HTMLInputElement;
  const text=document.getElementById('citystation') as HTMLInputElement;
  const loader=document.getElementById('loader') as HTMLDivElement;
  loader.style.visibility='hidden';
  radio1.checked=true;
  text.focus();
  modinptext();
}

