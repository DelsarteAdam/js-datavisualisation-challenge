/////////// temp format graph 1

////////////create zone
const table1Zone = document.getElementById("table1");

const table2Zone = document.getElementById("table2");
// const table1ZoneHtml = `<div id="table1all" ><div id="container-table1"></div>
//     <div>
//       <h2>Country choice</h2>
//       <select name="selectGraph1" id="graph1select">
//         Country choice
//       </select>
//     </div></div>`;

// function createZone() {}

// table1Zone.insertAdjacentHTML("beforebegin", table1ZoneHtml);
///////////// extract data

let table1Data = [];
let table1DataX = [];
let object1Data = [];
let arr1Country = [];
let object1DataSelect = [];

//////////////table2

let table2Data = [];
let table2DataX = [];
let object2Data = [];
let arr2Country = [];
let object2DataSelect = [];

////////////////////////////////////////////////////////////////////////////

function extractTableData(ID) {
  let data2 = [];

  let table = ID.rows;

  for (let i = 0; i < table.length; i++) {
    data2.push(extractDataCell(table, i));
  }
  console.log(data2);
  return data2.map((x) => x);
}

function extractDataCell(tableChoice, index) {
  let data = [];
  for (let j = 0; j < tableChoice[index].cells.length; j++) {
    data.push(tableChoice[index].cells[j].innerText);
  }
  return data;
}

function removeSpecial(table) {
  let data = [];
  data = table.map((x) => x);

  for (let i = 0; i < data.length; i++) {
    data[i][1] = data[i][1].replace(/[^a-zA-Z0-9 ]/g, "");
  }

  return data.map((x) => x);
}

function table1Cleanup() {
  let table = [];

  console.log(table);
}

function supprimerEtCopierPremieresLignes(array) {
  // Copie de la deuxième ligne
  table1DataX = array[1].map((x) => x);

  // Suppression des deux premières lignes
  array.splice(0, 2);
  table1DataX.splice(0, 2);

  // Retourner l'array modifié et la copie de la deuxième ligne
  return array;
}

function stringToFloat(array) {
  let table = array.map((x) => x);

  for (let i = 0; i < table.length; i++) {
    stringToFloatin(table, i);
  }
}

function stringToFloatin(table, index) {
  for (let j = 2; j < table[index].length; j++) {
    table[index][j] = parseFloat(table[index][j]);
  }
}

function createObjectin(table, index, objecta, tablex) {
  for (let j = 2; j < table[index].length; j++) {
    let object = {
      country: table[index][1],
      date: new Date(Date.UTC(tablex[j - 2])),
      value: table[index][j],
    };
    objecta.push(object);
  }
}

function createObject(table, objecta, tablex) {
  for (let i = 0; i < table.length; i++) {
    createObjectin(table, i, objecta, tablex);
  }
}

function arrCountryGenerator(table, table2) {
  for (let i = 0; i < table.length; i++) {
    let temp = table[i][1];
    table2.push(temp);
  }
}

table1Data = extractTableData(table1Zone);
table1Data = removeSpecial(table1Data);
supprimerEtCopierPremieresLignes(table1Data);
stringToFloat(table1Data);
createObject(table1Data, object1Data, table1DataX);
arrCountryGenerator(table1Data, arr1Country);

console.log(table1Data);
console.log(table1DataX);
console.log(object1Data);
console.log(arr1Country);

////// generate graph

const minDate = d3.min(object1Data, (d) => d.date);
const maxDate = d3.max(object1Data, (d) => d.date);
const minValue = d3.min(object1Data, (d) => d.value);
const maxValue = d3.max(object1Data, (d) => d.value);

let plot = Plot.plot({
  style: "overflow: visible;",
  width: 800,
  height: 600,
  marginLeft: 50,
  marginRight: 50,
  marginTop: 20,
  marginBottom: 30,
  y: {
    line: true,
    tickPadding: 15,
    type: "sqrt",
    grid: true,
    domain: [minValue, maxValue],
  },
  x: {
    line: true,
    tickPadding: 15,
    tickFormat: d3.utcFormat("%Y"),
    domain: [minDate, maxDate],
    grid: true,
  },
  // color: { legend: true },

  marks: [
    Plot.ruleY([0]),

    Plot.lineY(object1Data, {
      x: "date",
      y: "value",
      stroke: "country",
      tip: "x",
    }),

    Plot.dot(object1Data, { x: "date", y: "value", stroke: "country" }),
  ],
});
const containerTable1 = document.getElementById("container-table1");
containerTable1.append(plot);

///// select choice

function selectGraph(arr, Id) {
  let select = "";
  for (let i = 0; i < arr.length; i++) {
    select += `<option value="${arr[i]}">${arr[i]}</option>`;
  }

  document.getElementById(Id).innerHTML =
    `<option value="all">all</option>` + select;
}

selectGraph(arr1Country, "graph1select");

function objectDataSelectGeneratorin(table, index, tablex, table2) {
  for (let i = 2; i < table[index].length; i++) {
    let object = {
      country: table[index][1],
      date: new Date(Date.UTC(tablex[i - 2])),
      value: table[index][i],
    };
    table2.push(object);
  }
  console.log(table2);
}

const select1Option = document.getElementById("graph1select");

select1Option.addEventListener("change", () => {
  console.log(select1Option.value);
  if (select1Option.value == "all") {
    object1DataSelect = [];
    object1DataSelect = object1Data;
  } else {
    object1DataSelect = [];
    let index = 0;
    index = arr1Country.indexOf(select1Option.value);
    objectDataSelectGeneratorin(
      table1Data,
      index,
      table1DataX,
      object1DataSelect
    );
  }
  plot = Plot.plot({
    style: "overflow: visible;",
    width: 800,
    height: 600,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
    marginBottom: 30,
    y: {
      line: true,
      tickPadding: 15,
      type: "sqrt",
      grid: true,
      domain: [minValue, maxValue],
    },
    x: {
      line: false,
      tickPadding: 15,
      tickFormat: d3.utcFormat("%Y"),
      domain: [minDate, maxDate],
      grid: true,
    },

    marks: [
      Plot.ruleY([0]),

      Plot.lineY(object1DataSelect, {
        x: "date",
        y: "value",
        stroke: "country",
        tip: "x",
      }),

      Plot.dot(object1DataSelect, { x: "date", y: "value", stroke: "country" }),
    ],
  });
  containerTable1.removeChild(containerTable1.lastElementChild);
  containerTable1.append(plot);
});

/////////////////////

table2Data = extractTableData(table2Zone);
table2Data = removeSpecial(table2Data);

function supprimerEtCopierLaPremiereLigne(array) {
  // Copie de la deuxième ligne
  table2DataX = array[0].map((x) => x);

  // Suppression des deux premières lignes
  array.splice(0, 1);
  table2DataX.splice(0, 2);

  // Retourner l'array modifié et la copie de la deuxième ligne
  return array;
}

supprimerEtCopierLaPremiereLigne(table2Data);
table2DataX = ["2007", "2010"];
stringToFloat(table2Data);
createObject(table2Data, object2Data, table2DataX);
arrCountryGenerator(table2Data, arr2Country);

selectGraph(arr2Country, "graph2select");
const select2Option = document.getElementById("graph2select");

console.log(table2Data);
console.log(table2DataX);
console.log(object2Data);
console.log(arr2Country);

////// generate graph

// Fonction pour générer une couleur aléatoire
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Associer une couleur aléatoire à chaque pays
const countryColors = {};
object2Data.forEach((d) => {
  if (!countryColors[d.country]) {
    countryColors[d.country] = getRandomColor();
  }
});

const filteredData = object2Data.filter((d) => d.date.getFullYear() === 2007);
const filteredData2 = object2Data.filter((d) => d.date.getFullYear() === 2010);

const minValue2 = d3.min(object2Data, (d) => d.value);
const maxValue2 = d3.max(object2Data, (d) => d.value);

let plot2 = Plot.plot({
  style: "overflow: visible;",
  width: 800,
  height: 600,
  marginLeft: 50,
  marginRight: 50,
  marginTop: 20,
  marginBottom: 30,
  y: {
    tickPadding: 15,
    // type: "sqrt",
    grid: true,
    domain: [minValue2, maxValue2],
  },
  x: {
    tickPadding: 15,

    grid: true,
  },

  marks: [
    Plot.barX(filteredData, {
      x: "value",
      y: "country",
      fill: "#aaa",
      dy: 5,

      // insetTop: 2,
      // insetBottom: 2,
    }),
    Plot.barX(filteredData2, {
      x: "value",
      y: "country",
      fill: (d) => countryColors[d.country],

      // insetTop: 6,
      insetBottom: 4,
      tip: "y",
    }),
  ],
  y: { label: "Country", reverse: false },
  x: { label: "Value" },
});
const containerTable2 = document.getElementById("container-table2");
containerTable2.append(plot2);

///////// select by country

select2Option.addEventListener("change", () => {
  console.log(select2Option.value);
  if (select2Option.value == "all") {
    object2DataSelect = [];
    object2DataSelect = object2Data;
  } else {
    object2DataSelect = [];
    let index = 0;
    index = arr2Country.indexOf(select2Option.value);
    objectDataSelectGeneratorin(
      table2Data,
      index,
      table2DataX,
      object2DataSelect
    );
  }

  let filteredDataTemp = object2DataSelect.filter(
    (d) => d.date.getFullYear() === 2007
  );
  let filteredData2Temp = object2DataSelect.filter(
    (d) => d.date.getFullYear() === 2010
  );

  plot2 = Plot.plot({
    style: "overflow: visible;",
    width: 800,
    height: 600,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
    marginBottom: 30,
    y: {
      tickPadding: 15,
      // type: "sqrt",
      grid: true,
      domain: [minValue2, maxValue2],
    },
    x: {
      tickPadding: 15,

      grid: true,
    },

    marks: [
      Plot.barX(filteredData, {
        x: "value",
        y: "country",
        fill: "#aaa",
        dy: 5,

        // insetTop: 2,
        // insetBottom: 2,
      }),
      Plot.barX(filteredData2Temp, {
        x: "value",
        y: "country",
        fill: (d) => countryColors[d.country],

        // insetTop: 6,
        insetBottom: 4,
        tip: "y",
      }),
    ],
    y: { label: "Country", reverse: false },
    x: { label: "Value" },
  });
  containerTable2.removeChild(containerTable2.lastElementChild);
  containerTable2.append(plot2);
});

/////////// api

const urlApi = "https://canvasjs.com/services/data/datapoints.php?";
let objectApi = [];

let noCache = Date.now().toString(16);
// urlApi = `${urlApi}${noCache}`;

async function getApiData(url) {
  fetch(url, {
    cache: "no-store", // Indique au navigateur de ne pas utiliser le cache pour avoir accès aux données aléatoires
  })
    .then((Response) => {
      return Response.json();
    })
    .then((json) => {
      createObjectApi(json);
    })
    .then(createGraphApi);
}

function createObjectApi(Response) {
  objectApi = [];
  let data = Response;
  for (let i = 0; i < data.length; i++) {
    let object = {
      index: data[i][0],
      murder: data[i][1],
    };

    objectApi.push(object);
  }
}

function createGraphApi() {
  const minValuex = d3.min(objectApi, (d) => d.index);
  const maxValuex = d3.max(objectApi, (d) => d.index);
  const minValuey = d3.min(objectApi, (d) => d.murder);
  const maxValuey = d3.max(objectApi, (d) => d.murder);

  let plot3 = Plot.plot({
    style: "overflow: visible;",
    width: 800,
    height: 600,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
    marginBottom: 30,
    y: {
      tickPadding: 15,
      // type: "sqrt",
      grid: true,
      domain: [minValuey, maxValuey],
    },
    x: {
      tickPadding: 15,
      domain: [minValuex, maxValuex],
      grid: true,
    },

    marks: [
      Plot.ruleY([0], { stroke: "red" }),
      Plot.lineY(objectApi, { x: "index", y: "murder", tip: "x" }),
    ],
    x: { label: "index", reverse: false },
    y: { label: "murder" },
  });
  const containerTable3 = document.getElementById("container-table3");
  // containerTable3.removeChild(containerTable3.lastElementChild);
  containerTable3.append(plot3);
}

getApiData(urlApi);

/////////////////// each seconds

async function getApiDataTime(url) {
  try {
    const response = await fetch(url, {
      cache: "no-store", // Indique au navigateur de ne pas utiliser le cache pour avoir accès aux données aléatoires
    });
    const json = await response.json();
    createObjectApi(json);
    console.log(json);
    createGraphApiTime();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function createGraphApiTime() {
  const minValuex = d3.min(objectApi, (d) => d.index);
  const maxValuex = d3.max(objectApi, (d) => d.index);
  const minValuey = d3.min(objectApi, (d) => d.murder);
  const maxValuey = d3.max(objectApi, (d) => d.murder);

  let plot3 = Plot.plot({
    style: "overflow: visible;",
    width: 800,
    height: 600,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
    marginBottom: 30,
    y: {
      tickPadding: 15,
      // type: "sqrt",
      grid: true,
      domain: [minValuey, maxValuey],
    },
    x: {
      tickPadding: 15,
      domain: [minValuex, maxValuex],
      grid: true,
    },

    marks: [
      Plot.ruleY([0], { stroke: "red" }),
      Plot.lineY(objectApi, { x: "index", y: "murder", tip: "x" }),
    ],
    x: { label: "index", reverse: false },
    y: { label: "murder" },
  });
  const containerTable3 = document.getElementById("container-table3");
  containerTable3.removeChild(containerTable3.lastElementChild);
  containerTable3.append(plot3);
}

function updateSecond() {
  setInterval(() => getApiDataTime(urlApi), 1000);
}

updateSecond();
