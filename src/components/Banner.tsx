"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import Link from "next/link";

export const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      animate={{
        backgroundPositionX: "100%",
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      className="relative py-3 text-center text-white animate-gradient-move bg-black"
    >
      <div className="container">
        <p className="font-medium">
          <span className="hidden sm:inline">
            EXPLORE RARECHAIN V3 WHITEPAPER RFC -{" "}
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-1 underline underline-offset-4 cursor-pointer"
          >
            <span>JOIN DISCUSSION</span>
          </Link>
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 bg-transparent "
        aria-label="Close Banner"
      >
       <MdClose/>
      </button>
    </motion.div>
  );
};
