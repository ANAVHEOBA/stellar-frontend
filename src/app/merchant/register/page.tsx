'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MerchantConnect } from '@/app/components/merchant/auth/MerchantConnect';

export default function MerchantRegistration() {
  const [step, setStep] = useState<'connect' | 'verification'>('connect');
  const router = useRouter();

  // Add debug log
  useEffect(() => {
    console.log('MerchantRegistration page mounted');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Merchant Registration
          </h1>
          <p className="mt-2 text-gray-600">
            Connect your wallet to start accepting payments
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          {/* Progress Steps */}
          <div className="px-4 py-5 border-b border-gray-200">
            <div className="flex justify-around">
              <div className={`flex items-center ${step === 'connect' ? 'text-blue-600' : 'text-gray-500'}`}>
                <span className="w-8 h-8 flex items-center justify-center border-2 rounded-full mr-2">
                  1
                </span>
                Connect Wallet
              </div>
              <div className={`flex items-center ${step === 'verification' ? 'text-blue-600' : 'text-gray-500'}`}>
                <span className="w-8 h-8 flex items-center justify-center border-2 rounded-full mr-2">
                  2
                </span>
                Verification
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {step === 'connect' && (
              <MerchantConnect onSuccess={() => setStep('verification')} />
            )}

            {step === 'verification' && (
              <VerificationInstructions onComplete={() => {
                router.push('/merchant/dashboard');
              }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Verification Instructions Component
function VerificationInstructions({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Verification Complete</h3>
      <p className="text-gray-600">
        Your merchant account has been verified successfully.
      </p>
      <div className="mt-4">
        <button
          onClick={onComplete}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
} 