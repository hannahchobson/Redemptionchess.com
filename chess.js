var board1 = Chessboard('board1', 'start')
var board2 = Chessboard('board2', {
  draggable: true,
  dropOffBoard: 'trash',
  sparePieces: true
})

$('#startBtn').on('click', board2.start)
$('#clearBtn').on('click', board2.clear)


//create the modal over screen for player 1
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementByClassName("close")[0];
btn.onclick = function(){
  modal.style.display = "block";
}
span.onclick = function(){
  modal.style.display = "none";
}
window.onclick = function(event){
  if(event.target == modal){
    modal.style.display = "none";
  }
}