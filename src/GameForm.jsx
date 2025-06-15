import React, { useEffect, useState } from "react";

function GameForm({ title, onSubmit }) {
  const [gameName, setGameName] = useState(title);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    setGameName(title);
  }, [title]); // to change title in the input field for the second player

  return (
    showForm && (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(gameName);
          setShowForm(false);
        }}
      >
        <input
          type="text"
          value={gameName}
          required
          onClick={() => setGameName("")}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Namnge ditt spel"
        />
        <button>Gå med</button>
      </form>
    )
  );
}

export default GameForm;
