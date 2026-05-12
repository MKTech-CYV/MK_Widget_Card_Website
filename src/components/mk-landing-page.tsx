"use client";

import { MotionConfig } from "framer-motion";
import { Header } from "./landing/Header";
import { Hero } from "./landing/Hero";
import { Marquee } from "./landing/Marquee";
import { ProductSection } from "./landing/ProductSection";
import { GallerySection } from "./landing/GallerySection";
import { ModulesSection } from "./landing/ModulesSection";
import { WorkflowSection } from "./landing/WorkflowSection";
import { GuideSection } from "./landing/GuideSection";
import { CreatorSection } from "./landing/CreatorSection";
import { DownloadCTA } from "./landing/DownloadCTA";
import { Footer } from "./landing/Footer";

export function MkLandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-hidden bg-black text-zinc-100 selection:bg-cyan-300/20 selection:text-cyan-100">
        <div className="fixed inset-0 -z-10 bg-black" />
        <div className="fixed inset-0 -z-10 mk-grid-fade opacity-70" />
        <div className="fixed inset-x-0 top-0 -z-10 h-[520px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent)]" />

        <Header />

        <main>
          <Hero />
          <Marquee />
          <ProductSection />
          <GallerySection />
          <ModulesSection />
          <WorkflowSection />
          <GuideSection />
          <CreatorSection />
          <DownloadCTA />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
