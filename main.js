// Get today's date
const today = new Date().toJSON().slice(0,10);

// Get yesterdays date
let yesterday = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000

yesterday = yesterday.toJSON().slice(0,10);

// get data TODO: inc level as well as flow
const url = `
    http://environment.data.gov.uk/flood-monitoring/id/stations/2604TH/readings?parameter=flow&_sorted&startdate=${yesterday}&enddate=${today}
    `;

// get last 5 days flow
$(document).ready(function() {
    $.getJSON(url, function(data){
            const jsonData = JSON.stringify(data);

            //get latest level and older level (@12 hours)
            let currentLevel = (data.items[0].value);
            const oldLevel = (data.items[45].value); // TODO: check how many items returned...46?

            let trend = '';
            if (oldLevel < currentLevel) {
                trend = 'rising';
            } else if (oldLevel > currentLevel) {
                trend = 'falling';
            }

            currentLevel = parseInt(currentLevel);
            document.getElementById("currentLevel").innerHTML = `
                    The flow of the Thames at Maidenhead is currently ${currentLevel} m3/s and trend over the last 12 hours has seen the river ${trend}
                `;

            //check gate level
            let gatesOpen = "";
            if (trend === "falling") {
                if (currentLevel < 30) {
                    gatesOpen = "closed";
                } else if (currentLevel > 30 && currentLevel < 45) {
                    gatesOpen = "on 1 gate";
                } else if (currentLevel > 45 && currentLevel < 65) {
                    gatesOpen = "on 2 gates";
                } else if (currentLevel > 65 && currentLevel < 140) {
                    gatesOpen = "on 3 gates";
                } else {
                    gatesOpen = "on 4 gates";
                }
            } else {
                if (currentLevel > 0 && currentLevel < 30) {
                    gatesOpen = "closed";
                } else if (currentLevel > 30 && currentLevel < 50) {
                    gatesOpen = "on 1 gate";
                } else if (currentLevel > 50 && currentLevel < 70) {
                    gatesOpen = "on 2 gates";
                } else if (currentLevel > 70 && currentLevel < 105) {
                    gatesOpen = "on 3 gates";
                } else {
                    gatesOpen = "on 4 gates";
                }
            }

            gatesOpen = `Hurley is (probably) ${gatesOpen}`;
            document.getElementById("gates").innerHTML = gatesOpen;


            /*******************************************************************
             * CHARTS
             *******************************************************************/
            //load chart libraries
            google.charts.load('current', {packages: ['corechart']});
            google.charts.setOnLoadCallback(drawChart);

            //create 5 day chart data
            function drawChart(){
                const array = JSON.parse(jsonData);
                const table = new google.visualization.DataTable(array);
                table.addColumn('string', 'Time');
                table.addColumn('number', 'Flow');

                // create data table for chart
                for (let i = 0; i < data.items.length; i++) {
                    const dateTime = data.items[i].dateTime;
                    const value = data.items[i].value;
                    table.addRows([
                        [dateTime, value]
                    ]);
                }

                //create chart
                const chart = new google.visualization.LineChart($('#chart_div').get(0));
                chart.draw(table, {
                    title: 'm3/s',
                    curvetype: 'function',
                    height: 200,
                    hAxis: {direction:-1}
                });
            }


            /*******************************************************************
             * NOTES
             *******************************************************************/
            let notes = "";
            if (currentLevel > 105 && currentLevel < 140) {
                notes = "Either three or four gates could be open, best way to be sure is to take a look!";
            }
            document.getElementById("notes").innerHTML = notes;
        }
    );
});
