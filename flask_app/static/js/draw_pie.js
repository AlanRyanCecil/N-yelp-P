function draw_pie() {
    $('.dropdown-item').on('click', function(event) {
    star_dict = {1: [], 2: [], 3: [], 4: [], 5: []};
    bus_name = event.target.innerText;
    d3.json('/data/' + bus_name).then(function(data) {
        data.forEach(x => star_dict[x.stars].push(x));
        Plotly.newPlot(pie_chart,[{
            values:Object.entries(star_dict).map(([k, v]) => v.length),
            labels:[
                '&#9733;',
                '&#9733;&#9733;',
                '&#9733;&#9733;&#9733;',
                '&#9733;&#9733;&#9733;&#9733;',
                '&#9733;&#9733;&#9733;&#9733;&#9733;'
            ],
            type: 'pie',
            hole: 0.4,
        }],
        {   
          height: 400,
          width: 500
        }
        ) 
    });
});
}