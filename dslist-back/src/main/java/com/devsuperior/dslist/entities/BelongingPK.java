package com.devsuperior.dslist.entities;

import java.util.Objects;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

//Anotação @Embeddable - Representa o encapsulando de dois campos de uma classe na tabela relacional
//BelongingPK - Classe auxiliar para representar a chave primaria composta
@Embeddable
public class BelongingPK {

	@ManyToOne
    @JoinColumn(name = "game_id") //Nome da chave estrangeira
    private Game game;

    @ManyToOne
    @JoinColumn(name = "list_id") //Nome da chave estrangeira
    private GameList list;

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public GameList getList() {
		return list;
	}

	public void setList(GameList list) {
		this.list = list;
	}

	@Override
	public int hashCode() {
		return Objects.hash(game, list);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		BelongingPK other = (BelongingPK) obj;
		return Objects.equals(game, other.game) && Objects.equals(list, other.list);
	}
}