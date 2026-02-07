"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-black text-white px-4 py-2 rounded hover:bg-gray-800 ${className}`}
    >
      {children}
    </button>
  );
}