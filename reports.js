
var url;

var query = { active: true, currentWindow: true };
chrome.tabs.query(query, callback);
function callback(tabs) {
    url = tabs[0].url; 
  }



$('.subscribe').click(function (params) {
    let email = $('.email').val();

    if(url==null || !url.includes('airbnb')){
        $('.label').text('Url does not include airbnb');
        return;
    }


    var obj = {
        'email': email,
        'url': url
    }

    let users = [];

    chrome.storage.sync.get(['key'], function (result) {
        users = result.key;
        console.log(users);

        if (users != null) {
            users.push(obj);
            addNewUser(users);
        }else{
            users = [];
            users.push(obj);
            addNewUser(users);
        }

    });
});

function addNewUser(users) {
    chrome.storage.sync.set({key:users}, function() {
        console.log('Value is set to ' + users);
        $('.hide').removeClass('hide');
        $('.container').addClass('hide');
      });
}