

let bid = "iCQpiavjjPzJ5_3gPD5Ebg"

let category_elem = document.getElementById('business-categories'),
    star_plot = document.getElementById('star-bar-plot'),
    vader_plot = document.getElementById('vader-plot');

$('.dropdown-item').on('click', function(event) {


    bus_name = event.target.innerText;
    console.log(bus_name);
    d3.json('/data/' + bus_name).then(function(data) {
        console.log(data[0]);
        categories = data[0].categories;
        $('#business-name').text(data[0].name);
        $('#business-price').text('Price - ' + data[0].price);
        $('#business-rating').text('Rating - ' + data[0].rating);
        $('#business-reviews').text('Reviews - ' + data[0].review_count);

        Plotly.newPlot(star_plot, [{
            x: function(){
                y = [0, 0, 0, 0, 0,];
                data.forEach(x => y[x.stars - 1] += 1);
                return y;
            }(),
            y: [
                '&#9733;',
                '&#9733;&#9733;',
                '&#9733;&#9733;&#9733;',
                '&#9733;&#9733;&#9733;&#9733;',
                '&#9733;&#9733;&#9733;&#9733;&#9733;'
            ],
            orientation: 'h',
            hoverinfo: 'x',
            type: 'bar',
            width: 0.8,
            marker: {
                color: '#FFD20E',
            },
        }],
        {
            // title: data[0].name,
            font: {
                // size: 32,
            },
            xaxis: {
                showgrid: false,
                font: {
                    size: 3
                },
            },
            yaxis: {
                showgrid: false,
            }
        }
        );



        Plotly.newPlot(vader_plot,[{
            x: data.map(x => x.stars),
            y: data.map(x => x.vader),
            mode: 'markers',
            type: 'scatter',
        }],
        {
            title: 'Vader Plot',
            margin: { t: 60 }
        }
        );



star_plot.on('plotly_click', function(event) {
    console.log(event.points[0].pointIndex + 1);
});






















    });
});