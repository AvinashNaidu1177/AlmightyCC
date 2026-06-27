'use client'

import { useState, useEffect } from 'react'
import { Switch } from "@/components/ui/switch"
import { API_BASE } from '@/components/custom/Main'

function urlBase64ToUint8Array(base64String: string) {
 const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
 const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
 const rawData = window.atob(base64)
 return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export default function PushNotificationManager() {
 const [isSupported, setIsSupported] = useState(false)
 const [subscription, setSubscription] = useState<PushSubscription | null>(null)
 const [vitolEnabled, setVitolEnabled] = useState(false)
 const [moodleEnabled, setMoodleEnabled] = useState(false)
 const [fetchError, setFetchError] = useState<string | null>(null)

 const IDs = localStorage.getItem("IDs") || ""
 const UserID = IDs ? JSON.parse(IDs).VtopUsername : null

 useEffect(() => {
 if (!UserID) return;

 fetch(`${API_BASE}/api/notifications/status?UserID=${UserID}`)
 .then(res => res.json())
 .then(data => {
 setVitolEnabled(!!data.vitol);
 setMoodleEnabled(!!data.moodle);
 })
 .catch(() => {
 setVitolEnabled(false);
 setMoodleEnabled(false);
 });
 }, [UserID]);

 useEffect(() => {
 if ('serviceWorker' in navigator && 'PushManager' in window) {
 setIsSupported(true)
 registerServiceWorker()
 }
 }, [])

 async function registerServiceWorker() {
 const registration = await navigator.serviceWorker.register('/sw.js')
 const sub = await registration.pushManager.getSubscription()
 setSubscription(sub)
 }

 async function subscribeToPush() {
 const permission = await Notification.requestPermission()
 if (permission !== 'granted') return

 const registration = await navigator.serviceWorker.ready
 const sub = await registration.pushManager.subscribe({
 userVisibleOnly: true,
 applicationServerKey: urlBase64ToUint8Array(
 process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
 ),
 })

 setSubscription(sub)

 await fetch(`${API_BASE}/api/notifications/subscribe`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 UserID,
 subscription: JSON.parse(JSON.stringify(sub)),
 }),
 })
 }

 async function unsubscribeFromPush() {
 if (!subscription) return

 await subscription.unsubscribe()

 await fetch(`${API_BASE}/api/notifications/unsubscribe`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 UserID,
 endpoint: subscription.endpoint,
 }),
 })

 setSubscription(null)
 }

 if (!isSupported) {
 return <p>Push notifications are not supported in this browser.</p>
 }

 async function updateSource(source: 'vitol' | 'moodle', enabled: boolean) {
 const data =
 enabled
 ? JSON.parse(localStorage.getItem(`${source}Data`) || '[]')
 : [];

 await fetch(`${API_BASE}/api/notifications/config`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 UserID,
 source,
 enabled,
 data,
 }),
 });
 }

 return (
 <div className="w-full flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <div className="flex flex-col">
 <p className="text-lg font-semibold text-gray-300 dark:text-gray-200 ">
 Push Notifications <span className="text-xs text-muted-foreground">(Early Testing)</span>
 </p>
 </div>

 <Switch
 checked={!!subscription}
 onCheckedChange={(checked) => {
 checked ? subscribeToPush() : unsubscribeFromPush()
 }}
 />
 </div>

  {subscription && (
    <div className="mt-3 flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center p-4 text-center rounded-lg bg-[#111111] dark:bg-slate-800 midnight:bg-gray-900">
        <p className="text-gray-400 font-medium text-sm mb-1">Configuration temporarily disabled.</p>
        <p className="text-gray-500 text-xs">This feature is not yet supported by the current backend. (Coming Soon)</p>
      </div>
    </div>
  )}
  </div >
 )
}
