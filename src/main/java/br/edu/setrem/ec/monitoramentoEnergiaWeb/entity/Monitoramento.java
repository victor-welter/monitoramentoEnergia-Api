package br.edu.setrem.ec.monitoramentoEnergiaWeb.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Monitoramento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer codigoOrigem;
    private String data;
    private String horario;
    private double voltagem;
    private double amperagem;
    private double resistencia;
    private double custo;

    public Integer getCodigoOrigem() {
        return codigoOrigem;
    }

    public void setCodigoOrigem(Integer codigoOrigem) {
        this.codigoOrigem = codigoOrigem;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public double getVoltagem() {
        return voltagem;
    }

    public void setVoltagem(double voltagem) {
        this.voltagem = voltagem;
    }

    public double getAmperagem() {
        return amperagem;
    }

    public void setAmperagem(double amperagem) {
        this.amperagem = amperagem;
    }

    public double getResistencia() {
        return resistencia;
    }

    public void setResistencia(double resistencia) {
        this.resistencia = resistencia;
    }

    public double getCusto() {
        return custo;
    }

    public void setCusto(double custo) {
        this.custo = custo;
    }
}
