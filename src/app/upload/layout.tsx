import { brandingConfig } from "../../lib/branding.config";

export const metadata = {
 title: `Upload Files - ${brandingConfig.appName}`,
 description: "Upload Now, access later",
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
 return (
 <div>
 {children}
 </div>
 );
}