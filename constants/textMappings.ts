// translations.ts
const translations = {
  WelcomeBack: { en: "Welcome Back", nb: "Velkommen tilbake" },
  Email: { en: "Email", nb: "E-post" },
  Password: { en: "Password", nb: "Passord" },
  Login: { en: "Login", nb: "Logg inn" },
  LoggingIn: { en: "Logging in...", nb: "Logger inn..." },
  DontHaveAccount: {
    en: "Don't have an account? Sign up",
    nb: "Har du ikke en konto enda? Registrer deg",
  },
  Loading: { en: "Loading...", nb: "Laster..." },
  CameraPermissionAlert: {
    en: "Sorry, we need camera permissions to make this work!",
    nb: "Beklager, vi trenger tilgang til kameraet for at denned funksjonaliteten skal fungere",
  },
  GalleryPermissionAlert: {
    en: "Sorry, we need photo library permissions!",
    nb: "Beklager, vi trenger tilgang til kamerarull for at denne funksjonaliteten skal fungere",
  },
  Hello: {
    en: "Hello",
    nb: "Hei",
  },
  LogOut: {
    en: "Logout",
    nb: "Logg ut",
  },
  TakePicture: {
    en: "Take photo",
    nb: "Ta bilde",
  },
  UploadFromGallery: {
    en: "Upload image ",
    nb: "Last opp bilde",
  },
  Home: { en: "Home", nb: "Hjem" },
  MyReceits: { en: "My receipts", nb: "Mine kvitteringer" },
  MyProfile: { en: "My profile", nb: "Min profil" },
  Profile: { en: "Profile", nb: "Profil" },
  NoAccount: {
    en: "Don't have an account? Sign up",
    nb: "Har du ikke en konto? Registrer deg",
  },
};

type Language = "en" | "nb";
type TranslationKey = keyof typeof translations;

let currentLanguage: Language = "nb";

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
};

export const translate = (key: TranslationKey): string => {
  return translations[key]?.[currentLanguage] || key;
};

export default translations;
