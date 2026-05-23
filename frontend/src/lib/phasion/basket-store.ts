"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ItemResponse } from "./types"

export interface BasketLine {
  item: ItemResponse
  qty: number
  note?: string
}

interface BasketState {
  lines: BasketLine[]
  isOpen: boolean
  openBasket: () => void
  closeBasket: () => void
  addItem: (item: ItemResponse, qty?: number) => void
  removeItem: (itemId: string) => void
  updateQty: (itemId: string, qty: number) => void
  clearBasket: () => void
  totalMinor: () => number
}

export const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      openBasket: () => set({ isOpen: true }),
      closeBasket: () => set({ isOpen: false }),
      addItem: (item, qty = 1) =>
        set((state) => {
          if (!item.in_stock) return state
          const existing = state.lines.find((line) => line.item.id === item.id)
          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((line) =>
                line.item.id === item.id
                  ? { ...line, qty: line.qty + qty }
                  : line
              ),
            }
          }
          return { isOpen: true, lines: [...state.lines, { item, qty }] }
        }),
      removeItem: (itemId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.item.id !== itemId),
        })),
      updateQty: (itemId, qty) => {
        if (qty <= 0) {
          get().removeItem(itemId)
          return
        }
        set((state) => ({
          lines: state.lines.map((line) =>
            line.item.id === itemId ? { ...line, qty } : line
          ),
        }))
      },
      clearBasket: () => set({ lines: [], isOpen: false }),
      totalMinor: () =>
        get().lines.reduce(
          (total, line) => total + line.item.price_minor * line.qty,
          0
        ),
    }),
    { name: "phasion-sense-basket" }
  )
)
