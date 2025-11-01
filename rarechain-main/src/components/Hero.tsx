"use client";
import React from "react";
import { LoginButton } from "./LoginButton";
import ChartWidget from "@/components/chart";

const Hero = () => {
  return (
    <section
      className="flex flex-col lg:flex-row justify-between items-center gap-4 w-full h-auto lg:h-screen"
      style={{ backgroundColor: "#fff9f9" }}
    >
      {/* Chart Section */}
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <div className="chart-wrapper">
          <ChartWidget />
        </div>
      </div>

      {/* Text Section */}
      <div className="flex flex-col justify-center gap-6 px-6 py-10 lg:px-20 lg:py-20 w-full lg:w-1/2">
        <h1 className="text-4xl lg:text-6xl font-semibold text-black font-sans">
          Acquire Nodes and Earn Rewards
        </h1>
        <p className="text-black text-base font-normal leading-7 tracking-tight">
          The Rare Chain Network allows you to purchase and operate Node Networks
          for a specified duration, earning rewards as commissions from your node.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <LoginButton />
        </div>
      </div>

      <style jsx>{`
        .chart-wrapper {
          width: 350px;
          height: 400px;
        }

        @media (min-width: 1024px) {
          .chart-wrapper {
            width: 800px;
            height: 600px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
