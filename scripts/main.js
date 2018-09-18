(function(){
    'use strict';

    var $newBoardBtn = document.querySelector('.newBoard-btn');
    var $boardModal = document.querySelector('#board-modal');
    var $arrBoards = [];
    var $createBoardBtn = document.querySelector('#createBoard-btn');
    var $cancelBoardBtn = document.querySelector('#cancelBoardCreation-btn');
    var boardTitle = document.querySelector('input[data-js="board-title"]');
    var $homeBtn = document.querySelector('#home-btn');
    
    $homeBtn.addEventListener('click', goHomePage);            
    $newBoardBtn.addEventListener('click', showTitleBoardAsker);            
    $createBoardBtn.addEventListener('click', createNewBoard);
    $cancelBoardBtn.addEventListener('click', hideTitleBoardAsker);
    
    boardTitle.addEventListener("keyup", function(event){
        event.preventDefault();
        if(event.keyCode === 13){
            createNewBoard();
        }
    });    

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

    function Board(name){
        this.lists = [];
        this.title = '' + name + '';
        this.id = $arrBoards.length;
    }

    function buildBoard(board){
        buildBigBoardButton(board);
        buildBoardHeader(board);
    }
    
    function buildBigBoardButton(board){
        $boardModal.insertAdjacentHTML("afterend", '<li class="board" data-js="' + board.id + '"><div><h6>' + board.title + '</h6></div></li>');
        setBoardButton(board);
    }
    
    function buildBoardHeader(board){
        $boardModal.parentElement.insertAdjacentHTML("afterend", '<ul class="lists" board-js="' + board.id + '"><li class="list-namer"><i class="material-icons">add_circle_outline</i><input type="text" data-js="list-title" placeholder="Name a new list" maxlength="17"/></li></ul>');
        setNewListInput(board.id);
    }
    
    function setBoardButton(board){
        document.querySelector('[data-js="' + board.id + '"]').addEventListener('click', selectBoard);
    }

    function selectBoard(){
                
        for (var i=0; i<$arrBoards.length; i++){
            hide(document.querySelector('[data-js="' + (i) + '"]'));
        }
        
        var selected = event.target.parentElement.parentElement;
        selected.style.display = 'inline-block';
        selected.style.float = 'left';
        hide($newBoardBtn);
        openBoard(selected);
    }
    
    function openBoard(selected){
        var board = selected.getAttribute("data-js");
        document.querySelector('[board-js="' + board + '"]').style.display = 'inline-block';
    }
    
    function setNewListInput(board){
        document.querySelector('[data-js="list-title"]').addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13){
                buildNewList(board, this.value, this.parentElement);
                this.value = ""; 
            }
        });        
    }
            
    function List(name, board){
        this.items = [];
        this.title = '' + name + '';
        this.boardId = board.id;
        this.boardName = board.title;
        this.id = board.lists.length;
    }
    
    function buildNewList(board, listName, boardHeader){
                
        var list = $arrBoards[board].lists.length; 
        
        listHTMLBuilder(board, list, listName, boardHeader);
        
        createListObj((board), listName);
        
        var li = document.createElement("li");
        var div = document.createElement("div");
        var p = document.createElement("p");
        var input = document.createElement("input");
        var ul = document.createElement("ul");
        
        p.innerText = listName;
        
        input.setAttribute('type', 'text');
        input.setAttribute('data-js', 'inputItemName board');
        input.setAttribute('maxlength', '17');
        input.setAttribute('ondrop', 'return false');
        input.setAttribute('ondragover', 'return false');
        
        ul.setAttribute('class', 'items');
        ul.setAttribute('id', 'board-' + board + '-list-' + list);
        
        ul.addEventListener("drop", function drop(event) {
              event.preventDefault();
              var data = event.dataTransfer.getData("text");
              ul.appendChild(document.getElementById(data));
            }, false);
        
        ul.addEventListener("dragover", function allowDrop(event) {
                event.preventDefault();
            }, false);
        
        li.appendChild(div);
        div.appendChild(p);
        li.appendChild(input);
        li.appendChild(ul);
        
        boardHeader.parentElement.appendChild(li);
        
        setNewItemInput(board, list);
    }
    
    function listHTMLBuilder(board, list, listName, boardHeader){
        
        var node = document.createElement("LI");
        
        var titleDIV = document.createElement("DIV");
        var titleParagraph = document.createElement("P");
        var textNode = document.createTextNode(listName);
        titleParagraph.appendChild(textNode);
        titleDIV.appendChild(titleParagraph);
        node.appendChild(titleDIV);
        
        var itemsInput = document.createElement("INPUT");
        itemsInput.setAttribute("type", "text");
        itemsInput.setAttribute("maxlength", "17");
        itemsInput.setAttribute("ondrop", "return false");
        itemsInput.setAttribute("ondragover", "return false");
        itemsInput.setAttribute("data-js", "inputItemName board" + board + "-list" + list);
        node.appendChild(itemsInput);
        
        var itemsUL = document.createElement("UL");
        itemsUL.setAttribute("class", "items");
        itemsUL.setAttribute("data-js", "board-" + board + "-list-" + list);
        
        itemsUL.addEventListener("drop", function drop(ev, el) {
              ev.preventDefault();
              var data = ev.dataTransfer.getData("text");
              el.appendChild(document.getElementById(data));
            }, false);
        
        itemsUL.addEventListener("dragover", function allowDrop(ev) {
                ev.preventDefault();
            }, false);
        
        node.appendChild(itemsUL);
    }

    function createListObj(boardIndex, listTitle){
        var board = $arrBoards[boardIndex];
        var newList = new List(listTitle, board);
        board.lists.push(newList);
    }
    
    function setNewItemInput(board, list){
        var listElement = document.querySelector('#board-'+board+'-list-'+list+'');
                
        var listFirstSibiling = listElement.parentElement.childNodes[1];
                
        listFirstSibiling.addEventListener("keyup", function(event){
            event.preventDefault();
            if(event.keyCode === 13){
                                
                buildNewItem(listElement, board, list, this.value);
                this.value = "";
            }
        });
    }
    
    function buildNewItem(listElement, board, list, name){
                        
        var item = $arrBoards[board].lists[list].items.length;
        
        createItemObj(name, board, list);
        
        var li = document.createElement('li');        
        var div = document.createElement('div');        
        var p = document.createElement('p');  
        var i = document.createElement('i');   
        
        li.setAttribute('id', 'B'+ board + '_L' + list + '_I' + item);
        li.setAttribute('draggable', 'true');
        li.setAttribute('ondrop', 'return false');
        li.setAttribute('ondragover', 'return false');
        
        li.addEventListener("dragstart", function drag(ev) {
                ev.dataTransfer.setData("text", ev.target.id);
            }, false);
        
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
    
    function Item(name, list, board){
        
        this.title = '' + name + '';
        this.boardId = board.id;
        this.listID = list.id;
        this.boardName = board.title;
        this.listName = list.title;
        this.id = list.length;
    }
    
    function hide(element){
        element.style.display = 'none';
    }
    
    function show(element){
        element.style.display = 'inline-block';
    }
    
    function goHomePage(){
        hideAllLists();
        show($newBoardBtn);
        showAllBoards();
        resetFloat();
    }
    
    function hideAllLists(){
        var allLists = document.querySelectorAll('.lists');        
        
        for (var i=0; i<allLists.length; i++){
            allLists[i].style.display = 'none';    
        }
    }
    
    function showAllBoards(){
        for (var i=0; i<$arrBoards.length; i++){
            show(document.querySelector('[data-js="' + i + '"]'));
        }
    }
    
    function resetFloat(){
        var allBoards = document.querySelectorAll('.board');
        
        for (var i=0; i<allBoards.length; i++){
            allBoards[i].style.float = 'none';    
        }
    }
    
})();
    