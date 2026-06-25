"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Crown, X } from "lucide-react";

export default function PremiumEasterEgg() {
  const [showPricing, setShowPricing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPirateModal, setShowPirateModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lock scrolling when cinematic or modals are active
  useEffect(() => {
    if (isPlaying || showPricing || showPirateModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPlaying, showPricing, showPirateModal]);

  // Handle escape key specifically for the cinematic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPlaying) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    if (isPlaying) {
      window.addEventListener("keydown", handleKeyDown, true);
    }
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isPlaying]);

  const handlePlanClick = () => {
    setShowPricing(false);
    setIsPlaying(true);
    // Play video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.error("Playback failed", e));
    }
  };

  const handleVideoEnded = () => {
    // Start fade out sequence
    setIsPlaying(false);
    // Wait for the fade out animation (800ms) before showing pirate modal
    setTimeout(() => {
      setShowPirateModal(true);
    }, 800);
  };

  return (
    <>
      <button
        onClick={() => setShowPricing(true)}
        className="w-full mt-4 px-4 py-3 rounded-xl font-bold flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all border border-purple-500/50 group"
      >
        <Crown className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
        Go Premium
      </button>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0a0a0f]/90 border border-purple-500/30 backdrop-blur-md rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl shadow-purple-900/20 relative"
            >
              <button
                onClick={() => setShowPricing(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 text-center border-b border-gray-800/50">
                <div className="inline-flex items-center justify-center p-3 bg-purple-900/20 rounded-full mb-4">
                  <Crown className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Upgrade to AlmightyCC Premium</h2>
                <p className="text-gray-400 text-sm">Unlock exclusive features and prioritize your academic workflow.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
                {/* Monthly */}
                <div className="bg-[#111116] border border-gray-800 rounded-xl p-6 flex flex-col items-center hover:border-purple-500/50 transition-colors group cursor-pointer" onClick={handlePlanClick}>
                  <div className="text-gray-400 font-medium mb-4 uppercase tracking-wider text-sm">Monthly</div>
                  <div className="text-3xl font-bold text-white mb-6">₹149<span className="text-sm text-gray-500 font-normal">/mo</span></div>
                  <ul className="text-sm text-gray-400 space-y-3 mb-8 w-full">
                    <li className="flex items-center gap-2 text-purple-400">✓ <span className="text-gray-300">Advanced Analytics</span></li>
                    <li className="flex items-center gap-2 text-purple-400">✓ <span className="text-gray-300">Custom Themes</span></li>
                  </ul>
                  <button className="w-full py-2 rounded-lg bg-gray-800 text-white font-medium group-hover:bg-purple-600 transition-colors mt-auto">
                    Select Plan
                  </button>
                </div>

                {/* Yearly */}
                <div className="relative bg-gradient-to-b from-[#1a1025] to-[#111116] border border-purple-500 rounded-xl p-6 flex flex-col items-center shadow-lg shadow-purple-500/10 cursor-pointer" onClick={handlePlanClick}>
                  <div className="absolute top-0 transform -translate-y-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-purple-500/30">MOST POPULAR</div>
                  <div className="text-purple-400 font-medium mb-4 uppercase tracking-wider text-sm">Yearly</div>
                  <div className="text-3xl font-bold text-white mb-6">₹999<span className="text-sm text-gray-500 font-normal">/yr</span></div>
                  <ul className="text-sm text-gray-300 space-y-3 mb-8 w-full">
                    <li className="flex items-center gap-2 text-purple-400">✓ <span className="text-gray-100">All Monthly Features</span></li>
                    <li className="flex items-center gap-2 text-purple-400">✓ <span className="text-gray-100">Priority Support</span></li>
                    <li className="flex items-center gap-2 text-purple-400">✓ <span className="text-gray-100">Early Access</span></li>
                  </ul>
                  <button className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors mt-auto shadow-md shadow-purple-500/20">
                    Select Plan
                  </button>
                </div>

                {/* Lifetime */}
                <div className="bg-[#111116] border border-gray-800 rounded-xl p-6 flex flex-col items-center hover:border-purple-500/50 transition-colors group cursor-pointer" onClick={handlePlanClick}>
                  <div className="text-gray-400 font-medium mb-4 uppercase tracking-wider text-sm">Lifetime</div>
                  <div className="text-3xl font-bold text-white mb-6">₹2999<span className="text-sm text-gray-500 font-normal"> once</span></div>
                  <ul className="text-sm text-gray-400 space-y-3 mb-8 w-full">
                    <li className="flex items-center gap-2 text-purple-400">✓ <span className="text-gray-300">One-time payment</span></li>
                    <li className="flex items-center gap-2 text-purple-400">✓ <span className="text-gray-300">Forever access</span></li>
                  </ul>
                  <button className="w-full py-2 rounded-lg bg-gray-800 text-white font-medium group-hover:bg-purple-600 transition-colors mt-auto">
                    Select Plan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Overlay & Video */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-800 ease-in-out flex items-center justify-center bg-black ${isPlaying ? 'opacity-100 pointer-events-auto backdrop-blur-xl' : 'opacity-0 pointer-events-none'}`}
      >
        <div className={`absolute inset-0 shadow-[inset_0_0_150px_rgba(168,85,247,0.3)] transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
        <motion.div 
          animate={isPlaying ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, -2, 1, 0] } : {}} 
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full h-full relative"
        >
          <video
            ref={videoRef}
            src="/videos/pirate-premium.mp4"
            className="w-full h-full object-cover"
            playsInline
            onEnded={handleVideoEnded}
            onContextMenu={(e) => e.preventDefault()}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
          />
          {/* Invisible overlay over video to block all interactions (clicks, pauses) */}
          <div className="absolute inset-0 z-10 bg-transparent"></div>
        </motion.div>
      </div>

      {/* Pirate Membership Modal */}
      <AnimatePresence>
        {showPirateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-[#0a0a0f] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-purple-900/20 relative"
            >
              <div className="p-8 text-center space-y-4">
                <div className="text-6xl mb-6 animate-pulse">🏴‍☠️</div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Pirate Membership Activated</h2>
                
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                  <p>There is no Premium.</p>
                  <p>A pirate never charges his crew.</p>
                  <p className="text-purple-400 font-medium">AlmightyCC is, and always will be, completely free.</p>
                </div>

                <div className="bg-[#111116] border border-gray-800 rounded-xl p-5 mt-8 text-left space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price Paid:</span>
                    <span className="text-white font-mono font-bold text-base">₹0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Membership:</span>
                    <span className="text-purple-400 font-medium">Lifetime</span>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t border-gray-800 mt-2">
                    <span className="text-gray-500">Status:</span>
                    <span className="text-green-400 font-medium tracking-wide">Welcome aboard.</span>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <Button 
                    onClick={() => setShowPirateModal(false)}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                  >
                    Continue
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setShowPirateModal(false);
                      setIsPlaying(true);
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play().catch(e => console.error("Playback failed", e));
                      }
                    }}
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    Watch Again
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
