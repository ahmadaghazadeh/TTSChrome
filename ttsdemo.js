var voices;
var utteranceIndex = 0;
var sIndex = 0;

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
var arrayOfLines ;
function speak(utterance, highlightText) {
  var options = {
    'enqueue' : Boolean(enqueue.value),
    'lang': lang.value,
    'pitch': Number(pitch.value),
    'rate': Number(rate.value),
    'volume': Number(volume.value),
    'voiceName': voicesSelect.value,
    'onEvent': function(event) {
        console.debug(utteranceIndex, event);
        if (event.type == 'error') {
          console.error(event);
        }
        if (highlightText) {
          text.setSelectionRange(0, event.charIndex);
        }
        if (event.type == 'end' ||
            event.type == 'interrupted' ||
            event.type == 'cancelled' ||
            event.type == 'error') {
          chrome.tts.isSpeaking(function(isSpeaking) {
            if (!isSpeaking) {
				sIndex=sIndex+1;
			  speak(arrayOfLines[sIndex], true);
			  
              ttsStatus.textContent = 'Idle';
              ttsStatusBox.classList.remove('busy');
            }
          });
        }
    }
  };
  console.debug(++utteranceIndex, options);
  var delayTime=Number(delay.value)*1000+  utterance.length/Number(len.value)*1000;
  setTimeout(function(){
	  chrome.tts.speak(utterance, options);
	  ttsStatus.textContent = 'Busy - '+utterance ;
      ttsStatusBox.classList.add('busy');
  }, delayTime);
  

 
}

 setTimeout(function(){
	 chrome.storage.local.get("delay", function(items){
		delay.value= items;
     });
	  
	 chrome.storage.local.get("srctext", function(items){

		  console.log("srctext save : "+  items.srctext); 
		  text.value= items.srctext;
      });
	 
	 chrome.storage.local.get("len", function(items){
		len.value= items;
     });
	 
  }, 500);
  


 

document.getElementById('speak').addEventListener('click', function() {
  arrayOfLines = text.value.match(/[^\r\n]+/g);
  chrome.storage.local.set({ "srctext": text.value }, function(){
    console.log("text srctext : "+  text.value ); 
   });
  speak(arrayOfLines[sIndex], true);
});

document.getElementById('stop').addEventListener('click', function() {
  chrome.tts.stop();
});

document.getElementById('delay').addEventListener('change', function() {
   delayValue.innerHTML=delay.value +" sec";
   chrome.storage.local.set({ "delay": Number(delay.value) }, function(){
    console.log("delay save : "+  Number(delay.value) ); 
   });
});

len.addEventListener('change', function() {
   lenValue.innerHTML=len.value +" Weight";
   chrome.storage.local.set({ "len": Number(len.value) }, function(){
    console.log("len save : "+  Number(len.value) ); 
   });
});

 


voicesSelect.addEventListener('change', function() {
  voiceInfo.textContent = '';
  for (var i = 0; i < voices.length; i++) {
    if (voices[i].voiceName === this.value) {
      voiceInfo.textContent = JSON.stringify(voices[i], null, 2);
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

