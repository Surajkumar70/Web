const cherio = require('cherio');
const request = require('request');
const fs = require('fs');
const input = require('readline-sync');

//// in order to get al links in this file
// const writeLinks = fs.createWriteStream('imageLinks.txt', 'utf8');

const URL = input.question('Enter your url : ');

request(URL, async (err, res, html) => {
    const allURLs = []
    if (err) return 'Request failed';
    console.log('Request is a success');
    const $ = cherio.load(html);

    await $('img').each((ind, image) => {
        let imgLink = $(image).attr('src'); // extracting links of the image
        
        //// to get image links in a text file
        // const links = imgLink.concat('\n');
        // writeLinks.write(links);
        
        if (imgLink.search('http')){ // if found http in URL
            imgLink = URL.concat(imgLink)
        };
        // console.log(imgLink)
        allURLs.push(imgLink);
    })

    const URLs = new Set(allURLs); // filter duplicate images/urls
    console.log([...URLs]);
    [...URLs].forEach((link, index)=>{
        const imageExt = link.slice(link.lastIndexOf('.')); // extracting extension of image
        download(link, index.toString().concat(imageExt));
    });
    
});

const download = (uri, filename) => {
    request.head(uri, () => {
        request(uri).pipe(fs.createWriteStream('./Images/'.concat(filename)));
    });

};

