package br.edu.setrem.ec.monitoramentoEnergiaWeb.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.setrem.ec.monitoramentoEnergiaWeb.entity.Monitoramento;
import br.edu.setrem.ec.monitoramentoEnergiaWeb.repository.MonitoramentoRepository;

@RestController
@RequestMapping
public class MonitoramentoController {
    @Autowired
    private MonitoramentoRepository repository;

    @GetMapping("/buscaMonitoramento")
    public ResponseEntity<List<Monitoramento>> listar() {
        List<Monitoramento> list = repository.findAll();

        if (!list.isEmpty()) {
            return ResponseEntity.ok(list);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/salvaMonitoramento")
    public void save(@RequestParam Integer codigo, @RequestParam double voltagem, @RequestParam double amperagem,
            @RequestParam double resistencia) {
        Monitoramento m = new Monitoramento();

        double tarifa = 0.630;

        double custo = (((((voltagem * amperagem) / 1000) * 60) * tarifa) / 4);

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter houorFormat = DateTimeFormatter.ofPattern("HH:mm:ss");

        m.setCusto(custo);
        m.setCodigoOrigem(codigo);
        m.setVoltagem(voltagem);
        m.setAmperagem(amperagem);
        m.setResistencia(resistencia);
        m.setData(dateFormat.format(now));
        m.setHorario(houorFormat.format(now));

        repository.save(m);
    }
}
