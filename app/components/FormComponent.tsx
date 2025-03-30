'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function LoanApplicationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    amount: 0,
    term: 0,
    all_active_acc: 0,
    default_acc: 0,
    acc_opened_12m: 0,
    acc_age: 0,
    balance: 0,
    no_of_defaults: 0,
    loan_purpose: 'personal',
    employment_type: 'Full',
    name: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('amount') || name.includes('term') || name.includes('balance') || 
              name.includes('all_active_acc') || name.includes('default_acc') || 
              name.includes('acc_opened_12m') || name.includes('acc_age') || 
              name.includes('no_of_defaults') 
              ? Number(value) 
              : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      sessionStorage.setItem('loanFormData', JSON.stringify(formData));
      router.push('/apply/results');
    } catch (error) {
      console.error('Error during form submission:', error);
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Loan Application Form
      </h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Financial Information */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold border-b-2 border-blue-200 pb-2 text-blue-700">
              Financial Information
            </h2>
            
            <div>
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-700">
                Loan Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black placeholder-gray-500"
                min="0"
                required
                placeholder="Enter loan amount"
              />
            </div>
            
            <div>
              <label htmlFor="term" className="block mb-2 text-sm font-medium text-gray-700">
                Loan Term (months)
              </label>
              <input
                type="number"
                id="term"
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black placeholder-gray-500"
                min="0"
                required
                placeholder="Enter loan term"
              />
            </div>
            
            <div>
              <label htmlFor="balance" className="block mb-2 text-sm font-medium text-gray-700">
                Current Balance ($)
              </label>
              <input
                type="number"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black placeholder-gray-500"
                min="0"
                required
                placeholder="Enter current balance"
              />
            </div>
            
            <div>
              <label htmlFor="loan_purpose" className="block mb-2 text-sm font-medium text-gray-700">
                Loan Purpose
              </label>
              <select
                id="loan_purpose"
                name="loan_purpose"
                value={formData.loan_purpose}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                required
              >
                <option value="debt">Debt Consolidation</option>
                <option value="home">Home Improvement</option>
                <option value="personal">Personal</option>
                <option value="vehicle">Vehicle</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          {/* Account Information */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold border-b-2 border-blue-200 pb-2 text-blue-700">
              Account Information
            </h2>
            
            <div>
              <label htmlFor="all_active_acc" className="block mb-2 text-sm font-medium text-gray-700">
                Active Accounts
              </label>
              <input
                type="number"
                id="all_active_acc"
                name="all_active_acc"
                value={formData.all_active_acc}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black placeholder-gray-500"
                min="0"
                required
                placeholder="Number of active accounts"
              />
            </div>
            
            <div>
              <label htmlFor="default_acc" className="block mb-2 text-sm font-medium text-gray-700">
                Default Accounts
              </label>
              <input
                type="number"
                id="default_acc"
                name="default_acc"
                value={formData.default_acc}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black placeholder-gray-500"
                min="0"
                required
                placeholder="Number of default accounts"
              />
            </div>
            
            <div>
              <label htmlFor="acc_opened_12m" className="block mb-2 text-sm font-medium text-gray-700">
                Accounts Opened (12m)
              </label>
              <input
                type="number"
                id="acc_opened_12m"
                name="acc_opened_12m"
                value={formData.acc_opened_12m}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black placeholder-gray-500"
                min="0"
                required
                placeholder="Accounts opened in last 12 months"
              />
            </div>
            
            <div>
              <label htmlFor="acc_age" className="block mb-2 text-sm font-medium text-gray-700">
                Account Age (months)
              </label>
              <input
                type="number"
                id="acc_age"
                name="acc_age"
                value={formData.acc_age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black placeholder-gray-500"
                min="0"
                required
                placeholder="Age of oldest account in months"
              />
            </div>
            
            <div>
              <label htmlFor="no_of_defaults" className="block mb-2 text-sm font-medium text-gray-700">
                Number of Defaults
              </label>
              <input
                type="number"
                id="no_of_defaults"
                name="no_of_defaults"
                value={formData.no_of_defaults}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black placeholder-gray-500"
                min="0"
                required
                placeholder="Total number of defaults"
              />
            </div>
          </div>
        </div>
        
        {/* Personal Information */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold border-b-2 border-blue-200 pb-2 text-blue-700">
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black placeholder-gray-500"
                required
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black placeholder-gray-500"
                required
                placeholder="Your email address"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="employment_type" className="block mb-2 text-sm font-medium text-gray-700">
              Employment Type
            </label>
            <select
              id="employment_type"
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
              required
            >
              <option value="Full">Full-time</option>
              <option value="Part">Part-time</option>
              <option value="Self">Self-employed</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 disabled:bg-gray-400 transition-all shadow-md hover:shadow-lg font-medium"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}