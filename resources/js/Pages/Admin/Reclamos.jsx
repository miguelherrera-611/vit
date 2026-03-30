import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ESTADOS_RECLAMO = {
    pendiente:   { bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.3)',  color:'rgba(146,64,14,0.9)',  label:'Pendiente',    emoji:'🕐' },
    en_revision: { bg:'rgba(59,130,246,0.09)', border:'rgba(59,130,246,0.28)', color:'rgba(29,78,216,0.9)',  label:'En revisión',  emoji:'🔍' },
    resuelto:    { bg:'rgba(16,185,129,0.09)', border:'rgba(16,185,129,0.28)', color:'rgba(4,120,87,0.9)',   label:'Resuelto',     emoji:'✅' },
    cerrado:     { bg:'rgba(200,140,80,0.07)', border:'rgba(200,140,80,0.22)', color:'rgba(150,80,20,0.7)',  label:'Cerrado',      emoji:'🔒' },
};

export default function AdminReclamos({ reclamos, conteos, filtro }) {
    const { flash } = usePage().props;
    const [detalle, setDetalle] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [notas, setNotas] = useState('');
    const [processing, setProcessing] = useState(false);
    const [filtroActivo, setFiltroActivo] = useState(filtro || '');

    const filtrarPor = (estado) => {
        const nuevo = filtroActivo === estado ? '' : estado;
        setFiltroActivo(nuevo);
        router.get('/admin/reclamos', nuevo ? { estado: nuevo } : {}, { preserveState: true });
    };

    const guardarActualizacion = () => {
        if (!nuevoEstado) return;
        setProcessing(true);
        router.patch(`/admin/reclamos/${detalle.id}`, { estado: nuevoEstado, notas_admin: notas }, {
            preserveScroll: true,
            onSuccess: () => { setProcessing(false); setDetalle(null); },
            onError: () => setProcessing(false),
        });
    };

    const reclamosList = reclamos.data || [];

    return (
        <AppLayout>
            <Head title="Reclamos — Admin" />
            {/* ... render similar a AdminPedidos con la misma paleta */}
            {/* Lista de reclamos con filtros por estado */}
            {/* Panel lateral: tipo, cliente, teléfono WhatsApp, descripción, botón de contacto */}
            {/* Link directo WhatsApp: https://wa.me/57{telefono} */}
        </AppLayout>
    );
}
