var chart,
  chartData = [];
var socket = io(),
  socketId;
socket.on("connect", () => {
  socketId = socket.id;
});

socket.on("random", (num) => {
  var data = chart.config.data;
  chartData.push(num);
  data.labels.push(chartData.length);
  if (chart) chart.update();
  $("#numberList").prepend(num + " ");
});

let running = false;
function doAction() {
  let min = $("#minNumber").val(),
    max = $("#maxNumber").val();
  callAPI(min, max);
}

function callAPI(min, max) {
  $.ajax({
    url: "/api/generate",
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({ socketId, action: !running, min, max }),
    success: function (res) {
      running = !running;
      $("#btnAction").text(running ? "Stop" : "Start");
    },
    error: function (err) {
      alert("Error occured.");
      console.error(err);
    },
  });
}

$(() => {
  const ctx = document.getElementById("lineChart");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from(Array(chartData.length).keys(), (n) => n + 1),
      datasets: [
        {
          label: "Random Numbers",
          data: chartData,
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
});
