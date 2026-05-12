export const GITHUB_URL = "https://github.com/MKTech-CYV/MK_Widget_Card";
export const GOOGLE_PLAY_URL = ""; 
export const APP_STORE_URL = "";   
export const CREATOR_URL = "https://tranminhkhoi.dev";
export const CONTACT_EMAIL = "contact@tranminhkhoi.dev";

export const CLONE_COMMAND = `git clone ${GITHUB_URL}.git
cd MK_Widget_Card
npm install`;

export const IOS_COMMAND = `npx expo prebuild --platform ios
npx expo run:ios`;

export const ANDROID_COMMAND = `npx expo prebuild --platform android
npx expo run:android`;

export const MARQUEE_ITEMS = [
  "MK Widget Card",
  "eCard",
  "QR Code",
  "Widget",
  "Privacy",
  "Local-first",
  "Digital Identity",
  "Networking",
];

export const PREREQUISITES = [
  { item: "Node.js", desc: "Version 18 or higher." },
  { item: "Git", desc: "To clone source code from GitHub." },
  { item: "CocoaPods", desc: "Required for iOS build (run 'pod --version')." },
  { item: "Android SDK", desc: "Required for Android build." },
];
