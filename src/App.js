import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState('light');
  const [favorites, setFavorites] = useState([]); // Add favorites state

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
    fetchCoins();
    const interval = setInterval(fetchCoins, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Toggle favorite handler
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className={`app ${theme}`}>
      <h1>📊Robin's Crypto Price Tracker</h1>
      <button
        style={{ marginBottom: '20px', 
          borderRadius: '5px',
          marginRight: '20px',
          padding: '10px',
          cursor: 'pointer',
          border: 'none', 
          backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
          color: theme === 'light' ? '#000' : '#fff' }}
        className={`theme-toggle ${theme}`}
        onClick={toggleTheme}
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <input
        type="text"
        placeholder="Search for a coin..."
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      <div className="coin-list">
        {filteredCoins.map((coin) => (
          <div key={coin.id} className="coin">
            <span
              className={`favorite-icon${favorites.includes(coin.id) ? ' active' : ''}`}
              onClick={() => toggleFavorite(coin.id)}
              title={favorites.includes(coin.id) ? "Unfavorite" : "Favorite"}
              style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '8px' }}
            >
              {favorites.includes(coin.id) ? '★' : '☆'}
            </span>
            <img src={coin.image} alt={coin.name} />
            <h2>{coin.name} ({coin.symbol.toUpperCase()})</h2>
            <p>💵 ${coin.current_price.toLocaleString()}</p>
            <p
              className={
                coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'
              }
            >
              {coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined
                ? coin.price_change_percentage_24h.toFixed(2) + '%'
                : 'N/A'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default App;