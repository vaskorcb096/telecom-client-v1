export const useCartItems = () => {
  // Load cart from localStorage on hook initialization
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Function to add an item to the cart
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  // Function to clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Function to remove a specific item from the cart
  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
  };

  // Calculate cart count
  const cartCount = cart.length;

  return {
    cart,
    cartCount,
    addToCart,
    clearCart,
    removeFromCart,
  };
};
