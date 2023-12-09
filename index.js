const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const express = require('express');
const app = express();
const port = 1999;
const axios = require('axios');
const cheerio = require('cheerio');
var clients = null;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

// index page
app.get('/otps', function(req, res) {
    res.render('index');
});

function nomorTelp(nomor) {
    let processedNumber = nomor.replace(/[^\d]/g, '');
    if (processedNumber.startsWith('0')) {
        processedNumber = '62' + processedNumber.slice(1);
    }
    if (processedNumber.startsWith('+')) {
        processedNumber = processedNumber.slice(1);
    }
    return processedNumber;
}

app.post('/getOtp', async function(req, res){
    try {
        var sts = 0;
        var nomor = req.body.nomor;
        var message = '';
        var nomors =  nomorTelp(nomor);

        await client.sendMessage(`${nomors}@c.us`, 'Nomor OTP: '+Math.floor(Math.random() * 100 * 100))
            .then((response) => {
                sts = 1;
                message = 'Berhasil Kirim OTP';
            })
            .catch((err) => {
                message = 'Gagal Kirim OTP karena ' + err;
            })
            .finally(() => {
                res.status(200).json({ status: sts, msg: message });
            });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ status: 0, msg: 'Internal Server Error' });
    }
})

app.get('/',(req,res)=>{
    res.send(
        `<ul>
            <li><a href="https://apigerald.cyclic.app/askapi">API Pencarian ASK.COM</a></li>
        </ul>`
    )
})

app.get(`/askapi/`,(reg,res)=>{
    if(reg.query.judul==null){
        res.send('/?judul=contoh&hal=1')
    }else{
        var jdl = reg.query.judul;
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
                console.log('Gagal Respons!');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
})
app.use((req, res, next) => {
    res.status(404).send(
        "<h1>404 Salah Menempatkan Query :(</h1>")
})
app.listen(port, ()=>{
    console.log(`Aplikasi berjalan di port ${port}`);
})
