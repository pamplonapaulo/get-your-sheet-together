(function(){
    'use strict';

    var $arrBoards = [];
    var $newBoardBtn = document.querySelector('.newBoard-btn');
    var $boardModal = document.querySelector('#board-modal');
    var $createBoardBtn = document.querySelector('#createBoard-btn');
    var $cancelBoardBtn = document.querySelector('#cancelBoardCreation-btn');
    var boardTitle = document.querySelector('input[data-js="board-title"]');
    var $homeBtn = document.querySelector('#home-btn');
    var $saveBtn = document.querySelector('#save-btn');
    
    $homeBtn.addEventListener('click', goHomePage); 
    $saveBtn.addEventListener('click', saveUserData); 
    
    $newBoardBtn.addEventListener('click', showTitleBoardAsker);            
    $createBoardBtn.addEventListener('click', createNewBoard);
    $cancelBoardBtn.addEventListener('click', hideTitleBoardAsker);
    boardTitle.addEventListener('keyup', keyUpHandler(event), false);
        
    function Board(name){
        this.title = '' + name + '';
        this.id = $arrBoards.length;
        this.lists = [];
    }
    
    function List(name, board){
        this.title = '' + name + '';
        this.id = board.lists.length;
        this.boardName = board.title;
        this.boardId = board.id;
        this.items = [];
    }
    
    function Item(name, list, board){
        this.title = '' + name + '';
        this.id = list.items.length;
        this.boardName = board.title;
        this.boardId = board.id;
        this.listName = list.title;
        this.listID = list.id;
    }
    
    function showTitleBoardAsker(){
        $newBoardBtn.style.display = 'none';
        $boardModal.style.display = 'inline-block';
        boardTitle.focus();
    }
    
    function createUser(user){
        var post = new XMLHttpRequest();
        post.open('POST', 'http://localhost:3000/');
        post.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        post.send('id='+user.id+
                  '&name='+user.name);
        post.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              loadUserData(user);    
          }
        };        
    }
    
    function loadUserData(user){
        var userData = [];
        var get = new XMLHttpRequest();
        get.open('GET', 'http://localhost:3000/user/' + user.id);
        get.send();
        get.onreadystatechange = function(e) {
            if (get.readyState === 4) {
                userData = JSON.parse(get.responseText);
                window.user.index = userData.index;
                userData.boards.forEach(function(element) {
                    $arrBoards.push(element);
                    buildBoard(element);
                    buildHiddenHTML(element);
                });
            }
        };
    }
            
    function saveUserData(){
        var userData = {
            index: window.user.index,
            boards: $arrBoards,
            id: window.user.id,
            name: window.user.name
        }
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/boards');
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.send(JSON.stringify(userData));
    } 
    
    function hideTitleBoardAsker(){
        $newBoardBtn.style.display = 'inline-block';
        $boardModal.style.display = 'none';
        boardTitle.value = '';
    }

    function createNewBoard(){
        var newBoard = new Board(boardTitle.value);
        $arrBoards.push(newBoard);
        buildBoard(newBoard);
        hideTitleBoardAsker();
    }

    function buildBoard(board){
        buildBigBoardButton(board);
        buildBoardHeader(board);
    }
    
    function buildBigBoardButton(board){
        $boardModal.insertAdjacentHTML("afterend", '<li class="board" data-js="' + board.id + '"><div><h6>' + board.title + '</h6></div></li>');
        listenerSetter(board);
    }
    
    function buildBoardHeader(board){
        $boardModal.parentElement.insertAdjacentHTML("afterend", '<ul class="lists" board-js="' + board.id + '"><li class="list-namer"><i class="material-icons">add_circle_outline</i><input type="text" data-js="list-title" placeholder="Name a new list" maxlength="17"/></li></ul>');
        listenerSetter(board.id);
    }
    
    function listenerSetter(obj, list){
        
        // Board selector listener
        if(whatAmI(obj) === '[object Object]' && arguments.length === 1)
            document.querySelector('[data-js="' + obj.id + '"]').addEventListener('click', selectBoard);
        
        // New list listener
        if(whatAmI(obj) === '[object Number]' && arguments.length === 1)
            document.querySelector('[data-js="list-title"]').addEventListener('keyup', keyUpHandler(event, obj), false);
                
        // New item listener
        if(arguments.length === 2) {            
            var el = document.querySelector('#board-'+obj+'-list-'+list+'');
            el.parentElement.childNodes[1].addEventListener('keyup', keyUpHandler(event, obj, list, el), false);
        }
    }
    
    function whatAmI(obj) {
        return Object.prototype.toString.call(obj);
    }
    
    function selectBoard(){
        var selected = event.target.parentElement.parentElement;
        $arrBoards.forEach(function(element, index) {
          hide(document.querySelector('[data-js="' + index + '"]'));
        });
        selected.style.display = 'inline-block';
        selected.style.float = 'left';
        hide($newBoardBtn);
        openBoard(selected);
    }
    
    function openBoard(selected){
        var board = selected.getAttribute("data-js");
        document.querySelector('[board-js="' + board + '"]').style.display = 'inline-block';
    }
                
    function buildNewList(board, name, boardHeader, listID){
        
        var list = $arrBoards[board].lists.length;
        var li = document.createElement("li");
        var div = document.createElement("div");
        var p = document.createElement("p");
        var input = document.createElement("input");
        var ul = document.createElement("ul");
        
        if (arguments.length === 4)
            var list = listID;
        
        input.setAttribute('type', 'text');
        input.setAttribute('maxlength', '17');
        input.setAttribute('ondrop', 'return false');
        input.setAttribute('ondragover', 'return false');
        input.setAttribute('data-js', 'inputItemName board' + board + '-list' + list);
        ul.setAttribute('class', 'items');
        ul.setAttribute('id', 'board-' + board + '-list-' + list);
        ul.addEventListener('drop', dropHandler(event, ul), false);
        ul.addEventListener('dragover', allowDropHandler(event), false);
        p.innerText = name;
        li.appendChild(div);
        div.appendChild(p);
        li.appendChild(input);
        li.appendChild(ul);
        boardHeader.parentElement.appendChild(li);
        listenerSetter(board, list);
    }
    
    function dropHandler(e, el){
        return function (e){
          e.preventDefault();
          var data = e.dataTransfer.getData("text");
          el.appendChild(document.getElementById(data));
          fixChanges(el, data);
        }
    }

    function allowDropHandler(e){
        return function (e){
          e.preventDefault();
        }
    }
    
    function dragHandler(e){
        return function (e){
            e.dataTransfer.setData("text", e.target.id);
        }
    }
            
    function fixChanges(listElement, itemID){
        var spot = listElement.id;
        var listID = spot.replace(/board-(\d+)-list-(\d+)/g, '$2');
        var boardID = spot.replace(/board-(\d+)-list-(\d+)/g, '$1');
        var originalItemIndex = itemID.replace(/B(\d+)_L(\d+)_I(\d+)/g, '$3');
        var originalList = itemID.replace(/B(\d+)_L(\d+)_I(\d+)/g, '$2');        
        var finalItemArray = $arrBoards[boardID].lists[listID].items;
        var originalItemArray = $arrBoards[boardID].lists[originalList].items;
        var parentWrapper = document.getElementById('board-' + boardID + '-list-' + listID + '');
        
        moveItemBetweenListArrays(finalItemArray, pickItemFromArray(originalItemArray, originalItemIndex));
        updateIDs(finalItemArray, boardID, listID, parentWrapper);
        updateIDs(originalItemArray, boardID);
    }
            
    function updateIDs(itemArray, boardIndex, listIndex, wrapper){
        
            for (var i=0; i<itemArray.length; i++){
                
                itemArray[i].id = i;
                
                if(arguments.length === 4){ 
                    itemArray[i].listID = listIndex;
                    itemArray[i].listName = $arrBoards[boardIndex].lists[listIndex].title;
                   }
                if(arguments.length === 2){ 
                    var listIndex = itemArray[i].listID;
                    var wrapper = document.getElementById('board-' + boardIndex + '-list-' + listIndex + '');
                   }
                wrapper.childNodes[i].setAttribute('id', 'B' + boardIndex + '_L' + listIndex + '_I' + i);
            }
    }
    
    function pickItemFromArray(arrayOrigin, index){
        var itemOnMove = arrayOrigin.splice(index, 1);
        return itemOnMove[0];
    }
    
    function moveItemBetweenListArrays(arrayDestiny, item){
        arrayDestiny.push(item);
    }
    
    function keyUpHandler(e, board, list, el){
        var arg = arguments.length;
        return function (e){
            e.preventDefault();
            if(e.keyCode === 13){
                
                if(arg == 1)
                    return createNewBoard();                
                
                if(arg == 2) {
                    buildNewList(board, this.value, this.parentElement);
                    createListObj((board), this.value);
                }
                if(arg == 4) {
                    buildNewItem(el, board, list, this.value);
                    createItemObj(this.value, board, list);
                }
                this.value = "";
            }
        }
    }
    
    function createListObj(boardIndex, listTitle){
        var board = $arrBoards[boardIndex];
        var newList = new List(listTitle, board);
        board.lists.push(newList);
    }
    
    function buildNewItem(listElement, board, list, name, itemID){
                        
        var item = $arrBoards[board].lists[list].items.length;
        var li = document.createElement('li');        
        var div = document.createElement('div');        
        var p = document.createElement('p');  
        var i = document.createElement('i');
        
        if (arguments.length === 5)
            var item = itemID;
        
        li.setAttribute('id', 'B'+ board + '_L' + list + '_I' + item);
        li.setAttribute('draggable', 'true');
        li.setAttribute('ondrop', 'return false');
        li.setAttribute('ondragover', 'return false');
        li.addEventListener('dragstart', dragHandler(event), false);
        i.setAttribute('class', 'material-icons');
        i.innerText = 'add_circle_outline';
        p.innerText = name;
        div.appendChild(p);
        div.appendChild(i);
        li.appendChild(div);
        listElement.appendChild(li);
    }
    
    function createItemObj(name, board, list){
        var newItem = new Item(name, $arrBoards[board].lists[list], $arrBoards[board]);
        $arrBoards[board].lists[list].items.push(newItem);
    }
    
    function goHomePage(){
        hide();
        show($newBoardBtn);
        show();
        resetFloat();
    }
    
    function hide(element){
        if(arguments.length === 1)
            element.style.display = 'none';
        if(arguments.length === 0)
            document.querySelectorAll('.lists').forEach(function(element) {
              element.style.display = 'none';
            });
    }
        
    function show(element){
        if(arguments.length === 1)
            element.style.display = 'inline-block';
        if(arguments.length === 0)
            $arrBoards.forEach(function(element, index) {
              document.querySelector('[data-js="' + index + '"]').style.display = 'inline-block';
            });            
    }
        
    function resetFloat(){
        var allBoards = document.querySelectorAll('.board');
        allBoards.forEach(function(element) {
            element.style.float = 'none';    
        });
    }
        
    function buildHiddenHTML(board){
        if (board.lists.length > 0){
            rebuildLists(board);
        }
    }
    
    function rebuildLists(board){
        board.lists.forEach(function(list) {
            var boardHeader = document.querySelector('[board-js="' + board.id + '"]').firstChild; 
            buildNewList(board.id, list.title, boardHeader, list.id);
            rebuildItems(list, board);
        });        
    }
    
    function rebuildItems(list, board){
        if (list.items.length > 0){
            list.items.forEach(function(item) {
                var listElement = document.querySelector('#board-'+board.id+'-list-'+list.id+'');
                buildNewItem(listElement, board.id, list.id, item.title, item.id);
            });        
        }
    }
    
    
    
    // FACEBOOK LOGIN * * * * * * * * * * * * * * * * * * * * * * * * * * *

    document.getElementById('loginBtn').addEventListener('click', function() {
        //do the login
        FB.login(function(response) {
            if (response.authResponse) {
            //user just authorized your app
            checkLoginState();
            }
        }, {scope: 'public_profile,email', return_scopes: true});
    }, false);       

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '2112343138809750',
            cookie     : true,
            xfbml      : true,
            version    : 'v2.8'
        });
        FB.AppEvents.logPageView();   
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function checkLoginState() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }        

    function statusChangeCallback(response) {          
        if (response.status === 'connected') {
        runApp();
        } else {
        document.getElementById('status').innerHTML = 'Please log into this app.';
        }
    }

    function runApp() {
        FB.api('/me', function(response) {
            window.user = response;
            updateLayout();
            createUser(window.user);
        });
    }

    function updateLayout(){
        document.getElementById('user-name').innerHTML = window.user.name;
        document.querySelector('#image-wrapper').style.display = 'none';
        document.querySelector('.output').style.display = 'block';
    }
    
})();