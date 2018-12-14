from flask import Flask, request, render_template, redirect, jsonify
import pandas as pd
import spacy
import re
from gensim.summarization import summarize
from wordcloud import WordCloud
import requests
import json
import os
from config_yelp import api_key


app = Flask('alan')

df = pd.read_csv('static/data/top_21_businesses.csv', sep='\t')
nlp = spacy.load('en_core_web_sm')
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
    return jsonify(data)


@app.route(('/tokens/<name>/<star>'))
def getTokens(name, star):
    ds = df.loc[df['name'] == name].sort_values('date', ascending=False)
    if star == '0':
        text = ' '.join(ds['text'][:300])
    else:
        text = ' '.join(ds.loc[ds['stars'] == int(star), 'text'][:300])
    summary = re.sub('\n', ' ', summarize(text[:200000], word_count=300))
    doc = nlp(summary)
    response = ''
    for tok in doc:
        if tok.pos_ == 'ADJ':
            response += ' <span class="adj-btn">' + tok.text + '</span>'
        elif tok.pos_ == 'NOUN':
            response += ' <span class="noun-btn">' + tok.text + '</span>'
        else:
            ws = '' if tok.pos_ == 'PUNCT' else ' '
            response += ws + tok.text
    return jsonify({'summary': response.strip()})



@app.route('/test')
def test():
    with open('../cleaned_data/test_response.txt', 'r') as read:
        data = read.read()
    return jsonify({'summary': data})


# @app.route('/wordcloud/<name>/<star>')
# def make_wordcloud(name, star):
#     ds = df.loc[df['name'] == name].sort_values('date', ascending=False)
#     if star == '0':
#         reviews = ' '.join(ds['text'][:300])
#     else:
#         reviews = ' '.join(ds.loc[ds['stars'] == int(star), 'text'][:300])
#     doc = nlp(reviews)
#     text = [t.text for t in doc if t.pos_ == 'NOUN']
#     freq_dict = {}
#     for word in text:
#         if re.match("your|person|place|that|thing", word):
#             continue
#         val = freq_dict.get(word, 0)
#         freq_dict[word.lower()] = val + 1
#     wc = WordCloud(width=600, height=300, background_color="white", max_words=2000)
#     wc.generate_from_frequencies(freq_dict)
#     img = BytesIO()
#     wc.to_image().save(img, 'PNG')
#     img.seek(0)
#     return send_file(img, mimetype='image/png')



@app.route('/yelp')
def yelp():
    return jsonify(yelp_data['businesses'])


if __name__ == '__main__':
    app.run(debug=True)
