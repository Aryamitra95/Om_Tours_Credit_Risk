'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PredictionResult {
  prediction: number;
  probability: number;
  explanation: string;
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
  employment_type: 'Full' | 'Part' | 'Self' | 'Retired';
  name: string;
  email: string;
}

export default function PredictionResults() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve form data from session storage
    const storedData = sessionStorage.getItem('loanFormData');
    
    if (!storedData) {
      setError('No application data found. Please fill out the form first.');
      setLoading(false);
      return;
    }

    const parsedData: FormData = JSON.parse(storedData);
    setFormData(parsedData);

    // Call prediction API
    const fetchPrediction = async () => {
      try {
        const response = await fetch('@/app/backupapp.py', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: storedData,
        });

        if (!response.ok) {
          throw new Error('Prediction failed');
        }

        const result = await response.json();
        setPrediction(result);
      } catch (error) {
        console.error('Error during prediction:', error);
        setError('Failed to get prediction. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Your Application</h1>
        <p className="text-gray-600">Please wait while we analyze your information...</p>
        <div className="mt-8 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link 
          href="@/app/dashboard/layout.tsx" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Application Form
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Loan Application Results</h1>
        <Link 
          href="/apply" 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          New Application
        </Link>
      </div>
      
      {formData && prediction ? (
        <div className="space-y-8">
          <div className="p-6 bg-gray-50 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Application Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p><span className="text-gray-600">Name:</span> {formData.name}</p>
                <p><span className="text-gray-600">Email:</span> {formData.email}</p>
                <p><span className="text-gray-600">Employment:</span> {formData.employment_type}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Loan Details</h3>
                <p><span className="text-gray-600">Amount:</span> ${formData.amount}</p>
                <p><span className="text-gray-600">Term:</span> {formData.term} months</p>
                <p><span className="text-gray-600">Purpose:</span> {formData.loan_purpose}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Prediction Results</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Decision</h3>
                  <p className={`text-2xl font-bold ${prediction.prediction === 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {prediction.prediction === 1 ? 'Approved' : 'Denied'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Confidence</h3>
                  <p className="text-2xl font-bold">
                    {(prediction.probability * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold">Explanation</h3>
                <p className="text-gray-700">{prediction.explanation}</p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-semibold">Next Steps</h3>
                {prediction.prediction === 1 ? (
                  <p className="text-gray-700">
                    Congratulations! Your loan application looks promising. 
                    Our team will contact you at {formData.email} within 24 hours 
                    to discuss the next steps.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    We're unable to approve your application at this time. 
                    You may reapply in 3 months or contact our support team 
                    at support@loanprovider.com for more information.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link 
              href="@/app/dashboard/layout" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit New Application
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No application data available</p>
          <Link 
            href="/apply" 
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Application
          </Link>
        </div>
      )}
    </div>
  );
}