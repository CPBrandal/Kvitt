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
  Settings: { en: "Settings", nb: "Innstillinger" },
  GoBack: { en: "Go back", nb: "Gå tilbake" },
  Back: { en: "Back", nb: "Tilbake" },
  Language: { en: "Language", nb: "Språk" },
  DarkMode: { en: "Dark Mode", nb: "Mørkt tema" },
  LightMode: { en: "Light Mode", nb: "Lyst tema" },
  Receipts: { en: "Receipts", nb: "Kvitteringer" },
  ProcessingReceipt: {
    en: "Processing receipt...",
    nb: "Behandler kvittering...",
  },
  ThisMightTakeFewSeconds: {
    en: "This might take a few seconds",
    nb: "Dette kan ta noen sekunder",
  },
};

export type Language = "en" | "nb";
export type TranslationKey = keyof typeof translations;

export const getTranslation = (
  key: TranslationKey,
  language: Language
): string => {
  return translations[key]?.[language] || key;
};

export const translate = (key: TranslationKey): string => {
  return translations[key]?.["en"] || key;
};

export default translations;
