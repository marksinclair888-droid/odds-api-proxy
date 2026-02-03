export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { sport, apiKey } = req.query;
  
  if (!apiKey || !sport) {
    return res.status(400).json({ error: 'Missing apiKey or sport parameter' });
  }
  
  try {
    const oddsUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;
    
    const response = await fetch(oddsUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Proxy server error' });
  }
}
```
4. Click **"Commit changes"**

### **Step 3: Wait for Vercel to Redeploy**

Vercel will automatically detect the changes and redeploy (takes about 30 seconds).

### **Step 4: Test Again**

Once deployed, test this URL (replace `YOUR_API_KEY`):
```
https://odds-api-proxy.vercel.app/api/odds/basketball_nba?apiKey=YOUR_API_KEY
```

You should now see JSON data!

---

## **Your Final GitHub Structure Should Look Like:**
```
odds-api-proxy/
├── api/
│   └── odds.js          (no .rtf!)
├── package.json         (no .rtf!)
└── vercel.json          (no .rtf!)
