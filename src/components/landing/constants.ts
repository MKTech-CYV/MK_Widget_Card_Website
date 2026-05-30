import { GITHUB_URL as SOURCE_REPOSITORY_URL } from "@/lib/seo";

export { CONTACT_EMAIL, CREATOR_URL, GITHUB_URL, TWITTER_URL } from "@/lib/seo";

export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.mktech.widgetcard";
export const APP_STORE_URL = "https://apps.apple.com/us/app/mk-widget-card-qr-ng%C3%A2n-h%C3%A0ng/id6768935113";
export const GITHUB_REPO_URL = SOURCE_REPOSITORY_URL;

export const CLONE_COMMAND = `git clone ${GITHUB_REPO_URL}.git
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
