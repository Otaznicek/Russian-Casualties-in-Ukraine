const needle = require("needle");

express = require("express")
app = express()
path = require("path")
app.set('view engine', 'ejs')
fs = require("fs");
csvParser = require("csv-parser");
app.use(express.static(path.join(__dirname, 'public')));
process = require("process")

const port = 80
const result = [];
const result_daily = [];
const url = "https://russian-casualties.in.ua/api/v1/data/csv/daily";

needle
  .get(url)
  .pipe(csvParser())
  .on("data", (data) => {
    result.push(data);
  })
  .on("done", (err) => {
    if (err) console.log("An error has occurred");})

setInterval(function(){
  result = []
  needle
  .get(url)
  .pipe(csvParser())
  .on("data", (data) => {
    result.push(data);
  })
  .on("done", (err) => {
    if (err) console.log("An error has occurred");
  });},86400000)



app.get("/",(req,res)=>{
  var personnel = 0
  var tanks = 0
  var armoured_vehicles = 0
  var AS = 0
  var MLRS = 0
  var SE = 0
  var aircraft = 0
  var helicopters = 0
  var cruise_missiles = 0
  var UAV = 0
  var day = 0
  const chart = []
  var killed_avg = 0
  result.forEach(element => {
    personnel += Number(element["Liquidated"])
    tanks += Number(element["Tanks"])
    armoured_vehicles += Number(element["Armoured Personnel Vehicle"])
    AS += Number(element["Artillery systems"])
    MLRS += Number(element["MLRS"])
    SE += Number(element["Special Equipment"])
    aircraft += Number(element["Aircraft"])
    helicopters += Number(element["Helicopters"])
    cruise_missiles += Number(element["Cruise Missiles"])
    UAV += Number(element["UAV"])
    chart.push("[".concat(String(day),",",element["Liquidated"] + "]"))
    day +=1
   });
  killed_avg = Math.floor(personnel / result.length)
  console.log(killed_avg)
res.render("index",{personnel:personnel,tanks:tanks,armoured_vehicles:armoured_vehicles,AS:AS,MLRS:MLRS,SE:SE,aircraft:aircraft,helicopters:helicopters,cruise_missiles:cruise_missiles,UAV:UAV,casualties:chart,killed_avg:killed_avg})


 }
)

app.listen(port, ()=>{
console.log("App si running on " + port)
});
