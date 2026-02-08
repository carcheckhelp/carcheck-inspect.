import { Suspense } from 'react';
import Link from 'next/link';
import OrdersDisplay from '@/components/OrdersDisplay';

const OrdersPage = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">
            <header className="absolute top-8 left-8">
                <Link href="/">
                    <h1 className="text-5xl font-bold">
                        <span style={{ color: '#B8860B' }}>Car</span>
                        <span style={{ color: '#FFD700' }}>Check</span>
                    </h1>
                </Link>
            </header>

            <main className="w-full max-w-4xl mt-32 text-center">
                <h2 className="text-4xl font-bold mb-8">Seguimiento de Órdenes</h2>
                <Suspense fallback={<p className="text-yellow-400 text-lg">Cargando órdenes...</p>}>
                    <OrdersDisplay />
                </Suspense>
            </main>
        </div>
    );
};

export default OrdersPage;
