'use strict';
/**** **
 * *****
 *  ******/
// AOK 13.10.2019, github aomerk
/**** **
 * *****
 *  ******/

let usernameValue; // ...
let user; // user json obj {user, saved, content}

// initialize array
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.get(['users'], function (result) {
        if (result == null || result.users == null || result.users.length < 1) {
            let initData = {
                "username": "aliomerkeser",
                "content": "selam"
            };
            let arr = [initData];
            chrome.storage.sync.set({
                users: arr
            }, function () {
            });
        }
    });


});

// path changed
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    query();
});
// tab changed
chrome.tabs.onActivated.addListener(function () {
    query()
});

// path loaded
chrome.webNavigation.onCompleted.addListener(function () {
    query()
}, {
    url: [{
        urlMatches: 'twitter.com'
    }]
});

function query() {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function (tabs) {
        const tab = tabs[0];
        usernameValue = tab.url.split('com/')[1];
        usernameValue = usernameValue.split('/')[0];
        let path = tab.url.split('/')[2];
        if (path !== "twitter.com") {
            chrome.browserAction.setPopup({popup: ''});
        }else{
            chrome.browserAction.setPopup({popup: './popup.html'});

        }


        if (isSavedUser(usernameValue)) {
        } else {

        }
    });
}


// checks if code saved in chrome.sync
function isSavedUser(username) {
    chrome.storage.sync.get(['users'], function (result) {

        user = findInArray(username, result.users);

        chrome.storage.sync.set({
            currentUser: user
        }, function () {
        });
    });
}

// users are saved in a json array, finds current user
function findInArray(username, usersArray) {
    let tempUser = {user: username, content: "", saved: false};
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    chrome.browserAction.setBadgeText({text: "\u26CC"});
    usersArray.forEach(e => {
        if (e.user === username) {
            tempUser = e;
            chrome.browserAction.setBadgeText({text: "\u2713"});
            tempUser.saved = true;
        }
    });
    return tempUser;
}

