import express from 'express';
import axios from 'axios';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// AI Chatbot Logic
router.post('/ai', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Please provide a prompt' });

    let reply = "I am TrustMeds AI. How can I help you today?";
    
    if (process.env.GROQ_API_KEY) {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama3-70b-8192",
        messages: [{ role: "system", content: "Medical assistant." }, { role: "user", content: prompt }],
      }, {
        headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
      });
      reply = response.data.choices[0].message.content;
    }

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message (P2P Chat)
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const newMessage = new Message({
      senderId: req.user.id,
      receiverId,
      text,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chat history between two users
router.get('/history/:otherId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.otherId },
        { senderId: req.params.otherId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET conversations list for current user
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 });

    const conversationIds = new Set();
    const conversations = [];

    for (const msg of messages) {
      const otherId = msg.senderId.toString() === userId.toString() ? msg.receiverId : msg.senderId;
      if (!conversationIds.has(otherId.toString())) {
        conversationIds.add(otherId.toString());
        const otherUser = await User.findById(otherId).select('name role');
        if (otherUser) {
          conversations.push({
            _id: otherUser._id,
            name: otherUser.name,
            role: otherUser.role,
            lastMessage: msg.text,
            createdAt: msg.createdAt
          });
        }
      }
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

export default router;
