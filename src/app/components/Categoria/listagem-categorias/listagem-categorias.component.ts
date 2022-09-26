import { Observable, startWith, map } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-listagem-categorias',
  templateUrl: './listagem-categorias.component.html',
  styleUrls: ['./listagem-categorias.component.css']
})
export class ListagemCategoriasComponent implements OnInit {

  categorias = new MatTableDataSource<any>();
  displayColumns: string[] = [];
  autoCompleteInput = new FormControl();
  opcoesCategorias: string[] = [];
  nomesCategorias!: Observable<string[]>;


  constructor(private categoriasServices: CategoriasService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.categoriasServices.PegarTodos().subscribe(resultado => {
      resultado.forEach(categoria => {
        this.opcoesCategorias.push(categoria.nome);
      });

      this.categorias.data = resultado;
    });

    this.displayColumns = this.ExibirColunas();

    this.nomesCategorias = this.autoCompleteInput.valueChanges.pipe(startWith(''), map(nome => this.FiltrarNomes(nome)));
  }

  ExibirColunas(): string[] {
    return ['nome', 'icone', 'tipo', 'acoes'];
  }

  AbrirDialog(categoriaId: number, nome: string): void {
    this.dialog.open(DialogExclusaoCategoriasComponent, {
      data: {
        categoriaId: categoriaId,
        nome: nome,
      },
    }).afterClosed().subscribe(resultado => {
      debugger;
      if (resultado === true) {
        this.categoriasServices.PegarTodos().subscribe(dados => {
          this.categorias.data = dados;
        });

        this.displayColumns = this.ExibirColunas();
      }
    });
  }

  FiltrarNomes(nome: string): string[] {
    if (nome.trim().length >= 4) {
      this.categoriasServices.FiltrarCategorias(nome.toLowerCase()).subscribe(resultado => {
        this.categorias.data = resultado;
      });
    }
    else {
      if (nome == '') {
        this.categoriasServices.PegarTodos().subscribe(resultado => {
          this.categorias.data = resultado;
        });
      }
    }

    return this.opcoesCategorias.filter(categoria =>
      categoria.toLowerCase().includes(nome.toLowerCase())
    );
  }

}

//AQUI CRIAMOS UM MODAL PARA EXIBIR NA TELA, DE CONFIRMAÇÃO DE EXCLASÃO DE CATEGORIAS
@Component({
  selector: 'app-dialog-exclusao-categorias',
  templateUrl: 'dialog-exclusao-categorias.html'
})
export class DialogExclusaoCategoriasComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dados: any,
    private categoriasServices: CategoriasService) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ExcluirCategoria(categoriaId: number): void {
    this.categoriasServices.ExcluirCategoria(categoriaId).subscribe(resultado => {

    });
  }

}
