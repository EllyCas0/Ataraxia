const $ = (selector) => document.querySelector(selector);

const routes = [
  { id: "onboarding", label: "Inicio", icon: "◌", title: "Intereses", kicker: "Bienvenida" },
  { id: "today", label: "Hoy", icon: "?", title: "Pregunta del dia", kicker: "Hoy" },
  { id: "explore", label: "Explorar", icon: "⌕", title: "Explorar filosofia", kicker: "Biblioteca" },
  { id: "branches", label: "Ramas", icon: "§", title: "Ramas filosoficas", kicker: "Mapa" },
  { id: "traditions", label: "Tradiciones", icon: "◇", title: "Tradiciones", kicker: "Pluralidad" },
  { id: "idea", label: "Idea", icon: "※", title: "Problema filosofico", kicker: "Ficha" },
  { id: "constellations", label: "Constelaciones", icon: "✣", title: "Constelacion intelectual", kicker: "Relaciones" },
  { id: "paths", label: "Rutas", icon: "→", title: "Rutas de aprendizaje", kicker: "Recorridos" },
  { id: "lesson", label: "Leccion", icon: "¶", title: "Leccion breve", kicker: "Ruta" },
  { id: "salons", label: "Salones", icon: "☷", title: "Salon moderno", kicker: "Conversacion" },
  { id: "notebook", label: "Cuaderno", icon: "✎", title: "Cuaderno de ideas", kicker: "Privado" },
  { id: "socratic", label: "Socratico", icon: "!", title: "Companero socratico", kicker: "Dialogo" },
  { id: "sources", label: "Fuentes", icon: "≡", title: "Fuentes y lecturas", kicker: "Biblioteca" },
  { id: "profile", label: "Perfil", icon: "●", title: "Perfil", kicker: "Material guardado" },
  { id: "compare", label: "Comparar", icon: "⇄", title: "Comparacion", kicker: "Contrastes" },
  { id: "timeline", label: "Linea", icon: "⌁", title: "Linea temporal", kicker: "Debates" },
  { id: "disciplines", label: "Disciplinas", icon: "✦", title: "Conexiones", kicker: "Interdisciplina" },
  { id: "argument", label: "Argumento", icon: "✓", title: "Evaluar argumento", kicker: "Herramienta" },
];

const featured = [
  {
    name: "Libertad",
    type: "Problema",
    area: "Etica, politica, existencialismo",
    summary: "Pregunta por la autonomia, la responsabilidad, las condiciones sociales de la accion y los limites del determinismo.",
  },
  {
    name: "Conocimiento",
    type: "Concepto",
    area: "Epistemologia",
    summary: "Explora la relacion entre creencia, verdad, justificacion, duda, experiencia, testimonio y comunidad investigadora.",
  },
  {
    name: "Buen vivir",
    type: "Pregunta",
    area: "Etica comparada",
    summary: "Conecta virtud, florecimiento, deber, cuidado, armonia social y critica de las condiciones materiales de vida.",
  },
  {
    name: "Mente y cuerpo",
    type: "Debate",
    area: "Filosofia de la mente",
    summary: "Reune dualismo, materialismo, fenomenologia, neurociencia, budismo filosofico y debates sobre inteligencia artificial.",
  },
];

const branches = [
  ["Metafisica", "Realidad, existencia, identidad y causalidad."],
  ["Epistemologia", "Conocimiento, verdad, duda, evidencia y testimonio."],
  ["Etica", "Accion, virtud, responsabilidad, cuidado y justicia."],
  ["Politica", "Poder, comunidad, libertad, ley e instituciones."],
  ["Estetica", "Belleza, arte, interpretacion y creatividad."],
  ["Lenguaje", "Significado, comunicacion, interpretacion y poder."],
  ["Ciencia", "Metodo, explicacion, modelos, objetividad y limites."],
  ["Tecnologia", "IA, tecnica, agencia, trabajo y futuros compartidos."],
];

const traditions = [
  ["Analitica", "Claridad argumental, lenguaje, logica y problemas conceptuales."],
  ["Continental", "Historia, subjetividad, critica, fenomenologia y hermeneutica."],
  ["Pragmatista", "Ideas como practicas, consecuencias, democracia e investigacion."],
  ["India", "Conocimiento, conciencia, liberacion, logica y debate interescuela."],
  ["China", "Orden social, virtud, dao, ritual, gobierno y transformacion."],
  ["Africana", "Persona, comunidad, oralidad, colonialidad y eticas relacionales."],
  ["Latinoamericana", "Liberacion, identidad, dependencia, pueblo, modernidad y poder."],
  ["Indigena", "Territorio, reciprocidad, memoria, comunidad y responsabilidad ecologica."],
];

const paths = [
  ["Introduccion a la filosofia", 36, "De preguntas cotidianas a problemas clasicos."],
  ["Como construir argumentos", 52, "Premisas, inferencias, objeciones y caridad interpretativa."],
  ["Filosofia de la inteligencia artificial", 28, "Mente, lenguaje, agencia, sesgos y responsabilidad."],
  ["Mujeres que transformaron la historia intelectual", 43, "Autoridad, archivo, colaboracion y canon."],
  ["Del Renacimiento a la era digital", 31, "Humanismo, ciencia, imprenta, tecnica y creacion."],
];

const sources = [
  ["Platon, Republica", "Primaria", "Justicia, educacion, politica y conocimiento."],
  ["Aristoteles, Etica a Nicomaco", "Primaria", "Virtud, deliberacion y florecimiento."],
  ["Simone de Beauvoir, El segundo sexo", "Primaria", "Existencia, libertad, genero e historia."],
  ["Nagarjuna, Versos fundamentales del camino medio", "Primaria", "Vacuidad, dependencia y critica conceptual."],
  ["Kwasi Wiredu, Cultural Universals and Particulars", "Secundaria", "Universalidad, traduccion conceptual y filosofia africana."],
  ["Enrique Dussel, Filosofia de la liberacion", "Primaria", "Modernidad, exterioridad, etica y politica."],
];

let activeRoute = localStorage.getItem("ataraxia-route") || "onboarding";

function savedNotes() {
  return JSON.parse(localStorage.getItem("ataraxia-notes") || "[]");
}

function saveNote(text, tag = "Reflexion") {
  const notes = savedNotes();
  notes.unshift({ text, tag, date: new Date().toLocaleDateString("es") });
  localStorage.setItem("ataraxia-notes", JSON.stringify(notes.slice(0, 24)));
}

function navButton(route, compact = false) {
  return `<button class="nav-link ${activeRoute === route.id ? "active" : ""}" type="button" data-route="${route.id}">
    <span>${route.icon}</span><span>${compact ? route.label.split(" ")[0] : route.label}</span>
  </button>`;
}

function renderNav() {
  $("#side-nav").innerHTML = routes.map((route) => navButton(route)).join("");
  $("#drawer").innerHTML = routes.map((route) => navButton(route)).join("");
  const bottom = ["today", "explore", "constellations", "paths", "notebook"].map((id) => routes.find((route) => route.id === id));
  $("#bottom-nav").innerHTML = bottom.map((route) => navButton(route, true)).join("");
}

function setRoute(id) {
  activeRoute = id;
  localStorage.setItem("ataraxia-route", id);
  $("#drawer").classList.remove("open");
  render();
}

function card(title, body, extra = "") {
  return `<article class="card"><h3>${title}</h3><p>${body}</p>${extra}</article>`;
}

function listItem(title, subtitle, route = "idea", chips = "") {
  return `<button class="list-item" type="button" data-route="${route}">
    <strong>${title}</strong>
    <small>${subtitle}</small>
    ${chips}
  </button>`;
}

const screens = {
  onboarding: () => `
    <section class="hero">
      <span class="chip burgundy">Renacimiento moderno como inspiracion, no frontera</span>
      <h2>Explora ideas que siguen pensando con nosotros.</h2>
      <p>Ataraxia conecta ramas, tradiciones, problemas y disciplinas para convertir la curiosidad en investigacion, conversacion y creacion.</p>
      <div class="actions">
        <button class="button primary" data-route="today">Comenzar</button>
        <button class="button" data-route="explore">Ver mapa</button>
      </div>
    </section>
    <section class="section">
      <h2 class="section-title">Elige intereses</h2>
      <div class="chip-row">
        ${["Etica", "IA", "Libertad", "Arte", "Conocimiento", "Politica", "Tradiciones no occidentales", "Argumentos"].map((x) => `<span class="chip">${x}</span>`).join("")}
      </div>
    </section>
  `,
  today: () => `
    <article class="card question-card">
      <span class="source-badge">Pregunta de metafisica y tecnologia</span>
      <h2 class="question-text">¿Puede una inteligencia artificial comprender, o solo producir signos convincentes?</h2>
      <div class="meta-row">
        <span class="chip">Dificultad media</span>
        <span class="chip">Mente</span>
        <span class="chip">Lenguaje</span>
      </div>
    </article>
    <section class="section">
      <h2 class="section-title">Reflexion privada</h2>
      <textarea id="daily-answer" placeholder="Escribe una respuesta provisional. Puedes cambiar de opinion despues."></textarea>
      <div class="actions">
        <button class="button primary" id="save-answer">Guardar</button>
        <button class="button" data-route="salons">Ir al salon</button>
      </div>
    </section>
    ${card("Antes de publicar", "Distingue hechos, interpretaciones y opiniones. Resume una posicion contraria de manera justa antes de responder.", `<button class="button blue" data-route="argument">Evaluar argumento</button>`)}
  `,
  explore: () => `
    <input aria-label="Buscar ideas" placeholder="Buscar por pregunta, rama, tradicion, obra o concepto" />
    <div class="grid" style="margin-top:12px">
      ${featured.map((item) => listItem(item.name, item.summary, "idea", `<div class="chip-row"><span class="chip burgundy">${item.type}</span><span class="chip">${item.area}</span></div>`)).join("")}
    </div>
  `,
  branches: () => `
    <p class="lead">La filosofia no aparece como una fila unica de autores: puedes entrar por problemas, metodos, contextos o disciplinas.</p>
    <div class="grid two" style="margin-top:14px">
      ${branches.map(([name, desc]) => card(name, desc, `<button class="button" data-route="idea">Abrir</button>`)).join("")}
    </div>
  `,
  traditions: () => `
    <p class="lead">Cada tradicion se presenta en contexto, evitando jerarquias simplistas y separando historia documentada, interpretacion y debate abierto.</p>
    <div class="list" style="margin-top:14px">
      ${traditions.map(([name, desc]) => listItem(name, desc, "idea", `<span class="source-badge">Contexto cultural e historico</span>`)).join("")}
    </div>
  `,
  idea: () => `
    <article class="card">
      <span class="source-badge">Debate abierto</span>
      <h2 class="idea-title">Libertad humana</h2>
      <p>La libertad puede entenderse como ausencia de coercion, autonomia racional, capacidad situada de actuar, liberacion de estructuras injustas o posibilidad existencial de elegirse.</p>
      <div class="chip-row">
        <span class="chip burgundy">Etica</span><span class="chip">Politica</span><span class="chip">Existencialismo</span>
      </div>
    </article>
    ${card("Contexto", "El debate atraviesa la filosofia antigua, la teologia medieval, la modernidad politica, la critica social y las discusiones contemporaneas sobre neurociencia e IA.")}
    ${card("Argumentos y objeciones", "A favor: la deliberacion parece presuponer responsabilidad. Objecion: las decisiones dependen de causas previas. Respuesta: algunas teorias compatibilistas redefinen libertad como agencia sin coercion.")}
    ${card("Para seguir pensando", "¿Una sociedad puede llamar libre a una persona si sus opciones reales estan bloqueadas por pobreza, violencia o exclusion?", `<button class="button" data-route="compare">Comparar posiciones</button>`)}
  `,
  constellations: () => `
    <div class="chip-row">
      <span class="chip burgundy">Influencia documentada</span><span class="chip">Afinidad tematica</span><span class="chip">Hipotesis</span>
    </div>
    <div class="constellation" aria-label="Mapa visual de conexiones filosoficas">
      <svg viewBox="0 0 360 430" role="img">
        <path d="M70 90 L190 65 L275 135 L230 260 L115 310 L70 90" fill="none" stroke="#b48a42" stroke-width="2"/>
        <path d="M190 65 L180 210 L115 310" fill="none" stroke="#6f1d2c" stroke-width="2" stroke-dasharray="5 5"/>
        <path d="M70 90 L180 210 L300 335" fill="none" stroke="#152b45" stroke-width="2"/>
      </svg>
      <div class="node" style="left:28px;top:54px">Grecia antigua</div>
      <div class="node" style="left:150px;top:30px">Filosofia islamica</div>
      <div class="node" style="left:240px;top:102px">Escolastica</div>
      <div class="node" style="left:138px;top:184px">Humanismo</div>
      <div class="node" style="left:78px;top:278px">Ciencia moderna</div>
      <div class="node" style="left:254px;top:304px">IA y mente</div>
    </div>
  `,
  paths: () => `
    <div class="list">
      ${paths.map(([name, progress, desc]) => listItem(name, desc, "lesson", `<div class="progress"><span style="width:${progress}%"></span></div><small>${progress}% explorado</small>`)).join("")}
    </div>
  `,
  lesson: () => `
    ${card("Leccion 3: distinguir una opinion de un argumento", "Una opinion expresa una postura. Un argumento ofrece razones que pretenden sostenerla. La filosofia empieza cuando preguntamos si esas razones bastan, que presuponen y que objeciones merecen atencion.")}
    ${card("Fragmento para discutir", "Si una conclusion depende de una premisa invisible, el desacuerdo puede no estar en la conclusion sino en lo que se dio por obvio.")}
    ${card("Ejercicio", "Escribe una tesis, dos razones a favor, una objecion fuerte y una respuesta provisional.", `<textarea placeholder="Tesis, razones, objecion y respuesta"></textarea><button class="button primary" data-route="argument">Revisar estructura</button>`)}
  `,
  salons: () => `
    <article class="card question-card">
      <h2 class="question-text">¿La tecnologia amplifica nuestra libertad o reorganiza nuestra dependencia?</h2>
      <span class="source-badge">Moderacion: claridad, fuentes, respeto</span>
    </article>
    <div class="salon-post"><strong>Amara</strong><span>Mi argumento no es que toda tecnica oprima, sino que cada herramienta distribuye poder. La pregunta es quien puede modificar sus reglas.</span></div>
    <div class="salon-post"><strong>Luis</strong><span>Objecion: tambien hay tecnologias que reducen dependencia material. Tal vez haya que distinguir acceso, control y comprension.</span></div>
    ${card("Asistente de publicacion", "Antes de responder: define tus terminos, cita si afirmas un hecho historico y evita atribuir intenciones a otra persona.", `<textarea placeholder="Redacta una contribucion cuidadosa"></textarea><button class="button primary">Preparar respuesta</button>`)}
  `,
  notebook: () => {
    const notes = savedNotes();
    return `
      ${card("Mapa privado de intereses", "Tus notas crean conexiones entre temas recurrentes. Nada se comparte sin tu decision.", `<div class="notebook-map">${["Libertad", "IA", "Cuidado", "Verdad", "Arte", "Justicia"].map((x) => `<div class="map-tile">${x}</div>`).join("")}</div>`)}
      <textarea id="new-note" placeholder="Idea, cita, pregunta, hipotesis o referencia"></textarea>
      <div class="actions"><button class="button primary" id="save-note">Guardar nota</button><button class="button" data-route="sources">Anadir fuente</button></div>
      <h2 class="section-title">Notas recientes</h2>
      <div class="list">${notes.length ? notes.map((note) => listItem(note.tag, `${note.text} · ${note.date}`, "notebook")).join("") : card("Aun no hay notas", "Guarda una reflexion desde Hoy o escribe una idea aqui.")}</div>
    `;
  },
  socratic: () => `
    <div class="chat">
      <div class="bubble user">Creo que el progreso tecnologico siempre mejora la vida humana.</div>
      <div class="bubble">¿Que entiendes por mejorar: bienestar, libertad, justicia, conocimiento o eficiencia? Podrian entrar en conflicto.</div>
      <div class="bubble">Una objecion posible: una tecnologia puede aumentar capacidades y tambien concentrar poder. ¿Tu tesis depende de que esos efectos sean separables?</div>
    </div>
    ${card("Modo de ayuda", "El companero pregunta, distingue niveles de evidencia y sugiere fuentes. No reemplaza tu juicio ni se presenta como autoridad final.", `<textarea placeholder="Escribe una postura para examinar"></textarea><button class="button primary">Preguntar mejor</button>`)}
  `,
  sources: () => `
    <div class="chip-row"><span class="chip burgundy">Primarias</span><span class="chip">Secundarias</span><span class="chip">Debates</span><span class="chip">Introducciones</span></div>
    <div class="list" style="margin-top:14px">
      ${sources.map(([title, kind, desc]) => listItem(title, desc, "sources", `<span class="source-badge">${kind}</span>`)).join("")}
    </div>
  `,
  profile: () => `
    ${card("Evelyn", "Intereses principales: filosofia de la mente, etica, tecnologia, tradiciones comparadas y escritura reflexiva.", `<div class="grid two"><div class="mini-stat"><strong>12</strong>notas</div><div class="mini-stat"><strong>5</strong>rutas</div></div>`)}
    ${card("Guardado", "Pregunta del dia, Libertad humana, Filosofia de IA, Salon sobre tecnologia y dependencia.")}
    ${card("Privacidad", "El cuaderno y el mapa intelectual son privados por defecto. Puedes compartir piezas concretas, nunca el perfil completo por accidente.")}
  `,
  compare: () => `
    <div class="comparison">
      ${card("Estoicismo", "La libertad se vincula con gobernar los juicios y vivir de acuerdo con la razon dentro de un cosmos ordenado.")}
      ${card("Existencialismo", "La libertad aparece como responsabilidad situada: incluso bajo limites, la persona responde por su posicion ante el mundo.")}
    </div>
    ${card("Contraste clave", "Una diferencia no es solo historica. Cambia el lugar del mundo, la interioridad, la responsabilidad y el sentido de la accion.")}
    ${card("Pregunta puente", "¿Que ocurre cuando trasladamos estas ideas a vigilancia digital, trabajo automatizado o crisis climatica?")}
  `,
  timeline: () => `
    <div class="timeline">
      <div class="timeline-item"><strong>Antiguedad</strong><p>Virtud, conocimiento, cosmos, politica y formas de vida.</p></div>
      <div class="timeline-item"><strong>Medieval</strong><p>Razon, fe, traduccion, comentarios, universidades y filosofia islamica, judia y cristiana.</p></div>
      <div class="timeline-item"><strong>Modernidad</strong><p>Sujeto, ciencia, contrato social, colonialidad, metodo y critica.</p></div>
      <div class="timeline-item"><strong>Contemporanea</strong><p>Lenguaje, existencia, poder, tecnologia, genero, ambiente y pluralidad de archivos.</p></div>
    </div>
  `,
  disciplines: () => `
    <p class="lead">Las conexiones se presentan como influencia documentada, afinidad tematica, interpretacion academica o hipotesis abierta.</p>
    <div class="grid two" style="margin-top:14px">
      ${[
        ["Literatura", "Existencialismo, tragedia, novela moderna y mundos posibles."],
        ["Ciencia", "Explicacion, modelos, evidencia, realismo y limites del metodo."],
        ["Arte", "Belleza, forma, experiencia, politica de la mirada y creatividad."],
        ["Psicologia", "Conciencia, identidad, deseo, sesgo, trauma y agencia."],
        ["Derecho", "Responsabilidad, norma, castigo, derechos y legitimidad."],
        ["Tecnologia", "Automatizacion, IA, vigilancia, diseno y futuros comunes."],
      ].map(([name, desc]) => card(name, desc)).join("")}
    </div>
  `,
  argument: () => `
    ${card("Analizador de estructura", "No decide por ti. Te ayuda a ver tesis, premisas, supuestos, objeciones y tipo de desacuerdo.")}
    <textarea id="argument-text" placeholder="Pega aqui un argumento breve"></textarea>
    <div class="grid" style="margin-top:12px">
      <div class="argument-step"><span>1</span><p><strong>Tesis:</strong> ¿Que afirmacion intenta sostener?</p></div>
      <div class="argument-step"><span>2</span><p><strong>Razones:</strong> ¿Que premisas la apoyan?</p></div>
      <div class="argument-step"><span>3</span><p><strong>Supuestos:</strong> ¿Que debe aceptarse para que funcione?</p></div>
      <div class="argument-step"><span>4</span><p><strong>Objecion:</strong> ¿Cual es la respuesta contraria mas fuerte?</p></div>
    </div>
    <button class="button primary" style="margin-top:12px">Evaluar con cuidado</button>
  `,
};

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.route));
  });

  $("#save-answer")?.addEventListener("click", () => {
    const text = $("#daily-answer").value.trim();
    if (text) {
      saveNote(text, "Pregunta del dia");
      $("#daily-answer").value = "";
      setRoute("notebook");
    }
  });

  $("#save-note")?.addEventListener("click", () => {
    const text = $("#new-note").value.trim();
    if (text) {
      saveNote(text, "Nota");
      render();
    }
  });
}

function render() {
  const route = routes.find((item) => item.id === activeRoute) || routes[0];
  $("#screen-title").textContent = route.title;
  $("#screen-kicker").textContent = route.kicker;
  renderNav();
  $("#app").innerHTML = screens[route.id]();
  bindEvents();
}

$("#menu-button").addEventListener("click", () => $("#drawer").classList.toggle("open"));
$("#search-button").addEventListener("click", () => setRoute("explore"));

render();
