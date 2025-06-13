import { useState, useEffect } from "react";
import socket from "./socket.js";
import { Link } from "react-router-dom";

import "./App.css";
import Board from "./Board.jsx";
import Chat from "./Chat.jsx";
import GameForm from "./GameForm.jsx";
import UserForm from "./UserForm.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [board, setBoard] = useState(Array(9).fill(""));
  const [messages, setMessages] = useState([]);
  const [gameTitle, setGameTitle] = useState("Tic Tac Toe");
  const [status, setStatus] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [gameResult, setGameResult] = useState(null);

  useEffect(() => {
    socket.on("newPlayer", function (player) {
      setPlayers((players) => {
        const gameSymbol = players.length > 0 ? "O" : "X";
        return [...players, { name: player, symbol: gameSymbol }];
      });
    });

    socket.on("newGameCreated", (gameName) => {
      setGameTitle(gameName);
    });

    socket.on("newChatMessage", function ({ user, message, messages }) {
      setMessages([...messages, { user, message }]);
    });

    socket.on("newMove", ({ index, symbol, players, board }) => {
      applyMove(index, symbol, players, board);
    });

    socket.on("resetBoard", () => {
      setWinningCells([]);
      setBoard(Array(9).fill(""));
      setStatus(true);
      setGameResult(null);
    });

    // Clean up on unmount
    return () => {
      socket.off("newPlayer");
      socket.off("newGameCreated");
      socket.off("newChatMessage");
      socket.off("newMove");
      socket.off("resetBoard");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPlayer(players[0]);

    if (players.length === 2) {
      setStatus(true);
    }
  }, [players]);

  function handleUserSubmit(name) {
    setUser(name);
    socket.emit("player", name);
  }

  function handleGameSubmit(title) {
    const gameName = title;
    setGameTitle(gameName);
    socket.emit("gameCreated", gameName);
  }

  function handleCellClick(cellId) {
    if (!status) return; //if game ended
    if (user !== currentPlayer.name) return; //if not your turn
    if (board[cellId]) return; // if the cell has been clicked

    socket.emit("move", {
      index: cellId,
      symbol: currentPlayer.symbol,
      players,
      board,
    });
  }

  function handleSendMessage(msg) {
    socket.emit("chatMessage", { user, message: msg, messages });
  }

  function handleReset() {
    socket.emit("boardReset");
  }

  function applyMove(index, symbol, players, board) {
    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);

    const winPattern = checkWin(newBoard);
    if (winPattern) {
      setWinningCells(winPattern);
      setGameResult(`${symbol} vinner!`);
    } else if (!newBoard.includes("")) {
      setGameResult("Spelet är oavgjort!");
    } else {
      setCurrentPlayer(symbol === "X" ? players[1] : players[0]);
    }
  }

  function checkWin(boardToCheck) {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return pattern;
      }
    }
    return null;
  }

  return (
    <>
      <h1>Spela och chatta</h1>
      <main>
        <section>
          {!user ? (
            <UserForm onSubmit={handleUserSubmit} />
          ) : (
            <h2>Välkommen, {user}!</h2>
          )}
          {user && <GameForm title={gameTitle} onSubmit={handleGameSubmit} />}
        </section>
        <section id="players">
          <h2>Spelare</h2>
          {players.length < 1 ? (
            <p>Inga spelare än</p>
          ) : (
            <>
              <ul>
                {players.map((p) => (
                  <li key={p.name.concat(p.symbol)}>
                    Spelare {p.symbol}: {p.name}
                  </li>
                ))}
              </ul>
              {currentPlayer && <p>Nuvarande spelare: {currentPlayer.name}</p>}
            </>
          )}
        </section>
        <section id="game">
          <h2>{gameTitle}</h2>
          {status && currentPlayer ? (
            <>
              <Board
                board={board}
                onCellClick={handleCellClick}
                winningCells={winningCells}
              />
              {gameResult ? (
                gameResult && <h3 className="gameResult">{gameResult}</h3>
              ) : (
                <p className="gameMessage">
                  Nu är det {currentPlayer.name}s tur
                </p>
              )}
              <button onClick={handleReset}>Starta om</button>
            </>
          ) : (
            <p className="gameMessage">
              Vänta på att en {players.length === 1 && <span>till</span>}{" "}
              spelare ska gå med
            </p>
          )}
        </section>
        {user && (
          <section>
            <Chat
              messages={
                messages.length <= 10
                  ? messages
                  : messages.slice(messages.length - 10)
              }
              onSend={handleSendMessage}
            />
            <Link to={`/messages/${user}`}>Visa mina meddelanden</Link>
          </section>
        )}
      </main>
    </>
  );
}
