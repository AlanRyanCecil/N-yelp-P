from flask import Flask, request, render_template, redirect, jsonify
import pandas as pd
import requests
import json
import os
from config_yelp import api_key


app = Flask('alan')

df = pd.read_csv('static/data/top_21_businesses.csv', sep='\t')
top_10_businesses = df.groupby('name').count().sort_values('text', ascending=False)[:10].index

headers = {'Authorization': f'bearer {api_key}'}
city = 'San Diego'
search_term = 'bar'
search_url = f'https://api.yelp.com/v3/businesses/search?location={city}&term={search_term}'

if os.path.isfile('yelp.json'):
    with open('yelp.json', 'r') as json_data:
        yelp_data = json.load(json_data)
else:
    pass
    # yelp_data = requests.get(search_url, headers=headers).json()
    # with open('yelp.json', 'w') as outfile:
    #     json.dump(data, outfile)


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        form_data = request.form
        city = form_data['city']
        search = form_data['business']
        url = f'https://api.yelp.com/v3/businesses/search?location={city}&term={search}'
        # use Yelp_data var until done
        # data = requests.get(url, headers=headers).json()
        return render_template('index.html', data=yelp_data['businesses'])
    return render_template('index.html', businesses=top_10_businesses)


@app.route('/data/<name>')
def pandas(name):
    ds = df.loc[df['name'] == name, :].copy()
    ds = ds.sort_values('date', ascending=False)
    data = []
    for i, row in ds.iterrows():
        data.append({x: row[x] for x in row.index})
    return jsonify(data[:200])


@app.route('/yelp')
def yelp():
    return jsonify(yelp_data['businesses'])


if __name__ == '__main__':
    app.run(debug=True)
