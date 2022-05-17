let isPlayerTurn = true;
let isWinner = false;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//This Module will contain functions for controlling the board
const BoardModule = (()=>{
    //Initializing the board obj to return to expose the board controlloer functions
    BoardController = {};
    //Creating an array of all of the tile divs
    const tiles = document.querySelectorAll(".tile");
    const redo = document.querySelector(".redo");
    //The dsBoard will hold the state of each tile ex empty, X, O, Highlighted
    BoardController.dsBoard = [];
    //the options will hold all of the options that the computer is allowed to select
    BoardController.options = [];
    //Creates the board data struture and adds an object in each cell (9x9)
    BoardController.createBoard = (function(){
        for(let i = 0; i < 3; i++)
        {
            BoardController.dsBoard.push([]);
            for(let j = 0; j < 3; j++)
            {
                BoardController.dsBoard[i].push({
                    div: tiles[i*3 + j],
                    val: -1,
                });
                BoardController.options.push( BoardController.dsBoard[i][j]);
                //addubg an event listener that allows the player to intereact with the tiles
                tiles[i*3 + j].addEventListener('click', function(e){
                    e.stopPropagation();
                    console.log( BoardController.dsBoard[i][j].val)
                    if(!isWinner)
                        MoveController.MakeMove( BoardController.dsBoard[i][j]);
                })
            }
        }
    })();
    //Erases and resets all of the contents of the board
    BoardController.ClearBoard = function(){
        BoardController.options = [];
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                BoardController.dsBoard[i][j].val = -1;
                BoardController.dsBoard[i][j].div.textContent = "";
                BoardController.dsBoard[i][j].div.classList.remove("winner");
                BoardController.options.push(BoardController.dsBoard[i][j]);
            }
        }
    }
    //Highlights the winner
    const Highlight = function(tiles){
        (async () =>{
            await sleep(50);
            tiles[0].div.classList.add("winner");
            await sleep(50);
            tiles[1].div.classList.add("winner");
            await sleep(50);
            tiles[2].div.classList.add("winner");
        })();
        
    }
    //Checks to see if there is a winner
    BoardController.CheckWinner = function(){
        dsBoard = BoardController.dsBoard;
        //checks columns and rows, then highlights and returns the winner value if there is a winner
        for(let i = 0; i < 3; i++)
        {
            if(dsBoard[i][0].val == dsBoard[i][1].val && dsBoard[i][1].val ==  dsBoard[i][2].val && dsBoard[i][1].val != -1)
            {
                Highlight([dsBoard[i][0], dsBoard[i][1],dsBoard[i][2] ]);
                return dsBoard[i][0].val;
            }
                
            if(dsBoard[0][i].val == dsBoard[1][i].val && dsBoard[1][i].val == dsBoard[2][i].val && dsBoard[1][i].val != -1){
                Highlight([dsBoard[0][i], dsBoard[1][i],dsBoard[2][i] ]);
                return dsBoard[0][i].val;
            }
        }
        //checking diagnols
        if(dsBoard[0][0].val == dsBoard[1][1].val && dsBoard[1][1].val == dsBoard[2][2].val && dsBoard[2][2].val != -1){
            Highlight([dsBoard[0][0], dsBoard[1][1],dsBoard[2][2] ]);
            return dsBoard[0][0].val;
        }
        if(dsBoard[0][2].val == dsBoard[1][1].val && dsBoard[1][1].val == dsBoard[2][0].val && dsBoard[2][0].val != -1){
            Highlight([dsBoard[0][2], dsBoard[1][1],dsBoard[2][0] ]);
            return dsBoard[0][2].val;
        }
        return -1;
        
    }
    //adding an event listener to the redo button
    redo.addEventListener('click', function(e){
        e.stopPropagation();
        BoardController.ClearBoard();
        isWinner = false;
        isPlayerTurn = true;
    });
    //Creating the initial board and returning the contorller
    return BoardController;
})();

//Thus module hods all of the functions for the player and computer moves
const MoveModule = (()=>{
    //creating the controller that will expose all of the modules functions
    MoveController = {};
    //function that dictates where the computer moves * consults the boardController.options array to determine where it can move
    MoveController.CompMove = function(options = BoardController.options){
    
        if(options.length === 0) return;
        const rand = Math.floor(Math.random() * options.length);
        options[rand].val = 1;
        options[rand].div.textContent = "O";
        options.splice(rand, 1);
        isPlayerTurn = true;
        let winner = BoardController.CheckWinner();
        if(winner!= -1){
            isWinner = true;
            console.log( winner === 0 ? "The player won!" : "The Computer won!")
        }
    }
    //Player controller, updates the boardControlle.options array
    MoveController.MakeMove = function(tile, options = BoardController.options){
        if(!isPlayerTurn) return;
        const div = tile.div;
        console.log(tile)
        if(tile.val == -1){
            isPlayerTurn = false;
            div.textContent = "X";
            tile.val = 0;
            options.splice(options.indexOf(tile), 1);
            let winner = BoardController.CheckWinner();
            if(winner!= -1){
                isWinner = true;
                console.log( winner === 0 ? "The player won!" : "The Computer won!")
                return;
            }
            (async () =>{
                await sleep(500);
                MoveController.CompMove();
            })();
        } 
    }
    //Exoposing the functions
    return MoveController;
})();
