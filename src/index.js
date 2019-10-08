require("dotenv").config();

const express = require('express');
const axios = require('axios');

const app = express();

app.use('/', express.static(__dirname + '/public'));
app.use(express.json());

app.post('/api/:abbrev/:chapter/:verses', (req, res) => {

    const { abbrev, chapter, verses } = req.params;

    axios.get(`https://bibleapi.co/api/verses/ra/${abbrev}/${chapter}`)
    .then((response) => {
        let result = [];

        if( verses ) {

            if( verses.indexOf("-") >= 0 ){
                const v = verses.split("-", 2);
                const startVerse = parseInt(v[0]);
                const endVerse = parseInt(v[1]);
    
                for (let i = startVerse; i <= endVerse; i++) {
                    response.data.verses.map((verse) => { 
                        if (verse.number === i){
                            result.push(verse);
                        }
                    });
                }
    
                response.data.verses = result;
    
                return res.json( response.data );
            }
    
            if( !isNaN(verses) ){
                const v = parseInt(verses);
    
                response.data.verses.map((verse) => { 
                    if (verse.number === v){
                        result.push(verse);
                    }
                });
    
                response.data.verses = result;
    
                return res.json( response.data );
            }
            
        }

        return res.json( response.data );   
    }).catch(error => {
        return res.status(500).json( error );
    });

});

app.listen(process.env.PORT);