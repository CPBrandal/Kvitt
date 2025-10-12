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
  LoadingReceipts: { en: "Loading receipts...", nb: "Laster kvitteringer..." },
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
  Receipt: { en: "Receipt", nb: "Kvittering" },
  DeleteReceipt: { en: "Delete Receipt", nb: "Slett kvittering" },
  DeleteReceiptConfirm: {
    en: "Are you sure you want to delete the receipt from",
    nb: "Er du sikker på at du vil slette kvitteringen fra",
  },
  Cancel: { en: "Cancel", nb: "Avbryt" },
  Delete: { en: "Delete", nb: "Slett" },
  SuccessDeleteReceipt: {
    en: "Receipt deleted successfully",
    nb: "Kvittering slettet",
  },
  FailureDeleteReceipt: {
    en: "Failed to delete receipt",
    nb: "Kunne ikke slette kvittering",
  },
  UnknownStore: { en: "Unknown Store", nb: "Ukjent butikk" },
  Item: { en: "Item", nb: "Vare" },
  Items: { en: "Items", nb: "Varer" },
  VAT: { en: "VAT", nb: "MVA" },
  NoReceipts: { en: "No receipts found", nb: "Ingen kvitteringer funnet" },
  ScanYourFirstReceipt: {
    en: "Scan your first receipt from the home screen",
    nb: "Skann din første kvittering fra hjem-skjermen",
  },
  ReceiptNotFound: {
    en: "Receipt not found",
    nb: "Kunne ikke finne kvittering",
  },
  ReceiptsDetails: { en: "Receipt Details", nb: "Kvitteringsdetaljer" },
  Store: { en: "Store", nb: "Butikk" },
  Date: { en: "Date", nb: "Dato" },
  Qty: { en: "Qty", nb: "Ant" },
  ExportToPDF: { en: "Export to PDF", nb: "Eksporter som PDF" },
  LogoutConfirm: { en: "Logged out", nb: "Logget ut" },
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
