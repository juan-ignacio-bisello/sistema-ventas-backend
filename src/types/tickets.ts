export interface Ticket {
    id: string;
    cliente_id: string;
    armazon_id: string;
    cristal_od: string;
    cristal_oi: string;
    receta_id: string;
    estado: 'pendiente' | 'en_proceso' | 'terminado' | 'entregado' | 'cancelado' | 'retrasado';
    vendedor_id: string;
    taller_id: string;
    despachante_id: string;
    fecha_creado: Date;
    fecha_terminado: Date;
}
