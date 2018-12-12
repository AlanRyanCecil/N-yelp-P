'use strict';

let category_elem = document.getElementById('business-categories'),
    star_plot = document.getElementById('star-bar-plot'),
    pie_chart = document.getElementById('star-pie-chart'),
    bubble_chart = document.getElementById('bubble-chart'),
    vader_bubble_chart = document.getElementById('vader-bubble-chart'),
    vader_plot = document.getElementById('vader-plot'),
    review_section = $('#review-section'),
    sum_sect = $('#summary-section'),
    current_business, current_star,
    data, categories,
    star_words = ['One', 'Two', 'Three', 'Four', 'Five'];


$('.dropdown-item').on('click', function(event) {
    current_business = event.target.innerText;
    current_star = 0;
    console.log(current_business);
    d3.json('/data/' + current_business).then(function(response) {
        data = response;
        data.forEach(x => x.date = new Date(x.date));
        console.log(data[0]);
        categories = data[0].categories;
        $('#business-name').text(data[0].name);
        $('#business-price').text('Price - ' + data[0].price);
        $('#business-rating').text('Rating - ' + data[0].rating);
        $('#business-reviews').text('Reviews - ' + data[0].review_count);

        writeSummary();
        populateReviewSection(data, 'Most Recent Reviews', '', 1);

        let star_list = [0, 0, 0, 0, 0];
        data.forEach(x => star_list[x.stars - 1] += 1);
        Plotly.newPlot(star_plot, [{
            x: star_list,
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
        star_plot.on('plotly_click', function(event) {
            current_star = event.points[0].pointIndex + 1;
            let review_section_title = 'Most Recent ' + star_words[current_star - 1] + ' Star Reviews',
                reviews = data.filter(x => x.stars === current_star)
            populateReviewSection(reviews, review_section_title, '', 1);
            writeSummary();
        });



        Plotly.newPlot(vader_plot, [{
            x: data.filter(x => x.date.getFullYear() === 2016).map(x => x.date),
            y: data.filter(x => x.date.getFullYear() === 2016).map(x => x.rating),
            type: 'histogram',
        }]);


    });
});

function toTitle(str) {
    return str.split(' ')
        .map(x => x.toLowerCase().replace(/\w/, x => x.toUpperCase())).join(' ');
}

function writeSummary() {
    d3.json('/test').then(function(tokens) {
    // d3.json('/tokens/' + current_business + '/' + current_star).then(function(tokens) {
        let starword = current_star ? star_words[current_star - 1] + ' Star' : '';
        sum_sect.empty();
        sum_sect.append('<h4 class="xoffset-sm-2">Summary of the 300 Most Recent ' + starword + ' Reviews</h4>');
        sum_sect.append('<br>');
        sum_sect.append('<p class="xcol-sm-8 xoffset-sm-2">' + tokens.summary + '</p>')

        $('.adj-btn, .noun-btn').on('click', function(event) {
            console.log(data[0].text);
            let word = event.target.innerText,
                title = starword + ' Reviews Containing "' + toTitle(word) + '"',
                re = new RegExp(' ' + word, 'i'),
                reviews = data.filter(x => x.text.match(re));
            reviews = current_star ? reviews.filter(x => x.stars === current_star) : reviews;
            reviews.forEach(x => x.text = x.text.replace(word, '<span class="adj-btn">' + word + '</span>'));
            populateReviewSection(reviews, title, word, 1);
        });
    });
}


function populateReviewSection(reviews, title, keyword, page) {
    page = page * 3;
    review_section.empty();
    review_section.append('<h4 class="xoffset-sm-2">' + title + '</h4>');
    review_section.append('<br>');
    reviews.slice(page - 3, page).forEach(function(x) {
        let vader_score = '<span class="vader-score-text">Vader Score: ' + x.vader + '</span>'
        let row = $('<div class="row"></div>');
        review_section.append('<p class="xcol-sm-6 xoffset-sm-2">' + x.text + '<br>' + vader_score + '<p>');
        // row.append('<p>Vader Score: ' + x.vader + '</p>')
        // row.append('<button class="vader-btn btn btn-sm btn-primary">Analyze</button>');
        // review_section.append(row);
        review_section.append('<br>');
    });
    $('#review-page-btns').css('display', 'inline-flex');
}

draw_pie();
draw_bubbles();




$('#review-page-btns').on('click', function(event) {
    let page = event.target.innerText === 'next page' ? 5 : -5;
    console.log(page);
});




























