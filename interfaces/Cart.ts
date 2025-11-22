export interface IngredientePersonalizado {
    id: number;
    nombre: string;
    tipo: string;
    id_categoria: number;
    categoria_nombre: string;
}

export interface ProductoPersonalizado {
    producto_id: number;
    producto_nombre: string;
    producto_precio: number;
    ingredientes: IngredientePersonalizado[];
    cantidad: number;
}

export interface CartContextType {
    items: ProductoPersonalizado[];
    addToCart: (producto: ProductoPersonalizado) => void;
    removeFromCart: (productoId: number) => void;
    updateQuantity: (productoId: number, cantidad: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}