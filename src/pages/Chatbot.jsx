import { Alert, Avatar, Box, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import { api } from '../api/collegeApi.js';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setError('');
    setMessages((current) => [...current, { from: 'user', text }]);
    setLoading(true);
    try {
      const result = await api.sendChatMessage(text);
      setMessages((current) => [...current, { from: 'bot', text: result.response }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper elevation={0} sx={{ border: '1px solid #dbe3f0', maxWidth: 820, mx: 'auto', overflow: 'hidden' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 2, bgcolor: '#eef3ff', borderBottom: '1px solid #dbe3f0' }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}><SmartToyIcon /></Avatar>
        <Box>
          <Typography variant="h6">AI Counselor</Typography>
          <Typography variant="body2" color="text.secondary">Answers use your uploaded CAP references through Supabase vector search.</Typography>
        </Box>
      </Stack>

      <Stack spacing={1.5} sx={{ p: { xs: 1.5, md: 2 }, height: { xs: '58vh', md: '62vh' }, overflowY: 'auto', bgcolor: '#f8fafc' }}>
        {messages.length === 0 && <Typography color="text.secondary" textAlign="center" sx={{ mt: 8 }}>Ask about CAP rounds, cutoffs, documents, or branch selection.</Typography>}
        {messages.map((message, index) => (
          <Stack key={`${message.from}-${index}`} direction={message.from === 'user' ? 'row-reverse' : 'row'} spacing={1} alignItems="flex-start">
            <Avatar sx={{ bgcolor: message.from === 'user' ? 'secondary.main' : 'primary.main' }}>
              {message.from === 'user' ? <PersonIcon /> : <SmartToyIcon />}
            </Avatar>
            <Paper elevation={0} sx={{ p: 1.5, maxWidth: { xs: '84%', md: '75%' }, whiteSpace: 'pre-wrap', border: '1px solid #dbe3f0' }}>
              {message.text}
            </Paper>
          </Stack>
        ))}
        {loading && <Typography color="text.secondary">AI is typing...</Typography>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ p: { xs: 1.5, md: 2 }, borderTop: '1px solid #dbe3f0' }}>
        <TextField fullWidth size="small" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Ask a college counselling question" />
        <IconButton color="primary" onClick={send} disabled={loading} aria-label="Send message"><SendIcon /></IconButton>
      </Stack>
    </Paper>
  );
}
