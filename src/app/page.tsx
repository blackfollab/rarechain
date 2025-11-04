// import { Banner } from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import Features from "@/components/Features"
import CallToAction from "@/components/CallToAction"



export default function Home() {
  return (
  <div className="overflow-hidden">
    {/* <Banner /> */}
    <Navbar />
   <Hero/>
   <Process/>
   <Features/>
   <CallToAction/>
  </div>
  );
}

