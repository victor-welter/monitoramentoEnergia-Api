package br.edu.setrem.ec.monitoramentoEnergiaWeb.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.setrem.ec.monitoramentoEnergiaWeb.entity.Usuario;
import br.edu.setrem.ec.monitoramentoEnergiaWeb.repository.UsuarioRepository;

@RestController
@RequestMapping
public class UsuarioController {
    @Autowired
    private UsuarioRepository repository;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestParam String usuario, @RequestParam String senha) {
        Map<String, Object> map = new HashMap<String, Object>();

        List<Usuario> usuarios = repository.findAll();

        boolean status = false;

        for (int i = 0; i < usuarios.size(); i++) {
            Usuario user = usuarios.get(i);

            if ((user.getUsuario().toUpperCase().equals(usuario.toUpperCase())) && (user.getSenha().equals(senha))) {
                status = true;

                map.put("usuario", user.getUsuario());
                map.put("status", status);
                map.put("message", "Sucesso");

                break;
            }
        }

        if (status) {
            return ResponseEntity.status(HttpStatus.OK).body(map);
        } else {
            map.put("usuario", "");
            map.put("status", status);
            map.put("message", "Erro ao efetuar login");

            return ResponseEntity.status(HttpStatus.OK).body(map);
        }
    }
}
