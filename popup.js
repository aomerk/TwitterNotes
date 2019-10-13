// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
/**** **
 * *****
 *  ******/
// AOK 13.10.2019, github aomerk
/**** **
 * *****
 *  ******/
let inputBox = document.getElementById('inputBox');
let username = document.getElementById('username');
let note = document.getElementById('note');
let labelNote = document.getElementById('labelNote');
let addButton = document.getElementById('addButton');
let deleteButton = document.getElementById('deleteButton');
let user;
let isSaved;
let allUsers = [];
// get current user from page
chrome.storage.sync.get(['currentUser'], function (result) {
    user = result.currentUser;
    updateUI();

});
// get users array
chrome.storage.sync.get(['users'], function (result) {
    let tempArr = result.users;
    tempArr.push(user);
});

// add user, update ui
addButton.onclick = function (element) {
    user.content = inputBox.value;
    user.saved = true;
    allUsers.push(user);
    setAllUsers();
    setCurrentUser();
    updateUI();

};

// delete user from storage
deleteButton.onclick = function () {
    const index = allUsers.findIndex(x => x.user === user.user);
    if (index !== undefined) allUsers.splice(index, 1);
    setAllUsers();
    user.content = "";
    user.saved = false;
    setCurrentUser();
    updateUI();
};

// set users variable
function setAllUsers() {
    chrome.storage.sync.set({
        users: allUsers
    }, function () {
    });
}

// set current user variable ( user)
function setCurrentUser() {
    chrome.storage.sync.set({
        currentUser: user
    }, function () {
        updateUI()
    });
}

// UI logic
function updateUI() {
    notAUser();
    username.innerText = '@'+ user.user;
    note.innerText = user.content;
    isSaved = user.saved;
    if (isSaved) {
        addButton.style.display = 'none';
        inputBox.style.display = 'none';
        labelNote.style.display = 'none';
        deleteButton.style.display = 'block';
    } else {
        addButton.style.display = 'block';
        deleteButton.style.display = 'none';
        inputBox.style.display = 'block';
        labelNote.style.display = 'block';
    }
}

// basic logic, url parsing
function notAUser() {

    if (user.user == null || user.user.toString().length > 16 || user.user === "home") {
        document.getElementById("body").innerHTML = `
        <h4>Not a User</h4>
        `
    }
}
