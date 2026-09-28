import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

function storageKey(slug) {
  return `digital_menu_cart_${slug || 'default'}`;
}

function loadCart(slug) {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [slug, setSlug] = useState(null);
  const [items, setItems] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (slug) setItems(loadCart(slug));
  }, [slug]);

  useEffect(() => {
    if (slug) localStorage.setItem(storageKey(slug), JSON.stringify(items));
  }, [items, slug]);

  const addItem = useCallback((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemId === item.id);
      if (existing) {
        return prev.map((i) => (i.itemId === item.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { itemId: item.id, name: item.name, price: item.price, image: item.image, quantity }];
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
  }, []);

  const setQuantity = useCallback((itemId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.itemId !== itemId);
      return prev.map((i) => (i.itemId === itemId ? { ...i, quantity } : i));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clear,
      totalCount,
      totalPrice,
      restaurantSlug: slug,
      setRestaurantSlug: setSlug,
      isCartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
    }),
    [items, addItem, removeItem, setQuantity, clear, totalCount, totalPrice, slug, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
