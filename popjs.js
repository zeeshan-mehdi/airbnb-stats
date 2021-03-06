
var query = { active: true, currentWindow: true };
let flag = false;
let avgFinalPrice=avgFinalReviews=avgFinalQuantities=avgFinalBeds=avgFinalBaths=avgFinalSuperHosts=0;
document.addEventListener('DOMContentLoaded', function () {
    $('.display').hide();
    chrome.tabs.query(query, callback);

});

function callback(tabs) {
    $('.label').text('fetching results .....');
    $('.spinner-border').show();
    var url = tabs[0].url; 
    // there will be only one in this array
    if(url.includes('airbnb')&&url.includes('/s/'))
        getWebsitecontent(url);
    else if(!url.includes('airbnb')){
        chrome.tabs.create({active: true, url: "https://www.airbnb.com/"});
        $('.spinner-border').hide();
        $('.label').text('please do search and open extension again');    
    }else{
        $('.spinner-border').hide();
        $('.label').text('please do search and open extension again');
    }
  }



// $('.btnSearch').click(function () {

//     let query = $('.searchText').val();

//     let startDate = $('.startDate').val();
//     let endDate = $('.endDate').val();
//     let guests = $('.guests').val();
//     let raw = query;

//     //alert(startDate);

//     if(query==null||query==''||startDate==null||endDate==null||guests==null){
//         alert('please fill all feilds all are mandatory');
//         return;
//     }
//     query = query.replace(/\s+/g, '-');

    


//     getWebsitecontent(query,raw,startDate,endDate,guests);
    
// });

function getWebsitecontent(url) {

    $.get(url, function (response) {

        getAvgPrice(response);
        getReviewsData(response);
        getAvgBeds(response);

        getAvgSuperHosts(response);

    });
    $('.display').show();


    
}

function getAvgSuperHosts(response){
    
    let superHosts = $('._lwunzw', response);

    console.log(superHosts);
    let superHostCount= 0;
    $(superHosts).each(function (index) {
        console.log($(superHosts[index]).text());
        if($(superHosts[index]).text()=='SUPERHOST')
            superHostCount++;
    });

    avgFinalSuperHosts+=superHostCount;

    $('.avgSuperHosts').text(avgFinalSuperHosts);
    console.log(`Total Number of super hosts are : ${superHostCount}`);


    //var page2 = document.querySelector('li[data-id="page-2"]');
    //console.log(page2);

    //$('._3hmsj',response).click();

    //console.log(($('a._1li8g8e',response)[0]).attr('href'));

    if(!flag){
    chrome.tabs.executeScript({
        file: 'script.js'
      },function (response) {
          console.log('loaded');flag = true;
          chrome.tabs.query(query, callback);
      });
    }

    // console.log($('a._1li8g8e',response)[0]);
}


function getAvgBeds(response) {

    let beds = $('._1ulsev2', response);


    //console.log(beds);

    let noOfBeds = 0;
    let noOfBaths= 0 ;
    let str='';

    let n=0;


   
    $(beds).each(function (index) {
        
        let line = $(beds[index]).text();

        //console.log(line);

        let val = line.match(/\d/g);
       // console.log(val);

        if (val != null) {

            n++;
            let len = val.length;
            //console.log(val);

            str+=val[len - 2];
            
            noOfBeds+= parseInt(val[len - 2]);
            noOfBaths+= parseInt(val[len - 1]);
            
        }
    });


    console.log(str);
   // $('.label').text(n);


    noOfBeds = Math.round((noOfBeds/n + Number.EPSILON) * 100) / 100;
    noOfBaths = Math.round((noOfBaths/n + Number.EPSILON) * 100) / 100;


    if(!flag){
        avgFinalBeds=noOfBeds;
        avgFinalBaths=noOfBaths;
        console.log(`round 1 beds : ${noOfBeds} & baths ${noOfBaths}`);
        $('.label').text('20 Results Successfully Fetched ');
    }else{
        console.log(`round 2 beds : ${noOfBeds} & baths ${noOfBaths}`);
        avgFinalBeds=(avgFinalBeds+noOfBeds)/2;
        avgFinalBaths= (avgFinalBaths+noOfBaths)/2;

        console.log(`sum of 1 & 2 beds : ${avgFinalBeds} & baths ${avgFinalBaths}`);
        avgFinalBeds = Math.round((avgFinalBeds + Number.EPSILON) * 100) / 100;
        avgFinalBaths = Math.round((avgFinalBaths + Number.EPSILON) * 100) / 100;
    }

    $('.avgBeds').text(avgFinalBeds);
    $('.avgBaths').text(avgFinalBaths);
    // console.log(`total beds : ${noOfBeds}`);
    // console.log(`total baths : ${noOfBaths}`);

    // console.log(`avg no of beds : ${noOfBeds/n}`);
    // console.log(`avg no of baths : ${noOfBaths/n}`);


}


function getAvgPrice(response) {
    let sumOfPrices = 0;
    let prices = $('._1p7iugi', response);

    let n = 0;
    $(prices).each(function (index) {
        let strPrice = $(prices[index]).text();
        console.log(strPrice);
        strPrice = strPrice.match(/\d+/);

        console.log(strPrice);
        sumOfPrices += parseInt(strPrice);
        n++;
    });


    sumOfPrices = Math.round((sumOfPrices / n + Number.EPSILON) * 100) / 100;
    if(!flag){
        avgFinalPrice =sumOfPrices;
        console.log(`round 1 ${sumOfPrices}`);
    }
    else{


        console.log(`round 2 ${sumOfPrices}`);
        avgFinalPrice= avgFinalPrice +sumOfPrices;
        console.log(`total sum of 1 & 2 ${avgFinalPrice}`);
        avgFinalPrice= (Math.round((avgFinalPrice/2 + Number.EPSILON) * 100) / 100);
        
    }
    $('.avgPrices').text(avgFinalPrice );

    // console.log(`avg of prices   ${sumOfPrices / n}`);

}

function getReviewsData(response) {
    let rating = $('._60hvkx2', response);

    let sum = 0;
    let number = 0;
    let reviewQuantitySum = 0;

    $(rating).each(
        function (index) {
            number++;
            let rate = $(rating[index]).text();

            if (rate.includes('(')) {
                reviewQuantitySum += parseInt(rate.substring(rate.indexOf('(') + 1, rate.indexOf(')')));
                rate = rate.substring(0, rate.indexOf('('));
            }

            sum += parseFloat(rate);
            // console.log(reviewQuantitySum);
            //console.log(sum);
            // console.log(rate);
        }
    );

    reviewQuantitySum =  Math.round((reviewQuantitySum / number + Number.EPSILON) * 100) / 100;
    sum =  Math.round((sum / number + Number.EPSILON) * 100) / 100;


    if(!flag){
        
        console.log(`round 1 reviewQuantity sum : ${reviewQuantitySum}`);

        avgFinalQuantities=reviewQuantitySum;
    
        avgFinalReviews =sum;
    }else{
        console.log(`round 2 reviewQuantity sum : ${reviewQuantitySum}`);
        avgFinalQuantities = avgFinalQuantities+reviewQuantitySum;
        avgFinalQuantities= Math.round((avgFinalQuantities/2 + Number.EPSILON) * 100) / 100;
        //avgFinalQuantities= avgFinalQuantities+reviewQuantitySum/2;
    
        avgFinalReviews = avgFinalReviews+sum;
        avgFinalReviews= Math.round((avgFinalReviews/2 + Number.EPSILON) * 100) / 100;
        
        $('.label').text('40 Results Fetched Successfully ');
        $('.spinner-border').hide();
    }

    
    $('.avgQuantity').text(avgFinalQuantities );
    $('.avgReviews').text(avgFinalReviews );

    // console.log(`sum ${sum}`);
    // console.log(`reviewQuantitySum ${reviewQuantitySum}`);
    // console.log(`review Average : ${sum / number}  review Quantity Avg : ${reviewQuantitySum / number}`);
}