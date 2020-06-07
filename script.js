

document.querySelector('a._1li8g8e').click();



//$('a._1li8g8e',response)[0].click();


// // var url = "http://anyorigin.com/go?url=" + encodeURIComponent("https://sfbay.craigslist.org/") +  "&callback=?";
// // $.get(url, function(response) {
// //   console.log(response);
// // });


// getWebsitecontent();


// function getWebsitecontent() {

//     $.get('https://www.airbnb.com/s/Mumbai--Maharashtra--India/homes?tab_id=home_tab&refinement_paths%5B%5D=%2Fhomes&place_id=ChIJwe1EZjDG5zsRaYxkjY_tpF0&source=structured_search_input_header&search_type=search_query&query=Mumbai%2C%20India&adults=3&checkin=2020-06-14&checkout=2020-06-15', function (response) {

//         getAvgPrice(response);
//         getReviewsData(response);
//         getAvgBeds(response);

//         getAvgSuperHosts(response);

//     });
// }

// function getAvgSuperHosts(response){
    
//     let superHosts = $('._lwunzw', response);

//     let superHostCount= 0;
//     $(superHosts).each(function (index) {
//         superHostCount++;
//     });

//     console.log(`Total Number of super hosts are : ${superHostCount}`);
// }


// function getAvgBeds(response) {

//     let beds = $('._1ulsev2', response);

//     let noOfBeds = 0;
//     let noOfBaths= 0 ;

//     let n=0;

//     $(beds).each(function (index) {
//         n++;
//         let line = $(beds[index]).text();

//         //console.log(line);

//         let val = line.match(/\d/g);
//        // console.log(val);

//         if (val != null) {

//             let len = val.length;

//             noOfBeds+= parseInt(val[len - 2]);
//             noOfBaths+= parseInt(val[len - 1]);
            
//         }
//     });


//     console.log(`total beds : ${noOfBeds}`);
//     console.log(`total baths : ${noOfBaths}`);

//     console.log(`avg no of beds : ${noOfBeds/n}`);
//     console.log(`avg no of baths : ${noOfBaths/n}`);


// }


// function getAvgPrice(response) {
//     let sumOfPrices = 0;
//     let prices = $('._1p7iugi', response);

//     let n = 0;
//     $(prices).each(function (index) {
//         let strPrice = $(prices[index]).text();
//         strPrice = strPrice.substring(strPrice.indexOf('$') + 1);
//         if (strPrice.includes('$')) {
//             strPrice = strPrice.substring(strPrice.indexOf('$') + 1);
//         }
//         sumOfPrices += parseInt(strPrice);
//         n++;
//     });

//     console.log(`avg of prices   ${sumOfPrices / n}`);

// }

// function getReviewsData(response) {
//     let rating = $('._60hvkx2', response);

//     let sum = 0;
//     let number = 0;
//     let reviewQuantitySum = 0;

//     $(rating).each(
//         function (index) {
//             number++;
//             let rate = $(rating[index]).text();

//             if (rate.includes('(')) {
//                 reviewQuantitySum += parseInt(rate.substring(rate.indexOf('(') + 1, rate.indexOf(')')));
//                 rate = rate.substring(0, rate.indexOf('('));
//             }

//             sum += parseFloat(rate);
//             // console.log(reviewQuantitySum);
//             //console.log(sum);
//             // console.log(rate);
//         }
//     );

//     console.log(`sum ${sum}`);
//     console.log(`reviewQuantitySum ${reviewQuantitySum}`);
//     console.log(`review Average : ${sum / number}  review Quantity Avg : ${reviewQuantitySum / number}`);
// }