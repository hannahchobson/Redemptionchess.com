let curBoard;
let curPlayer;

let curHeldPiece;
let curHeldPieceStartingPosition;

// [0] = x coord, [1] = y coord
function startGame() {
    const starterPosition = [['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']];

    const starterPlayer = 'white';

    loadPosition(starterPosition, starterPlayer);
}
/*
* Load the current position and the new position for the piece
*/
function loadPosition(position, playerToMove) {
    curBoard = position;
    curPlayer = playerToMove;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (position[i][j] != '.') {
                loadPiece(position[i][j], [i + 1, j + 1]);
            }
        }
    }
}

//changes piece ID, doesn't place it
function loadPiece(piece, position) {
    const squareElement = document.getElementById(`${position[0]}${position[1]}`);

    const pieceElement = document.createElement('img');
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = false;
    pieceElement.src = getPieceImageSource(piece);

    squareElement.appendChild(pieceElement);
}

// gets the image for each piece
function getPieceImageSource(piece) {
    switch (piece) {
        case 'R': return 'black_rook.png';
        case 'N': return 'black_knight.png';
        case 'B': return 'black_bishop.png';
        case 'Q': return 'black_queen.png';
        case 'K': return 'black_king.png';
        case 'P': return 'black_pawn.png';
        case 'r': return 'white_rook.png';
        case 'n': return 'white_knight.png';
        case 'b': return 'white_bishop.png';
        case 'q': return 'white_queen.png';
        case 'k': return 'white_king.png';
        case 'p': return 'white_pawn.png';
    }
}

/*
* Event Listeners to move the piece 
*/
function setPieceHoldEvents() {
    let mouseX, mouseY = 0;

    document.addEventListener('mousemove', function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    let pieces = document.getElementsByClassName('piece');
    let movePieceInterval;
    let hasIntervalStarted = false;

    for (const piece of pieces) {
        piece.addEventListener('mousedown', function(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
        
            if (hasIntervalStarted === false) {
                piece.style.position = 'absolute';

                curHeldPiece = piece;
                const curHeldPieceStringPosition = piece.parentElement.id.split('');

                curHeldPieceStartingPosition = [parseInt(curHeldPieceStringPosition[0]) - 1, parseInt(curHeldPieceStringPosition[1]) - 1];

                movePieceInterval = setInterval(function() {
                    piece.style.top = mouseY - piece.offsetHeight / 2 + window.scrollY + 'px';
                    piece.style.left = mouseX - piece.offsetWidth / 2 + window.scrollX + 'px';
                }, 1);
        
                hasIntervalStarted = true;
            }
        });
    }
        
    document.addEventListener('mouseup', function(event) {
        window.clearInterval(movePieceInterval);

        if (curHeldPiece != null) {
            const boardElement = document.querySelector('.board');
            // mouse or scrolling
            if ((event.clientX > boardElement.offsetLeft - window.scrollX && event.clientX < boardElement.offsetLeft + boardElement.offsetWidth - window.scrollX) &&
                (event.clientY > boardElement.offsetTop - window.scrollY && event.clientY < boardElement.offsetTop + boardElement.offsetHeight - window.scrollY)) {
                    const mousePositionOnBoardX = event.clientX - boardElement.offsetLeft + window.scrollX;
                    const mousePositionOnBoardY = event.clientY - boardElement.offsetTop + window.scrollY;

                    const boardBorderSize = parseInt(getComputedStyle(document.querySelector('.board'), null)
                                                .getPropertyValue('border-left-width')
                                                .split('px')[0]);

                    const xPosition = Math.floor((mousePositionOnBoardX - boardBorderSize) / document.getElementsByClassName('square')[0].offsetWidth);
                    const yPosition = Math.floor((mousePositionOnBoardY - boardBorderSize) / document.getElementsByClassName('square')[0].offsetHeight);

                    const pieceReleasePosition = [yPosition, xPosition];

                    if (!(pieceReleasePosition[0] == curHeldPieceStartingPosition[0] && pieceReleasePosition[1] == curHeldPieceStartingPosition[1])) {
                        if (validateMovement(curHeldPieceStartingPosition, pieceReleasePosition)) {
                            movePiece(curHeldPiece, curHeldPieceStartingPosition, pieceReleasePosition);
                        }
                    }
                }

            curHeldPiece.style.position = 'static';
            curHeldPiece = null;
            curHeldPieceStartingPosition = null;
        }
    
        hasIntervalStarted = false;
    });
}

//checks movement
function movePiece(piece, startingPosition, endingPosition) {
    // move validations to validateMovement()
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]];
    
    if (boardPiece != '.') {
        if ((boardPiece === boardPiece.toUpperCase() && curPlayer == 'black') ||
            (boardPiece === boardPiece.toLowerCase() && curPlayer == 'white')) {
                curBoard[startingPosition[0]][startingPosition[1]] = '.';
                curBoard[endingPosition[0]][endingPosition[1]] = boardPiece;

                const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}`);
                destinationSquare.textContent = '';
                destinationSquare.appendChild(piece);

                // check if is check/checkmate

                if (curPlayer == 'white') {
                    curPlayer = 'black';
                } else {
                    curPlayer = 'white';
                }
        }
    }
}
/*
* Logic to see if the move is valid for each piece 
*/
function validateMovement(startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]];
    
    switch (boardPiece) {
        case 'r':
        case 'R': return validateRookMovement(startingPosition, endingPosition);
        case 'n':
        case 'N': return validateKnightMovement(startingPosition, endingPosition);
        case 'b':
        case 'B': return validateBishopMovement(startingPosition, endingPosition);
        case 'q':
        case 'Q': return validateQueenMovement(startingPosition, endingPosition);
        case 'k': 
        case 'K': return validateKingMovement(startingPosition, endingPosition);
        case 'p': return validatePawnMovement('white', startingPosition, endingPosition);
        case 'P': return validatePawnMovement('black', startingPosition, endingPosition);
    }
}

// logic to see if the move is valid for Bishop
function validateBishopMovement(startingPosition, endingPosition) {
    if (endingPosition[0] - endingPosition[1] == startingPosition[0] - startingPosition[1] ||
        endingPosition[0] + endingPosition[1] == startingPosition[0] + startingPosition[1]) {
            if (!validatePathIsBlocked(startingPosition, endingPosition)) {
                return false;
            }
            // validate if move puts own king in check (write code here)
            return true;
    } else {
        return false;
    }
}

function validateRookMovement(startingPosition, endingPosition) {
    if (endingPosition[0] == startingPosition[0] || endingPosition[1] == startingPosition[1]) {
        if (!validatePathIsBlocked(startingPosition, endingPosition)) {
            return false;
        }
        // validate if move puts own king in check (write code here)
        return true;
    } else {
        return false;
    }
}

function validateKingMovement(startingPosition, endingPosition) {
    if ([-1, 0, 1].includes(endingPosition[0] - startingPosition[0]) && [-1, 0, 1].includes(endingPosition[1] - startingPosition[1])) {
        if (isFriendlyPieceOnEndingPosition(endingPosition)) {
            return false;
        }
        // validate if move puts own king in check (write code here)
        // validate castling

        return true;
    } else {
        return false;
    }
}

function validateQueenMovement(startingPosition, endingPosition) {
    if (endingPosition[0] - endingPosition[1] == startingPosition[0] - startingPosition[1] ||
        endingPosition[0] + endingPosition[1] == startingPosition[0] + startingPosition[1] ||
        endingPosition[0] == startingPosition[0] || endingPosition[1] == startingPosition[1]) {
            if (!validatePathIsBlocked(startingPosition, endingPosition)) {
                return false;
            }
            // validate if move puts own king in check (write code here)
            return true;
    } else {
        return false;
    }
}

// 0 to 7 for up and down (0 is top, 7 is bottom)

function validatePawnMovement(pawnColor, startingPosition, endingPosition) {
    direction = pawnColor == 'black' ? 1 : -1; //negative == black, white == positive

    let isCapture = false;

    //capture piece
    if (endingPosition[0] == startingPosition[0] + direction &&
        [startingPosition[1] - 1, startingPosition[1] + 1].includes(endingPosition[1])) {
            // is enemy piece diagonal to player
            if (isEnemyPieceOnEndingPosition(endingPosition)) {
                isCapture = true;
            }
        }

     //en passant code
    //checks if piece is parallel to player (moves that way?)
    if(endingPosition[0] == startingPosition[0] &&
        [startingPosition[1] - 1, startingPosition[1] + 1].includes(endingPosition[1])){
            // takes pawn if parallel
            if(isEnemyPieceOnEndingPosition(endingPosition) && (endingPosition[0] == 3 && pawnColor == 'white' ) || (endingPosition[0] == 4 && pawnColor == 'black')){
                isCapture = true;
                // move diagonal (move up 1 and left/right 1) (problem: takes any piece that's parallel, not just pawn)
                
            }
        }

    // 0 == black end, 7 == white end
    // validate if is promotion (current code freezes piece, sends it back to previous space)
    // if(pawnColor == 'white' && endingPosition[0] == 0){
    //     loadPiece('q', endingPosition);
    //     loadPosition(endingPosition, curPlayer);
    // }

    let isFirstMove = false;

    // is pawn in initial starting spot
    if ((pawnColor == 'white' && startingPosition[0] == 6) || (pawnColor == 'black' && startingPosition[0] == 1)) {
        isFirstMove = true;
    }

    //[0] == x coord, [1] == y cord
    // movement
    if (((endingPosition[0] == startingPosition[0] + direction || (endingPosition[0] == startingPosition[0] + direction * 2 && isFirstMove)) &&
         endingPosition[1] == startingPosition[1]) || isCapture) {
             //if friendly is on space ahead
            if (isFriendlyPieceOnEndingPosition(endingPosition)) {
                return false;
                //if enemy is blocking space ahead
            } else if (!isCapture && isEnemyPieceOnEndingPosition(endingPosition)) {
                return false;
            } 
            // promotion
            else if (endingPosition == 0 &&  pawnColor == 'white') {
                loadPiece('q', endingPosition);
                loadPosition(endingPosition, 'white');
            }

            // validate if move puts own king in check (write code here)
            return true;
    } else {
        return false;
    }
}

function validateKnightMovement(startingPosition, endingPosition) {
    // moves up 2, one left/right (knight movement)
    if (([-2, 2].includes(endingPosition[0] - startingPosition[0]) && [-1, 1].includes(endingPosition[1] - startingPosition[1])) || 
        ([-2, 2].includes(endingPosition[1] - startingPosition[1]) && [-1, 1].includes(endingPosition[0] - startingPosition[0]))) {
            if (isFriendlyPieceOnEndingPosition(endingPosition)) {
                return false;
            }
            // validate if move puts own king in check (write code here)
            return true;
    } else {
        return false;
    }
}

function validatePathIsBlocked(startingPosition, endingPosition) {
    const xDifference = endingPosition[0] - startingPosition[0]
    const yDifference = endingPosition[1] - startingPosition[1]

    let xDirection = 0;
    let yDirection = 0;

    if (xDifference < 0) {
        xDirection = -1;
    } else if (xDifference > 0) {
        xDirection = 1;
    }

    if (yDifference < 0) {
        yDirection = -1;
    } else if (yDifference > 0) {
        yDirection = 1;
    }

    let squareX = startingPosition[0] + xDirection;
    let squareY = startingPosition[1] + yDirection;

    while (squareX != endingPosition[0] || squareY != endingPosition[1]) {
        const isSquareOccupied = document.getElementById(`${squareX + 1}${squareY + 1}`).children.length > 0;

        if (isSquareOccupied) {
            return false;
        }

        squareX += xDirection;
        squareY += yDirection;
    }
    
    if (isFriendlyPieceOnEndingPosition(endingPosition)) {
        return false;
    } else {
        // enemy piece has been captured
    }

    return true;
}

// is ally on square for heldPiece
function isFriendlyPieceOnEndingPosition(endingPosition) {
    const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}`);

    if (destinationSquare.children.length > 0) {
        const destinationPiece = destinationSquare.querySelector('.piece').id;
    
        if (destinationPiece == destinationPiece.toUpperCase() && curPlayer == 'black' ||
            destinationPiece == destinationPiece.toLowerCase() && curPlayer == 'white') {
                return true;
        } else {
            return false;
        }        
    } else {
        return false;
    }
}

// is opponent on square for heldPiece
function isEnemyPieceOnEndingPosition(endingPosition) {
    const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}`);

    if (destinationSquare.children.length > 0) {
        // determines what the piece is
        const destinationPiece = destinationSquare.querySelector('.piece').id;

        // checks if piece is white or black (if black pawn is taken by white pawn, white pawn will show on board)
        if (destinationPiece == destinationPiece.toUpperCase() && curPlayer == 'white' || destinationPiece == destinationPiece.toLowerCase() && curPlayer == 'black') {
            // put score values for blackScore / whiteScore here
            switch(destinationPiece){
                // add score for white
                case 'P': $(score1).html(whiteScore += 10);
                case 'R': $(score1).html(whiteScore += 20);
                case 'N': $(score1).html(whiteScore += 30);
                case 'B': $(score1).html(whiteScore += 20);
                case 'Q': $(score1).html(whiteScore += 50);

                // add score for black
                case 'p': $(score2).html(blackScore += 10);
                case 'r': $(score2).html(blackScore += 20);
                case 'n': $(score2).html(blackScore += 30);
                case 'b': $(score2).html(blackScore += 20);
                case 'q': $(score2).html(blackScore += 50);
            }
                return true;
        } else {
            return false;
        }        
    } else {
        return false;
    }
}

// white pawn starting position starts at 6, black starts at 1


// Redemption Mode code

// add on point system
var blackScore = 0;
var whiteScore = 0;


//functions to update score (put in isEnemyPieceOnEndingPosition function)

// function pieceTaken(){
//     // if(whiteArmy.pawn.checkMove === null){
//     //     blackScore += 10;
//     // }
//     // if no pawn moves, then piece is taken
//     if(destinationPiece.toLowerCase() == 'p' && curPlayer == 'black'){
//         blackScore += 10;
//     }
//     if(destinationPiece.toUpperCase() == 'P' && curPlayer == 'white'){
//         whiteScore += 10;
//     }
//     // if no queen moves, then piece is taken
//     if(destinationPiece.toLowerCase() == 'q' && curPlayer == 'black'){
//         blackScore += 50;
//     }
//     if(destinationPiece.toUpperCase() == 'Q' && curPlayer == 'white'){
//         whiteScore += 50;
//     }
//     // if no bishop moves, then piece is taken
//     if(destinationPiece.toLowerCase() == 'b' && curPlayer == 'black'){
//         blackScore += 20;
//     }
//     if(destinationPiece.toUpperCase() == 'B' && curPlayer == 'white'){
//         whiteScore += 20;
//     }
//     // if no knight moves, then piece is taken
//     if(destinationPiece.toLowerCase == 'n' && curPlayer == 'black'){
//         blackScore += 30;
//     }
//     if(destinationPiece.toUpperCase == 'N' && curPlayer == 'white'){
//         whiteScore += 30;
//     }
//     // if no rook moves, then piece is taken
//     if(destinationPiece.toLowerCase == 'r' && curPlayer == 'black'){
//         blackScore += 20;
//     }
//     if(destinationPiece.toUpperCase == 'R' && curPlayer == 'white'){
//         whiteScore += 20;
//     }
// }

//make sure points are added to scoreboard (bank)
//print it out for now
console.log(whiteScore);
console.log(blackScore);

//make sure points in bank can be used in the market


//function for putting pieces back on board
function putPawnBack(){
    // for white player
    if(whiteScore >= 20){
        whiteScore -= 20;
        // load pawn back in board
        // loads pawn piece back in the constant "starter position area" ?
        loadPiece('p', starterPosition);
        loadPosition(startingPosition, curPlayer);
    }

    if(blackScore >= 20){
        blackScore -= 20;
        // load pawn back in board
        // loads pawn piece back in the constant "starter position area" ?
        loadPiece('P', starterPosition);
        loadPosition(startingPosition, curPlayer);
    }
}

function putQueenBack(){
    if(queen.pieceTaken()){

    }
    // check if score is enough for queen
    if(whiteScore >= 75){
        whiteScore -= 75;
        /* load queen back in board at position 0, 0 
            (lets just say it'll start at beginning position)
            use loadPiece function?
         */
        loadPiece('q', starterPosition);
        loadPosition(starterPosition, curPlayer);
    }
    if(blackScore >= 75){
        blackScore -= 75;
        // load queen back in board
        loadPiece('Q', starterPosition);
        loadPosition(startingPosition, curPlayer);
    }
}

function putBishopBack(){
    if(whiteScore >= 40){
        whiteScore -= 40;
        // load Bishop back in board
        loadPiece('b', starterPosition);
        loadPosition(startingPosition, curPlayer);
    }

    if(blackScore >= 40){
        blackScore -= 40;
        // load Bishop back in board
        loadPiece('B', starterPosition);
        loadPosition(startingPosition, curPlayer);
    }
}

function putKnightBack(){
    if(whiteScore >= 50){
        whiteScore -= 50;
        // load Knight back in board
        loadPiece('n', starterPosition);
        loadPosition(startingPosition, curPlayer);
    }

    if(blackScore >= 50){
        blackScore -= 50;
        // load Knight back in board
        loadPiece('N', starterPosition);
        loadPosition(startingPosition, curPlayer);
    }
}

function putRookBack(){
    if(whiteScore >= 40){
        whiteScore -= 40;
        // load Rook back in board
        loadPiece('r', starterPosition);
        loadPosition(startingPosition, curPlayer);
    }
}

startGame();
setPieceHoldEvents();