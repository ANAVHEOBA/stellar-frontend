'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Stellar Payment Platform
          </h1>
          <p className="text-xl text-gray-600">
            Choose how you want to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Consumer Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">I'm a User</h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet to make payments and manage your transactions
              </p>
              <Link 
                href="/connect"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Connect Wallet
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              <h3 className="font-medium mb-2">As a user, you can:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Make instant payments</li>
                <li>View transaction history</li>
                <li>Access multiple merchants</li>
                <li>Track payment status</li>
              </ul>
            </div>
          </div>

          {/* Merchant Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">I'm a Merchant</h2>
              <p className="text-gray-600 mb-6">
                Register your business to accept Stellar payments and manage rates
              </p>
              <Link 
                href="/merchant/register"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Register as Merchant
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              <h3 className="font-medium mb-2">As a merchant, you can:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Set custom exchange rates</li>
                <li>Monitor transactions</li>
                <li>Access business analytics</li>
                <li>Manage payment settings</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="font-medium text-lg mb-2">Secure</div>
              <p className="text-gray-600">Built on Stellar blockchain technology</p>
            </div>
            <div>
              <div className="font-medium text-lg mb-2">Fast</div>
              <p className="text-gray-600">Instant transactions and settlements</p>
            </div>
            <div>
              <div className="font-medium text-lg mb-2">Low Cost</div>
              <p className="text-gray-600">Minimal transaction fees</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
