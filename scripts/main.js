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
    
    function setNewListInput(board){
        var el = document.querySelector('[data-js="list-title"]');
        el.addEventListener('keyup', keyUpNewListHanlder(event, board), false);
    }
    
    function setNewItemInput(board, list){
        var el = document.querySelector('#board-'+board+'-list-'+list+'');
        var listFirstSibiling = el.parentElement.childNodes[1];
        listFirstSibiling.addEventListener('keyup', keyUpNewItemHanlder(event, el, board, list), false);
    }
            
    function List(name, board){
        this.items = [];
        this.title = '' + name + '';
        this.boardId = board.id;
        this.boardName = board.title;
        this.id = board.lists.length;
    }
    
    function buildNewList(board, name, boardHeader){
                
        var list = $arrBoards[board].lists.length; 
        var li = document.createElement("li");
        var div = document.createElement("div");
        var p = document.createElement("p");
        var input = document.createElement("input");
        var ul = document.createElement("ul");
        
        input.setAttribute('type', 'text');
        input.setAttribute('maxlength', '17');
        input.setAttribute('ondrop', 'return false');
        input.setAttribute('ondragover', 'return false');
        input.setAttribute('data-js', 'inputItemName board' + board + '-list' + list);
        
        ul.setAttribute('class', 'items');
        ul.setAttribute('id', 'board-' + board + '-list-' + list);
        
        ul.addEventListener('drop', dropHanlder(event, ul), false);
        ul.addEventListener('dragover', allowDropHanlder(event), false);
        
        p.innerText = name;
        li.appendChild(div);
        div.appendChild(p);
        li.appendChild(input);
        li.appendChild(ul);
        boardHeader.parentElement.appendChild(li);
        
        setNewItemInput(board, list);
        createListObj((board), name);
    }
    
    function dropHanlder(e, el){
        return function (e){
          e.preventDefault();
          var data = e.dataTransfer.getData("text");
          el.appendChild(document.getElementById(data));
        }
    }

    function allowDropHanlder(e){
        return function (e){
          e.preventDefault();
        }
    }
    
    function dragHanlder(e){
        return function (e){
            e.dataTransfer.setData("text", e.target.id);
        }
    }
    
    function keyUpNewItemHanlder(e, el, board, list){
        return function (e){
            e.preventDefault();
            if(e.keyCode === 13){
                buildNewItem(el, board, list, this.value);
                this.value = "";
            }
        }
    }
    
    function keyUpNewListHanlder(e, board){
        return function (e){
            e.preventDefault();
            if(e.keyCode === 13){
                buildNewList(board, this.value, this.parentElement);
                this.value = ""; 
            }
        }
    }
    
    function createListObj(boardIndex, listTitle){
        var board = $arrBoards[boardIndex];
        var newList = new List(listTitle, board);
        board.lists.push(newList);
    }
    
    function buildNewItem(listElement, board, list, name){
                        
        var item = $arrBoards[board].lists[list].items.length;
        var li = document.createElement('li');        
        var div = document.createElement('div');        
        var p = document.createElement('p');  
        var i = document.createElement('i');   
        
        li.setAttribute('id', 'B'+ board + '_L' + list + '_I' + item);
        li.setAttribute('draggable', 'true');
        li.setAttribute('ondrop', 'return false');
        li.setAttribute('ondragover', 'return false');
        
        li.addEventListener('dragstart', dragHanlder(event), false);
        
        i.setAttribute('class', 'material-icons');
        i.innerText = 'add_circle_outline';
        
        p.innerText = name;
        div.appendChild(p);
        div.appendChild(i);
        li.appendChild(div);
        listElement.appendChild(li);
        
        createItemObj(name, board, list);
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
    
})();