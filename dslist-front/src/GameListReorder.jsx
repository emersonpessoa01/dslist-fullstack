import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

/**
 * GameListReorder - Componente para reordenar jogos da lista (compatível com GameListController)
 * @param {number} listId - ID da lista de jogos
 * @param {string} apiBase - URL base da API backend
 */
export default function GameListReorder({ listId = 1, apiBase = "http://localhost:8081" }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGames();
  }, [listId]);

  async function fetchGames() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/lists/${listId}/games`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      setGames(data);
    } catch (err) {
      setError("Erro ao buscar jogos: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  async function onDragEnd(result) {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const reordered = reorder(games, sourceIndex, destinationIndex);
    setGames(reordered);

    try {
      await fetch(`${apiBase}/lists/${listId}/replacement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceIndex, destinationIndex }),
      });
    } catch (err) {
      console.error("Erro ao enviar reposicionamento:", err);
      setError("Erro ao atualizar posição no servidor");
      fetchGames();
    }
  }

  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#1e1e1e" }}>
      <div
        style={{
          background: "#2b2b2b",
          color: "#fff",
          borderRadius: 10,
          padding: "16px 32px",
          textAlign: "center",
          maxWidth: 600,
          margin: "auto",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Lista de Jogos #{listId}</h2>

        {loading && <p>Carregando jogos...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  background: "#f8f9fa",
                  padding: "16px",
                  borderRadius: "8px",
                }}
              >
                {games.map((game, index) => (
                  <Draggable key={game.id} draggableId={String(game.id)} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          marginBottom: 8,
                          padding: 12,
                          background: snapshot.isDragging ? "#d1ecf1" : "#ffffff",
                          border: "1px solid #dee2e6",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          transition: "background 0.2s ease",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <img
                          src={game.imgUrl}
                          alt={game.title}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 4,
                            marginRight: 12,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <strong>{game.title}</strong>
                        </div>
                        <div style={{ color: "#aaa", fontSize: 12 }}>#{index + 1}</div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
