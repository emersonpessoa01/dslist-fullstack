package com.devsuperior.dslist.services;

import com.devsuperior.dslist.dto.GameDTO;
import com.devsuperior.dslist.dto.GameMinDTO;
import com.devsuperior.dslist.entities.Game;
import com.devsuperior.dslist.projections.GameMinProjection;
import com.devsuperior.dslist.repositories.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GameService {
    @Autowired
    private GameRepository gameRepository;

    @Transactional(readOnly = true)
    public List<GameMinDTO> findAll(){
        List<Game> result = gameRepository.findAll();
//        List<GameMinDTO> dto = result.stream().map(x ->new GameMinDTO(x)).toList();
//          return dto;
        return result.stream().map(x ->new GameMinDTO(x)).toList();
    }

   @Transactional(readOnly = true)
    public GameDTO findById(Long id){
        Game result = gameRepository.findById(id).get();//Para pegarGame dento do Optional
        // Converter o Objto Game para GameDTO
        //GameDTO dto = new GameDTO(result);
        return new GameDTO(result);
        //Garantindo os principios das transaçõs:acid
        //Atomica, consitente,isolada e  duravel


    }
    @Transactional(readOnly = true)
    public List<GameMinDTO> findByList(Long listId){
        List<GameMinProjection> result = gameRepository.searchByList(listId);
        //Converter projection em dto
        return result.stream().map(x ->new GameMinDTO(x)).toList();
    }
}
