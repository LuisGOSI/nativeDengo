export interface Ingrediente {
    id: number;
    nombre: string;
    descripcion: string;
    tipo: string;
    activo: boolean;
    id_categoria: number;
    categorias: {
        id: number;
        nombre: string;
    };
}