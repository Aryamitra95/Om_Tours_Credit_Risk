import type { NextApiRequest, NextApiResponse } from 'next';

// This is a placeholder for your actual ML model integration
async function getPrediction(formData: any): Promise<any> {
  // In a real implementation, you would:
  // 1. Call your ML model service (could be Python Flask/FastAPI, TensorFlow Serving, etc.)
  // 2. Format the data appropriately for your model
  // 3. Return the prediction
  
  // Mock response - replace with actual model call
  return new Promise(resolve => {
    setTimeout(() => {
      // Simple mock logic - in reality this would come from your ML model
      const riskScore = 
        (formData.default_acc * 0.3) + 
        (formData.no_of_defaults * 0.25) + 
        (formData.balance / formData.amount * 0.2) +
        (formData.acc_age < 12 ? 0.15 : 0) +
        (formData.acc_opened_12m > 3 ? 0.1 : 0);
      
      const approved = riskScore < 0.7 ? 1 : 0;
      const probability = approved ? 1 - riskScore : riskScore;
      
      resolve({
        prediction: approved,
        probability: Math.max(0.1, Math.min(0.99, probability)), // clamp between 0.1 and 0.99
        explanation: approved 
          ? "Your application meets our current criteria for approval based on your credit history and financial situation."
          : "Our analysis indicates higher risk based on your credit history and current financial obligations."
      });
    }, 1000); // Simulate network delay
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    const prediction = await getPrediction(formData);
    res.status(200).json(prediction);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Error processing prediction' });
  }
}