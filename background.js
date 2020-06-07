
let users;
var query = { active: true, currentWindow: true };
let flag = false;
let avgFinalPrice=avgFinalReviews=avgFinalQuantities=avgFinalBeds=avgFinalBaths=avgFinalSuperHosts=0;
    



chrome.runtime.onInstalled.addListener(function (details){
    createAlarm();
});

function createAlarm() {
    var now = new Date();
    var day = now.getDate();
    if (now.getHours() >= 10) {
        // 3 AM already passed
        day += 1;
    }
    // '+' casts the date to a number, like [object Date].getTime();
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, 1, 50, 0, 0);
    //                        YYYY               MM              DD  HH MM SS MS

    // Create
    chrome.alarms.create('3AMyet', {
        delayInMinutes: 1,
        periodInMinutes: 10080,

    });
}

// Listen
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === '3AMyet') {
        console.log('alarm fired');
        readDB();
    }
});




function callback(email,url) {
    // there will be only one in this array
    if(url.includes('airbnb'))
        getWebsitecontent(email,url);
    else
        console.log('not airbnb url');   
  }


function readDB() {
    chrome.storage.sync.get(['key'], function (result) {
        users = result.key;
       
        if(users==null)
            return;
    
        for(let i =0;i<users.length;i++){
    
            console.log(`users from background ${users[i].email}`);
            callback(users[i].email,users[i].url,);
            
        }
        if (users != null) {
            console.log('not null from background');
        }
    
    });
}


function requestEmail(email,url) {
    var params ={
        'email':email,
        'url':url,
        'avgPrice':avgFinalPrice,
        'avgBeds':avgFinalBeds,
        'avgBaths':avgFinalBaths,
        'avgRating':avgFinalReviews,
        'avgQuantity':avgFinalQuantities,
        'superHosts':avgFinalSuperHosts
    }


    let webUrl = 'https://bnb-sniper-pro.herokuapp.com/mail';

    const req = new XMLHttpRequest();

    req.open("POST", webUrl, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(params));

    req.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log(`respose is : ${this.responseText}`);
        }
    }
    console.log(params);
}

function getWebsitecontent(email,url) {

    $.get(url, function (response) {

        getAvgPrice(response);
        getReviewsData(response);
        getAvgBeds(response);

        getAvgSuperHosts(email,url,response);

    });
    //$('.display').show();


    
}

function getAvgSuperHosts(email,url,response){
    
    let superHosts = $('._lwunzw', response);

    console.log(superHosts);
    let superHostCount= 0;
    $(superHosts).each(function (index) {
        console.log($(superHosts[index]).text());
        if($(superHosts[index]).text()=='SUPERHOST')
            superHostCount++;
    });

    avgFinalSuperHosts+=superHostCount;

    console.log(`Total Number of super hosts are : ${superHostCount}`);


    //var page2 = document.querySelector('li[data-id="page-2"]');
    //console.log(page2);

    //$('._3hmsj',response).click();

    //console.log(($('a._1li8g8e',response)[0]).attr('href'));

    // if(!flag){
    // chrome.tabs.executeScript({
    //     file: 'script.js'
    //   },function (response) {
    //       console.log('loaded');flag = true;
    //       chrome.tabs.query(query, callback2);
    //   });
    // }else{
    // }

    setTimeout(function () {
        return requestEmail(email,url);
    },1000)
    
    

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
        avgFinalBeds+=noOfBeds;
        avgFinalBaths+=noOfBaths;
    }else{
        
        avgFinalBeds=avgFinalBeds+noOfBeds/2;
        avgFinalBaths= avgFinalBaths+noOfBaths/2;
        avgFinalBeds = Math.round((avgFinalBeds + Number.EPSILON) * 100) / 100;
        avgFinalBaths = Math.round((avgFinalBaths + Number.EPSILON) * 100) / 100;
    }

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
        strPrice = strPrice.match(/\d+/);
        sumOfPrices += parseInt(strPrice);
        n++;
    });


    sumOfPrices = Math.round((sumOfPrices / n + Number.EPSILON) * 100) / 100;
    if(!flag)
        avgFinalPrice +=sumOfPrices;
    else
    avgFinalPrice= Math.round(((avgFinalPrice +sumOfPrices)/2 + Number.EPSILON) * 100) / 100;
   

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
        avgFinalQuantities+=reviewQuantitySum;
    
        avgFinalReviews +=sum;
    }else{
        avgFinalQuantities= Math.round(((avgFinalQuantities+reviewQuantitySum)/2 + Number.EPSILON) * 100) / 100;
        //avgFinalQuantities= avgFinalQuantities+reviewQuantitySum/2;
    
        avgFinalReviews= Math.round(((avgFinalReviews +sum)/2 + Number.EPSILON) * 100) / 100;
        
        ;
    }

    // console.log(`sum ${sum}`);
    // console.log(`reviewQuantitySum ${reviewQuantitySum}`);
    // console.log(`review Average : ${sum / number}  review Quantity Avg : ${reviewQuantitySum / number}`);
}





function addNewUser(users) {
    chrome.storage.sync.set({ key: users }, function () {
        console.log('Value is set to ' + users);
    });
}






