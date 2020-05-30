

document.addEventListener('DOMContentLoaded', function () {
    $('.display').hide();
});



$('.btnSearch').click(function () {

    let query = $('.searchText').val();

    let startDate = $('.startDate').val();
    let endDate = $('.endDate').val();
    let guests = $('.guests').val();
    let raw = query;

    //alert(startDate);

    if(query==null||query==''||startDate==null||endDate==null||guests==null){
        alert('please fill all feilds all are mandatory');
        return;
    }
    query = query.replace(/\s+/g, '-');

    


    getWebsitecontent(query,raw,startDate,endDate,guests);
    
});

function getWebsitecontent(query,raw,startDate,endDate,guests) {

    $.get('https://www.airbnb.com/s/'+query+'/homes?tab_id=home_tab&refinement_paths%5B%5D=%2Fhomes&source=structured_search_input_header&search_type=search_query&query='+raw+'&adults='+guests+'&checkin='+startDate+'&checkout='+endDate+'', function (response) {

        getAvgPrice(response);
        getReviewsData(response);
        getAvgBeds(response);

        getAvgSuperHosts(response);

    });
    $('.display').show();
}

function getAvgSuperHosts(response){
    
    let superHosts = $('._lwunzw', response);

    let superHostCount= 0;
    $(superHosts).each(function (index) {
        superHostCount++;
    });

    $('.avgSuperHosts').text(superHostCount);
    console.log(`Total Number of super hosts are : ${superHostCount}`);
}


function getAvgBeds(response) {

    let beds = $('._1ulsev2', response);

    let noOfBeds = 0;
    let noOfBaths= 0 ;

    let n=0;

    $(beds).each(function (index) {
        n++;
        let line = $(beds[index]).text();

        //console.log(line);

        let val = line.match(/\d/g);
       // console.log(val);

        if (val != null) {

            let len = val.length;

            noOfBeds+= parseInt(val[len - 2]);
            noOfBaths+= parseInt(val[len - 1]);
            
        }
    });


    $('.avgBeds').text(noOfBeds/n);
    $('.avgBaths').text(noOfBaths/n);
    console.log(`total beds : ${noOfBeds}`);
    console.log(`total baths : ${noOfBaths}`);

    console.log(`avg no of beds : ${noOfBeds/n}`);
    console.log(`avg no of baths : ${noOfBaths/n}`);


}


function getAvgPrice(response) {
    let sumOfPrices = 0;
    let prices = $('._1p7iugi', response);

    let n = 0;
    $(prices).each(function (index) {
        let strPrice = $(prices[index]).text();
        strPrice = strPrice.substring(strPrice.indexOf('$') + 1);
        if (strPrice.includes('$')) {
            strPrice = strPrice.substring(strPrice.indexOf('$') + 1);
        }
        sumOfPrices += parseInt(strPrice);
        n++;
    });

    $('.avgPrices').text(sumOfPrices / n);

    console.log(`avg of prices   ${sumOfPrices / n}`);

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

    $('.avgQuantity').text(reviewQuantitySum / number);
    $('.avgReviews').text(sum / number);

    console.log(`sum ${sum}`);
    console.log(`reviewQuantitySum ${reviewQuantitySum}`);
    console.log(`review Average : ${sum / number}  review Quantity Avg : ${reviewQuantitySum / number}`);
}