"use client";

import { createContext, useEffect, useState } from "react";

import { defaultProducts } from "../constants/Products";

const STORAGE_KEY = "products";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(defaultProducts);

  useEffect(() => {
    const storedProducts = localStorage.getItem(STORAGE_KEY);
    if (!storedProducts) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
      return;
    }

    try {
      const parsed = JSON.parse(storedProducts);
      if (Array.isArray(parsed)) {
        setProducts(parsed);
      }
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (payload) => {
    const product = {
      id: Date.now(),
      name: payload.name.trim(),
      category: payload.category.trim().toLowerCase(),
      price: Number(payload.price),
      image: payload.image.trim() || "/product1.png",
      description: payload.description.trim(),
    };

    setProducts((prev) => [product, ...prev]);
    return product;
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
}
