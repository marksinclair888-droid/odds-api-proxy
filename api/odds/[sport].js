export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Get the sport from the dynamic route
  const { sport } = req.query;
  const { apiKey } = req.query;
  
  if (!apiKey) {
    return res.status(400).json({ 
      error: 'Missing apiKey parameter',
      usage: 'GET /api/odds/{sport}?apiKey=YOUR_KEY'
    });
  }
  
  if (!sport) {
    return res.status(400).json({ 
      error: 'Missing sport parameter',
      usage: 'GET /api/odds/basketball_nba?apiKey=YOUR_KEY'
    });
  }
  
  try {
    // Build The Odds API URL according to their docs
    const oddsUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;
    
    console.log('Fetching from:', oddsUrl.replace(apiKey, 'HIDDEN'));
    
    const response = await fetch(oddsUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Odds API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'The Odds API returned an error',
        status: response.status,
        message: errorText 
      });
    }
    
    const data = await response.json();
    console.log('Successfully fetched', data.length, 'games');
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal proxy error',
      message: error.message 
    });
  }
}
```

4. Click **"Commit changes"**

---

### **Your New GitHub Structure:**
```
odds-api-proxy/
├── api/
│   └── odds/
│       └── [sport].js    ← Dynamic route
├── package.json
└── vercel.json
```

---

### **Step 3: Wait and Test**

Wait 30-60 seconds for Vercel to redeploy.

Then test this URL (replace `YOUR_API_KEY`):
```
https://odds-api-proxy.vercel.app/api/odds/basketball_nba?apiKey=YOUR_API_KEY
```

You should see JSON data!

---

### **Step 4: Update the Artifact**

Once it works, in the artifact set your **Proxy URL** to:
```
https://odds-api-proxy.vercel.app
