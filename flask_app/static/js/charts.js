'use strict';

let category_elem = document.getElementById('business-categories'),
    star_plot = document.getElementById('star-bar-plot'),
    pie_chart = document.getElementById('star-pie-chart'),
    bubble_chart = document.getElementById('bubble-chart'),
    vader_bubble_chart = document.getElementById('vader-bubble-chart'),
    vader_plot = document.getElementById('vader-plot'),
    review_section = $('#review-section'),
    sum_sect = $('#summary-section'),
    bus_name, categories, star_dict;


$('.dropdown-item').on('click', function(event) {
    star_dict = {1: [], 2: [], 3: [], 4: [], 5: []};
    bus_name = event.target.innerText;
    console.log(bus_name);
    d3.json('/data/' + bus_name).then(function(data) {
        data.forEach(x => x.date = new Date(x.date));
        data.forEach(x => star_dict[x.stars].push(x));
        console.log(data[0]);
        categories = data[0].categories;
        $('#business-name').text(data[0].name);
        $('#business-price').text('Price - ' + data[0].price);
        $('#business-rating').text('Rating - ' + data[0].rating);
        $('#business-reviews').text('Reviews - ' + data[0].review_count);

        populateReviewSection(data, 'Most Recent Reviews');

        Plotly.newPlot(star_plot, [{
            x: Object.entries(star_dict).map(([k, v]) => v.length),
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


        // Plotly.newPlot(vader_plot,[{
        //     x: data.map(x => x.stars),
        //     y: data.map(x => x.vader),
        //     mode: 'markers',
        //     type: 'scatter',
        // }],
        // {
        //     title: 'Vader Plot',
        //     margin: { t: 50 }
        // }
        // );

        Plotly.newPlot(vader_plot, [{
            x: data.filter(x => x.date.getFullYear() === 2016).map(x => x.date),
            y: data.filter(x => x.date.getFullYear() === 2016).map(x => x.rating),
            // mode: 'markers',
            type: 'histogram',
        }]);


    let stars = ['One', 'Two', 'Three', 'Four', 'Five'];
    star_plot.on('plotly_click', function(event) {
        let star = event.points[0].pointIndex + 1,
            review_section_title = 'Most Recent ' + stars[star - 1] + ' Star Reviews';
        populateReviewSection(star_dict[star], review_section_title, star);




        d3.json('/tokens/' + bus_name + '/' + star).then(function(tokens) {
            sum_sect.empty();
            sum_sect.append('<h3 class="offset-sm-2">Summary of the 300 most recent ' + stars[star - 1] + ' star reviews</h3>');
            sum_sect.append('<br>');
            sum_sect.append('<p class="col-sm-8 offset-sm-2">' + tokens.summary + '</p>')

            $('.adj-btn, .noun-btn').on('click', function(event) {
                console.log(event.target.innerText);
            });
        });

    });


    d3.json('/test').then(function(summary) {
        let star = 1;
        sum_sect.append('<h3 class="offset-sm-2">Summary of the 300 Most Recent ' + stars[star - 1] + ' Star Reviews</h3>');
        sum_sect.append('<br>');
        sum_sect.append('<p class="col-sm-8 offset-sm-2">' + summary.text + '</p>')
        $('.adj-btn, .noun-btn').on('click', function(event) {
            let word = event.target.innerText;
            let title = word;

            console.log(word, word, word);
            let re = new RegExp(word, 'i');
            let reviews = data.filter(x => x.stars === star).filter(x => x.text.match(re));
            console.log(reviews[0].text.replace(re, 'fartfartfartfart'));
            populateReviewSection(reviews, title, star, word);
        });
    });





    });
});









function populateReviewSection(data, title, star, keyword) {
    review_section.empty();
    review_section.append('<h2 class="offset-sm-2">' + title + '</h2>');
    review_section.append('<br>');
    data.slice(0, 5).forEach(function(x) {
        let vader_score = '<span class="vader-score-text">Vader Score: ' + x.vader + '</span>'
        let row = $('<div class="row"></div>');
        row.append('<p class="col-sm-6 offset-sm-2">' + x.text + '<br>' + vader_score + '<p>');
        // row.append('<p>Vader Score: ' + x.vader + '</p>')
        row.append('<button class="vader-btn btn btn-sm btn-primary">Analyze</button>');
        review_section.append(row);
        review_section.append('<br>')
    });
}

draw_pie();
draw_bubbles();





















