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

 const tabBase = "flex-1 py-3 text-sm font-medium transition-colors";
 const tabActive = "bg-purple-600 text-white dark:bg-purple-500 dark:text-gray-100 midnight:bg-purple-700 ";
 const tabInactive =
 "bg-[#111111] text-gray-400 hover:bg-gray-800 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 midnight:hover:bg-gray-800";

 return (
 <div data-scrollable className="flex w-full shadow-sm pb-4 dark:bg-slate-900 ">
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
 className="w-12 flex items-center justify-center bg-gray-400 hover:cursor-pointer text-white text-sm font-medium hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600 midnight:bg-gray-600 midnight:hover:bg-gray-700 transition-colors"
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
 className="w-12 flex items-center justify-center bg-purple-500 hover:cursor-pointer text-white text-sm font-medium hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 midnight:bg-purple-800 transition-colors"
 >
 <RefreshCcw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
 </button>

 </div>
 );
}
