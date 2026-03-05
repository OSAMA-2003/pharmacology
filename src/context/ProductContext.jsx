/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";
// TODO (Backend Developer): Uncomment the line below to use real API calls
// import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";
import { productsData } from "../components/data"; // MOCK DATA

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // --- CONTEXTS & STATE ---
  const { backendUrl, token } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- HELPERS ---
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // --- PRODUCT API ---

  /**
   * Get all products with optional filters.
   * TODO (Backend Developer): Replace mock logic with a real API call to GET /api/products
   */
  const getAllProducts = async (filters = {}) => {
    try {
      setIsLoading(true);
      // --- FRONTEND MOCK ---
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simple filtering for mock data
      let filtered = productsData;
      if (filters.category) {
        filtered = productsData.filter(p => p.category === filters.category);
      }
      setProducts(filtered);
      return { success: true, products: filtered };
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.get(`${backendUrl}/api/products`, {
        params: filters,
      });

      if (response.data.success) {
        setProducts(response.data.products);
        return response.data;
      }
      */
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("فشل في تحميل المنتجات");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get details for a single product.
   * TODO (Backend Developer): Replace mock logic with a real API call to GET /api/products/:productId
   */
  const getProductDetails = async (productId) => {
    try {
      setIsLoading(true);
      const headers = token ? { token } : {};

      // --- FRONTEND MOCK ---
      await new Promise(resolve => setTimeout(resolve, 500));
      const product = productsData.find(p => String(p.id) === String(productId));
      setCurrentProduct(product);
      return product;
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.get(
        `${backendUrl}/api/products/${productId}`,
        { headers }
      );

      if (response.data.success) {
        setCurrentProduct(response.data.product);
        return response.data.product;
      }
      */
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("فشل في تحميل تفاصيل المنتج");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get featured products.
   * TODO (Backend Developer): Replace mock logic with a real API call to GET /api/products/featured/all
   */
  const getFeaturedProducts = async () => {
    try {
      // --- FRONTEND MOCK ---
      await new Promise(resolve => setTimeout(resolve, 500));
      setFeaturedProducts(productsData.slice(0, 4)); // Mock: first 4 products are featured
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.get(
        `${backendUrl}/api/products/featured/all`
      );

      if (response.data.success) {
        setFeaturedProducts(response.data.products);
      }
      */
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  /**
   * Get all product categories.
   * TODO (Backend Developer): Replace mock logic with a real API call to GET /api/products/categories/all
   */
  const getCategories = async () => {
    try {
      // --- FRONTEND MOCK ---
      const mockCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))];
      setCategories(mockCategories);
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.get(
        `${backendUrl}/api/products/categories/all`
      );

      if (response.data.success) {
        setCategories(response.data.categories);
      }
      */
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // --- CART API ---

  /**
   * Add an item to the shopping cart.
   * TODO (Backend Developer): Replace mock logic with a real API call to POST /api/products/cart/add
   * This function should require a valid token.
   */
  const addToCart = async (
    productId,
    quantity = 1,
    size = null,
    color = null
  ) => {
    try {
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً");
        return null;
      }

      setIsLoading(true);

      // --- FRONTEND MOCK ---
      // This part is complex to mock without a backend state.
      // For now, we just show a success message.
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("تمت إضافة المنتج إلى السلة (محاكاة)");
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.post(
        `${backendUrl}/api/products/cart/add`,
        { productId, quantity, size, color },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("تمت إضافة المنتج إلى السلة");
        // Refresh cart
        await getCart();
        return response.data;
      } else {
        toast.error(response.data.message);
        return null;
      }
      */
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error.response?.data?.message || "فشل في إضافة المنتج إلى السلة"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get the current user's shopping cart.
   * TODO (Backend Developer): Replace mock logic with a real API call to GET /api/products/cart
   * This function should require a valid token.
   */
  const getCart = async () => {
    try {
      if (!token) {
        setCart(null);
        return null;
      }

      // --- FRONTEND MOCK ---
      // Returning an empty cart for now.
      setCart({ items: [], total: 0 });
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.get(`${backendUrl}/api/products/cart`, {
        headers: { token },
      });

      if (response.data.success) {
        setCart(response.data.cart);
        return response.data.cart;
      }
      */
    } catch (error) {
      console.error("Error getting cart:", error);
      setCart(null);
      return null;
    }
  };

  /**
   * Update an item's quantity in the cart.
   * TODO (Backend Developer): Replace mock logic with a real API call to PUT /api/products/cart/item/:itemId
   */
  const updateCartItem = async (itemId, quantity) => {
    try {
      if (!token) return null;

      // --- FRONTEND MOCK ---
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("تم تحديث الكمية (محاكاة)");
      await getCart(); // Refresh mock cart
      return { success: true };
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.put(
        `${backendUrl}/api/products/cart/item/${itemId}`,
        { quantity },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("تم تحديث الكمية");
        await getCart();
        return response.data;
      }
      */
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast.error(error.response?.data?.message || "فشل في تحديث الكمية");
      return null;
    }
  };

  /**
   * Remove an item from the cart.
   * TODO (Backend Developer): Replace mock logic with a real API call to DELETE /api/products/cart/item/:itemId
   */
  const removeCartItem = async (itemId) => {
    try {
      if (!token) return null;

      // --- FRONTEND MOCK ---
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("تم إزالة المنتج (محاكاة)");
      await getCart(); // Refresh mock cart
      return { success: true };
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.delete(
        `${backendUrl}/api/products/cart/item/${itemId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("تم إزالة المنتج من السلة");
        await getCart();
        return response.data;
      }
      */
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("فشل في إزالة المنتج");
      return null;
    }
  };

  /**
   * Clear all items from the cart.
   * TODO (Backend Developer): Replace mock logic with a real API call to DELETE /api/products/cart/clear
   */
  const clearCart = async () => {
    try {
      if (!token) return null;

      // --- FRONTEND MOCK ---
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("تم تفريغ السلة (محاكاة)");
      setCart(null);
      return { success: true };
      // --- END MOCK ---
      /*
      const response = await axios.delete(
        `${backendUrl}/api/products/cart/clear`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("تم تفريغ السلة");
        setCart(null);
        return response.data;
      }
      */
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("فشل في تفريغ السلة");
      return null;
    }
  };

  // --- ORDER API ---

  /**
   * Create a new order from the cart.
   * TODO (Backend Developer): Replace mock logic with a real API call to POST /api/products/order/create
   * This should handle payment gateway integration.
   */
  const createOrder = async (orderData) => {
    try {
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً");
        return null;
      }

      setIsLoading(true);

      // --- FRONTEND MOCK ---
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("تم إنشاء الطلب بنجاح (محاكاة)");
      await clearCart();
      return { success: true };
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.post(
        `${backendUrl}/api/products/order/create`,
        orderData,
        { headers: { token } }
      );

      console.log("Order creation response:", response.data);

      if (response.data.success) {
        if (response.data.paymentUrl) {
          // Open payment window
          const paymentWindow = window.open(
            response.data.paymentUrl,
            "_blank",
            "width=800,height=600"
          );

          // Start polling for order status
          startOrderPolling(response.data.order._id, paymentWindow);
        } else {
          toast.success("تم إنشاء الطلب بنجاح");
        }

        // Clear cart
        await clearCart();
        return response.data;
      } else {
        toast.error(response.data.message);
        return null;
      }
      */
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.message || "فشل في إنشاء الطلب");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get all orders for the current user.
   * TODO (Backend Developer): Replace mock logic with a real API call to GET /api/products/orders/my-orders
   */
  const getUserOrders = async () => {
    try {
      if (!token) return [];

      // --- FRONTEND MOCK ---
      // Returning an empty array for now.
      // You can populate this with mock order data for testing.
      setOrders([]);
      return [];
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.get(
        `${backendUrl}/api/products/orders/my-orders`,
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
        return response.data.orders;
      }
      return [];
      */
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  // Get order details
  /**
   * Get details for a single order.
   * TODO (Backend Developer): Replace mock logic with a real API call to GET /api/products/order/:orderId
   */
  const getOrderDetails = async (orderId) => {
    try {
      if (!token) return null;

      // --- FRONTEND MOCK ---
      // Returning null for now.
      return null;
      // --- END MOCK ---
      /*
      // --- BACKEND INTEGRATION ---
      const response = await axios.get(
        `${backendUrl}/api/products/order/${orderId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        return response.data.order;
      }
      return null;
      */
    } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
    }
  };

  // Poll for order status
  /**
   * Polls the backend to check for payment status after redirecting to a payment gateway.
   * TODO (Backend Developer): This logic is tightly coupled with the backend. Ensure the GET /api/products/order/:orderId endpoint is efficient.
   */
  const startOrderPolling = (orderId, paymentWindow) => {
    let pollCount = 0;
    const maxPolls = 30;

    const pollInterval = setInterval(async () => {
      pollCount++;

      if (pollCount >= maxPolls) {
        clearInterval(pollInterval);
        toast.info("انتهى وقت الانتظار، يرجى التحقق من صفحة الطلبات");
        return;
      }

      // Stop polling if payment window is closed
      if (paymentWindow && paymentWindow.closed) {
        console.log("Payment window closed - checking order...");
        clearInterval(pollInterval);

        // Check order status
        const order = await getOrderDetails(orderId);
        if (order && order.paymentStatus === "paid") {
          toast.success("✅ تم الدفع بنجاح! سيتم تجهيز طلبك قريباً");
        }
        return;
      }

      // Check order status
      try {
        const order = await getOrderDetails(orderId);
        if (order && order.paymentStatus === "paid") {
          clearInterval(pollInterval);

          if (paymentWindow && !paymentWindow.closed) {
            paymentWindow.close();
          }

          toast.success("✅ تم الدفع بنجاح! سيتم تجهيز طلبك قريباً");
        }
      } catch (error) {
        console.error("Order polling error:", error);
      }
    }, 5000);
  };

  // --- DERIVED STATE & HELPERS ---
  // Calculate discount percentage
  const calculateDiscountPercentage = (price, discountPrice) => {
    if (!discountPrice || !price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  // Check if product is in cart
  const isProductInCart = (productId) => {
    if (!cart || !cart.items) return false;
    return cart.items.some((item) => item.product._id === productId);
  };

  // Get cart quantity for product
  const getCartQuantity = (productId) => {
    if (!cart || !cart.items) return 0;
    const item = cart.items.find((item) => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  return (
    // --- PROVIDER VALUE ---
    <ProductContext.Provider
      value={{
        products,
        featuredProducts,
        categories,
        currentProduct,
        cart,
        orders,
        isLoading,

        formatPrice,
        calculateDiscountPercentage,
        isProductInCart,
        getCartQuantity,

        getAllProducts,
        getProductDetails,
        getFeaturedProducts,
        getCategories,
        addToCart,
        getCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        createOrder,
        getUserOrders,
        getOrderDetails,
        startOrderPolling,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
