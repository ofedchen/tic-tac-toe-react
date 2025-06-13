import React, { useState } from "react";

function UserForm({ onSubmit }) {
  const [name, setName] = useState(""); // to useContext??
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(name);
      }}
    >
      <input
        type="text"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
        placeholder="Ditt namn"
      />
      <button>Skriv in ditt namn</button>
    </form>
  );
}

export default UserForm;
