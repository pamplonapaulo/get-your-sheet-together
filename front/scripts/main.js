(function(){
    'use strict';

    var $arrBoards = [];
    var $newBoardBtn = document.querySelector('.newBoard-btn');
    var $boardModal = document.querySelector('#board-modal');
    var $createBoardBtn = document.querySelector('#createBoard-btn');
    var $cancelBoardBtn = document.querySelector('#cancelBoardCreation-btn');
    var boardTitle = document.querySelector('input[data-js="board-title"]');
    var $homeBtn = document.querySelector('#home-btn');
    
    $homeBtn.addEventListener('click', goHomePage);            
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
        var itemOnDrag = document.getElementById(itemID);
        var itemNumber = itemID.replace(/B(\d+)_L(\d+)_I(\d+)/g, '$3');
        var originalList = itemID.replace(/B(\d+)_L(\d+)_I(\d+)/g, '$2');
        resetItemIDs($arrBoards[boardID].lists[listID].items, boardID, listID, originalList, itemNumber);        
    }
    
    function resetItemIDs(array, boardID, listID, originalList, originalItemIndex){
                        
        var originalItemArray = $arrBoards[boardID].lists[originalList].items;
        var parentWrapper = document.getElementById('board-' + boardID + '-list-' + listID + '');
        moveItemBetweenListArrays(array, pickItemFromArray(originalItemArray, originalItemIndex));
        
        for (var i=0; i<array.length; i++){
            array[i].id = i;
            array[i].listID = listID;
            array[i].listName = $arrBoards[boardID].lists[listID].title;
            parentWrapper.childNodes[i].setAttribute('id', 'B' + boardID + '_L' + listID + '_I' + i);
        }
        
        for (var i=0; i<originalItemArray.length; i++){
            originalItemArray[i].id = i;
            var list = originalItemArray[i].listID;
            var wrapper = document.getElementById('board-' + boardID + '-list-' + list + '');
            wrapper.childNodes[i].setAttribute('id', 'B' + boardID + '_L' + list + '_I' + i);
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
    
    
    function hide(element){
        element.style.display = 'none';
    }
    
    function show(element){
        element.style.display = 'inline-block';
    }
    
    function goHomePage(){
        saveBoards();
        hideAllLists();
        show($newBoardBtn);
        showAllBoards();
        resetFloat();
    }
    
    function hideAllLists(){
        var allLists = document.querySelectorAll('.lists'); 
        allLists.forEach(function(element) {
          element.style.display = 'none';
        });
    }
    
    function showAllBoards(){
        $arrBoards.forEach(function(element, index) {
          show(document.querySelector('[data-js="' + index + '"]'));
        });
    }
    
    function resetFloat(){
        var allBoards = document.querySelectorAll('.board');
        allBoards.forEach(function(element) {
            element.style.float = 'none';    
        });
    }
    
    function saveBoards(){
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/boards');
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.send(JSON.stringify($arrBoards));
    }
    
    function loadBoards(){
        var boardsOnServer = [];
        var get = new XMLHttpRequest();
        get.open('GET', 'http://localhost:3000/boards');
        get.send();
        get.onreadystatechange = function(){
            if (get.readyState === 4) {
                boardsOnServer = JSON.parse(get.responseText);
                boardsOnServer.forEach(function(element) {
                    $arrBoards.push(element);
                    buildBoard(element);
                    buildHiddenHTML(element);
                });
            }
        };
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
    
    loadBoards();
            
})();