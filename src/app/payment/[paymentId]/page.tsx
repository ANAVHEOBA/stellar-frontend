'use client';

import { use } from 'react';
import { PaymentPage } from '@/app/components/payment/PaymentPage';

interface PaymentRouteProps {
  params: Promise<{ paymentId: string }>;
}

export default function PaymentRoute({ params }: PaymentRouteProps) {
  const resolvedParams = use(params);
  return <PaymentPage paymentId={resolvedParams.paymentId} />;
} 