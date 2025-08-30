// app.js — une UI + generador + timer
(function(){
  const $ = s => document.querySelector(s);
  const on = (el,ev,fn)=> el && el.addEventListener(ev,fn);

  const selDific = $("#sel-dificultad");
  const chkTimer = $("#chk-timer");
  const btnNuevo = $("#btn-nuevo");
  const btnComp  = $("#btn-comprobar");
  const btnSol   = $("#btn-solucion");
  const btnSig   = $("#btn-siguiente");

  const lblTimer = $("#timer");
  const lblMsg   = $("#msg");
  const elEnun   = $("#enunciado");
  const elOps    = $("#lista-opciones");
  const elFeed   = $("#feedback");
  const elPasos  = $("#pasos");
  const elGraf   = $("#grafico");

  let ejercicio=null, seleccion=null, timeLeft=300, timerId=null;

  function nuevo(){
    limpiar();
    ejercicio = window.generarInecuacion(selDific.value);
    render(ejercicio);
  }

  function render(ej){
    elEnun.textContent = ej.enunciado;
    elOps.innerHTML = ej.opciones.map((t,i)=>`<li><button class="opt" data-i="${i}">${t}</button></li>`).join("");
    seleccion=null; btnComp.disabled=true; btnSol.disabled=true; btnSig.disabled=true;
    elFeed.textContent = "Elegí una opción y después comprobá.";
    elPasos.innerHTML = `<li class="muted">Todavía no hay nada generado.</li>`;
    elGraf.innerHTML = "";

    elOps.querySelectorAll(".opt").forEach(b=>{
      on(b,"click",()=>{
        elOps.querySelectorAll(".opt").forEach(x=>x.classList.remove("is-selected"));
        b.classList.add("is-selected");
        seleccion = parseInt(b.dataset.i,10);
        btnComp.disabled=false;
      });
    });

    if(chkTimer.checked){ startTimer(300); } else { stopTimer(); lblTimer.textContent="⏱ 05:00"; }
    lblMsg.textContent = "Ejercicio generado.";
  }

  function comprobar(){
    if(seleccion==null) return;
    elOps.querySelectorAll(".opt").forEach((b,i)=>{
      b.disabled=true;
      if(i===ejercicio.correcta) b.classList.add("is-correct");
      if(i===seleccion && i!==ejercicio.correcta) b.classList.add("is-wrong");
    });
    elFeed.innerHTML = (seleccion===ejercicio.correcta) ? "✅ Correcto." : "❌ Incorrecto.";
    btnSol.disabled=false; btnSig.disabled=false;
  }

  function mostrarSol(){
    elPasos.innerHTML = ejercicio.pasos.map(p=>`<li>${p}</li>`).join("");
    elGraf.innerHTML = "";
    ejercicio.draw(elGraf);
  }

  function limpiar(){
    elEnun.textContent="—";
    elOps.innerHTML="";
    elFeed.textContent="Elegí una opción y después comprobá.";
    elPasos.innerHTML=`<li class="muted">Todavía no hay nada generado.</li>`;
    btnComp.disabled=true; btnSol.disabled=true; btnSig.disabled=true;
  }

  function startTimer(s){
    stopTimer(); timeLeft=s; updateTimer();
    timerId=setInterval(()=>{
      timeLeft--; updateTimer();
      if(timeLeft<=0){
        stopTimer();
        elFeed.innerHTML = "⏰ Tiempo agotado. Mirá la solución.";
        elOps.querySelectorAll(".opt").forEach(b=>b.disabled=true);
        btnSol.disabled=false; btnSig.disabled=false;
        mostrarSol();
      }
    },1000);
  }
  function stopTimer(){ if(timerId) clearInterval(timerId); timerId=null; }
  function updateTimer(){ lblTimer.textContent = "⏱ " + Utils.formatTime(timeLeft); }

  on(btnNuevo,"click",nuevo);
  on(btnComp,"click",comprobar);
  on(btnSol,"click",mostrarSol);
  on(btnSig,"click",nuevo);
  on(chkTimer,"change",()=>{ if(ejercicio) chkTimer.checked?startTimer(300):stopTimer(); });

  // Arranco generando uno
  nuevo();
})();

