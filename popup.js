// chrome.storage.sync.remove("id", function(data) {
//     alert("done")
// });

// chrome.storage.sync.get("revenue", function(data) {
//     alert(data.revenue)
// });

chrome.storage.sync.get("id", function(data) {
    if(data.id){
        $("#isId").fadeIn(1000)
        chrome.storage.sync.get("payout", function(data) {
            $("#PayoutNum").text(data.payout)
            chrome.storage.sync.get("revenue", function(data) {
                $("#RevMoney").text(data.revenue.substring(4))
            });
        });
    }else{
        $("#noId").fadeIn(1000)
    }
});

document.getElementById("login").addEventListener("click", login);

function login(){
    $("#spin").addClass("fa fa-spinner fa-spin");
    $.ajax({
        type: "post",
        crossDomain: true,
        url: "https://70a22d02.ngrok.io/",
        data: {
            email: $("#email").val(),
            password: $("#password").val()
        },
        success: function(data) {
            if(data.response === true){
                // alert("he do oo")
                chrome.storage.sync.set({'id': data.id, "revenue": data.revenue, "payout": data.payout}, function() {

                    let loginInfo = {
                        response: true,
                        text : "Hello, I'm Paystack Informant. I'm your new best friend because I'm always here to inform you about money"
                    }

                    console.log("User successfuly logged in to the Paystack Informant server")
                    $("#login").text("Login Successful")
                    $("#noId").hide()
                    // $("#isId").fadeIn(1000)

                    chrome.storage.sync.get("payout", function(data) {
                        $("#PayoutNum").text(data.payout)
                        chrome.storage.sync.get("revenue", function(data) {
                            $("#RevMoney").text(data.revenue.substring(4))
                        });
                    });
                    $("#isId").fadeIn(1000)

                    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, loginInfo)
                    })
                });
            }
        },
        error: function(error){
            alert("there is error ooo")
            alert(error)
            
        }
    })
}