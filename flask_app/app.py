from flask import Flask, request, render_template, redirect, jsonify
import requests
import json
import os
from config_yelp import api_key


app = Flask('alan')


headers = {'Authorization': f'bearer {api_key}'}
city = 'San Diego'
search_term = 'bar'
search_url = f'https://api.yelp.com/v3/businesses/search?location={city}&term={search_term}'

if os.path.isfile('yelp.json'):
    with open('yelp.json', 'r') as json_data:
        yelp_data = json.load(json_data)
else:
    yelp_data = requests.get(search_url, headers=headers).json()
    with open('yelp.json', 'w') as outfile:
        json.dump(data, outfile)


form_data = []


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        form_data.append(request.form)
        return jsonify(form_data)
    return render_template('index.html')


@app.route('/yelp')
def yelp():
    return jsonify(yelp_data['businesses'])


if __name__ == '__main__':
    app.run(debug=True)
