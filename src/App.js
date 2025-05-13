import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');

  const fetchCoins = async () => {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd");
      const data = await res.json();
      setCoins(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchCoins(); // initial fetch
    const interval = setInterval(fetchCoins, 10000); // every 10s
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <h1>📊Robin's Crypto Price Tracker</h1>
      <input
        type="text"
        placeholder="Search for a coin..."
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      <div className="coin-list">
        {filteredCoins.map((coin) => (
          <div key={coin.id} className="coin">
            <img src={coin.image} alt={coin.name} />
            <h2>{coin.name} ({coin.symbol.toUpperCase()})</h2>
            <p>💵 ${coin.current_price.toLocaleString()}</p>
            <p
              className={
                coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'
              }
            >
              {coin.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;