"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartLine, SelectedAddOn } from "@/types/menu";
import { computeCartCount, computeCartTotal, makeLineId } from "@/lib/cart";

const STORAGE_KEY = "azar-chicken-cart";

interface AddLineInput {
  kind: CartLine["kind"];
  refId: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  removedIngredients: string[];
  addOns: SelectedAddOn[];
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  total: number;
  addLine: (input: AddLineInput) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // One-time read of persisted cart on mount: localStorage isn't available
    // during SSR, so this can't be a lazy useState initializer without a
    // hydration mismatch.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore storage write failures (private mode, quota, etc.)
    }
  }, [lines, hydrated]);

  const addLine = useCallback((input: AddLineInput) => {
    const lineId = makeLineId(input.refId, input.removedIngredients, input.addOns);
    setLines((prev) => {
      const existing = prev.find((l) => l.lineId === lineId);
      if (existing) {
        return prev.map((l) =>
          l.lineId === lineId ? { ...l, quantity: l.quantity + input.quantity } : l
        );
      }
      return [...prev, { ...input, lineId }];
    });
    setIsDrawerOpen(true);

    fetch("/api/track/cart-add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: input.refId, kind: input.kind }),
      keepalive: true,
    }).catch(() => {
      // Analytics failing silently should never break adding to cart.
    });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => l.lineId !== lineId);
      return prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l));
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: computeCartCount(lines),
      total: computeCartTotal(lines),
      addLine,
      removeLine,
      setQuantity,
      clear,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
    }),
    [lines, addLine, removeLine, setQuantity, clear, isDrawerOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
