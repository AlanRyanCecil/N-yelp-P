function draw_bubbles() {

    $('.dropdown-item').on('click', function(event) {
        bus_name = event.target.innerText;
        d3.json('/data/' + bus_name).then(function(data) {
            var years = []
            var years_dict = {}
            var years_dict_vader = {}
            data.forEach(x => {
                var date = new Date(x.date);
                var year = date.getFullYear();
                if (years.includes(year)){} 
                    else {
                    years.push(year);
                    years_dict[year] = [];
                    years_dict_vader[year] = [];
                };
                years_dict[ new Date(x.date).getFullYear()].push(x.stars);
                years_dict_vader[ new Date(x.date).getFullYear()].push(x.vader);
            });



            // Plotly.newPlot(bubble_chart,[{
            // type: 'scatter',
            // mode: 'markers',
            // x: years,
            // y: Object.entries(years_dict).map(([k,v]) => v.reduce((a,b) => a+b, 0) / v.length),
            // marker:{
            //     size : Object.entries(years_dict).map(([k,v]) => v.length*2),
            //     sizemode: "area",
            //     },
            // text: Object.entries(years_dict).map(([k,v]) => v.length)
            // }],
            // {
            //     title:`<b> Years vs Average Stars for ${bus_name}</b>`,
            //     xaxis: {
            //       title: 'Year',
            //     },
            //     yaxis: {
            //       title: 'Average Star'
            //     },
            //     width:900,
            //     height:500,
            // }
            // )

            Plotly.newPlot(vader_bubble_chart,[{
            type: 'scatter',
            mode: 'markers',
            x: years,
            y: Object.entries(years_dict_vader).map(([k,v]) => v.reduce((a,b) => a+b, 0) / v.length),
            marker:{
                size : Object.entries(years_dict_vader).map(([k,v]) => v.length*2),
                sizemode: "area",
                },
            text: Object.entries(years_dict_vader).map(([k,v]) => v.length)
            }],
            {
                title:`<b> Years vs Average Vader Scores for ${bus_name}</b>`,
                xaxis: {
                  title: 'Year',
                },
                yaxis: {
                  title: 'Average Vader Score'
                },
                width:900,
                height:500,
            }
            )

        });
    });
}