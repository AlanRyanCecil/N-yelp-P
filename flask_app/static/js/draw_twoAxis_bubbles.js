function draw_twoAxis_bubbles(data) {
    var years = []
    var years_dict = {}
    var years_dict_vader = {}
    data.forEach(x => {
        var year = x.date.getFullYear();
        if (years.includes(year)){} 
            else {
            years.push(year);
            years_dict[year] = [];
            years_dict_vader[year] = [];
        };
        years_dict[ new Date(x.date).getFullYear()].push(x.stars);
        years_dict_vader[ new Date(x.date).getFullYear()].push(x.vader);
    });

    var trace1 = {
        type: 'bar',
        // mode: 'markers',
        x: years,
        y: Object.entries(years_dict).map(([k,v]) => v.reduce((a,b) => a+b, 0) / v.length),
        // marker:{
        //     size : Object.entries(years_dict).map(([k,v]) => v.length*2),
        //     sizemode: "area",
        //     },
        name: 'Average Star',
        text: Object.entries(years_dict).map(([k,v]) => v.length)
    };

    var trace2 = {
        type: 'line',
        // mode: 'markers',
        x: years,
        y: Object.entries(years_dict_vader).map(([k,v]) => v.reduce((a,b) => a+b, 0) / v.length),
        marker:{
            size : Object.entries(years_dict_vader).map(([k,v]) => v.length*2),
            sizemode: "area",
            },
        name: 'Average Vader Score',
        yaxis: 'y2',
        text: Object.entries(years_dict_vader).map(([k,v]) => v.length)
    };

    var layout = {
        // title:`<b> Years vs Average Stars and Averag Vedar Score for ${data[0].name}</b>`,
        xaxis: {
          title: 'Year',
        },

        yaxis: {title: 'Average Star'},
        yaxis2: {
            title: 'Average Vader Score',
            overlaying: 'y',
            side: 'right',
        },
       
        // width:900,
        height:500,
    };

    var data = [trace1 , trace2];

Plotly.newPlot('bubble-chart' ,[trace1 , trace2],layout, {displayModeBar: false});
}