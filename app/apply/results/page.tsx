'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PredictionResult {
  prediction: number;
}

interface FormData {
  amount: number;
  term: number;
  all_active_acc: number;
  default_acc: number;
  acc_opened_12m: number;
  acc_age: number;
  balance: number;
  no_of_defaults: number;
  loan_purpose: 'debt' | 'home' | 'personal' | 'vehicle' | 'other';
  employment_type: 'full' | 'part' | 'self' | 'retired';
  name: string;
  email: string;
}

export default function PredictionResults() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('loanFormData');
        if (!storedData) {
          throw new Error('No application data found. Please fill out the form first.');
        }

        const parsedData: FormData = JSON.parse(storedData);
        setFormData(parsedData);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('http://127.0.0.1:5000/apply/results/dashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: storedData,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Prediction failed');
        }

        const result = await response.json();
        const predictionScore = Math.min(100, Math.max(0, parseInt(result.prediction)));
        setPrediction({ prediction: predictionScore });
      } catch (err: any) {
        console.error('Prediction error:', err);
        setError(err.message || 'Failed to get prediction. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Processing Your Application</h1>
        <div className="flex justify-center items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="text-gray-700">Analyzing your information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <h1 className="text-xl font-bold text-red-800 mb-2">Error</h1>
          <p className="text-red-700">{error}</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/apply"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Application
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Loan Application Decision</h1>
        <div className="flex space-x-3">
          <Link
            href="/apply"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            New Application
          </Link>
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
          >
            Print Results
          </button>
        </div>
      </div>

      {/* Application Summary Card */}
      <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Application Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Personal Information</h3>
            <div className="space-y-2 text-gray-800">
              <p><span className="font-medium">Name:</span> {formData?.name}</p>
              <p><span className="font-medium">Email:</span> {formData?.email}</p>
              <p><span className="font-medium">Employment:</span> {formData?.employment_type}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Loan Details</h3>
            <div className="space-y-2 text-gray-800">
              <p><span className="font-medium">Amount:</span> ${formData?.amount.toLocaleString()}</p>
              <p><span className="font-medium">Term:</span> {formData?.term} months</p>
              <p><span className="font-medium">Purpose:</span> 
                <span className="capitalize"> {formData?.loan_purpose.toLowerCase()}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Card */}
      {prediction && typeof prediction.prediction !== 'undefined' ? (
        <>
          <div className="mb-8 p-6 rounded-xl border"
            style={{
              backgroundColor: prediction.prediction > 50 ? '#f0fdf4' : '#fef2f2',
              borderColor: prediction.prediction > 50 ? '#bbf7d0' : '#fecaca'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Decision</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                prediction.prediction > 50 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {prediction.prediction > 50 ? 'Approved' : 'Declined'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Confidence Level</h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="h-4 rounded-full" 
                    style={{
                      width: `${prediction.prediction}%`,
                      backgroundColor: prediction.prediction > 50 ? '#10b981' : '#ef4444'
                    }}
                  ></div>
                </div>
                <p className="mt-2 text-gray-800">
                  Score: {prediction.prediction.toFixed(0)}/100
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h2 className="text-xl font-semibold mb-3 text-blue-900">Next Steps</h2>
            {prediction.prediction > 50 ? (
              <div className="space-y-3 text-blue-800">
                <p>🎉 Congratulations! Your application has been pre-approved.</p>
                <p>
                  Our team will contact you at <span className="font-semibold">
                  {formData?.email || 'your provided email'}</span> within 24 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-gray-800">
                <p>We're unable to approve your application at this time.</p>
                <p>
                  Contact <span className="font-semibold">support@loanapp.com</span> for more information.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-4 bg-yellow-50 text-yellow-900 rounded-lg border border-yellow-200">
          Decision results are not available. Please try again later.
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/apply"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Submit New Application
        </Link>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Print This Decision
        </button>
      </div>
    </div>
  );
}