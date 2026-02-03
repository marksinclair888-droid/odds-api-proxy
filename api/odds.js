export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Get parameters from query string
  const apiKey = req.query.apiKey;
  const sport = req.url.split('/').pop().split('?')[0]; // Extract sport from URL
  
  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey parameter' });
  }
  
  if (!sport || sport === 'odds') {
    return res.status(400).json({ error: 'Missing sport in URL. Use /api/odds/basketball_nba?apiKey=YOUR_KEY' });
  }
  
  try {
    const oddsUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;
    
    const response = await fetch(oddsUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: 'The Odds API Error',
        status: response.status,
        message: errorText 
      });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy server error',
      message: error.message 
    });
  }
}
