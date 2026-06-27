"use client";
import { useState } from "react";
import { LogOut, RefreshCcw, Settings } from "lucide-react";
import SettingsPage from "./SettingsPage";

export default function NavigationTabs({
 activeTab,
 setActiveTab,
 handleLogOutRequest,
 handleReloadRequest,
 currSemesterID,
 setCurrSemesterID,
 handleLogin,
 setIsReloading,
 username,
 password,
 setPassword,
 settings,
 setSettings
}) {
 const [isSpinning, setIsSpinning] = useState(false);
 const [showSettingsPage, setShowSettingsPage] = useState<boolean>(false);

 const handleReloadClick = async () => {
 setIsSpinning(true);
 await handleReloadRequest();
 setTimeout(() => setIsSpinning(false), 600);
 };

  const tabBase = "flex-1 py-3 text-sm font-medium transition-all duration-300 ease-out border-b-2";
  const tabActive = "bg-purple-900/10 text-white dark:bg-purple-500/10 dark:text-gray-100 border-purple-500 shadow-[inset_0_-2px_10px_-2px_rgba(168,85,247,0.3)]";
  const tabInactive =
  "bg-transparent text-gray-500 hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:bg-white/[0.02] dark:hover:bg-white/[0.02]";

  return (
  <div data-scrollable className="flex w-full border-b border-white/5 pb-0 bg-[#09090b] pt-2 px-2 gap-2">
 {showSettingsPage && (
 <SettingsPage
 handleClose={() => setShowSettingsPage(false)}
 currSemesterID={currSemesterID}
 setCurrSemesterID={setCurrSemesterID}
 handleLogin={handleLogin}
 setIsReloading={setIsReloading}
 handleLogOutRequest={handleLogOutRequest}
 password={password}
 username={username}
 setPassword={setPassword}
 decimalValues={settings.decimalValues}
 setDecimalValues={(val: boolean) => {
 setSettings(prev => ({ ...prev, decimalValues: val }))
 localStorage.setItem("settings", JSON.stringify({ ...settings, decimalValues: val }))
 }
 }
 loadingScreen={settings.loadingScreen}
 setLoadingScreen={(val: boolean) => {
 setSettings(prev => ({ ...prev, loadingScreen: val }))
 localStorage.setItem("settings", JSON.stringify({ ...settings, loadingScreen: val }))
 }
 }
 />
 )}
  <button
  onClick={() => setShowSettingsPage(true)}
  className="w-12 mb-2 flex items-center justify-center bg-transparent border border-white/5 rounded-lg hover:cursor-pointer text-gray-400 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/5 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300"
  >
  <Settings className="w-5 h-5" />
  </button>

 <button
 onClick={() => setActiveTab("attendance")}
 className={`${tabBase} ${activeTab === "attendance" ? tabActive : tabInactive
 }`}
 >
 Attendance
 </button>

 <button
 onClick={() => setActiveTab("exams")}
 className={`${tabBase} ${activeTab === "exams" ? tabActive : tabInactive
 }`}
 >
 Exams
 </button>

 <button
 onClick={() => setActiveTab("hostel")}
 className={`${tabBase} ${activeTab === "hostel" ? tabActive : tabInactive
 }`}
 >
 Hostel
 </button>

  <button
  onClick={handleReloadClick}
  className="w-12 mb-2 flex items-center justify-center bg-transparent border border-white/5 rounded-lg hover:cursor-pointer text-gray-400 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/5 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 ml-2"
  >
  <RefreshCcw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
  </button>

  </div>
 );
}
