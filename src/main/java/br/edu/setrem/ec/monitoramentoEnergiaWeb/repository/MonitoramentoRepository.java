package br.edu.setrem.ec.monitoramentoEnergiaWeb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.setrem.ec.monitoramentoEnergiaWeb.entity.Monitoramento;

@Repository
public interface MonitoramentoRepository extends JpaRepository<Monitoramento, Integer> {
    
}
