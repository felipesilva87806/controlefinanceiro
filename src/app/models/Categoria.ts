import { Tipo } from "./Tipo";

export class Categoria{
    categoriaId: number = 0;
    nome: string = '';
    icone: string = '';
    tipoId: number = 0;
    tipo: Tipo = new Tipo;
}