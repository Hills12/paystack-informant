function notifier (status = String, message) {
    $("body").prepend(`<div id="${status}"> ${message}</div>`)
    $(`#${status}`).fadeIn(1000);
    setTimeout(function(){
        $(`#${status}`).fadeOut()
    }, 8000)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    message.response ? notifier("goodInfo", message.text) : notifier("badInfo", message.text) 
})

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        if(key == "id"){
            console.log(`Your Login ${key} was cleared, kindly login again to the Paystack Informant Extension`)
        }else{
            // console.log(`Your ${key} amount has changed from ${storageChange.oldValue} to ${storageChange.newValue}. You can check the extension`)

            let infoText = `😊 Hey there ❕❕❕ Some numbers just changed in your Paystack Account, 😉 might be positive 📈 Better you check your Extension`

            notifier("goodInfo", infoText)
        }
    }
});

/* chrome.storage.sync.set({"revenue": "NGN 50,000.00", "payout": "NGN 50,000.00" }, function() {
    console.log("successful")
}); */

chrome.storage.sync.get("id", function(storage) {
    if(storage.id){
        $.ajax({
            type: "post",
            crossDomain: true,
            url: "https://70a22d02.ngrok.io/alwaysGet",
            data: {
                id: storage.id
            },
            success: function(data) {
                if(data.response == true){
                    chrome.storage.sync.set({'id': storage.id, "revenue": data.revenue, "payout": data.payout }, function() {
                        console.log("Information gotten! Items are being saved to the extension storage")
                    });
                }else if(data.response == false){
                    chrome.storage.sync.remove("id", function() {
                        console.log("There is no user in the Paystack Informant DB hence, remove ID")
                    });
                }
            },
            error: function(error){
                console.log("there is an error connecting to the Paystack Informant server")
                console.log(error)
            }
        })
    }else{
        console.log("You are not logged in to Paystack Informant. kindly login to continue")
    }
});