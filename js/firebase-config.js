// ══════════════════════════════════════════════════════════════════
//  CornGrits.in — Firebase Configuration
//  INSTRUCTIONS: Replace the placeholder values below with your
//  actual Firebase project config keys.
//  See: https://console.firebase.google.com
// ══════════════════════════════════════════════════════════════════

const FIREBASE_CONFIG = {
  apiKey:            "PASTE_YOUR_apiKey_HERE",
  authDomain:        "PASTE_YOUR_authDomain_HERE",
  projectId:         "PASTE_YOUR_projectId_HERE",
  storageBucket:     "PASTE_YOUR_storageBucket_HERE",
  messagingSenderId: "PASTE_YOUR_messagingSenderId_HERE",
  appId:             "PASTE_YOUR_appId_HERE"
};

// ── DO NOT EDIT BELOW THIS LINE ──────────────────────────────────
const CG_FIREBASE_READY = (
  FIREBASE_CONFIG.apiKey !== 'PASTE_YOUR_apiKey_HERE' &&
  FIREBASE_CONFIG.projectId !== 'PASTE_YOUR_projectId_HERE'
);
