"use client";

import { Toaster as Sonner } from "sonner";
import "sonner/dist/styles.css";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-center"
      toastOptions={{
        style: {
          background: "#1F2A1F",
          color: "#ECE8DF",
          border: "1px solid #2E342F",
          borderRadius: "18px",
        },
      }}
    />
  );
}
