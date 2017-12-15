var voices;
var utteranceIndex = 0;
var sIndex = 0;
var isRunning = 1;
var repeatCounter = 1;

var arrayOfLines ;
function speak(utterance, highlightText) {
  var options = {
    'enqueue' : Boolean(enqueue.value),
    'lang': lang.value,
    'pitch': Number(pitch.value),
    'rate': Number(rate.value),
    'volume': Number(volume.value),
    'voiceName': document.getElementById('voices').value,
    'onEvent': function(event) {
        console.debug(utteranceIndex, event);
        if (event.type == 'error') {
          console.error(event);
        }
        if (highlightText) {
          //text.setSelectionRange(0, event.charIndex);
        }
        if (event.type == 'end' ||
            event.type == 'interrupted' ||
            event.type == 'cancelled' ||
            event.type == 'error') {
          chrome.tts.isSpeaking(function(isSpeaking) {
            if (!isSpeaking && isRunning==1) {
			  
			  if(repeatCounter>=repeat.value)
			  {
				  sIndex=sIndex+1;
				  repeatCounter=1;
				  if((sIndex)==arrayOfLines.length){
					  document.getElementById('srctext').style.visibility = "visible"
				  }
			  }
			  else{
				  repeatCounter=repeatCounter+1;
				  
			  }
			  Jump(sIndex);
			  chrome.storage.local.set({ "sIndex":sIndex }, function(){
	     	     console.log("sIndex : "+ sIndex ); 
	          });
	          counter.innerHTML=(sIndex) +" / " +arrayOfLines.length;
			  speak(arrayOfLines[sIndex], true);
              ttsStatus.textContent = 'Idle';
              ttsStatusBox.classList.remove('busy');
            } 
          });
        }
    }
  };
  console.debug(++utteranceIndex, options);
  var delayTime=Number(delay.value)*1000;
  if(sIndex>0){
	  delayTime= delayTime+arrayOfLines[sIndex-1].length/Number(len.value)*1000;
  }
  setTimeout(function(){
	  chrome.tts.speak(utterance, options);
	  ttsStatus.textContent = 'Busy' ;
      ttsStatusBox.classList.add('busy');
  }, delayTime);
   
}





 setTimeout(function(){
	 
	var enqueue = document.getElementById('enqueue');
	var lang = document.getElementById('lang');
	var pitch = document.getElementById('pitch');
	var rate = document.getElementById('rate');
	var text = document.getElementById('srctext');
	var ttsStatusBox = document.getElementById('ttsStatusBox');
	var ttsStatus = document.getElementById('ttsStatus');
	var voiceInfo = document.getElementById('voiceInfo');
	var voicesSelect = document.getElementById('voices');
	var volume = document.getElementById('volume');
	var delay = document.getElementById('delay');
	var len = document.getElementById('len');
	var delayValue = document.getElementById('delayValue');
	var lenValue = document.getElementById('lenValue');
	var counter = document.getElementById('counter');
	
	var repeat = document.getElementById('repeat');
	var repeatValue = document.getElementById('repeatValue');
	
	delay.addEventListener('change', function() {
		delayValue.innerHTML=delay.value +" sec";
		chrome.storage.local.set({ "delay": Number(delay.value) }, function(){
		console.log("delay save : "+  Number(delay.value) ); 
		   });
	});

	len.addEventListener('change', function() {
	  lenValue.innerHTML="1 / "+len.value +" Weight";
	   chrome.storage.local.set({ "len": Number(len.value) }, function(){
		console.log("len save : "+  Number(len.value) ); 
	   });
	});
	
	repeat.addEventListener('change', function() {
		repeatValue.innerHTML=repeat.value +" time";
		chrome.storage.local.set({ "repeat": Number(repeat.value) }, function(){
		console.log("repeat save : "+  Number(repeat.value) ); 
		   });
	});

	voicesSelect.addEventListener('change', function() {
	  voiceInfo.textContent = '';
	  for (var i = 0; i < voices.length; i++) {
		if (voices[i].voiceName === this.value) {
		    voiceInfo.textContent = JSON.stringify(voices[i], null, 2);
		   
		    chrome.storage.local.set({ "voicesSelect":voiceInfo.textContent }, function(){
	     	  console.log("text srctext : "+ voiceInfo.textContent ); 
	       });
		   
		    chrome.storage.local.set({ "voicesValue":this.value }, function(){
	     	  console.log("text srctext : "+ this.value ); 
	        });
	   
		  break;
		}
	  }
	});

	chrome.tts.getVoices(function(availableVoices) {
	   voices = availableVoices;
	  for (var i = 0; i < voices.length; i++) {
		voicesSelect.add(new Option(voices[i].voiceName, voices[i].voiceName));
	  }
 	});


	document.getElementById('speak').addEventListener('click', function() {
	  isRunning=1;
 	  text.style.visibility = "hidden"
	  arrayOfLines = text.value.match(/[^\r\n]+/g);
	  chrome.storage.local.set({ "srctext": text.value }, function(){
		console.log("text srctext : "+  text.value ); 
	   });
	  speak(arrayOfLines[sIndex], true);
	});
	
	document.getElementById('stop').addEventListener('click', function() {
	   isRunning=0;
	   document.getElementById('srctext').style.visibility = "visible"
	});
	
	document.getElementById('reset').addEventListener('click', function() {
	   sIndex=0;
	    chrome.storage.local.set({ "sIndex":sIndex }, function(){
	     	     console.log("sIndex : "+ sIndex ); 
	          });
	});

    document.getElementById('show').addEventListener('click', function() {
	   document.getElementById('srctext').style.visibility = "visible"
	});

	 chrome.storage.local.get("delay", function(items){
		delay.value= items.delay;
		delayValue.innerHTML=delay.value +" sec";
		console.log("text delay : "+  items ); 
     });
	  
	 chrome.storage.local.get("srctext", function(items){

		  console.log("srctext save : "+  items.srctext); 
		  text.value= items.srctext;
      });
	 
	 chrome.storage.local.get("len", function(items){
		len.value= items.len;
		lenValue.innerHTML="1 / "+len.value +" Weight";
		console.log("text len : "+  items ); 
     });
	 
     chrome.storage.local.get("voicesSelect", function(items){
		voiceInfo.textContent= items;
		console.log("voicesSelect: "+  items ); 
      });
	  
	  chrome.storage.local.get("voicesSelect", function(items){
		voiceInfo.textContent= items;
		console.log("voicesSelect: "+  items ); 
      });
      
	  chrome.storage.local.get("voicesValue", function(items){
	     voicesSelect.value=items.voicesValue;
	   	console.log("voicesValue: "+  items ); 
        });
	  
	  chrome.storage.local.get("repeat", function(items){
		repeat.value= items.repeat;
		repeatValue.innerHTML=repeat.value +" Time";
		console.log("repeat: "+  items +" Time" ); 
     });
	 
	 chrome.storage.local.get("sIndex", function(items){
		 if(items.sIndex==undefined)
		 {
			sIndex= 1;
		 }else{
			 sIndex= items.sIndex;
		 }
		
		arrayOfLines = text.value.match(/[^\r\n]+/g);
		counter.innerHTML=(sIndex) +" / " +arrayOfLines.length;
     });
	 
  }, 500);
  
function Jump(line)
{
  var ta = document.getElementById("srctext");
  var lineHeight = ta.clientHeight / ta.rows;
  var jump = (line-1) * lineHeight;
  ta.scrollTop = jump;
}


 



