const KEY = "tasquesKanban"

let tasques = []

function guardarTasques() {
  localStorage.setItem(KEY, JSON.stringify(tasques))
}

function carregarTasques() {
  const data = localStorage.getItem(KEY)
  tasques = data ? JSON.parse(data) : []
}

carregarTasques()
renderTauler(tasques)
actualitzarEstadistiques()

const form = document.getElementById("formTasca")

form.addEventListener("submit", function(e) {
  e.preventDefault()

  const titol = document.getElementById("titol").value
  const descripcio = document.getElementById("descripcio").value
  const prioritat = document.getElementById("prioritat").value
  const data = document.getElementById("dataVenciment").value

  const novaTasca = {
    id: Date.now().toString(),
    titol: titol,
    descripcio: descripcio,
    prioritat: prioritat,
    dataVenciment: data,
    estat: "perFer"
  }

tasques.push(novaTasca)
guardarTasques()
renderTauler(tasques)
actualitzarEstadistiques()
})

function renderTauler(tasques) {

  document.getElementById("perFer").innerHTML = "<h3>Per fer</h3>"
  document.getElementById("enCurs").innerHTML = "<h3>En curs</h3>"
  document.getElementById("fet").innerHTML = "<h3>Fet</h3>"

  tasques.forEach(tasca => {

    const div = document.createElement("div")
    div.classList.add("tasca")
    div.classList.add(tasca.prioritat)

    div.innerHTML = `
      <strong>${tasca.titol}</strong><br>
      <small>${tasca.descripcio}</small><br>
      <em>Prioritat: ${tasca.prioritat}</em><br>

      <select onchange="canviarEstat('${tasca.id}', this.value)">
        <option value="perFer" ${tasca.estat === "perFer" ? "selected" : ""}>Per fer</option>
        <option value="enCurs" ${tasca.estat === "enCurs" ? "selected" : ""}>En curs</option>
        <option value="fet" ${tasca.estat === "fet" ? "selected" : ""}>Fet</option>
      </select>

      <button onclick="eliminarTasca('${tasca.id}')">Eliminar</button>
    `

    document.getElementById(tasca.estat).appendChild(div)
  })
}

function canviarEstat(id, nouEstat) {
  const tasca = tasques.find(t => t.id === id)

  tasca.estat = nouEstat

  guardarTasques()
  renderTauler(tasques)
  actualitzarEstadistiques()
}

function eliminarTasca(id) {
  if (confirm("Segur que vols eliminar aquesta tasca?")) {
    tasques = tasques.filter(t => t.id !== id)

    guardarTasques()
    renderTauler(tasques)
    actualitzarEstadistiques()
  }
}

const filtreEstat = document.getElementById("filtreEstat")

filtreEstat.addEventListener("change", aplicarFiltres)

function aplicarFiltres() {
  const estatSeleccionat = filtreEstat.value

  let tasquesFiltrades = tasques

  if (estatSeleccionat !== "tots") {
    tasquesFiltrades = tasques.filter(t => t.estat === estatSeleccionat)
  }

  renderTauler(tasquesFiltrades)
}

const filtrePrioritat = document.getElementById("filtrePrioritat")

filtrePrioritat.addEventListener("change", aplicarFiltres)

function aplicarFiltres() {
  const estatSeleccionat = filtreEstat.value
  const prioritatSeleccionada = filtrePrioritat.value

  let tasquesFiltrades = tasques

  // Filtre estat
  if (estatSeleccionat !== "tots") {
    tasquesFiltrades = tasquesFiltrades.filter(t => t.estat === estatSeleccionat)
  }

  // Filtre prioritat
  if (prioritatSeleccionada !== "tots") {
    tasquesFiltrades = tasquesFiltrades.filter(t => t.prioritat === prioritatSeleccionada)
  }

  renderTauler(tasquesFiltrades)
}

const cercaText = document.getElementById("cercaText")

cercaText.addEventListener("input", aplicarFiltres)

function aplicarFiltres() {
  const estatSeleccionat = filtreEstat.value
  const prioritatSeleccionada = filtrePrioritat.value
  const text = cercaText.value.toLowerCase()

  let tasquesFiltrades = tasques

  // Filtre estat
  if (estatSeleccionat !== "tots") {
    tasquesFiltrades = tasquesFiltrades.filter(t => t.estat === estatSeleccionat)
  }

  // Filtre prioritat
  if (prioritatSeleccionada !== "tots") {
    tasquesFiltrades = tasquesFiltrades.filter(t => t.prioritat === prioritatSeleccionada)
  }

  // Cerca text
  if (text !== "") {
    tasquesFiltrades = tasquesFiltrades.filter(t =>
      t.titol.toLowerCase().includes(text) ||
      t.descripcio.toLowerCase().includes(text)
    )
  }

  renderTauler(tasquesFiltrades)
}

function actualitzarEstadistiques() {
  const total = tasques.length

  const perFer = tasques.filter(t => t.estat === "perFer").length
  const enCurs = tasques.filter(t => t.estat === "enCurs").length
  const fet = tasques.filter(t => t.estat === "fet").length

  const percentatge = total ? Math.round((fet / total) * 100) : 0

  document.getElementById("totalTasques").textContent = total
  document.getElementById("numPerFer").textContent = perFer
  document.getElementById("numEnCurs").textContent = enCurs
  document.getElementById("numFet").textContent = fet
  document.getElementById("percentatge").textContent = percentatge
}

