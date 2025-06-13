function Board({ board, onCellClick, winningCells = [] }) {
  return (
    <div className="board">
      {board.map((cell, i) => (
        <button
          key={i}
          className="cell"
          style={{
            backgroundColor: winningCells.includes(i) ? "#a0e7a0" : "",
          }}
          onClick={() => {console.log('test'); onCellClick(i)}}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}

export default Board;
