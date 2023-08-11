const express = require('express');
const app = express();
const port = 1999;
const axios = require('axios');
const cheerio = require('cheerio');

app.get(`/api/`,(reg,res)=>{
    if(reg.query.judul==null&&reg.query.hal==null){
        res.send('/?judul=contoh&hal=1')
    }else{
        var jdl = reg.query.judul==null?'https://github.com/bantutataweb/ApiPencarianExp':reg.query.hal;
        var halm = reg.query.hal==null?1:reg.query.hal;
        axios.get(`https://www.ask.com/web?q=${jdl}&page=${halm}`)  
        .then(function (response) {
            if(response.status==200){
                const html = response.data;
                const $ = cheerio.load(html)
                let loopingApi = []
                $('.PartialSearchResults-results .PartialSearchResults-item-wrapper .PartialSearchResults-item').each(function(i, el){
                    loopingApi[i]={
                        judul   : $(this).find('.PartialSearchResults-item-title').text().trim(),
                        url     : $(this).find('.PartialSearchResults-item-title a').attr('href').trim(),
                        content : $(this).find('.PartialSearchResults-item-details .PartialSearchResults-item-right-block p').text().trim(),
                    }
                })
                res.send(JSON.stringify(loopingApi))
            }else{
                console.log('Gagals Respons!');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
})
app.use((req, res, next) => {
    res.status(404).send(
        "<h1>Salah Menempatkan Query :(</h1>")
})
app.listen(port, ()=>{
    console.log(`Aplikasi berjalan di port ${port}`);
})
