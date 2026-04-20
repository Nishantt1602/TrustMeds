import express from 'express';
import axios from 'axios';

const router = express.Router();

// Simple chatbot using Groq API (free AI model)
// You can replace this with OpenAI, Claude, or any LLM API
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Please provide a prompt' });
    }

    // Simple hardcoded responses for demo (replace with real API call)
    const responses = {
      headache: "For headaches, common medicines are Paracetamol 500mg or Aspirin. Always consult a doctor if pain persists.",
      fever: "Common fever medications include Paracetamol, Ibuprofen, or Aspirin. Drink plenty of water and rest.",
      cough: "For cough, you might try Dextromethorphan or Codeine-based syrups. Consult a pharmacist for best option.",
      default: "I'm a medical assistant chatbot. Please describe your symptoms (e.g., headache, fever, cough) and I'll suggest common medicines. Always consult a healthcare professional for medical advice."
    };

    let reply = responses.default;

    if (prompt.toLowerCase().includes('headache')) {
      reply = responses.headache;
    } else if (prompt.toLowerCase().includes('fever')) {
      reply = responses.fever;
    } else if (prompt.toLowerCase().includes('cough')) {
      reply = responses.cough;
    }

    // Optional: Use real API (uncomment when you have API key)
    /*
    if (process.env.GROQ_API_KEY) {
      try {
        const response = await axios.post('https://api.groq.com/chat/completions', {
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "user",
              content: `You are a medical assistant. Answer briefly about medicines. ${prompt}`
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        reply = response.data.choices[0].message.content;
      } catch (apiError) {
        console.log('Groq API error, using default response');
      }
    }
    */

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
