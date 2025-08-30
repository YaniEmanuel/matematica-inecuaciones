// utils.js — helpers chiquitos
window.Utils = {
  randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; },
  formatTime(s){
    const mm=String(Math.floor(s/60)).padStart(2,"0");
    const ss=String(s%60).padStart(2,"0");
    return `${mm}:${ss}`;
  },
  shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }
};

