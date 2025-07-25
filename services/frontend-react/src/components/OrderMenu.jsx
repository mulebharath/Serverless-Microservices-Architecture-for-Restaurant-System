import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- DATA & HELPERS (Moved outside component for stability) ---

// Helper to create a consistent, URL-friendly ID from a name
const createItemId = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// Master list of all available food items with a stable, unique ID
const ALL_FOOD_ITEMS = [
  // Indian
  { id: 'masala-dosa', cuisine: 'Indian', name: 'Masala Dosa', price: 120, description: 'Crispy dosa with spicy potato filling.' },
  { id: 'dal-makhani', cuisine: 'Indian', name: 'Dal Makhani', price: 180, description: 'Creamy black lentil curry.' },
  { id: 'samosa', cuisine: 'Indian', name: 'Samosa', price: 40, description: 'Crispy pastry with spicy potato filling.' },
  { id: 'gulab-jamun', cuisine: 'Indian', name: 'Gulab Jamun', price: 70, description: 'Sweet milk-solid balls in syrup.' },
  { id: 'palak-paneer', cuisine: 'Indian', name: 'Palak Paneer', price: 260, description: 'Paneer cubes in spinach gravy.' },
  { id: 'fish-curry', cuisine: 'Indian', name: 'Fish Curry', price: 350, description: 'Spicy fish curry with rice.' },
  { id: 'dhokla', cuisine: 'Indian', name: 'Dhokla', price: 80, description: 'Steamed savory cake from Gujarat.' },
  { id: 'jalebi', cuisine: 'Indian', name: 'Jalebi', price: 60, description: 'Sweet, spiral-shaped dessert.' },
  { id: 'mutton-biryani', cuisine: 'Indian', name: 'Mutton Biryani', price: 320, description: 'Aromatic rice with mutton.' },
  { id: 'chicken-biryani', cuisine: 'Indian', name: 'Chicken Biryani', price: 300, description: 'Aromatic rice with chicken.' },
  { id: 'seviyan-kheer', cuisine: 'Indian', name: 'Seviyan Kheer', price: 90, description: 'Vermicelli pudding.' },

  // Chinese
  { id: 'veg-hakka-noodles', cuisine: 'Chinese', name: 'Veg Hakka Noodles', price: 180, description: 'Stir-fried noodles with veggies.' },
  { id: 'chicken-manchurian', cuisine: 'Chinese', name: 'Chicken Manchurian', price: 220, description: 'Fried chicken balls in spicy sauce.' },
  { id: 'spring-rolls', cuisine: 'Chinese', name: 'Spring Rolls', price: 150, description: 'Crispy rolls stuffed with veggies.' },
  { id: 'schezwan-fried-rice', cuisine: 'Chinese', name: 'Schezwan Fried Rice', price: 200, description: 'Spicy fried rice with Schezwan sauce.' },
  { id: 'chilli-paneer', cuisine: 'Chinese', name: 'Chilli Paneer', price: 210, description: 'Paneer cubes tossed in spicy sauce.' },
  { id: 'hot-and-sour-soup', cuisine: 'Chinese', name: 'Hot & Sour Soup', price: 120, description: 'Spicy and tangy soup.' },
  { id: 'chicken-lollipop', cuisine: 'Chinese', name: 'Chicken Lollipop', price: 240, description: 'Fried chicken drumettes.' },
  { id: 'momos', cuisine: 'Chinese', name: 'Momos', price: 130, description: 'Steamed dumplings with filling.' },
  { id: 'kung-pao-chicken', cuisine: 'Chinese', name: 'Kung Pao Chicken', price: 260, description: 'Spicy stir-fried chicken with peanuts.' },
  { id: 'crispy-chilli-potato', cuisine: 'Chinese', name: 'Crispy Chilli Potato', price: 160, description: 'Fried potato tossed in spicy sauce.' },

  // Italian
  { id: 'margherita-pizza', cuisine: 'Italian', name: 'Margherita Pizza', price: 350, description: 'Classic pizza with tomato, mozzarella, and basil.' },
  { id: 'pasta-alfredo', cuisine: 'Italian', name: 'Pasta Alfredo', price: 320, description: 'Creamy Alfredo sauce with fettuccine pasta.' },
  { id: 'bruschetta', cuisine: 'Italian', name: 'Bruschetta', price: 180, description: 'Grilled bread with tomato and basil.' },
  { id: 'tiramisu', cuisine: 'Italian', name: 'Tiramisu', price: 220, description: 'Coffee-flavored Italian dessert.' },
  { id: 'lasagna', cuisine: 'Italian', name: 'Lasagna', price: 340, description: 'Layered pasta with cheese and sauce.' },
  { id: 'risotto', cuisine: 'Italian', name: 'Risotto', price: 300, description: 'Creamy Italian rice dish.' },
  { id: 'pesto-pasta', cuisine: 'Italian', name: 'Pesto Pasta', price: 280, description: 'Pasta tossed in basil pesto sauce.' },
  { id: 'focaccia', cuisine: 'Italian', name: 'Focaccia', price: 150, description: 'Italian flatbread with herbs.' },
  { id: 'minestrone-soup', cuisine: 'Italian', name: 'Minestrone Soup', price: 140, description: 'Hearty vegetable soup.' },
  { id: 'caprese-salad', cuisine: 'Italian', name: 'Caprese Salad', price: 160, description: 'Tomato, mozzarella, and basil salad.' },

  // American
  { id: 'french-fries', cuisine: 'American', name: 'French Fries', price: 120, description: 'Crispy golden fries.' },
  { id: 'bbq-chicken-wings', cuisine: 'American', name: 'BBQ Chicken Wings', price: 260, description: 'Chicken wings tossed in BBQ sauce.' },
  { id: 'chocolate-brownie', cuisine: 'American', name: 'Chocolate Brownie', price: 150, description: 'Rich chocolate brownie with nuts.' },
  { id: 'hot-dog', cuisine: 'American', name: 'Hot Dog', price: 180, description: 'Grilled sausage in a bun.' },
  { id: 'mac-and-cheese', cuisine: 'American', name: 'Mac and Cheese', price: 200, description: 'Creamy macaroni with cheese sauce.' },
  { id: 'caesar-salad', cuisine: 'American', name: 'Caesar Salad', price: 160, description: 'Crisp romaine, parmesan, croutons, and Caesar dressing.' },
  { id: 'apple-pie', cuisine: 'American', name: 'Apple Pie', price: 140, description: 'Classic American apple pie.' },
  { id: 'pancakes', cuisine: 'American', name: 'Pancakes', price: 120, description: 'Fluffy pancakes with syrup.' },
];

// Group items by cuisine for rendering
const MENU_BY_CUISINE = ALL_FOOD_ITEMS.reduce((acc, item) => {
  if (!acc[item.cuisine]) {
    acc[item.cuisine] = [];
  }
  acc[item.cuisine].push(item);
  return acc;
}, {});

// Helper to determine veg/non-veg
const isVeg = (name) => {
  const nonVegKeywords = ['chicken', 'fish', 'mutton', 'egg', 'biryani', 'wings', 'hot dog', 'kung pao', 'lollipop', 'beef', 'prawn', 'shrimp', 'sausage'];
  return !nonVegKeywords.some(word => name.toLowerCase().includes(word));
};

// --- COMPONENT ---

function OrderMenu() {
  const [quantities, setQuantities] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleQuantityChange = (id, value) => {
    let num = parseInt(value, 10);
    // Allow empty string for user input, but treat it as 1 for logic
    if (isNaN(num) || num < 1) {
      num = '';
    }
    setQuantities(q => ({ ...q, [id]: num }));
  };

  const handleAddToKitchen = async (item) => {
    setError('');
    // Use a default of 1 if the quantity is not set or is an empty string
    const quantity = Number(quantities[item.id] || 1);
    
    if (quantity <= 0) {
      setError('Please select a valid quantity.');
      return;
    }

    setLoadingId(item.id);
    try {
      const response = await fetch('/order-api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: item.name, quantity })
      });

      if (!response.ok) throw new Error('Order failed.');
      
      // Reset quantity for this item after adding to kitchen
      setQuantities(q => ({ ...q, [item.id]: 1 }));
      
      navigate('/kitchen');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section>
      <h2 style={{ marginBottom: 24 }}>🍽️ Order Food</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      {Object.entries(MENU_BY_CUISINE).map(([cuisine, items]) => (
        <div key={cuisine} className="menu-section">
          <h2>{cuisine} Dishes</h2>
          <div className="menu-grid">
            {items.map(item => (
              <div className="card menu-card" key={item.id}>
                <img
                  src={`/images/${item.name.replace(/ /g, '-')}.jpg`}
                  alt={item.name}
                  className="menu-img"
                  // Optional: Add a fallback for missing images
                  onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                />
                <div className="menu-info">
                  <h3>{item.name} <span className={`food-tag ${isVeg(item.name) ? 'veg' : 'non-veg'}`}>{isVeg(item.name) ? 'Veg' : 'Non-Veg'}</span></h3>
                  <p>{item.description}</p>
                  <div className="menu-price">₹{item.price}</div>
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="number"
                      min="1"
                      value={quantities[item.id] || 1}
                      onChange={e => handleQuantityChange(item.id, e.target.value)}
                      style={{ width: 60, marginRight: 8 }}
                    />
                    <span style={{ fontSize: 14 }}>Qty</span>
                  </div>
                  <button
                    className="btn primary"
                    style={{ width: '100%' }}
                    onClick={() => handleAddToKitchen(item)}
                    disabled={loadingId === item.id}
                  >
                    {loadingId === item.id ? 'Adding...' : 'Add to Kitchen'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default OrderMenu; 