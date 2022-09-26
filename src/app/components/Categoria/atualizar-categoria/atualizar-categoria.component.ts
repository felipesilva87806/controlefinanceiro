import { FormControl, FormGroup } from '@angular/forms';
import { CategoriasService } from './../../../services/categorias.service';
import { TiposService } from './../../../services/tipos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tipo } from './../../../models/Tipo';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/models/Categoria';

@Component({
  selector: 'app-atualizar-categoria',
  templateUrl: './atualizar-categoria.component.html',
  styleUrls: ['../listagem-categorias/listagem-categorias.component.css']
})
export class AtualizarCategoriaComponent implements OnInit {
  
  nomeCategoria: string = '';
  categoriaId: number = 0;
  categoria!: Observable<Categoria>;
  tipos: Tipo[] = [];
  formulario: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private tipoService: TiposService,
    private categoriasService: CategoriasService) { }

  ngOnInit(): void {
    this.categoriaId = this.route.snapshot.params['id'];
    this.tipoService.PegarTodos().subscribe(resultado => {
      this.tipos = resultado;
    });

    this.categoriasService.PegarCategoriaPeloId(this.categoriaId).subscribe(resultado => {
      this.nomeCategoria = resultado.nome;
      this.formulario = new FormGroup({
        categoriaId: new FormControl(resultado.categoriaId),
        nome: new FormControl(resultado.nome),
        icone: new FormControl(resultado.icone),
        tipoId: new FormControl(resultado.tipoId)
      });
    });    
  }

  get Propriedade(){
    return this.formulario.controls;
  }

  EnviarFormulario(): void{
    const categoria = this.formulario.value;
    this.categoriasService.AtualizarCategoria(this.categoriaId, categoria).subscribe((resultado) => {
      this.router.navigate(['categorias/listagemcategorias']);
    });

  }

  VoltarListagem(): void{
    this.router.navigate(['categorias/listagemcategorias']);
  }

}
