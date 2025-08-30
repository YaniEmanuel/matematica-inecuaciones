// inecuaciones.js — genera |x - h| ? c y arma todo (enunciado, opciones, pasos, dibujo)
(function(){
  window.generarInecuacion = function(dif){
    const h = Utils.randInt(-6,6);
    const c = (dif==="facil") ? Utils.randInt(1,4)
            : (dif==="dificil") ? Utils.randInt(5,9)
            : Utils.randInt(2,7);
    const ops = ["<","<=",">",">="];
    const op  = ops[Utils.randInt(0,ops.length-1)];
    const enunciado = `|x ${h>=0? "-" : "+"} ${Math.abs(h)}| ${op} ${c}`;

    // extremos teóricos
    const L = h - c, R = h + c;

    const pasos = [];
    let solucion = "";
    let partes = []; // instrucciones para la recta

    if(op === "<" || op === "<="){
      const abierto = (op === "<");
      pasos.push(`Partimos de: ${enunciado}`);
      pasos.push(`Desdoblo: -${c} ${op} x - ${h} ${op} ${c}`);
      pasos.push(`Sumo ${h} en los tres lados: ${L} ${op} x ${op} ${R}`);
      pasos.push(`Intervalo entre ${L} y ${R} ${abierto? "abierto":"cerrado"} en ambos extremos.`);
      const a = abierto ? "(" : "[";
      const b = abierto ? ")" : "]";
      solucion = `x ∈ ${a}${L}, ${R}${b}`;
      partes = [{tipo:"segmento", desde:L, hasta:R, cerradoIzq:!abierto, cerradoDer:!abierto}];
    }else{
      const cerrado = (op === ">=");
      pasos.push(`Partimos de: ${enunciado}`);
      pasos.push(`Dos casos: x - ${h} ${op} ${c}  ó  x - ${h} ${op} -${c}`);
      pasos.push(`Sumo ${h}: x ${op} ${R}  ó  x ${op} ${L}`);
      pasos.push(`Dos rayos: x ${cerrado?"≥":">"} ${R}  y  x ${cerrado?"≤":"<"} ${L}.`);
      solucion = cerrado
        ? `x ∈ (-∞, ${L}] ∪ [${R}, ∞)`
        : `x ∈ (-∞, ${L}) ∪ (${R}, ∞)`;
      partes = [
        {tipo:"rayo-izq", hasta:L, cerrado:cerrado},
        {tipo:"rayo-der", desde:R, cerrado:cerrado},
      ];
    }

    // Distractores plausibles
    const interior = `x ∈ (${L}, ${R})`;
    const cerradoAmbos = `x ∈ [${L}, ${R}]`;
    const rayoIzq = `x ∈ (-∞, ${R})`;
    const rayoDer = `x ∈ (${L}, ∞)`;

    let opciones = (op===">"||op===">=")
      ? [solucion, interior, cerradoAmbos, `x ∈ (-∞, ${L}) ∪ (${R}, ∞)`]
      : [solucion, cerradoAmbos, interior, rayoIzq];

    opciones = Array.from(new Set(opciones)).slice(0,4);
    while(opciones.length<4) opciones.push(rayoDer);

    const idx = Utils.shuffle([0,1,2,3]);
    const opcionesMez = idx.map(i=>opciones[i]);
    const correcta = idx.indexOf(0);

    // Dibujo coherente con L y R
    function draw(container){
      container.innerHTML = "";
      const margen = Math.max(2, Math.ceil((R-L)*0.4));
      const minX = Math.min(L, R) - margen;
      const maxX = Math.max(L, R) + margen;
      const w = container.clientWidth || 720;
      const map = x => ((x - minX) / (maxX - minX)) * w;

      partes.forEach(p=>{
        if(p.tipo==="segmento"){
          const seg = document.createElement("div");
          seg.className="seg";
          seg.style.left  = map(p.desde) + "px";
          seg.style.width = Math.max(2, map(p.hasta)-map(p.desde)) + "px";
          container.appendChild(seg);
          marca(p.desde, p.cerradoIzq);
          marca(p.hasta, p.cerradoDer);
        }else if(p.tipo==="rayo-izq"){
          const seg = document.createElement("div");
          seg.className="seg";
          seg.style.left  = "0px";
          seg.style.width = Math.max(2, map(p.hasta)) + "px";
          container.appendChild(seg);
          marca(p.hasta, p.cerrado);
        }else if(p.tipo==="rayo-der"){
          const seg = document.createElement("div");
          seg.className="seg";
          seg.style.left  = map(p.desde) + "px";
          seg.style.width = Math.max(2, w - map(p.desde)) + "px";
          container.appendChild(seg);
          marca(p.desde, p.cerrado);
        }
      });

      function marca(x, cerrado){
        const m=document.createElement("div");
        m.className="mark"+(cerrado?" filled":"");
        m.style.left = map(x)+"px";
        container.appendChild(m);
        const lab=document.createElement("div");
        lab.className="legend";
        lab.style.left = map(x)+"px";
        lab.textContent = x;
        container.appendChild(lab);
      }
    }

    return { enunciado, opciones: opcionesMez, correcta, pasos, draw, L, R, op };
  };
})();

