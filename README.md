# Receipt Scanner

A React Native mobile app for scanning and managing receipts using OCR technology.

## Features

- Scan receipts using camera or photo library
- Extract text from receipts using Google Cloud Vision API
- Export receipts as PDFs
- Store receipts in Firebase
- User authentication with Firebase Auth
- Works on iOS and Android

## Tech Stack

- **React Native** with Expo
- **TypeScript**
- **Tailwind CSS** (NativeWind)
- **Firebase** (Authentication & Firestore)
- **Google Cloud Vision API** (OCR)

## Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- Firebase account
- Google Cloud account with Vision API enabled

## Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd receipt-scanner
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file:
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
GOOGLE_CLOUD_VISION_API_KEY=your_vision_api_key
```

4. Start the app
```bash
npx expo start
```

## Usage

1. Sign up or log in
2. Tap the camera button to scan a receipt
3. Review extracted text
4. Save or export as PDF

## License

MIT

## Images

<img width="585" height="1266" alt="IMG_8954" src="https://github.com/user-attachments/assets/2e84e011-170e-4e16-b260-5e4d1079e5aa" />


<img width="585" height="1266" alt="IMG_8956" src="https://github.com/user-attachments/assets/20ea51b1-2203-451e-b3a8-4629bf44ffcb" />


<img width="585" height="1266" alt="IMG_8957" src="https://github.com/user-attachments/assets/2bc04f06-e1ad-4fee-81ee-99a49c9504d2" />


<img width="585" height="1266" alt="IMG_8958" src="https://github.com/user-attachments/assets/aef718c3-5638-4bfa-8979-428491fa1be5" />


<img width="585" height="1266" alt="IMG_8960" src="https://github.com/user-attachments/assets/3846c38a-cbd1-4006-81a2-3fd0f7a9aa42" />
