"use client";

// 🚀 GitHub Actions Auto-Deployment Test - System Active!

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Crown, Share2, Zap, Settings, Star, Calendar, Copy, Check, History, Trash2, MessageCircle, Mail, Twitter, Facebook, ThumbsUp, ThumbsDown, TrendingUp, Camera, FileText, MapPin, Cloud, MessageSquare, TestTube, Share } from "lucide-react";
import { BetaFeedbackForm } from "./BetaFeedbackForm";

export default function ExcuseGeneratorApp() {
  // Safe localStorage wrapper to handle security restrictions
  const safeLocalStorage = {
    isAvailable: () => {
      try {
        const test = '__localStorage_test__';
        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    },
    getItem: (key: string) => {
      if (!safeLocalStorage.isAvailable()) {
        return null;
      }
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.warn(`localStorage.getItem failed for key "${key}":`, error);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      if (!safeLocalStorage.isAvailable()) {
        return;
      }
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.warn(`localStorage.setItem failed for key "${key}":`, error);
      }
    }
  };

  const [situation, setSituation] = useState("work");
  const [tone, setTone] = useState("funny");
  const [excuse, setExcuse] = useState("");
  const [showPremium, setShowPremium] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [onboarding, setOnboarding] = useState(() => {
    // Check URL parameter for forcing onboarding
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('onboard') === 'true') {
        return true;
      }
    }
    return true; // Default to true for first-time users
  });
  const [showSettings, setShowSettings] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dailyExcuse, setDailyExcuse] = useState("");
  const [copied, setCopied] = useState(false);
  const [excuseHistory, setExcuseHistory] = useState<{excuse: string, timestamp: Date, situation: string, tone: string}[]>([]);
  const [excuseRatings, setExcuseRatings] = useState<{[excuse: string]: {rating: 'up' | 'down', timestamp: Date}}>({});
  const [currentExcuseRated, setCurrentExcuseRated] = useState<'up' | 'down' | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showProofGenerator, setShowProofGenerator] = useState(false);
  const [proofFormat, setProofFormat] = useState<'document' | 'sms' | 'email'>('document');
  const [userEmailAddress, setUserEmailAddress] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [generatedProof, setGeneratedProof] = useState<{type: string, content: string, image?: string} | null>(null);
  
  // Patient information for medical certificates
  const [showPatientInfoDialog, setShowPatientInfoDialog] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientDateOfBirth, setPatientDateOfBirth] = useState('');
  
  // New states for custom features
  const [customExcuses, setCustomExcuses] = useState<{[key: string]: {[key: string]: string[]}}>({}); 
  const [showCustomExcuse, setShowCustomExcuse] = useState(false);
  const [newCustomExcuse, setNewCustomExcuse] = useState("");
  const [customSituation, setCustomSituation] = useState("work");
  const [customTone, setCustomTone] = useState("funny");
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateValues, setTemplateValues] = useState<{[key: string]: string}>({});
  const [showExport, setShowExport] = useState(false);
  
  // Loading and animation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [animateExcuse, setAnimateExcuse] = useState(false);
  
  // Location and live data states
  const [userLocation, setUserLocation] = useState<{
    lat: number, 
    lon: number, 
    city?: string,
    state?: string,
    country?: string,
    address?: string,
    neighborhood?: string
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'denied' | 'granted' | 'pending'>('pending');
  const [liveWeatherData, setLiveWeatherData] = useState<any>(null);
  const [liveTrafficData, setLiveTrafficData] = useState<any>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  
  // Analytics and tracking states
  const [usageStats, setUsageStats] = useState<{
    situationCounts: {[key: string]: number};
    toneCounts: {[key: string]: number};
    combinationCounts: {[key: string]: number};
    totalGenerations: number;
  }>({
    situationCounts: {},
    toneCounts: {},
    combinationCounts: {},
    totalGenerations: 0
  });
  
  const [excuseAnalytics, setExcuseAnalytics] = useState<{
    [excuse: string]: {
      timesGenerated: number;
      timesRated: number;
      positiveRatings: number;
      negativeRatings: number;
      averageRating: number;
      effectiveness: number;
      lastUsed: Date;
      situation: string;
      tone: string;
    }
  }>({});
  
  const [abTestGroups, setAbTestGroups] = useState<{
    [testId: string]: {
      variantA: string[];
      variantB: string[];
      userGroup: 'A' | 'B';
      results: {
        A: { generations: number; ratings: number; positiveRatings: number };
        B: { generations: number; ratings: number; positiveRatings: number };
      };
    }
  }>({});
  
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Language selection states
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ja'>('en');
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  
  // Beta feedback form state
  const [showBetaFeedback, setShowBetaFeedback] = useState(false);
  
  // Ad system states
  const [showAd, setShowAd] = useState(false);
  const [adType, setAdType] = useState<'banner' | 'interstitial'>('banner');
  const [adDismissed, setAdDismissed] = useState(false);
  const [excusesSinceAd, setExcusesSinceAd] = useState(0);
  
  // Subscription management states
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'premium'>('free');
  const [showSubscription, setShowSubscription] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<{
    tier: 'free' | 'pro' | 'premium';
    startDate: Date;
    expiryDate?: Date;
    features: {
      dailyExcuseLimit: number;
      customExcusesLimit: number;
      templatesLimit: number;
      proofGeneration: boolean;
      analytics: boolean;
      prioritySupport: boolean;
      exportFeatures: boolean;
      advancedSettings: boolean;
    };
    usage: {
      excusesToday: number;
      customExcusesCreated: number;
      templatesUsed: number;
      lastReset: Date;
    };
  }>({
    tier: 'free',
    startDate: new Date(),
    features: {
      dailyExcuseLimit: 10,
      customExcusesLimit: 5,
      templatesLimit: 2,
      proofGeneration: false,
      analytics: false,
      prioritySupport: false,
      exportFeatures: false,
      advancedSettings: false,
    },
    usage: {
      excusesToday: 0,
      customExcusesCreated: 0,
      templatesUsed: 0,
      lastReset: new Date(),
    }
  });

  const subscriptionTiers = {
    free: {
      name: "Free",
      price: "$0",
      priceMonthly: 0,
      features: {
        dailyExcuseLimit: 10,
        customExcusesLimit: 5,
        templatesLimit: 2,
        proofGeneration: false,
        analytics: false,
        prioritySupport: false,
        exportFeatures: false,
        advancedSettings: false,
      },
      featureList: [
        "10 excuses per day",
        "5 custom excuses",
        "2 excuse templates",
        "Basic situations & tones",
        "Community support",
        "⚠️ Contains ads"
      ]
    },
    pro: {
      name: "Pro",
      price: "$4.99",
      priceMonthly: 4.99,
      features: {
        dailyExcuseLimit: 50,
        customExcusesLimit: 25,
        templatesLimit: 10,
        proofGeneration: true,
        analytics: true,
        prioritySupport: false,
        exportFeatures: true,
        advancedSettings: true,
      },
      featureList: [
        "50 excuses per day",
        "25 custom excuses",
        "10 excuse templates",
        "Professional proof generator",
        "Usage analytics & insights",
        "Export favorites",
        "Advanced customization",
        "Email support",
        "✅ Ad-free experience"
      ]
    },
    premium: {
      name: "Premium",
      price: "$9.99",
      priceMonthly: 9.99,
      features: {
        dailyExcuseLimit: -1, // Unlimited
        customExcusesLimit: -1, // Unlimited
        templatesLimit: -1, // Unlimited
        proofGeneration: true,
        analytics: true,
        prioritySupport: true,
        exportFeatures: true,
        advancedSettings: true,
      },
      featureList: [
        "Unlimited excuses",
        "Unlimited custom excuses",
        "Unlimited templates",
        "Professional proof generator",
        "Advanced analytics & A/B testing",
        "Priority customer support",
        "Export in multiple formats",
        "Early access to new features",
        "AI-powered excuse optimization",
        "✅ Ad-free experience"
      ]
    }
  };

  const availableLanguages = {
    en: { name: "English", flag: "🇺🇸", nativeName: "English" },
    es: { name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
    fr: { name: "French", flag: "🇫🇷", nativeName: "Français" },
    de: { name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
    it: { name: "Italian", flag: "🇮🇹", nativeName: "Italiano" },
    pt: { name: "Portuguese", flag: "🇵🇹", nativeName: "Português" },
    ru: { name: "Russian", flag: "🇷🇺", nativeName: "Русский" },
    ja: { name: "Japanese", flag: "🇯🇵", nativeName: "日本語" }
  };

  // Translations for the entire app interface
  const translations = {
    en: {
      // App title
      appTitle: "Excuses, Excuses!",
      appSubtitle: "The Professional Excuse Generator",
      
      // Main interface
      situation: "Situation",
      situationPlaceholder: "Choose a situation",
      tone: "Tone",
      tonePlaceholder: "Choose a tone",
      language: "Language",
      languagePlaceholder: "Choose language",
      
      // Situations
      situations: {
        work: "💼 Work",
        school: "🎓 School", 
        date: "💕 Date",
        family: "👨‍👩‍👧‍👦 Family",
        social: "🎉 Social",
        exercise: "💪 Exercise",
        weather: "🌦️ Weather",
        traffic: "🚗 Traffic", 
        medical: "🏥 Medical",
        emergency: "🚨 Emergency (Premium)",
        travel: "✈️ Travel (Premium)"
      },
      
      // Tones
      tones: {
        funny: "😂 Funny",
        professional: "💼 Professional",
        believable: "✅ Believable", 
        dramatic: "🎭 Dramatic"
      },
      
      // Buttons
      generateExcuse: "Generate Excuse",
      generating: "Generating...",
      copyToClipboard: "Copy to Clipboard",
      saveFavorite: "Save Favorite",
      share: "Share",
      
      // Rating
      good: "Good",
      bad: "Bad", 
      thanks: "Thanks!",
      noted: "Noted!",
      rateThis: "Rate this excuse:",
      
      // Proof generators
      weather: "Weather",
      traffic: "Traffic", 
      medical: "Medical",
      
      // Loading messages
      generatingExcuse: "Generating your excuse...",
      craftingStory: "Crafting the perfect story",
      
      // Feature buttons
      custom: "Custom",
      templates: "Templates", 
      analytics: "Analytics",
      export: "Export",
      settings: "Settings",
      
      // Subscription
      subscriptionTitle: "Choose Your Plan",
      freePlan: "Free",
      proPlan: "Pro",
      premiumPlan: "Premium",
      currentPlan: "Current Plan",
      upgradePlan: "Upgrade Plan",
      
      // Daily widget
      dailyExcuseTitle: "Daily Excuse",
      copy: "Copy",
      copied: "Copied!",
      copyProof: "Copy Proof",
      
      // Main instructions  
      pickInstructions: "Pick a situation and tone, then let the magic happen!",
      
      // Stats
      successRate: "success rate",
      
      // Accessibility
      generateAriaLabel: "Generate a new excuse",
      generateAriaDescription: "Click to generate a new excuse based on your selected situation and tone",
      copyAriaLabel: "Copy excuse to clipboard",
      favoriteAriaLabel: "Save this excuse to favorites",
      
      // Proof generation
      issued: "Issued",
      area: "County and surrounding areas",
      location: "Location",
      reported: "REPORTED",
      clearance: "EST. CLEARANCE",
      delay: "Average delay",
      minutes: "minutes",
      medicalServices: "COMPREHENSIVE MEDICAL SERVICES",
      patientInfo: "PATIENT INFORMATION",
      patient: "Patient",
      serviceDate: "Date of Service",
      time: "Time",
      physician: "ATTENDING PHYSICIAN",
      license: "Medical License",
      returnDate: "Patient may return to normal activities on",
      date: "Date",
      day: "day",
      days: "days",
      // Additional proof labels
      office: "Office",
      alertId: "Alert ID",
      incidentId: "Incident ID", 
      documentId: "Document #",
      north: "North",
      south: "South",
      exit: "Exit",
      affectedArea: "AFFECTED AREA",
      
      // Onboarding
      welcomeTitle: "🎉 Welcome to Excuses, Excuses!",
      welcomeDescription: "The ultimate excuse generator for any situation! Choose your language above, then pick your preferred excuse style to get started.",
      chooseLanguageLabel: "🌍 Choose Your Language",
      chooseStyleTitle: "Choose Your Style",
      funnyStyle: "😂 Funny & Hilarious",
      professionalStyle: "💼 Professional & Polished",
      believableStyle: "✅ Believable & Realistic", 
      dramaticStyle: "🎭 Dramatic & Over-the-Top"
    },
    es: {
      // App title
      appTitle: "¡Excusas, Excusas!",
      appSubtitle: "El Generador Profesional de Excusas",
      
      // Main interface
      situation: "Situación",
      situationPlaceholder: "Elige una situación",
      tone: "Tono", 
      tonePlaceholder: "Elige un tono",
      language: "Idioma",
      languagePlaceholder: "Elige idioma",
      
      // Situations
      situations: {
        work: "💼 Trabajo",
        school: "🎓 Escuela",
        date: "💕 Cita",
        family: "👨‍👩‍👧‍👦 Familia", 
        social: "🎉 Social",
        exercise: "💪 Ejercicio",
        weather: "🌦️ Clima",
        traffic: "🚗 Tráfico", 
        medical: "🏥 Médico",
        emergency: "🚨 Emergencia (Premium)",
        travel: "✈️ Viaje (Premium)"
      },
      
      // Tones
      tones: {
        funny: "😂 Divertido",
        professional: "💼 Profesional",
        believable: "✅ Creíble",
        dramatic: "🎭 Dramático"
      },
      
      // Buttons
      generateExcuse: "Generar Excusa",
      generating: "Generando...",
      copyToClipboard: "Copiar al Portapapeles", 
      copied: "¡Copiado!",
      saveFavorite: "Guardar Favorito",
      share: "Compartir",
      
      // Rating
      good: "Bueno",
      bad: "Malo", 
      thanks: "¡Gracias!",
      noted: "¡Notado!",
      rateThis: "Califica esta excusa:",
      
      // Proof generators
      weather: "Clima",
      traffic: "Tráfico", 
      medical: "Médico",
      
      // Loading messages
      generatingExcuse: "Generando tu excusa...",
      craftingStory: "Creando la historia perfecta",
      
      // Feature buttons
      custom: "Personalizar",
      templates: "Plantillas",
      analytics: "Análisis", 
      export: "Exportar",
      settings: "Configuración",
      
      // Subscription
      subscriptionTitle: "Elige Tu Plan",
      freePlan: "Gratis",
      proPlan: "Pro", 
      premiumPlan: "Premium",
      currentPlan: "Plan Actual",
      upgradePlan: "Actualizar Plan",
      
      // Daily widget
      dailyExcuseTitle: "Excusa Diaria",
      copyProof: "Copiar Prueba",
      copy: "Copiar",
      
      // Main instructions
      pickInstructions: "Elige una situación y un tono, ¡y deja que ocurra la magia!",
      
      // Stats  
      successRate: "tasa de éxito",
      
      // Accessibility
      generateAriaLabel: "Generar nueva excusa",
      generateAriaDescription: "Haz clic para generar una nueva excusa basada en tu situación y tono seleccionados",
      copyAriaLabel: "Copiar excusa al portapapeles",
      favoriteAriaLabel: "Guardar esta excusa en favoritos",
      // Additional proof labels  
      office: "Oficina",
      alertId: "ID de Alerta",
      incidentId: "ID de Incidente",
      documentId: "Documento #",
      north: "Norte", 
      south: "Sur",
      exit: "Salida",
      affectedArea: "ÁREA AFECTADA",
      
      // Onboarding
      welcomeTitle: "🎉 ¡Bienvenido a Excusas, Excusas!",
      welcomeDescription: "¡El mejor generador de excusas para cualquier situación! Elige tu idioma arriba, luego selecciona tu estilo de excusa preferido para comenzar.",
      chooseLanguageLabel: "🌍 Elige Tu Idioma",
      chooseStyleTitle: "Elige Tu Estilo",
      funnyStyle: "😂 Divertido e Hilarante",
      professionalStyle: "💼 Profesional y Pulido",
      believableStyle: "✅ Creíble y Realista", 
      dramaticStyle: "🎭 Dramático y Exagerado"
    },
    fr: {
      // App title
      appTitle: "Excuses, Excuses!",
      appSubtitle: "Le Générateur Professionnel d'Excuses",
      
      // Main interface
      situation: "Situation",
      situationPlaceholder: "Choisir une situation",
      tone: "Ton",
      tonePlaceholder: "Choisir un ton", 
      language: "Langue",
      languagePlaceholder: "Choisir la langue",
      
      // Situations
      situations: {
        work: "💼 Travail",
        school: "🎓 École",
        date: "💕 Rendez-vous",
        family: "👨‍👩‍👧‍👦 Famille",
        social: "🎉 Social", 
        exercise: "💪 Exercice",
        weather: "🌦️ Météo",
        traffic: "🚗 Trafic", 
        medical: "🏥 Médical",
        emergency: "🚨 Urgence (Premium)",
        travel: "✈️ Voyage (Premium)"
      },
      
      // Tones
      tones: {
        funny: "😂 Amusant",
        professional: "💼 Professionnel",
        believable: "✅ Crédible",
        dramatic: "🎭 Dramatique"
      },
      
      // Buttons
      generateExcuse: "Générer Excuse",
      generating: "Génération...",
      copyToClipboard: "Copier dans le Presse-papiers",
      copied: "Copié!",
      saveFavorite: "Sauvegarder Favori",
      share: "Partager",
      
      // Rating
      good: "Bien",
      bad: "Mal", 
      thanks: "Merci!",
      noted: "Noté!",
      rateThis: "Évaluez cette excuse:",
      
      // Proof generators
      weather: "Météo",
      traffic: "Trafic", 
      medical: "Médical",
      
      // Loading messages
      generatingExcuse: "Génération de votre excuse...",
      craftingStory: "Création de l'histoire parfaite",
      
      // Feature buttons
      custom: "Personnaliser",
      templates: "Modèles",
      analytics: "Analyse",
      export: "Exporter", 
      settings: "Paramètres",
      
      // Subscription
      subscriptionTitle: "Choisissez Votre Plan",
      freePlan: "Gratuit",
      proPlan: "Pro",
      premiumPlan: "Premium",
      currentPlan: "Plan Actuel",
      upgradePlan: "Mettre à Niveau",
      
      // Daily widget
      dailyExcuseTitle: "Excuse Quotidienne",
      copyProof: "Copier Preuve",
      copy: "Copier",
      
      // Main instructions
      pickInstructions: "Choisissez une situation et un ton, puis laissez la magie opérer!",
      
      // Stats
      successRate: "taux de réussite",
      
      // Accessibility
      generateAriaLabel: "Générer nouvelle excuse",
      generateAriaDescription: "Cliquez pour générer une nouvelle excuse basée sur votre situation et ton sélectionnés",
      copyAriaLabel: "Copier excuse dans le presse-papiers",
      favoriteAriaLabel: "Sauvegarder cette excuse dans les favoris",
      // Additional proof labels
      office: "Bureau",
      alertId: "ID d'Alerte",
      incidentId: "ID d'Incident", 
      documentId: "Document #",
      north: "Nord",
      south: "Sud", 
      exit: "Sortie",
      affectedArea: "ZONE AFFECTÉE",
      
      // Onboarding
      welcomeTitle: "🎉 Bienvenue dans Excuses, Excuses!",
      welcomeDescription: "Le générateur d'excuses ultime pour toute situation! Choisissez votre langue ci-dessus, puis sélectionnez votre style d'excuse préféré pour commencer.",
      chooseLanguageLabel: "🌍 Choisissez Votre Langue",
      chooseStyleTitle: "Choisissez Votre Style",
      funnyStyle: "😂 Amusant et Hilarant",
      professionalStyle: "💼 Professionnel et Poli",
      believableStyle: "✅ Crédible et Réaliste", 
      dramaticStyle: "🎭 Dramatique et Exagéré"
    },
    de: {
      // App title
      appTitle: "Ausreden, Ausreden!",
      appSubtitle: "Der Professionelle Ausreden-Generator",
      
      // Main interface
      situation: "Situation",
      situationPlaceholder: "Situation wählen",
      tone: "Ton",
      tonePlaceholder: "Ton wählen",
      language: "Sprache", 
      languagePlaceholder: "Sprache wählen",
      
      // Situations
      situations: {
        work: "💼 Arbeit",
        school: "🎓 Schule",
        date: "💕 Date",
        family: "👨‍👩‍👧‍👦 Familie",
        social: "🎉 Sozial",
        exercise: "💪 Sport",
        weather: "🌦️ Wetter",
        traffic: "🚗 Verkehr",
        medical: "🏥 Medizinisch",
        emergency: "🚨 Notfall (Premium)",
        travel: "✈️ Reise (Premium)"
      },
      
      // Tones
      tones: {
        funny: "😂 Lustig",
        professional: "💼 Professionell", 
        believable: "✅ Glaubwürdig",
        dramatic: "🎭 Dramatisch"
      },
      
      // Buttons
      generateExcuse: "Ausrede Generieren",
      generating: "Generiere...",
      copyToClipboard: "In Zwischenablage Kopieren",
      copied: "Kopiert!",
      saveFavorite: "Favorit Speichern",
      share: "Teilen",
      
      // Rating
      good: "Gut",
      bad: "Schlecht", 
      thanks: "Danke!",
      noted: "Notiert!",
      rateThis: "Bewerte diese Ausrede:",
      
      // Proof generators
      weather: "Wetter",
      traffic: "Verkehr", 
      medical: "Medizinisch",
      
      // Loading messages
      generatingExcuse: "Generiere deine Ausrede...",
      craftingStory: "Die perfekte Geschichte erschaffen",
      
      // Feature buttons
      custom: "Anpassen",
      templates: "Vorlagen",
      analytics: "Analyse",
      export: "Exportieren",
      settings: "Einstellungen",
      
      // Subscription
      subscriptionTitle: "Plan Wählen",
      freePlan: "Kostenlos",
      proPlan: "Pro",
      premiumPlan: "Premium", 
      currentPlan: "Aktueller Plan",
      upgradePlan: "Plan Upgraden",
      
      // Daily widget
      dailyExcuseTitle: "Tägliche Ausrede",
      copyProof: "Beweis Kopieren",
      copy: "Kopieren",
      
      // Main instructions
      pickInstructions: "Wählen Sie eine Situation und einen Ton, dann lassen Sie die Magie geschehen!",
      
      // Stats
      successRate: "Erfolgsrate",
      
      // Accessibility
      generateAriaLabel: "Neue Ausrede generieren",
      generateAriaDescription: "Klicken Sie, um eine neue Ausrede basierend auf Ihrer ausgewählten Situation und Ihrem Ton zu generieren",
      copyAriaLabel: "Ausrede in Zwischenablage kopieren",
      favoriteAriaLabel: "Diese Ausrede zu Favoriten hinzufügen",
      // Additional proof labels
      office: "Büro", 
      alertId: "Alarm-ID",
      incidentId: "Vorfall-ID",
      documentId: "Dokument #",
      north: "Nord",
      south: "Süd",
      exit: "Ausfahrt", 
      affectedArea: "BETROFFENES GEBIET",
      
      // Onboarding
      welcomeTitle: "🎉 Willkommen bei Excuses, Excuses!",
      welcomeDescription: "Der ultimative Ausredengenerator für jede Situation! Wählen Sie oben Ihre Sprache und dann Ihren bevorzugten Ausredenstil, um zu beginnen.",
      chooseLanguageLabel: "🌍 Wählen Sie Ihre Sprache",
      chooseStyleTitle: "Wählen Sie Ihren Stil",
      funnyStyle: "😂 Lustig und Urkomisch",
      professionalStyle: "💼 Professionell und Gepflegt",
      believableStyle: "✅ Glaubwürdig und Realistisch", 
      dramaticStyle: "🎭 Dramatisch und Übertrieben"
    },
    it: {
      // App title
      appTitle: "Scuse, Scuse!",
      appSubtitle: "Il Generatore Professionale di Scuse",
      
      // Main interface
      situation: "Situazione",
      situationPlaceholder: "Scegli una situazione",
      tone: "Tono",
      tonePlaceholder: "Scegli un tono",
      language: "Lingua",
      languagePlaceholder: "Scegli lingua",
      
      // Situations
      situations: {
        work: "💼 Lavoro",
        school: "🎓 Scuola",
        date: "💕 Appuntamento",
        family: "👨‍👩‍👧‍👦 Famiglia",
        social: "🎉 Sociale",
        exercise: "💪 Esercizio",
        weather: "🌦️ Meteo",
        traffic: "🚗 Traffico",
        medical: "🏥 Medico",
        emergency: "🚨 Emergenza (Premium)",
        travel: "✈️ Viaggio (Premium)"
      },
      
      // Tones
      tones: {
        funny: "😂 Divertente",
        professional: "💼 Professionale",
        believable: "✅ Credibile",
        dramatic: "🎭 Drammatico"
      },
      
      // Buttons
      generateExcuse: "Genera Scusa",
      generating: "Generando...",
      copyToClipboard: "Copia negli Appunti",
      copied: "Copiato!",
      saveFavorite: "Salva Preferito",
      share: "Condividi",
      
      // Rating
      good: "Bene",
      bad: "Male", 
      thanks: "Grazie!",
      noted: "Notato!",
      rateThis: "Valuta questa scusa:",
      
      // Proof generators
      weather: "Meteo",
      traffic: "Traffico", 
      medical: "Medico",
      
      // Loading messages
      generatingExcuse: "Generando la tua scusa...",
      craftingStory: "Creando la storia perfetta",
      
      // Feature buttons
      custom: "Personalizzato",
      templates: "Modelli",
      analytics: "Analisi",
      export: "Esporta",
      settings: "Impostazioni",
      
      // Subscription
      subscriptionTitle: "Scegli Il Tuo Piano",
      freePlan: "Gratuito",
      proPlan: "Pro",
      premiumPlan: "Premium",
      currentPlan: "Piano Attuale",
      upgradePlan: "Aggiorna Piano",
      
      // Daily widget
      dailyExcuseTitle: "Scusa Giornaliera",
      copyProof: "Copia Prova",
      copy: "Copia",
      
      // Main instructions
      pickInstructions: "Scegli una situazione e un tono, poi lascia che accada la magia!",
      
      // Stats
      successRate: "tasso di successo",
      
      // Accessibility
      generateAriaLabel: "Genera nuova scusa",
      generateAriaDescription: "Clicca per generare una nuova scusa basata sulla situazione e il tono selezionati",
      copyAriaLabel: "Copia scusa negli appunti", 
      favoriteAriaLabel: "Salva questa scusa nei preferiti",
      // Additional proof labels
      office: "Ufficio",
      alertId: "ID Allerta", 
      incidentId: "ID Incidente",
      documentId: "Documento #",
      north: "Nord",
      south: "Sud",
      exit: "Uscita",
      affectedArea: "AREA INTERESSATA",
      
      // Onboarding
      welcomeTitle: "🎉 Benvenuto in Excuses, Excuses!",
      welcomeDescription: "Il generatore di scuse definitivo per ogni situazione! Scegli la tua lingua sopra, poi seleziona il tuo stile di scusa preferito per iniziare.",
      chooseLanguageLabel: "🌍 Scegli La Tua Lingua",
      chooseStyleTitle: "Scegli Il Tuo Stile",
      funnyStyle: "😂 Divertente e Esilarante",
      professionalStyle: "💼 Professionale e Raffinato",
      believableStyle: "✅ Credibile e Realistico", 
      dramaticStyle: "🎭 Drammatico e Esagerato"
    },
    pt: {
      // App title
      appTitle: "Desculpas, Desculpas!",
      appSubtitle: "O Gerador Profissional de Desculpas",
      
      // Main interface
      situation: "Situação",
      situationPlaceholder: "Escolher situação",
      tone: "Tom",
      tonePlaceholder: "Escolher tom",
      language: "Idioma",
      languagePlaceholder: "Escolher idioma",
      
      // Situations
      situations: {
        work: "💼 Trabalho",
        school: "🎓 Escola",
        date: "💕 Encontro",
        family: "👨‍👩‍👧‍👦 Família",
        social: "🎉 Social",
        exercise: "💪 Exercício",
        weather: "🌦️ Clima",
        traffic: "🚗 Trânsito",
        medical: "🏥 Médico",
        emergency: "🚨 Emergência (Premium)",
        travel: "✈️ Viagem (Premium)"
      },
      
      // Tones
      tones: {
        funny: "😂 Engraçado",
        professional: "💼 Profissional",
        believable: "✅ Acreditável",
        dramatic: "🎭 Dramático"
      },
      
      // Buttons
      generateExcuse: "Gerar Desculpa",
      generating: "Gerando...",
      copyToClipboard: "Copiar para Área de Transferência",
      copied: "Copiado!",
      saveFavorite: "Salvar Favorito",
      share: "Compartilhar",
      
      // Rating
      good: "Bom",
      bad: "Ruim", 
      thanks: "Obrigado!",
      noted: "Anotado!",
      rateThis: "Avalie esta desculpa:",
      
      // Proof generators
      weather: "Clima",
      traffic: "Trânsito", 
      medical: "Médico",
      
      // Loading messages
      generatingExcuse: "Gerando sua desculpa...",
      craftingStory: "Criando a história perfeita",
      
      // Feature buttons
      custom: "Personalizado",
      templates: "Modelos",
      analytics: "Análise",
      export: "Exportar",
      settings: "Configurações",
      
      // Subscription
      subscriptionTitle: "Escolha Seu Plano",
      freePlan: "Gratuito",
      proPlan: "Pro",
      premiumPlan: "Premium",
      currentPlan: "Plano Atual",
      upgradePlan: "Atualizar Plano",
      
      // Daily widget
      dailyExcuseTitle: "Desculpa Diária",
      copyProof: "Copiar Prova",
      copy: "Copiar",
      
      // Main instructions
      pickInstructions: "Escolha uma situação e um tom, então deixe a magia acontecer!",
      
      // Stats
      successRate: "taxa de sucesso",
      
      // Accessibility
      generateAriaLabel: "Gerar nova desculpa",
      generateAriaDescription: "Clique para gerar uma nova desculpa baseada na situação e tom selecionados",
      copyAriaLabel: "Copiar desculpa para área de transferência",
      favoriteAriaLabel: "Salvar esta desculpa nos favoritos",
      // Additional proof labels
      office: "Escritório",
      alertId: "ID do Alerta",
      incidentId: "ID do Incidente", 
      documentId: "Documento #",
      north: "Norte",
      south: "Sul",
      exit: "Saída", 
      affectedArea: "ÁREA AFETADA",
      
      // Onboarding
      welcomeTitle: "🎉 Bem-vindo ao Excuses, Excuses!",
      welcomeDescription: "O melhor gerador de desculpas para qualquer situação! Escolha seu idioma acima, depois selecione seu estilo de desculpa preferido para começar.",
      chooseLanguageLabel: "🌍 Escolha Seu Idioma",
      chooseStyleTitle: "Escolha Seu Estilo",
      funnyStyle: "😂 Engraçado e Hilário",
      professionalStyle: "💼 Profissional e Polido",
      believableStyle: "✅ Acreditável e Realista", 
      dramaticStyle: "🎭 Dramático e Exagerado"
    },
    ru: {
      // App title
      appTitle: "Оправдания, Оправдания!",
      appSubtitle: "Профессиональный Генератор Оправданий",
      
      // Main interface
      situation: "Ситуация",
      situationPlaceholder: "Выберите ситуацию",
      tone: "Тон",
      tonePlaceholder: "Выберите тон",
      language: "Язык",
      languagePlaceholder: "Выберите язык",
      
      // Situations
      situations: {
        work: "💼 Работа",
        school: "🎓 Школа",
        date: "💕 Свидание",
        family: "👨‍👩‍👧‍👦 Семья",
        social: "🎉 Общественное",
        exercise: "💪 Спорт",
        weather: "🌦️ Погода",
        traffic: "🚗 Трафик",
        medical: "🏥 Медицинский",
        emergency: "🚨 Экстренная (Premium)",
        travel: "✈️ Путешествие (Premium)"
      },
      
      // Tones
      tones: {
        funny: "😂 Смешной",
        professional: "💼 Профессиональный",
        believable: "✅ Правдоподобный",
        dramatic: "🎭 Драматичный"
      },
      
      // Buttons
      generateExcuse: "Сгенерировать Оправдание",
      generating: "Генерация...",
      copyToClipboard: "Копировать в Буфер",
      copied: "Скопировано!",
      saveFavorite: "Сохранить в Избранное",
      share: "Поделиться",
      
      // Rating
      good: "Хорошо",
      bad: "Плохо", 
      thanks: "Спасибо!",
      noted: "Отмечено!",
      rateThis: "Оцените это оправдание:",
      
      // Proof generators
      weather: "Погода",
      traffic: "Трафик", 
      medical: "Медицинский",
      
      // Loading messages
      generatingExcuse: "Генерация вашего оправдания...",
      craftingStory: "Создание идеальной истории",
      
      // Feature buttons
      custom: "Настроить",
      templates: "Шаблоны",
      analytics: "Аналитика",
      export: "Экспорт",
      settings: "Настройки",
      
      // Subscription
      subscriptionTitle: "Выберите План",
      freePlan: "Бесплатный",
      proPlan: "Про",
      premiumPlan: "Премиум",
      currentPlan: "Текущий План",
      upgradePlan: "Обновить План",
      
      // Daily widget
      dailyExcuseTitle: "Оправдание Дня",
      copyProof: "Копировать Доказательство",
      copy: "Копировать",
      
      // Main instructions
      pickInstructions: "Выберите ситуацию и тон, затем позвольте магии произойти!",
      
      // Stats
      successRate: "процент успеха",
      
      // Accessibility
      generateAriaLabel: "Сгенерировать новое оправдание",
      generateAriaDescription: "Нажмите, чтобы сгенерировать новое оправдание на основе выбранной ситуации и тона",
      copyAriaLabel: "Копировать оправдание в буфер обмена",
      favoriteAriaLabel: "Сохранить это оправдание в избранном",
      // Additional proof labels  
      office: "Офис",
      alertId: "ID Оповещения",
      incidentId: "ID Инцидента",
      documentId: "Документ #", 
      north: "Север",
      south: "Юг",
      exit: "Выезд",
      affectedArea: "ПОСТРАДАВШАЯ ОБЛАСТЬ",
      
      // Onboarding
      welcomeTitle: "🎉 Добро пожаловать в Excuses, Excuses!",
      welcomeDescription: "Идеальный генератор оправданий для любой ситуации! Выберите свой язык выше, затем выберите предпочтительный стиль оправданий, чтобы начать.",
      chooseLanguageLabel: "🌍 Выберите Ваш Язык",
      chooseStyleTitle: "Выберите Ваш Стиль",
      funnyStyle: "😂 Смешно и Весело",
      professionalStyle: "💼 Профессионально и Изящно",
      believableStyle: "✅ Правдоподобно и Реалистично", 
      dramaticStyle: "🎭 Драматично и Преувеличенно"
    },
    ja: {
      // App title
      appTitle: "言い訳、言い訳！",
      appSubtitle: "プロフェッショナル言い訳ジェネレーター",
      
      // Main interface
      situation: "状況",
      situationPlaceholder: "状況を選択",
      tone: "トーン",
      tonePlaceholder: "トーンを選択",
      language: "言語",
      languagePlaceholder: "言語を選択",
      
      // Situations
      situations: {
        work: "💼 仕事",
        school: "🎓 学校",
        date: "💕 デート",
        family: "👨‍👩‍👧‍👦 家族",
        social: "🎉 社交",
        exercise: "💪 運動",
        weather: "🌦️ 天気",
        traffic: "🚗 交通",
        medical: "🏥 医療",
        emergency: "🚨 緊急 (プレミアム)",
        travel: "✈️ 旅行 (プレミアム)"
      },
      
      // Tones
      tones: {
        funny: "😂 面白い",
        professional: "💼 プロフェッショナル",
        believable: "✅ 信頼できる",
        dramatic: "🎭 ドラマチック"
      },
      
      // Buttons
      generateExcuse: "言い訳を生成",
      generating: "生成中...",
      copyToClipboard: "クリップボードにコピー",
      copied: "コピーしました！",
      saveFavorite: "お気に入りに保存",
      share: "シェア",
      
      // Rating
      good: "良い",
      bad: "悪い", 
      thanks: "ありがとう！",
      noted: "了解！",
      rateThis: "この言い訳を評価:",
      
      // Proof generators
      weather: "天気",
      traffic: "交通", 
      medical: "医療",
      
      // Loading messages
      generatingExcuse: "言い訳を生成中...",
      craftingStory: "完璧な物語を作成中",
      
      // Feature buttons
      custom: "カスタム",
      templates: "テンプレート",
      analytics: "分析",
      export: "エクスポート",
      settings: "設定",
      
      // Subscription
      subscriptionTitle: "プランを選択",
      freePlan: "無料",
      proPlan: "プロ",
      premiumPlan: "プレミアム",
      currentPlan: "現在のプラン",
      upgradePlan: "プランをアップグレード",
      
      // Daily widget
      dailyExcuseTitle: "今日の言い訳",
      copyProof: "証明をコピー",
      copy: "コピー",
      
      // Main instructions
      pickInstructions: "状況とトーンを選んで、魔法を起こしましょう！",
      
      // Stats
      successRate: "成功率",
      
      // Accessibility
      generateAriaLabel: "新しい言い訳を生成",
      generateAriaDescription: "選択した状況とトーンに基づいて新しい言い訳を生成するにはクリック",
      copyAriaLabel: "言い訳をクリップボードにコピー",
      favoriteAriaLabel: "この言い訳をお気に入りに保存",
      // Additional proof labels
      office: "オフィス", 
      alertId: "警報ID",
      incidentId: "事故ID",
      documentId: "文書 #",
      north: "北",
      south: "南", 
      exit: "出口",
      affectedArea: "影響を受ける地域",
      
      // Onboarding
      welcomeTitle: "🎉 Excuses, Excuses!へようこそ！",
      welcomeDescription: "あらゆる状況に対応する究極の言い訳ジェネレーター！上記で言語を選択し、お好みの言い訳スタイルを選んで始めましょう。",
      chooseLanguageLabel: "🌍 言語を選択",
      chooseStyleTitle: "スタイルを選択",
      funnyStyle: "😂 面白くてユーモラス",
      professionalStyle: "💼 プロフェッショナルで洗練",
      believableStyle: "✅ 信憑性があり現実的", 
      dramaticStyle: "🎭 ドラマチックで大袈裟"
    }
  };

  const multilingualExcuses = {
    en: {
      work: {
        funny: [
          "My WiFi got stage fright during the meeting.",
          "My cat scheduled an emergency meeting on my keyboard.",
          "I'm stuck in an elevator with terrible cell service... again.",
          "My coffee maker is holding me hostage until I fix it."
        ],
        professional: [
          "I'm dealing with unexpected technical issues and will join shortly.",
          "I have an urgent client matter that requires immediate attention.",
          "I'm experiencing connectivity issues and need to resolve them first.",
          "I need to handle a time-sensitive project deliverable before joining."
        ],
        believable: [
          "Traffic was heavier than expected, I'll be late.",
          "My train/bus is running significantly behind schedule.",
          "I have a family emergency I need to address quickly.",
          "My car won't start, I'm arranging alternative transportation."
        ],
        dramatic: [
          "The universe is clearly conspiring against my attendance today!",
          "I'm trapped in a maze of construction detours with no escape!",
          "My entire morning has been a series of catastrophic events!",
          "The powers that be have decided today is not my day to shine!"
        ]
      },
      social: {
        funny: [
          "My social battery died and I can't find the charger.",
          "I'm having a deep philosophical crisis about pants.",
          "My couch and I are in the middle of important negotiations.",
          "I just remembered I'm allergic to small talk."
        ],
        professional: [
          "I have a family commitment that requires my immediate attention.",
          "I'm experiencing some personal circumstances that prevent my attendance.",
          "I need to handle an urgent personal matter this evening.",
          "I have a prior engagement that I cannot reschedule."
        ],
        believable: [
          "I'm not feeling well and don't want to risk getting others sick.",
          "I have a family member visiting unexpectedly.",
          "My babysitter canceled last minute and I can't find a replacement.",
          "I'm dealing with a home maintenance emergency."
        ],
        dramatic: [
          "I'm currently trapped in a web of social obligations beyond my control!",
          "The very fabric of my evening has been torn asunder by chaos!",
          "I'm battling forces that seek to prevent my social participation!",
          "My presence would only bring darkness to this joyous occasion!"
        ]
      },
      weather: {
        funny: [
          "Mother Nature decided to throw a tantrum and I'm caught in the crossfire.",
          "The weather app lied to me worse than my ex did.",
          "I'm currently being held hostage by a rogue rainstorm.",
          "The sun called in sick and took all my motivation with it.",
          "I'm having an intense staring contest with a lightning bolt.",
          "The weather is more unpredictable than my WiFi connection."
        ],
        professional: [
          "Severe weather conditions have made travel unsafe in my area.",
          "I'm experiencing weather-related transportation delays that will impact my arrival time.",
          "Due to hazardous weather conditions, I need to prioritize safety and delay my departure.",
          "Local weather advisories are recommending against non-essential travel at this time.",
          "Weather-related power outages in my area are affecting my ability to participate remotely.",
          "I'm monitoring weather conditions and will update you on my availability shortly."
        ],
        believable: [
          "There's a severe storm warning in my area and roads are flooded.",
          "Heavy snow has made driving conditions extremely dangerous.",
          "My power went out due to the storm and my phone is nearly dead.",
          "The weather is so bad that public transportation has been suspended.",
          "Ice storm has made it impossible to safely leave my driveway.",
          "Flash flood warnings mean I need to stay put until conditions improve."
        ],
        dramatic: [
          "The heavens have opened and are unleashing their fury upon me!",
          "I'm trapped in nature's violent ballet of wind and rain!",
          "The storm gods have chosen me as their personal target today!",
          "I'm caught in an epic battle between the elements themselves!",
          "Mother Nature is having a full-scale meltdown and I'm in the blast zone!",
          "The weather has conspired to create a perfect storm of inconvenience!"
        ]
      },
      traffic: {
        funny: [
          "I'm stuck in traffic so bad, I've started a small civilization in my car.",
          "The highway has become a very expensive parking lot.",
          "I'm moving slower than a Windows 95 computer loading the internet.",
          "Traffic is so backed up, I've aged three years in the last hour.",
          "I'm trapped in what appears to be the world's slowest parade.",
          "The GPS is laughing at me - actual arrival time: sometime next week."
        ],
        professional: [
          "I'm experiencing significant traffic delays due to an accident on my route.",
          "Unexpected road construction has created substantial delays in my commute.",
          "I'm currently navigating through heavy traffic congestion and will be delayed.",
          "A major traffic incident has blocked my usual route, causing significant delays.",
          "Peak traffic conditions are heavier than anticipated, impacting my arrival time.",
          "I'm working through alternative routes due to current traffic conditions."
        ],
        believable: [
          "Major accident on the freeway has traffic at a complete standstill.",
          "There's construction I wasn't aware of that's caused a huge backup.",
          "My usual route is blocked due to emergency road repairs.",
          "Traffic is backed up for miles due to a multi-car accident ahead.",
          "Road closure due to utility work has diverted all traffic to side streets.",
          "Rush hour traffic is particularly heavy today due to a special event."
        ],
        dramatic: [
          "I'm trapped in an endless river of metal and fury!",
          "The great migration of vehicles has claimed me as its prisoner!",
          "I've become one with the eternal traffic jam of souls!",
          "The highway gods are testing my patience with this automotive purgatory!",
          "I'm caught in the epic saga of ten thousand commuters versus one small road!",
          "The traffic has achieved sentience and chosen me as its unwilling victim!"
        ]
      },
      medical: {
        funny: [
          "My body decided to stage a rebellion and I'm the unwilling dictator.",
          "I'm having technical difficulties with my human operating system.",
          "My immune system is throwing a tantrum like a toddler in a grocery store.",
          "I woke up feeling like I was hit by the struggle bus... twice.",
          "My body's warranty expired and everything is malfunctioning at once.",
          "I'm experiencing a temporary glitch in my human software."
        ],
        professional: [
          "I'm experiencing health-related symptoms that require medical attention.",
          "I need to address a medical situation that has developed suddenly.",
          "I'm following medical advice to rest and avoid potential exposure to others.",
          "I have a medical appointment that cannot be rescheduled due to scheduling constraints.",
          "I'm managing a health condition that requires immediate attention today.",
          "Medical circumstances require me to prioritize my health and recovery."
        ],
        believable: [
          "I woke up with severe flu symptoms and don't want to risk spreading it.",
          "I'm experiencing food poisoning symptoms from something I ate last night.",
          "I have a migraine so severe that I can't focus or function properly.",
          "I'm dealing with a stomach virus and need to stay close to home.",
          "I have a severe allergic reaction and need to see a doctor immediately.",
          "I threw out my back and can barely move without significant pain."
        ],
        dramatic: [
          "My mortal vessel has betrayed me in the most spectacular fashion!",
          "I'm locked in an epic battle with microscopic invaders!",
          "My body has declared war on itself and I'm caught in the crossfire!",
          "The plague of inconvenience has chosen me as its latest victim!",
          "I'm experiencing a full-scale revolt of my biological systems!",
          "My health has abandoned me like a fair-weather friend!"
        ]
      }
    },
    es: {
      work: {
        funny: [
          "Mi WiFi tiene miedo escénico durante las reuniones.",
          "Mi gato programó una reunión de emergencia en mi teclado.",
          "Estoy atrapado en un ascensor sin señal... otra vez.",
          "Mi cafetera me tiene como rehén hasta que la arregle."
        ],
        professional: [
          "Estoy resolviendo problemas técnicos inesperados, me uniré pronto.",
          "Tengo un asunto urgente de cliente que requiere atención inmediata.",
          "Estoy experimentando problemas de conectividad que debo resolver primero.",
          "Necesito manejar una entrega de proyecto urgente antes de unirme."
        ],
        believable: [
          "El tráfico estaba más pesado de lo esperado, llegaré tarde.",
          "Mi tren/autobús está muy retrasado.",
          "Tengo una emergencia familiar que debo atender rápidamente.",
          "Mi coche no arranca, estoy organizando transporte alternativo."
        ],
        dramatic: [
          "¡El universo claramente está conspirando contra mi asistencia hoy!",
          "¡Estoy atrapado en un laberinto de desvíos de construcción sin escape!",
          "¡Toda mi mañana ha sido una serie de eventos catastróficos!",
          "¡Los poderes superiores han decidido que hoy no es mi día para brillar!"
        ]
      },
      social: {
        funny: [
          "Mi batería social murió y no encuentro el cargador.",
          "Estoy teniendo una crisis filosófica profunda sobre los pantalones.",
          "Mi sofá y yo estamos en medio de negociaciones importantes.",
          "Acabo de recordar que soy alérgico a la charla trivial."
        ],
        professional: [
          "Tengo un compromiso familiar que requiere mi atención inmediata.",
          "Estoy experimentando algunas circunstancias personales que impiden mi asistencia.",
          "Necesito manejar un asunto personal urgente esta noche.",
          "Tengo un compromiso previo que no puedo reprogramar."
        ],
        believable: [
          "No me siento bien y no quiero arriesgar contagiar a otros.",
          "Tengo un miembro de la familia visitando inesperadamente.",
          "Mi niñera canceló a último minuto y no puedo encontrar reemplazo.",
          "Estoy lidiando con una emergencia de mantenimiento del hogar."
        ],
        dramatic: [
          "¡Actualmente estoy atrapado en una red de obligaciones sociales fuera de mi control!",
          "¡La misma tela de mi noche ha sido desgarrada por el caos!",
          "¡Estoy luchando contra fuerzas que buscan impedir mi participación social!",
          "¡Mi presencia solo traería oscuridad a esta ocasión alegre!"
        ]
      },
      weather: {
        funny: [
          "La Madre Naturaleza decidió hacer berrinche y estoy atrapado en el fuego cruzado.",
          "La app del clima me mintió peor que mi ex.",
          "Actualmente estoy siendo rehén de una tormenta rebelde.",
          "El sol pidió día libre y se llevó toda mi motivación con él.",
          "Estoy teniendo un concurso intenso de miradas con un rayo.",
          "El clima es más impredecible que mi conexión WiFi."
        ],
        professional: [
          "Las condiciones climáticas severas han hecho que viajar sea inseguro en mi área.",
          "Estoy experimentando retrasos de transporte relacionados con el clima.",
          "Debido a las condiciones climáticas peligrosas, debo priorizar la seguridad.",
          "Los avisos meteorológicos locales recomiendan evitar viajes no esenciales.",
          "Cortes de energía relacionados con el clima están afectando mi participación remota.",
          "Estoy monitoreando las condiciones climáticas y actualizaré mi disponibilidad pronto."
        ],
        believable: [
          "Hay una advertencia de tormenta severa en mi área y las carreteras están inundadas.",
          "La nieve pesada ha hecho que las condiciones de manejo sean extremadamente peligrosas.",
          "Se fue la luz por la tormenta y mi teléfono está casi sin batería.",
          "El clima está tan malo que el transporte público ha sido suspendido.",
          "La tormenta de hielo ha hecho imposible salir de mi entrada de forma segura.",
          "Las advertencias de inundación repentina significan que debo quedarme hasta que mejore."
        ],
        dramatic: [
          "¡Los cielos se han abierto y están desatando su furia sobre mí!",
          "¡Estoy atrapado en el ballet violento de viento y lluvia de la naturaleza!",
          "¡Los dioses de la tormenta me han elegido como su objetivo personal hoy!",
          "¡Estoy atrapado en una batalla épica entre los elementos mismos!",
          "¡La Madre Naturaleza está teniendo un colapso total y estoy en la zona de impacto!",
          "¡El clima ha conspirado para crear una tormenta perfecta de inconvenientes!"
        ]
      },
      traffic: {
        funny: [
          "Estoy atrapado en tráfico tan malo que he comenzado una pequeña civilización en mi carro.",
          "La autopista se ha convertido en un estacionamiento muy caro.",
          "Me muevo más lento que una computadora Windows 95 cargando internet.",
          "El tráfico está tan atascado que he envejecido tres años en la última hora.",
          "Estoy atrapado en lo que parece ser el desfile más lento del mundo.",
          "El GPS se está riendo de mí - tiempo real de llegada: algún momento la próxima semana."
        ],
        professional: [
          "Estoy experimentando retrasos significativos de tráfico debido a un accidente en mi ruta.",
          "La construcción inesperada de carreteras ha creado retrasos sustanciales en mi viaje.",
          "Actualmente estoy navegando a través de congestión de tráfico pesada.",
          "Un incidente de tráfico mayor ha bloqueado mi ruta usual, causando retrasos significativos.",
          "Las condiciones de tráfico pico son más pesadas de lo anticipado.",
          "Estoy trabajando en rutas alternativas debido a las condiciones actuales de tráfico."
        ],
        believable: [
          "Accidente mayor en la autopista tiene el tráfico completamente parado.",
          "Hay construcción de la que no estaba consciente que ha causado un gran atasco.",
          "Mi ruta usual está bloqueada debido a reparaciones de emergencia del camino.",
          "El tráfico está atascado por millas debido a un accidente de múltiples carros adelante.",
          "Cierre de carretera debido a trabajo de servicios ha desviado todo el tráfico.",
          "El tráfico de hora pico está particularmente pesado hoy debido a un evento especial."
        ],
        dramatic: [
          "¡Estoy atrapado en un río sin fin de metal y furia!",
          "¡La gran migración de vehículos me ha reclamado como su prisionero!",
          "¡Me he vuelto uno con el atasco de tráfico eterno de almas!",
          "¡Los dioses de la autopista están probando mi paciencia con este purgatorio automotriz!",
          "¡Estoy atrapado en la saga épica de diez mil viajeros versus un camino pequeño!",
          "¡El tráfico ha alcanzado conciencia y me ha elegido como su víctima involuntaria!"
        ]
      },
      medical: {
        funny: [
          "Mi cuerpo decidió organizar una rebelión y soy el dictador involuntario.",
          "Estoy teniendo dificultades técnicas con mi sistema operativo humano.",
          "Mi sistema inmunológico está haciendo berrinche como un niño en el supermercado.",
          "Desperté sintiéndome como si me hubiera golpeado el autobús de la lucha... dos veces.",
          "La garantía de mi cuerpo expiró y todo está funcionando mal a la vez.",
          "Estoy experimentando un error temporal en mi software humano."
        ],
        professional: [
          "Estoy experimentando síntomas relacionados con la salud que requieren atención médica.",
          "Necesito atender una situación médica que se ha desarrollado repentinamente.",
          "Estoy siguiendo consejos médicos para descansar y evitar exposición potencial a otros.",
          "Tengo una cita médica que no puede ser reprogramada debido a restricciones de horario.",
          "Estoy manejando una condición de salud que requiere atención inmediata hoy.",
          "Las circunstancias médicas requieren que priorice mi salud y recuperación."
        ],
        believable: [
          "Desperté con síntomas severos de gripe y no quiero arriesgar propagarlo.",
          "Estoy experimentando síntomas de intoxicación alimentaria por algo que comí anoche.",
          "Tengo una migraña tan severa que no puedo enfocarme o funcionar adecuadamente.",
          "Estoy lidiando con un virus estomacal y necesito quedarme cerca de casa.",
          "Tengo una reacción alérgica severa y necesito ver a un doctor inmediatamente.",
          "Me lastimé la espalda y apenas puedo moverme sin dolor significativo."
        ],
        dramatic: [
          "¡Mi vasija mortal me ha traicionado de la manera más espectacular!",
          "¡Estoy encerrado en una batalla épica con invasores microscópicos!",
          "¡Mi cuerpo ha declarado guerra contra sí mismo y estoy atrapado en el fuego cruzado!",
          "¡La plaga de la inconveniencia me ha elegido como su última víctima!",
          "¡Estoy experimentando una revuelta total de mis sistemas biológicos!",
          "¡Mi salud me ha abandonado como un amigo de buen tiempo!"
        ]
      }
    },
    fr: {
      work: {
        funny: [
          "Mon WiFi a le trac pendant les réunions.",
          "Mon chat a programmé une réunion d'urgence sur mon clavier.",
          "Je suis coincé dans un ascenseur sans réseau... encore.",
          "Ma machine à café me tient en otage jusqu'à ce que je la répare."
        ],
        professional: [
          "Je règle des problèmes techniques inattendus, je vais rejoindre bientôt.",
          "J'ai une affaire client urgente qui nécessite une attention immédiate.",
          "Je rencontre des problèmes de connectivité que je dois résoudre d'abord.",
          "Je dois traiter un livrable de projet urgent avant de rejoindre."
        ],
        believable: [
          "Le trafic était plus dense que prévu, je vais être en retard.",
          "Mon train/bus est très en retard.",
          "J'ai une urgence familiale à régler rapidement.",
          "Ma voiture ne démarre pas, j'organise un transport alternatif."
        ],
        dramatic: [
          "L'univers conspire clairement contre ma présence aujourd'hui !",
          "Je suis pris au piège dans un labyrinthe de déviations sans issue !",
          "Toute ma matinée a été une série d'événements catastrophiques !",
          "Les forces supérieures ont décidé qu'aujourd'hui n'est pas mon jour de briller !"
        ]
      },
      social: {
        funny: [
          "Ma batterie sociale est morte et je ne trouve pas le chargeur.",
          "J'ai une crise philosophique profonde à propos des pantalons.",
          "Mon canapé et moi sommes au milieu de négociations importantes.",
          "Je viens de me rappeler que je suis allergique aux bavardages."
        ],
        professional: [
          "J'ai un engagement familial qui nécessite mon attention immédiate.",
          "Je traverse des circonstances personnelles qui empêchent ma présence.",
          "Je dois gérer une affaire personnelle urgente ce soir.",
          "J'ai un engagement préalable que je ne peux pas reprogrammer."
        ],
        believable: [
          "Je ne me sens pas bien et ne veux pas risquer de contaminer les autres.",
          "J'ai un membre de la famille qui visite de manière inattendue.",
          "Ma baby-sitter a annulé à la dernière minute et je ne trouve pas de remplaçant.",
          "Je gère une urgence d'entretien de maison."
        ],
        dramatic: [
          "Je suis actuellement pris au piège dans une toile d'obligations sociales hors de mon contrôle !",
          "Le tissu même de ma soirée a été déchiré par le chaos !",
          "Je combats des forces qui cherchent à empêcher ma participation sociale !",
          "Ma présence ne ferait qu'apporter des ténèbres à cette joyeuse occasion !"
        ]
      }
    },
    de: {
      work: {
        funny: [
          "Mein WLAN hat Lampenfieber während Meetings.",
          "Meine Katze hat ein Notfallmeeting auf meiner Tastatur einberufen.",
          "Ich stecke in einem Aufzug ohne Empfang fest... schon wieder.",
          "Meine Kaffeemaschine hält mich als Geisel, bis ich sie repariere."
        ],
        professional: [
          "Ich löse unerwartete technische Probleme und werde bald beitreten.",
          "Ich habe eine dringende Kundenangelegenheit, die sofortige Aufmerksamkeit erfordert.",
          "Ich habe Verbindungsprobleme, die ich zuerst lösen muss.",
          "Ich muss eine zeitkritische Projektlieferung vor dem Beitritt bearbeiten."
        ],
        believable: [
          "Der Verkehr war schwerer als erwartet, ich werde zu spät kommen.",
          "Mein Zug/Bus hat erhebliche Verspätung.",
          "Ich habe einen Familiennotfall, den ich schnell klären muss.",
          "Mein Auto springt nicht an, ich organisiere alternative Beförderung."
        ],
        dramatic: [
          "Das Universum verschwört sich eindeutig gegen meine Anwesenheit heute!",
          "Ich bin in einem Labyrinth von Baustellen-Umleitungen ohne Ausweg gefangen!",
          "Mein ganzer Morgen war eine Serie katastrophaler Ereignisse!",
          "Die Mächte haben entschieden, dass heute nicht mein Tag zum Glänzen ist!"
        ]
      }
    },
    it: {
      work: {
        funny: [
          "Il mio WiFi ha la paura del palcoscenico durante le riunioni.",
          "Il mio gatto ha programmato una riunione di emergenza sulla mia tastiera.",
          "Sono bloccato in un ascensore senza segnale... di nuovo.",
          "La mia macchina del caffè mi tiene in ostaggio finché non la riparo."
        ],
        professional: [
          "Sto risolvendo problemi tecnici imprevisti, mi unirò presto.",
          "Ho una questione cliente urgente che richiede attenzione immediata.",
          "Ho problemi di connettività che devo risolvere prima.",
          "Devo gestire una consegna di progetto urgente prima di unirmi."
        ],
        believable: [
          "Il traffico era più intenso del previsto, arriverò in ritardo.",
          "Il mio treno/autobus è molto in ritardo.",
          "Ho un'emergenza familiare da gestire rapidamente.",
          "La mia auto non si avvia, sto organizzando un trasporto alternativo."
        ],
        dramatic: [
          "L'universo sta chiaramente cospirando contro la mia presenza oggi!",
          "Sono intrappolato in un labirinto di deviazioni senza via d'uscita!",
          "Tutta la mia mattinata è stata una serie di eventi catastrofici!",
          "I poteri superiori hanno deciso che oggi non è il mio giorno per brillare!"
        ]
      }
    },
    pt: {
      work: {
        funny: [
          "Meu Wi-Fi teve um ataque de ansiedade social durante a reunião.",
          "Meu gato marcou uma reunião de emergência no meu teclado.",
          "Estou preso num elevador com péssimo sinal... de novo.",
          "Minha cafeteira está me fazendo refém até eu consertá-la."
        ],
        professional: [
          "Estou lidando com questões técnicas inesperadas e me juntarei em breve.",
          "Tenho um assunto urgente com cliente que requer atenção imediata.",
          "Estou enfrentando problemas de conectividade e preciso resolvê-los primeiro.",
          "Tenho uma questão prioritária que devo completar primeiro."
        ],
        believable: [
          "Trânsito na rodovia está congestionado devido a acidente, chegarei 20 minutos atrasado.",
          "Meu carro quebrou e estou esperando o guincho.",
          "Tenho uma emergência familiar que preciso resolver.",
          "A operadora de internet está com problema na minha área."
        ],
        dramatic: [
          "O universo está claramente conspirando contra minha presença hoje!",
          "Estou preso num labirinto de desvios sem saída!",
          "Toda minha manhã foi uma série de eventos catastróficos!",
          "Os poderes superiores decidiram que hoje não é meu dia para brilhar!"
        ]
      }
    },
    ru: {
      work: {
        funny: [
          "Мой Wi-Fi получил социофобию во время встречи.",
          "Мой кот назначил экстренное совещание на моей клавиатуре.",
          "Я застрял в лифте с ужасной связью... опять.",
          "Моя кофеварка держит меня в заложниках, пока я её не починю."
        ],
        professional: [
          "Я решаю неожиданные технические проблемы и скоро присоединюсь.",
          "У меня срочное дело с клиентом, требующее немедленного внимания.",
          "У меня проблемы с подключением, нужно их сначала решить.",
          "У меня приоритетная задача, которую нужно выполнить в первую очередь."
        ],
        believable: [
          "Пробка на шоссе из-за аварии, опоздаю на 20 минут.",
          "Моя машина сломалась, жду эвакуатор.",
          "У меня семейная чрезвычайная ситуация, которую нужно решить.",
          "У интернет-провайдера сбой в моём районе."
        ],
        dramatic: [
          "Вселенная явно замышляет против моего присутствия сегодня!",
          "Я заперт в лабиринте объездов без выхода!",
          "Всё моё утро было серией катастрофических событий!",
          "Высшие силы решили, что сегодня не мой день для блеска!"
        ]
      }
    },
    ja: {
      work: {
        funny: [
          "Wi-Fiがミーティング中に社交不安を起こしました。",
          "猫がキーボードで緊急会議を招集しました。",
          "電波の悪いエレベーターに閉じ込められています...また。",
          "コーヒーメーカーに修理するまで人質に取られています。"
        ],
        professional: [
          "予期しない技術的問題に対処しており、すぐに参加いたします。",
          "お客様との緊急案件があり、すぐに対応が必要です。",
          "接続に問題が生じており、まず解決する必要があります。",
          "優先的に完了しなければならない業務があります。"
        ],
        believable: [
          "高速道路で事故による渋滞で20分遅れます。",
          "車が故障してレッカーを待っています。",
          "家族の緊急事態に対応する必要があります。",
          "私の地域でインターネットプロバイダーに障害が発生しています。"
        ],
        dramatic: [
          "宇宙が明らかに今日の私の参加を阻んでいます！",
          "出口のない迂回路の迷路に閉じ込められています！",
          "私の朝は破滅的な出来事の連続でした！",
          "上位の力が今日は私が輝く日ではないと決めました！"
        ]
      }
    }
  };

  // Get excuses for current language (fallback to English)
  const getCurrentLanguageExcuses = () => {
    return multilingualExcuses[selectedLanguage] || multilingualExcuses.en;
  };

  // Get translations for current language (fallback to English)
  const t = translations[selectedLanguage] || translations.en;

  const sampleExcuses = getCurrentLanguageExcuses();

  // Excuse templates with placeholders
  const excuseTemplates = {
    work: {
      funny: [
        "My {pet} just {action} and I need to {solution} before I can join.",
        "I'm stuck in an elevator with {person} and we're having a {type_of_discussion}.",
        "My {device} decided to {malfunction} at the worst possible moment.",
        "I'm currently in a standoff with my {appliance} over {issue}."
      ],
      professional: [
        "I have an urgent {type_of_matter} with {entity} that requires immediate attention.",
        "Due to unexpected {situation}, I need to {action} before I can participate.",
        "I'm experiencing {technical_issue} and need {time_estimate} to resolve it.",
        "I have a {priority_level} {task_type} that I must complete first."
      ],
      believable: [
        "Traffic on {road_name} is backed up due to {reason}, I'll be {time_estimate} late.",
        "My {vehicle} has {problem} and I'm waiting for {solution}.",
        "I have a {family_relation} {emergency_type} that I need to handle.",
        "The {service_provider} has an outage in my area affecting {service}."
      ],
      dramatic: [
        "The {entity_type} of {location} are conspiring against my {goal} today!",
        "I'm trapped in a maze of {obstacle_type} with no {solution_type} in sight!",
        "My entire {time_period} has been a series of {event_type} events!",
        "The {force_type} have decided today is not my day to {achievement}!"
      ]
    },
    school: {
      funny: [
        "My {pet} just {action} my {school_item} and I need to {solution}.",
        "I got lost in my own {location} looking for my {item}.",
        "My {device} went on strike without {notice_type}.",
        "My {school_supply} is holding my {important_item} hostage."
      ],
      professional: [
        "I'm dealing with a {family_type} situation that requires my immediate attention.",
        "I have a {medical_type} appointment that ran longer than expected.",
        "Due to {transportation_issue}, I will be {time_estimate} late.",
        "I'm experiencing {technical_problem} that prevents me from {action}."
      ],
      believable: [
        "The {transport_method} was delayed due to {reason}.",
        "I had a {appointment_type} appointment that ran over.",
        "My {vehicle} broke down on {location}.",
        "I'm feeling {symptom} and don't want to spread {illness_type}."
      ],
      dramatic: [
        "My academic destiny hangs in the balance of {obstacle_type} failures!",
        "I'm battling the forces of {challenge_type} chaos!",
        "The educational {entity_type} have forsaken me this {time_period}!",
        "I'm trapped in a vortex of {event_type} disasters!"
      ]
    },
    date: {
      funny: [
        "My {clothing_item} is having an identity crisis and I need to {action}.",
        "My {service_provider} driver is giving me {advice_type}, this might take a while.",
        "I'm currently negotiating with my {body_part} about tonight's {event}.",
        "My {device} says {excuse_type} in retrograde, bad night to {activity}."
      ],
      professional: [
        "An urgent {work_type} matter came up that I need to handle.",
        "I have a {family_type} obligation I completely forgot about.",
        "Something unexpected came up that requires my immediate {action}.",
        "I'm not feeling {health_condition} enough to go out tonight."
      ],
      believable: [
        "{family_type} emergency, can we push {activity} to {time}?",
        "I'm running really late due to {reason}, can we reschedule?",
        "I'm not feeling {symptom}, I think I should stay in tonight.",
        "Something came up at {location}, I need to handle it first."
      ],
      dramatic: [
        "The forces of {entity_type} are conspiring against our {event_type} tonight!",
        "I'm caught in an epic battle between {obstacle1} and {obstacle2}!",
        "My {time_period} plans have been sabotaged by the {force_type} of {challenge}!",
        "The universe is clearly {action} our romantic {event_type} this evening!"
      ]
    }
  };

  const generateExcuse = async () => {
    try {
      console.log('generateExcuse called - isGenerating:', isGenerating);
      if (isGenerating) return; // Prevent multiple simultaneous generations
      
      // Check subscription limits
      const canGenerate = checkSubscriptionLimits('generate');
      console.log('Can generate:', canGenerate, 'subscriptionData:', subscriptionData);
      if (!canGenerate) {
        console.log('Subscription limits exceeded, showing subscription modal');
        setShowSubscription(true);
        return;
      }
      
      console.log('Starting excuse generation...');
      setIsGenerating(true);
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Current situation:', situation, 'Current tone:', tone);
      
      // Combine sample excuses with custom excuses
      let situationExcuses = sampleExcuses[situation as keyof typeof sampleExcuses];
      
      // Fallback mechanism for missing situations - use work excuses as default
      if (!situationExcuses) {
        console.log(`Situation '${situation}' not found, falling back to work`);
        situationExcuses = sampleExcuses['work'];
        
        // If work doesn't exist either, create basic fallback excuses
        if (!situationExcuses) {
          console.log('Work situation also missing, using emergency fallback');
          situationExcuses = {
            funny: ["Something unexpected came up!", "I'm dealing with a situation.", "Life happened!", "The universe has other plans for me."],
            professional: ["I have an urgent matter to attend to.", "Due to unforeseen circumstances, I cannot make it.", "I need to handle a priority issue.", "I have a conflict that requires my attention."],
            believable: ["I'm not feeling well.", "I have a family emergency.", "My transportation fell through.", "I have a prior commitment."],
            dramatic: ["The forces of chaos have conspired against me!", "I am battling unforeseen circumstances!", "Destiny has other plans!", "I am trapped in a whirlwind of obligations!"]
          };
        }
      }
      
      const customSituationExcuses = customExcuses[situation] || {};
      
      console.log('situationExcuses:', situationExcuses);
      console.log('customSituationExcuses:', customSituationExcuses);
      
      if (!situationExcuses) {
        console.error('No situation excuses found for situation:', situation);
        setIsGenerating(false);
        return; // Handle case where situation doesn't exist
      }
      
      let toneExcuses = situationExcuses[tone as keyof typeof situationExcuses] as string[];
      const customToneExcuses = customSituationExcuses[tone] || [];
      
      // Fallback mechanism for missing tones
      if (!toneExcuses || toneExcuses.length === 0) {
        console.log(`Tone '${tone}' not found for situation '${situation}', trying fallback tones`);
        // Try other tones in order of preference
        const fallbackTones: (keyof typeof situationExcuses)[] = ['professional', 'believable', 'funny', 'dramatic'];
        for (const fallbackTone of fallbackTones) {
          if (fallbackTone !== tone && situationExcuses[fallbackTone] && situationExcuses[fallbackTone].length > 0) {
            toneExcuses = situationExcuses[fallbackTone] as string[];
            console.log(`Using fallback tone '${fallbackTone}' for tone '${tone}'`);
            break;
          }
        }
        
        // If still no excuses, create generic ones based on tone
        if (!toneExcuses || toneExcuses.length === 0) {
          console.log(`Creating emergency excuses for tone '${tone}'`);
          switch (tone) {
            case 'funny':
              toneExcuses = ["Something hilariously unexpected happened!", "Life decided to be comedic today!", "I'm having a sitcom moment!"];
              break;
            case 'professional':
              toneExcuses = ["I have an urgent commitment.", "Due to circumstances beyond my control, I cannot attend.", "I need to address a priority matter."];
              break;
            case 'believable':
              toneExcuses = ["I'm not feeling well.", "I have a family situation.", "My transportation plans fell through."];
              break;
            case 'dramatic':
              toneExcuses = ["Fate has conspired against me!", "I am trapped in a whirlwind of chaos!", "The universe demands my attention elsewhere!"];
              break;
            default:
              toneExcuses = ["I cannot make it.", "Something came up.", "I have a conflict."];
          }
        }
      }
      
      console.log('toneExcuses:', toneExcuses);
      console.log('customToneExcuses:', customToneExcuses);
      
      if (!toneExcuses && customToneExcuses.length === 0) {
        console.error('No excuses found for tone:', tone);
        setIsGenerating(false);
        return; // Handle case where no excuses exist
      }
      
      // Combine all available excuses
      const allExcuses = [...(toneExcuses || []), ...customToneExcuses];
      console.log('allExcuses length:', allExcuses.length);
      console.log('allExcuses sample:', allExcuses.slice(0, 3));
      
      // Generate live data-enhanced excuse if location and live data are available
      let finalExcuse = '';
      if (useRealData && userLocation && (liveWeatherData || liveTrafficData)) {
        finalExcuse = generateLiveDataExcuse(situation, tone, liveWeatherData, liveTrafficData);
        console.log('Generated live data excuse:', finalExcuse);
      } else {
        // Use traditional random selection from available excuses
        
        // Get recently used excuses (last 10 or within last 10 minutes - reduced from 1 hour)
        const recentExcuses = excuseHistory
          .filter(entry => {
            const timeDiff = Date.now() - entry.timestamp.getTime();
            return timeDiff < 600000; // 10 minutes in milliseconds (reduced from 1 hour)
          })
          .map(entry => entry.excuse);
        
        console.log('recentExcuses:', recentExcuses);
        
        // Filter out recently used excuses
        let availableExcuses = allExcuses.filter((excuse: string) => !recentExcuses.includes(excuse));
        console.log('availableExcuses after filter:', availableExcuses.length);
        
        // If all excuses were recently used, use all excuses (reset the pool)
        if (availableExcuses.length === 0) {
          availableExcuses = [...allExcuses];
          console.log('All excuses were recent, resetting pool');
        }
        
        // For debugging - always ensure we have variety by shuffling the array
        const shuffled = [...availableExcuses].sort(() => Math.random() - 0.5);
        
        // Weight excuses based on ratings (highly rated excuses are more likely to be chosen)
        const weightedExcuses: string[] = [];
        for (const excuse of shuffled) {
          const rating = getExcuseRating(excuse);
          if (rating === 'up') {
            // Add highly-rated excuses 3 times to increase their chances
            weightedExcuses.push(excuse, excuse, excuse);
          } else if (rating === 'down') {
            // Add poorly-rated excuses only once (reduce their chances)
            weightedExcuses.push(excuse);
          } else {
            // Add unrated excuses twice (normal chance)
            weightedExcuses.push(excuse, excuse);
          }
        }
        
        // Add extra randomization - shuffle the weighted array
        const shuffledWeighted = [...weightedExcuses].sort(() => Math.random() - 0.5);
        
        // Select random excuse from weighted pool
        finalExcuse = shuffledWeighted[Math.floor(Math.random() * shuffledWeighted.length)];
        console.log('Selected from', shuffledWeighted.length, 'weighted options');
        console.log('Generated excuse:', finalExcuse);
      }
      
      // Add to history
      const newHistoryEntry = {
        excuse: finalExcuse,
        timestamp: new Date(),
        situation: situation,
        tone: tone
      };
      
      setExcuseHistory(prev => [newHistoryEntry, ...prev].slice(0, 50)); // Keep last 50 excuses
      setExcuse(finalExcuse);
      setCurrentExcuseRated(null); // Reset rating visual feedback for new excuse
      
      // Track usage analytics
      trackUsageAnalytics(situation, tone, finalExcuse);
      
      // Increment usage counter for subscription tracking
      incrementUsage('generate');
      
      // Track ad views and show ads for free users
      if (subscriptionTier === 'free') {
        setExcusesSinceAd(prev => prev + 1);
        showAdAfterExcuses(3); // Show interstitial ad every 3 excuses for free users
      }
      
      console.log('Excuse generation completed successfully');
      setIsGenerating(false);
    } catch (error) {
      console.error('Error in generateExcuse:', error);
      setIsGenerating(false);
    }
  };

  const saveFavorite = () => {
    if (excuse && !favorites.includes(excuse)) {
      setFavorites([...favorites, excuse]);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Modern browsers with secure context
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sendAsSMS = (text: string, phoneNumber?: string) => {
    // Clean the text for SMS - remove formatting characters
    const cleanText = text
      .replace(/━/g, '-')  // Replace fancy line characters
      .replace(/📱|🌩️|🚨|🏥|⛈️|💨|🧊|🌊/g, '')  // Remove emojis
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .trim();
    
    // Create SMS URL with optional phone number
    const smsBody = encodeURIComponent(cleanText);
    const smsUrl = phoneNumber 
      ? `sms:${phoneNumber}?body=${smsBody}`
      : `sms:?body=${smsBody}`;
    
    try {
      // Open SMS app with pre-filled message
      window.open(smsUrl, '_self');
    } catch (err) {
      console.error('Failed to open SMS app: ', err);
      // Fallback: copy to clipboard
      copyToClipboard(cleanText);
    }
  };

  const sendAsEmail = async (content: string, recipientEmail: string) => {
    setEmailSending(true);
    try {
      // Create a simple, clean email format
      const subject = 'Medical Excuse Documentation';
      
      // Clean up the content for email
      let emailContent = content;
      
      // If it's an email format, clean it up
      if (content.includes('Subject:')) {
        emailContent = content.replace(/Subject:.*\n/, '').replace(/To:.*\n/, '').replace(/From:.*\n/, '').trim();
      }
      
      // Create mailto URL with simple encoding
      const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
      
      // Try multiple methods to ensure it works
      try {
        // Method 1: Direct window location
        window.location.href = mailtoUrl;
      } catch (e) {
        // Method 2: Window.open as fallback
        window.open(mailtoUrl);
      }
      
      // Show success message
      alert('✅ Email client should be opening now!\n\nIf your email client didn\'t open automatically:\n1. Copy the proof text below\n2. Create a new email\n3. Paste the content');
      
      setTimeout(() => {
        setEmailSending(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('❌ Could not open email client automatically.\n\nPlease copy the proof text and paste it into your email manually.');
      setEmailSending(false);
    }
  };

  // Location and Live Data Functions
  const requestLocation = async () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setLocationPermission('denied');
      setIsLoadingLocation(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0 // Always get fresh location data
        });
      });

      const { latitude, longitude } = position.coords;
      const location: {
        lat: number, 
        lon: number, 
        city?: string,
        state?: string,
        country?: string,
        address?: string,
        neighborhood?: string
      } = { lat: latitude, lon: longitude };
      
      // Get detailed location info from coordinates using multiple sources
      try {
        // Try OpenWeatherMap reverse geocoding first
        const weatherResponse = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=demo`);
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          if (weatherData[0]) {
            location.city = weatherData[0].name;
            location.state = weatherData[0].state;
            location.country = weatherData[0].country;
          }
        }
        
        // Try more detailed reverse geocoding with Nominatim (OpenStreetMap)
        try {
          const nominatimResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'ExcusesApp/1.0'
              }
            }
          );
          
          if (nominatimResponse.ok) {
            const nominatimData = await nominatimResponse.json();
            if (nominatimData && nominatimData.address) {
              const addr = nominatimData.address;
              
              // Extract detailed address components
              location.neighborhood = addr.neighbourhood || addr.suburb || addr.residential;
              location.city = location.city || addr.city || addr.town || addr.village;
              location.state = location.state || addr.state || addr.region;
              location.country = location.country || addr.country;
              
              // Create readable address
              const addressParts = [];
              if (addr.house_number && addr.road) {
                addressParts.push(`${addr.house_number} ${addr.road}`);
              } else if (addr.road) {
                addressParts.push(addr.road);
              }
              if (location.neighborhood && location.neighborhood !== location.city) {
                addressParts.push(location.neighborhood);
              }
              if (location.city) {
                addressParts.push(location.city);
              }
              if (location.state) {
                addressParts.push(location.state);
              }
              
              location.address = addressParts.filter(Boolean).join(', ');
            }
          }
        } catch (nominatimError) {
          console.log('Nominatim geocoding failed, using basic location');
        }
        
      } catch (e) {
        console.log('Could not get detailed location, using coordinates only');
        // Fallback: create basic location display from coordinates
        location.address = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
      }

      setUserLocation(location);
      setLocationPermission('granted');
      
      // Automatically fetch live data
      await Promise.all([
        fetchLiveWeather(location),
        fetchLiveTraffic(location)
      ]);
      
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationPermission('denied');
      alert('Location access denied. Using generic location data instead.');
    }
    
    setIsLoadingLocation(false);
  };

  const fetchLiveWeather = async (location: {
    lat: number, 
    lon: number, 
    city?: string,
    state?: string,
    country?: string,
    address?: string,
    neighborhood?: string
  }) => {
    try {
      // Using free weather API from weatherapi.com or open-meteo.com (no key required)
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,visibility&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`);
      
      if (response.ok) {
        const data = await response.json();
        const current = data.current;
        
        // Weather code mapping for Open-Meteo
        const getWeatherDescription = (code: number) => {
          const weatherCodes: { [key: number]: { main: string, description: string } } = {
            0: { main: 'Clear', description: 'clear sky' },
            1: { main: 'Clouds', description: 'mainly clear' },
            2: { main: 'Clouds', description: 'partly cloudy' },
            3: { main: 'Clouds', description: 'overcast' },
            45: { main: 'Fog', description: 'fog' },
            48: { main: 'Fog', description: 'depositing rime fog' },
            51: { main: 'Drizzle', description: 'light drizzle' },
            53: { main: 'Drizzle', description: 'moderate drizzle' },
            55: { main: 'Drizzle', description: 'dense drizzle' },
            61: { main: 'Rain', description: 'slight rain' },
            63: { main: 'Rain', description: 'moderate rain' },
            65: { main: 'Rain', description: 'heavy rain' },
            71: { main: 'Snow', description: 'slight snow fall' },
            73: { main: 'Snow', description: 'moderate snow fall' },
            75: { main: 'Snow', description: 'heavy snow fall' },
            80: { main: 'Rain', description: 'slight rain showers' },
            81: { main: 'Rain', description: 'moderate rain showers' },
            82: { main: 'Rain', description: 'violent rain showers' },
            95: { main: 'Thunderstorm', description: 'thunderstorm' },
            96: { main: 'Thunderstorm', description: 'thunderstorm with slight hail' },
            99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail' }
          };
          return weatherCodes[code] || { main: 'Unknown', description: 'unknown weather' };
        };
        
        const weather = getWeatherDescription(current.weather_code);
        
        setLiveWeatherData({
          condition: weather.main,
          description: weather.description,
          temperature: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          visibility: current.visibility / 1000, // Convert to km
          city: location.city || location.address || 'Your Location'
        });
      } else {
        // Fallback to mock data if API fails
        setLiveWeatherData({
          condition: 'Rain',
          description: 'heavy rain',
          temperature: 46, // 46°F 
          humidity: 95,
          windSpeed: 25,
          visibility: 0.5,
          city: location.city || location.address || 'Your Location'
        });
      }
    } catch (error) {
      console.log('Using mock weather data');
      // Mock realistic weather data as fallback
      setLiveWeatherData({
        condition: 'Thunderstorm',
        description: 'severe thunderstorm with heavy rain',
        temperature: 54, // 54°F 
        humidity: 98,
        windSpeed: 45,
        visibility: 0.2,
        city: location.city || location.address || 'Your Location'
      });
    }
  };

  const fetchLiveTraffic = async (location: {
    lat: number, 
    lon: number, 
    city?: string,
    state?: string,
    country?: string,
    address?: string,
    neighborhood?: string
  }) => {
    try {
      // Get local roads using OpenStreetMap/Nominatim API for nearby roads
      const nearbyResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lon}&zoom=16&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'ExcusesApp/1.0'
          }
        }
      );
      
      let localStreets: string[] = [];
      if (nearbyResponse.ok) {
        const data = await nearbyResponse.json();
        if (data?.address) {
          // Extract local street names
          const addr = data.address;
          if (addr.road) localStreets.push(addr.road);
          
          // Get nearby roads using Overpass API (OpenStreetMap)
          try {
            const overpassQuery = `
              [out:json][timeout:5];
              (
                way["highway"~"^(primary|secondary|tertiary|residential|trunk)$"](around:1000,${location.lat},${location.lon});
              );
              out geom;
            `;
            
            const overpassResponse = await fetch('https://overpass-api.de/api/interpreter', {
              method: 'POST',
              body: overpassQuery,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
            
            if (overpassResponse.ok) {
              const overpassData = await overpassResponse.json();
              const nearbyRoads = overpassData.elements
                .map((way: any) => way.tags?.name)
                .filter((name: string) => name && !localStreets.includes(name))
                .slice(0, 3); // Get up to 3 additional roads
              
              localStreets.push(...nearbyRoads);
            }
          } catch (e) {
            console.log('Could not fetch nearby roads from Overpass API');
          }
        }
      }
      
      // Fallback to common street names if no local streets found
      if (localStreets.length === 0) {
        localStreets = ['Main Street', 'Oak Avenue', 'First Street'];
      }
      
      // Create realistic traffic scenarios using actual local streets
      const trafficTypes = ['accident', 'construction', 'weather_related', 'heavy_traffic', 'road_closure'];
      const selectedType = trafficTypes[Math.floor(Math.random() * trafficTypes.length)];
      const selectedStreet = localStreets[Math.floor(Math.random() * localStreets.length)];
      
      const scenarios = {
        accident: {
          type: 'accident',
          location: selectedStreet,
          description: `Multi-vehicle accident on ${selectedStreet} blocking lanes`,
          delay: `${15 + Math.floor(Math.random() * 45)} minutes`,
          distance: `${0.1 + Math.random() * 2}`.slice(0,3) + ' miles from current location'
        },
        construction: {
          type: 'construction',
          location: selectedStreet,
          description: `Road construction on ${selectedStreet} - single lane traffic`,
          delay: `${10 + Math.floor(Math.random() * 30)} minutes`,
          distance: `${0.2 + Math.random() * 1.5}`.slice(0,3) + ' miles from current location'
        },
        weather_related: {
          type: 'weather_related',
          location: selectedStreet,
          description: `Weather-related hazards on ${selectedStreet} - reduced visibility`,
          delay: `${20 + Math.floor(Math.random() * 40)} minutes`,
          distance: `${0.1 + Math.random() * 1.2}`.slice(0,3) + ' miles from current location'
        },
        heavy_traffic: {
          type: 'heavy_traffic',
          location: selectedStreet,
          description: `Heavy congestion on ${selectedStreet} during rush hour`,
          delay: `${15 + Math.floor(Math.random() * 35)} minutes`,
          distance: `${0.2 + Math.random() * 1.8}`.slice(0,3) + ' miles from current location'
        },
        road_closure: {
          type: 'road_closure',
          location: selectedStreet,
          description: `${selectedStreet} closed due to emergency maintenance`,
          delay: `${30 + Math.floor(Math.random() * 45)} minutes detour required`,
          distance: `${0.1 + Math.random() * 1}`.slice(0,3) + ' miles from current location'
        }
      };
      
      setLiveTrafficData(scenarios[selectedType as keyof typeof scenarios]);
      
    } catch (error) {
      console.log('Using fallback traffic data');
      setLiveTrafficData({
        type: 'accident',
        location: location.address?.split(',')[0] || 'Main Street',
        description: `Traffic incident on ${location.address?.split(',')[0] || 'Main Street'} causing delays`,
        delay: `${15 + Math.floor(Math.random() * 30)} minutes`,
        distance: '0.5 miles from current location'
      });
    }
  };

  const generateLiveDataExcuse = (situation: string, tone: string, weather: any, traffic: any) => {
    // Create more specific location description
    const getLocationDescription = () => {
      if (userLocation?.neighborhood && userLocation?.city) {
        return `${userLocation.neighborhood}, ${userLocation.city}`;
      }
      if (userLocation?.city && userLocation?.state) {
        return `${userLocation.city}, ${userLocation.state}`;
      }
      if (userLocation?.city) {
        return userLocation.city;
      }
      if (weather?.city) {
        return weather.city;
      }
      return 'my area';
    };

    const city = getLocationDescription();
    const specificArea = userLocation?.address || city;
    const templates = {
      weather: {
        professional: [
          `Due to severe ${weather.description} in ${city}, I cannot safely travel to the office. Visibility is only ${weather.visibility}km and wind speeds are ${weather.windSpeed}km/h.`,
          `The current weather conditions in ${city} (${weather.description}, ${weather.temperature}°F) make it unsafe to travel. I will work from home today.`,
          `Weather alert in ${city}: ${weather.description} with ${weather.humidity}% humidity. I need to stay home for safety reasons.`,
          `I'm currently at ${specificArea} and the weather conditions (${weather.description}, ${weather.temperature}°F) make travel unsafe. Working remotely today.`
        ],
        believable: [
          `I'm stuck at home because of the ${weather.description} in ${city}. Roads are not safe with only ${weather.visibility}km visibility.`,
          `Can't make it in today - there's ${weather.description} and it's only ${weather.temperature}°F outside. Too dangerous to drive.`,
          `The weather is terrible here in ${city} (${weather.description}). I don't feel safe driving in these conditions.`,
          `I'm at ${specificArea} and can't get out due to the ${weather.description}. Roads are impassable with ${weather.temperature}°F weather.`
        ],
        funny: [
          `Mother Nature decided to have a tantrum in ${city} today! There's ${weather.description} and I'm not brave enough to face her wrath.`,
          `The weather gods are angry in ${city} - it's ${weather.temperature}°F with ${weather.description}. I'm staying inside like a smart human!`,
          `Current weather in ${city}: ${weather.description}. My car and I have decided to stay in hibernation mode today!`
        ],
        dramatic: [
          `The heavens have unleashed their fury upon ${city}! With ${weather.description} and winds of ${weather.windSpeed}km/h, I am trapped by nature's wrath!`,
          `I am held captive by the storm gods in ${city}! The ${weather.description} makes travel impossible - visibility is a mere ${weather.visibility}km!`,
          `The elements conspire against me in ${city}! ${weather.description} at ${weather.temperature}°F - I cannot battle such forces of nature!`
        ]
      },
      traffic: {
        professional: [
          `I'm experiencing significant delays due to a ${traffic.description} on ${traffic.location}. The estimated delay is ${traffic.delay}, which will make me very late.`,
          `There's a major traffic incident (${traffic.description}) ${traffic.distance}. Current delay time is ${traffic.delay}. I'll work from home instead.`,
          `Traffic conditions are severe today - ${traffic.description} on ${traffic.location}. I'm looking at a ${traffic.delay} delay.`
        ],
        believable: [
          `I'm stuck in traffic due to ${traffic.description} on ${traffic.location}. It's going to be at least a ${traffic.delay} delay.`,
          `There's a big accident ${traffic.distance} that's causing ${traffic.delay} delays. I'm not going to make it on time.`,
          `Traffic is completely backed up because of ${traffic.description}. Looking at ${traffic.delay} just to get through.`
        ],
        funny: [
          `I'm currently part of the world's slowest parade on ${traffic.location}! There's ${traffic.description} and I've moved 3 feet in 20 minutes.`,
          `The highway has turned into a parking lot thanks to ${traffic.description}. I'm thinking of setting up camp here for ${traffic.delay}!`,
          `I'm experiencing the joy of ${traffic.description} on ${traffic.location}. At this rate, I'll arrive sometime next week!`
        ],
        dramatic: [
          `I am trapped in a vehicular prison on ${traffic.location}! The ${traffic.description} has created a ${traffic.delay} nightmare of epic proportions!`,
          `The traffic gods have cursed ${traffic.location} with ${traffic.description}! I am but a prisoner in this ${traffic.delay} ordeal!`,
          `Behold! The great ${traffic.description} has transformed ${traffic.location} into a monument to human suffering! I face ${traffic.delay} of torment!`
        ]
      }
    };

    // Choose weather or traffic based on what's more severe/interesting
    let selectedData, selectedType;
    if (weather && traffic) {
      // Prefer severe weather conditions or major traffic incidents
      if ((weather.windSpeed > 30 || weather.visibility < 1) || traffic.delay.includes('60')) {
        selectedData = weather.windSpeed > 30 || weather.visibility < 1 ? weather : traffic;
        selectedType = weather.windSpeed > 30 || weather.visibility < 1 ? 'weather' : 'traffic';
      } else {
        // Random selection if both are moderate
        selectedType = Math.random() > 0.5 ? 'weather' : 'traffic';
        selectedData = selectedType === 'weather' ? weather : traffic;
      }
    } else {
      selectedData = weather || traffic;
      selectedType = weather ? 'weather' : 'traffic';
    }

    const typeTemplates = templates[selectedType as keyof typeof templates];
    const toneTemplates = typeTemplates[tone as keyof typeof typeTemplates] || typeTemplates.professional;
    
    return toneTemplates[Math.floor(Math.random() * toneTemplates.length)];
  };

  // Subscription Management Functions
  const checkSubscriptionLimits = (action: 'generate' | 'custom' | 'template') => {
    const today = new Date().toDateString();
    const lastReset = new Date(subscriptionData.usage.lastReset).toDateString();
    
    // Reset daily usage if it's a new day
    if (today !== lastReset) {
      setSubscriptionData(prev => ({
        ...prev,
        usage: {
          ...prev.usage,
          excusesToday: 0,
          lastReset: new Date(),
        }
      }));
    }
    
    const { features, usage } = subscriptionData;
    
    switch (action) {
      case 'generate':
        if (features.dailyExcuseLimit === -1) return true; // Unlimited
        return usage.excusesToday < features.dailyExcuseLimit;
      case 'custom':
        if (features.customExcusesLimit === -1) return true; // Unlimited
        return usage.customExcusesCreated < features.customExcusesLimit;
      case 'template':
        if (features.templatesLimit === -1) return true; // Unlimited
        return usage.templatesUsed < features.templatesLimit;
      default:
        return false;
    }
  };

  const incrementUsage = (action: 'generate' | 'custom' | 'template') => {
    setSubscriptionData(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        excusesToday: action === 'generate' ? prev.usage.excusesToday + 1 : prev.usage.excusesToday,
        customExcusesCreated: action === 'custom' ? prev.usage.customExcusesCreated + 1 : prev.usage.customExcusesCreated,
        templatesUsed: action === 'template' ? prev.usage.templatesUsed + 1 : prev.usage.templatesUsed,
      }
    }));
  };

  const hasFeature = (feature: keyof typeof subscriptionData.features) => {
    return subscriptionData.features[feature];
  };

  const upgradeSubscription = (newTier: 'pro' | 'premium') => {
    const tierConfig = subscriptionTiers[newTier];
    setSubscriptionData(prev => ({
      ...prev,
      tier: newTier,
      features: tierConfig.features,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }));
    setSubscriptionTier(newTier);
    
    // Automatically unlock premium features for both Pro and Premium tiers
    setIsPremium(true);
    safeLocalStorage.setItem('isPremium', 'true');
    safeLocalStorage.setItem('subscriptionTier', newTier);
    
    setShowSubscription(false);
    setShowAd(false); // Hide ads for premium users
    setAdDismissed(true); // Dismiss any existing ads
    
    // Show success message
    console.log(`Successfully upgraded to ${newTier} tier with premium features unlocked!`);
  };

  const getRemainingUsage = () => {
    const { features, usage } = subscriptionData;
    return {
      excuses: features.dailyExcuseLimit === -1 ? 'Unlimited' : `${Math.max(0, features.dailyExcuseLimit - usage.excusesToday)} left today`,
      customExcuses: features.customExcusesLimit === -1 ? 'Unlimited' : `${Math.max(0, features.customExcusesLimit - usage.customExcusesCreated)} remaining`,
      templates: features.templatesLimit === -1 ? 'Unlimited' : `${Math.max(0, features.templatesLimit - usage.templatesUsed)} remaining`,
    };
  };

  // Ad Management Functions
  const shouldShowAd = () => {
    // Always show banner ads for free users unless dismissed in the last 5 minutes
    return subscriptionTier === 'free' && !adDismissed;
  };

  const shouldShowBannerAd = () => {
    // Always show banner ad for free users (separate from interstitial logic)
    return subscriptionTier === 'free';
  };

  const showAdAfterExcuses = (count: number) => {
    if (subscriptionTier === 'free' && excusesSinceAd >= count) {
      setShowAd(true);
      setAdType('interstitial');
      setExcusesSinceAd(0);
    }
  };

  const dismissAd = () => {
    setShowAd(false);
    setAdDismissed(true);
    // Reset ad dismissal after 5 minutes for banner ads
    setTimeout(() => setAdDismissed(false), 5 * 60 * 1000);
  };

  const trackAdView = () => {
    // In a real app, this would track ad impressions for analytics
    console.log('Ad viewed by free tier user');
  };

  const resetDailyUsage = () => {
    setSubscriptionData(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        excusesToday: 0,
        lastReset: new Date(),
      }
    }));
  };

  const shareViaSMS = (text: string) => {
    const message = encodeURIComponent(`Check out this excuse: "${text}" 😄`);
    window.open(`sms:?body=${message}`, '_self');
  };

  const shareViaEmail = (text: string) => {
    const subject = encodeURIComponent('Perfect Excuse for You!');
    const body = encodeURIComponent(`Hey! I found the perfect excuse for you:\n\n"${text}"\n\n😄 Pretty good, right? Generated with Excuses, Excuses!`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  };

  const shareViaTwitter = (text: string) => {
    const tweet = encodeURIComponent(`"${text}" 😂 #ExcusesExcuses #PerfectExcuse`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
  };

  const shareViaFacebook = (text: string) => {
    const quote = encodeURIComponent(`Check out this perfect excuse: "${text}"`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${quote}`, '_blank');
  };

  const shareViaWhatsApp = (text: string) => {
    const message = encodeURIComponent(`Check out this excuse: "${text}" 😄`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareNative = async (text: string) => {
    if (typeof navigator !== 'undefined' && 'share' in navigator && navigator.share) {
      try {
        await navigator.share({
          title: 'Perfect Excuse!',
          text: `"${text}" 😄`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Native sharing was cancelled or failed');
      }
    } else {
      // Fallback to showing the share screen
      setShowShare(true);
    }
  };

  const rateExcuse = (excuse: string, rating: 'up' | 'down') => {
    setExcuseRatings(prev => ({
      ...prev,
      [excuse]: {
        rating,
        timestamp: new Date()
      }
    }));
    setCurrentExcuseRated(rating);
    
    // Track rating in analytics
    trackExcuseRating(excuse, rating);
    
    // Auto-clear rating visual feedback after 2 seconds
    setTimeout(() => {
      setCurrentExcuseRated(null);
    }, 2000);
  };

  const getExcuseRating = (excuse: string): 'up' | 'down' | null => {
    return excuseRatings[excuse]?.rating || null;
  };

  const getRatingStats = () => {
    const ratings = Object.values(excuseRatings);
    const upCount = ratings.filter(r => r.rating === 'up').length;
    const downCount = ratings.filter(r => r.rating === 'down').length;
    const totalRatings = upCount + downCount;
    
    return {
      upCount,
      downCount,
      totalRatings,
      percentage: totalRatings > 0 ? Math.round((upCount / totalRatings) * 100) : 0
    };
  };

  const getTopRatedExcuses = () => {
    return Object.entries(excuseRatings)
      .filter(([_, data]) => data.rating === 'up')
      .sort((a, b) => b[1].timestamp.getTime() - a[1].timestamp.getTime())
      .slice(0, 5)
      .map(([excuse]) => excuse);
  };

  // Analytics and tracking functions
  const trackUsageAnalytics = (situation: string, tone: string, excuse: string) => {
    const combinationKey = `${situation}-${tone}`;
    
    // Update usage statistics
    setUsageStats(prev => ({
      situationCounts: {
        ...prev.situationCounts,
        [situation]: (prev.situationCounts[situation] || 0) + 1
      },
      toneCounts: {
        ...prev.toneCounts,
        [tone]: (prev.toneCounts[tone] || 0) + 1
      },
      combinationCounts: {
        ...prev.combinationCounts,
        [combinationKey]: (prev.combinationCounts[combinationKey] || 0) + 1
      },
      totalGenerations: prev.totalGenerations + 1
    }));
    
    // Update excuse analytics
    setExcuseAnalytics(prev => ({
      ...prev,
      [excuse]: {
        timesGenerated: (prev[excuse]?.timesGenerated || 0) + 1,
        timesRated: prev[excuse]?.timesRated || 0,
        positiveRatings: prev[excuse]?.positiveRatings || 0,
        negativeRatings: prev[excuse]?.negativeRatings || 0,
        averageRating: prev[excuse]?.averageRating || 0,
        effectiveness: calculateExcuseEffectiveness(excuse, prev[excuse]),
        lastUsed: new Date(),
        situation,
        tone
      }
    }));
  };

  const trackExcuseRating = (excuse: string, rating: 'up' | 'down') => {
    setExcuseAnalytics(prev => {
      const currentData = prev[excuse];
      if (!currentData) return prev;
      
      const newPositive = currentData.positiveRatings + (rating === 'up' ? 1 : 0);
      const newNegative = currentData.negativeRatings + (rating === 'down' ? 1 : 0);
      const newTotalRated = currentData.timesRated + 1;
      
      return {
        ...prev,
        [excuse]: {
          ...currentData,
          timesRated: newTotalRated,
          positiveRatings: newPositive,
          negativeRatings: newNegative,
          averageRating: newTotalRated > 0 ? newPositive / newTotalRated : 0,
          effectiveness: calculateExcuseEffectiveness(excuse, {
            ...currentData,
            timesRated: newTotalRated,
            positiveRatings: newPositive,
            negativeRatings: newNegative
          })
        }
      };
    });
  };

  const calculateExcuseEffectiveness = (excuse: string, data?: any) => {
    if (!data || data.timesRated === 0) return 0.5; // Neutral rating for unrated excuses
    
    const ratingScore = data.averageRating || (data.positiveRatings / data.timesRated);
    const usageScore = Math.min(data.timesGenerated / 10, 1); // Normalize usage to 0-1 scale
    const recentUsageBonus = data.lastUsed && (Date.now() - new Date(data.lastUsed).getTime()) < 86400000 ? 0.1 : 0;
    
    // Weighted effectiveness score
    return Math.min((ratingScore * 0.6) + (usageScore * 0.3) + recentUsageBonus, 1);
  };

  const getMostPopularSituation = () => {
    const counts = usageStats.situationCounts;
    return Object.keys(counts).length > 0 
      ? Object.entries(counts).sort(([,a], [,b]) => b - a)[0][0]
      : 'work';
  };

  const getMostPopularTone = () => {
    const counts = usageStats.toneCounts;
    return Object.keys(counts).length > 0 
      ? Object.entries(counts).sort(([,a], [,b]) => b - a)[0][0]
      : 'funny';
  };

  const getTopPerformingExcuses = () => {
    return Object.entries(excuseAnalytics)
      .filter(([_, data]) => data.timesRated > 0)
      .sort(([,a], [,b]) => b.effectiveness - a.effectiveness)
      .slice(0, 5)
      .map(([excuse, data]) => ({ excuse, ...data }));
  };

  const getLeastPopularCombinations = () => {
    const allCombinations = ['work-funny', 'work-professional', 'work-believable', 'work-dramatic',
                             'school-funny', 'school-professional', 'school-believable', 'school-dramatic',
                             'date-funny', 'date-professional', 'date-believable', 'date-dramatic'];
    
    return allCombinations
      .map(combo => ({ combo, count: usageStats.combinationCounts[combo] || 0 }))
      .sort((a, b) => a.count - b.count)
      .slice(0, 3);
  };

  const initializeABTest = () => {
    // Simple A/B test for excuse variations
    const testId = 'excuse-effectiveness-test';
    const userGroup = Math.random() > 0.5 ? 'A' : 'B';
    
    setAbTestGroups(prev => ({
      ...prev,
      [testId]: {
        variantA: ['I\'m stuck in traffic', 'My car broke down', 'The train is delayed'],
        variantB: ['Traffic is unusually heavy today', 'I\'m experiencing vehicle troubles', 'Public transport is running behind'],
        userGroup,
        results: prev[testId]?.results || {
          A: { generations: 0, ratings: 0, positiveRatings: 0 },
          B: { generations: 0, ratings: 0, positiveRatings: 0 }
        }
      }
    }));
  };

  // Custom excuse functions
  const addCustomExcuse = () => {
    if (!newCustomExcuse.trim()) return;
    
    setCustomExcuses(prev => {
      const newExcuses = { ...prev };
      if (!newExcuses[customSituation]) {
        newExcuses[customSituation] = {};
      }
      if (!newExcuses[customSituation][customTone]) {
        newExcuses[customSituation][customTone] = [];
      }
      newExcuses[customSituation][customTone] = [
        ...newExcuses[customSituation][customTone],
        newCustomExcuse.trim()
      ];
      return newExcuses;
    });
    
    setNewCustomExcuse("");
    setShowCustomExcuse(false);
  };

  const deleteCustomExcuse = (excuse: string, situation: string, tone: string) => {
    setCustomExcuses(prev => {
      const newExcuses = { ...prev };
      if (newExcuses[situation] && newExcuses[situation][tone]) {
        newExcuses[situation][tone] = newExcuses[situation][tone].filter(e => e !== excuse);
        
        // Clean up empty arrays and objects
        if (newExcuses[situation][tone].length === 0) {
          delete newExcuses[situation][tone];
        }
        if (Object.keys(newExcuses[situation]).length === 0) {
          delete newExcuses[situation];
        }
      }
      return newExcuses;
    });
  };

  // Template functions
  const generateFromTemplate = (template: string) => {
    const placeholders = template.match(/{([^}]+)}/g) || [];
    let generatedExcuse = template;
    
    placeholders.forEach(placeholder => {
      const key = placeholder.slice(1, -1); // Remove { and }
      const value = templateValues[key] || '[FILL IN]';
      generatedExcuse = generatedExcuse.replace(placeholder, value);
    });
    
    return generatedExcuse;
  };

  const fillTemplate = (templateExcuse: string) => {
    setExcuse(generateFromTemplate(templateExcuse));
    // Add to history
    const historyEntry = {
      excuse: generateFromTemplate(templateExcuse),
      timestamp: new Date(),
      situation,
      tone
    };
    setExcuseHistory(prev => [historyEntry, ...prev].slice(0, 50));
    setShowTemplates(false);
  };

  // Export functions
  const exportFavorites = (format: 'txt' | 'json' | 'csv') => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'txt':
        content = favorites.join('\n');
        filename = 'favorite-excuses.txt';
        mimeType = 'text/plain';
        break;
      case 'json':
        content = JSON.stringify({
          favorites,
          exportDate: new Date().toISOString(),
          totalCount: favorites.length
        }, null, 2);
        filename = 'favorite-excuses.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        content = 'Excuse,Date Added\n' + 
          favorites.map((excuse, index) => `"${excuse.replace(/"/g, '""')}","${new Date().toISOString()}"`).join('\n');
        filename = 'favorite-excuses.csv';
        mimeType = 'text/csv';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportHistory = (format: 'txt' | 'json' | 'csv') => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'txt':
        content = excuseHistory.map((entry, index) => 
          `${index + 1}. ${entry.excuse}\n   Date: ${entry.timestamp.toLocaleDateString()}\n   Context: ${entry.situation} - ${entry.tone}\n`
        ).join('\n');
        filename = 'excuse-history.txt';
        mimeType = 'text/plain';
        break;
      case 'json':
        content = JSON.stringify({
          history: excuseHistory,
          exportDate: new Date().toISOString(),
          totalCount: excuseHistory.length
        }, null, 2);
        filename = 'excuse-history.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        content = 'Excuse,Date,Situation,Tone\n' + 
          excuseHistory.map(entry => 
            `"${entry.excuse.replace(/"/g, '""')}","${entry.timestamp.toISOString()}","${entry.situation}","${entry.tone}"`
          ).join('\n');
        filename = 'excuse-history.csv';
        mimeType = 'text/csv';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to get random incident descriptions in different languages
  const getRandomIncidentDescription = (language: string) => {
    const incidents = {
      en: [
        'Major multi-vehicle collision blocking multiple lanes',
        'Jackknifed semi-truck causing major delays',
        'Vehicle fire with emergency response ongoing',
        'Police investigation blocking traffic flow',
        'Emergency road repairs in progress',
        'Overturned vehicle blocking left lanes',
        'Hazmat spill requiring specialized cleanup',
        'Construction zone accident with injuries',
        'Disabled commercial vehicle blocking traffic',
        'Bridge maintenance reducing lanes',
        'Weather-related incident affecting visibility',
        'Emergency medical response blocking lanes',
        'Debris removal operation in progress',
        'Utility line work requiring lane closures',
        'Traffic signal malfunction causing backups'
      ],
      es: [
        'Colisión mayor de múltiples vehículos bloqueando varios carriles',
        'Camión volcado causando grandes retrasos',
        'Incendio vehicular con respuesta de emergencia',
        'Investigación policial bloqueando el tráfico',
        'Reparaciones de emergencia en progreso',
        'Vehículo volcado bloqueando carriles izquierdos',
        'Derrame de materiales peligrosos requiriendo limpieza',
        'Accidente en zona de construcción con heridos',
        'Vehículo comercial averiado bloqueando tráfico',
        'Mantenimiento de puente reduciendo carriles'
      ],
      fr: [
        'Collision majeure de véhicules multiples bloquant plusieurs voies',
        'Camion renversé causant des retards majeurs',
        'Incendie de véhicule avec intervention d\'urgence',
        'Enquête policière bloquant la circulation',
        'Réparations routières d\'urgence en cours',
        'Véhicule renversé bloquant les voies de gauche',
        'Déversement de matières dangereuses nécessitant nettoyage',
        'Accident en zone de construction avec blessés',
        'Véhicule commercial en panne bloquant circulation',
        'Maintenance de pont réduisant les voies'
      ],
      de: [
        'Schwerer Mehrfahrzeug-Unfall blockiert mehrere Spuren',
        'Umgestürzter LKW verursacht große Verzögerungen',
        'Fahrzeugbrand mit laufendem Notfalleinsatz',
        'Polizeiermittlung blockiert Verkehrsfluss',
        'Notfall-Straßenreparaturen im Gange',
        'Umgestürztes Fahrzeug blockiert linke Spuren',
        'Gefahrgut-Verschüttung erfordert Spezialreinigung',
        'Baustellenunfall mit Verletzten',
        'Liegengebliebenes Nutzfahrzeug blockiert Verkehr',
        'Brückenwartung reduziert Fahrspuren'
      ],
      it: [
        'Grave collisione multipla che blocca diverse corsie',
        'Camion ribaltato che causa gravi ritardi',
        'Incendio veicolare con intervento di emergenza',
        'Indagine di polizia che blocca il traffico',
        'Riparazioni stradali di emergenza in corso',
        'Veicolo ribaltato che blocca corsie di sinistra',
        'Sversamento materiali pericolosi richiede pulizia',
        'Incidente in zona cantiere con feriti',
        'Veicolo commerciale in panne blocca traffico',
        'Manutenzione ponte riduce corsie'
      ],
      pt: [
        'Grave colisão de múltiplos veículos bloqueando várias faixas',
        'Caminhão tombado causando grandes atrasos',
        'Incêndio veicular com resposta de emergência',
        'Investigação policial bloqueando tráfego',
        'Reparos rodoviários de emergência em andamento',
        'Veículo capotado bloqueando faixas esquerdas',
        'Vazamento de materiais perigosos requer limpeza',
        'Acidente em zona de construção com feridos',
        'Veículo comercial quebrado bloqueia tráfego',
        'Manutenção de ponte reduzindo faixas'
      ],
      ru: [
        'Серьезное столкновение нескольких автомобилей блокирует несколько полос',
        'Перевернувшийся грузовик вызывает серьезные задержки',
        'Пожар транспортного средства с аварийным реагированием',
        'Полицейское расследование блокирует движение',
        'Аварийный ремонт дороги в процессе',
        'Перевернутое транспортное средство блокирует левые полосы',
        'Разлив опасных материалов требует очистки',
        'Авария в зоне строительства с пострадавшими',
        'Сломанное коммерческое транспортное средство блокирует движение',
        'Обслуживание моста сокращает полосы'
      ],
      ja: [
        '複数の車線を封鎖する重大な多重車両衝突',
        '大型トラックの横転により大幅な遅延',
        '緊急対応中の車両火災',
        '交通の流れを阻害する警察の捜査',
        '進行中の緊急道路修理',
        '左車線を塞ぐ横転車両',
        '専門清掃を要する危険物流出',
        '負傷者のいる工事現場事故',
        '交通を阻害する故障商用車',
        '車線を減らす橋梁保守'
      ]
    };
    
    const languageIncidents = incidents[language as keyof typeof incidents] || incidents.en;
    return languageIncidents[Math.floor(Math.random() * languageIncidents.length)];
  };

  // Image generation functions for premium tools
  
  // Function to get realistic highways based on location
  const getLocalHighways = (locationInfo: any) => {
    const state = locationInfo?.state?.toLowerCase() || '';
    const city = locationInfo?.city?.toLowerCase() || '';
    
    // Major metropolitan area highway mapping
    const regionalHighways = {
      // Texas highways
      texas: {
        interstates: ['I-35', 'I-45', 'I-10', 'I-20', 'I-30', 'I-635', 'I-820'],
        usRoutes: ['US-75', 'US-183', 'US-380', 'US-121', 'US-114', 'US-287'],
        stateRoutes: ['TX-114', 'TX-121', 'TX-183', 'TX-360', 'TX-161']
      },
      // California highways  
      california: {
        interstates: ['I-5', 'I-405', 'I-10', 'I-110', 'I-605', 'I-210', 'I-101'],
        usRoutes: ['US-101', 'US-1', 'US-395', 'US-99'],
        stateRoutes: ['CA-1', 'CA-91', 'CA-134', 'CA-170']
      },
      // New York highways
      'new york': {
        interstates: ['I-95', 'I-87', 'I-278', 'I-495', 'I-678', 'I-295'],
        usRoutes: ['US-1', 'US-9', 'US-206'],
        stateRoutes: ['NY-25', 'NY-27', 'NY-135']
      },
      // Florida highways
      florida: {
        interstates: ['I-95', 'I-75', 'I-4', 'I-275', 'I-375', 'I-595'],
        usRoutes: ['US-1', 'US-19', 'US-41', 'US-192'],
        stateRoutes: ['FL-826', 'FL-836', 'FL-112']
      },
      // Illinois highways
      illinois: {
        interstates: ['I-94', 'I-90', 'I-55', 'I-57', 'I-290', 'I-355'],
        usRoutes: ['US-41', 'US-12', 'US-20', 'US-45'],
        stateRoutes: ['IL-53', 'IL-83', 'IL-31']
      },
      // Default/Generic highways for other areas
      default: {
        interstates: ['I-75', 'I-85', 'I-65', 'I-40', 'I-70', 'I-80'],
        usRoutes: ['US-1', 'US-50', 'US-60', 'US-70'],
        stateRoutes: ['Route 9', 'Route 17', 'Route 23']
      }
    };
    
    // Dallas-Fort Worth specific highways (for Coppell, Texas)
    if (city.includes('coppell') || city.includes('dallas') || city.includes('plano') || city.includes('irving')) {
      return {
        interstates: ['I-35E', 'I-635', 'I-820', 'I-30', 'I-20'],
        usRoutes: ['US-75', 'US-121', 'US-114', 'US-380'],
        stateRoutes: ['TX-114', 'TX-121', 'TX-183', 'TX-360']
      };
    }
    
    return (regionalHighways as any)[state] || regionalHighways['texas'] || regionalHighways['default'];
  };

  const generateWeatherAlertImage = (weatherData: any, locationInfo: any, alertInfo: any) => {
    const canvas = document.createElement('canvas');
    canvas.width = 850;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Professional weather document background
    const gradient = ctx.createLinearGradient(0, 0, 0, 700);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 850, 700);
    
    // Official header with seal area
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(0, 0, 850, 120);
    
    // Draw official seal placeholder (circle)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(70, 60, 35, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.arc(70, 60, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Seal text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NOAA', 70, 58);
    ctx.fillText('NWS', 70, 68);
    
    // Main header text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NATIONAL WEATHER SERVICE', 425, 45);
    ctx.font = 'bold 20px Arial';
    ctx.fillText('WEATHER ALERT NOTIFICATION', 425, 75);
    
    // Office designation
    ctx.font = '14px Arial';
    ctx.fillText('Dallas/Fort Worth, TX Office', 425, 100);
    
    // Alert status bar
    const alertColor = alertInfo.severity === 'WARNING' ? '#dc2626' : 
                      alertInfo.severity === 'WATCH' ? '#ea580c' : '#059669';
    ctx.fillStyle = alertColor;
    ctx.fillRect(0, 120, 850, 60);
    
    // Alert text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${alertInfo.type.toUpperCase()} ${alertInfo.severity}`, 425, 155);
    
    // Document body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, 200, 810, 480);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 200, 810, 480);
    
    // Document header
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('OFFICIAL WEATHER ADVISORY', 40, 230);
    
    // Horizontal line
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 240);
    ctx.lineTo(810, 240);
    ctx.stroke();
    
    // Current date and time
    const now = new Date();
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.fillText(`Issued: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 40, 260);
    ctx.fillText(`Alert ID: NWS-${Math.floor(Math.random() * 90000) + 10000}`, 600, 260);
    
    // Location information
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('AFFECTED AREA:', 40, 300);
    ctx.font = '14px Arial';
    ctx.fillText(`${locationInfo.city}${locationInfo.state ? `, ${locationInfo.state}` : ''} and surrounding counties`, 40, 320);
    
    // Weather details
    ctx.font = 'bold 16px Arial';
    ctx.fillText('CURRENT CONDITIONS:', 40, 360);
    ctx.font = '14px Arial';
    ctx.fillText(`Temperature: ${weatherData?.temperature || '45'}°F`, 40, 385);
    ctx.fillText(`Conditions: ${weatherData?.description || 'Severe weather conditions'}`, 40, 405);
    ctx.fillText(`Wind Speed: ${weatherData?.windSpeed || '35'} mph`, 40, 425);
    ctx.fillText(`Humidity: ${weatherData?.humidity || '85'}%`, 40, 445);
    
    // Impact statement
    ctx.font = 'bold 16px Arial';
    ctx.fillText('EXPECTED IMPACTS:', 40, 485);
    ctx.font = '14px Arial';
    ctx.fillText('• Travel will be extremely difficult or impossible', 40, 510);
    ctx.fillText('• Widespread power outages expected', 40, 530);
    ctx.fillText('• Emergency services may be limited', 40, 550);
    
    // Safety information
    ctx.font = 'bold 16px Arial';
    ctx.fillText('RECOMMENDED ACTIONS:', 40, 590);
    ctx.font = '14px Arial';
    ctx.fillText('• Avoid all non-essential travel', 40, 615);
    ctx.fillText('• Stay indoors and away from windows', 40, 635);
    ctx.fillText('• Monitor weather radio for updates', 40, 655);
    
    // Footer
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('This is an official notification from the National Weather Service', 425, 690);
    
    return canvas.toDataURL('image/png');
  };

  const generateTrafficReportImage = (trafficData: any, locationInfo: any) => {
    const canvas = document.createElement('canvas');
    canvas.width = 850;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Professional document background
    const gradient = ctx.createLinearGradient(0, 0, 0, 750);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f9fafb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 850, 750);
    
    // Official header
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 850, 100);
    
    // Department seal
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(70, 50, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(70, 50, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // Seal text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TXDOT', 70, 48);
    ctx.fillText('TRAFFIC', 70, 57);
    
    // Main header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TEXAS DEPARTMENT OF TRANSPORTATION', 425, 40);
    ctx.font = 'bold 16px Arial';
    ctx.fillText('TRAFFIC INCIDENT REPORT', 425, 65);
    ctx.font = '12px Arial';
    ctx.fillText('District Office - Dallas/Fort Worth', 425, 85);
    
    // Alert status banner
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 100, 850, 50);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ACTIVE TRAFFIC INCIDENT', 425, 130);
    
    // Document body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(30, 170, 790, 550);
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 170, 790, 550);
    
    // Document header
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('OFFICIAL TRAFFIC REPORT', 50, 200);
    
    // Report details box
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(50, 210, 750, 80);
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 210, 750, 80);
    
    // Report header info
    const now = new Date();
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('INCIDENT DETAILS', 60, 230);
    ctx.font = '12px Arial';
    ctx.fillText(`Report Date: ${now.toLocaleDateString()}`, 60, 250);
    ctx.fillText(`Report Time: ${now.toLocaleTimeString()}`, 60, 268);
    ctx.fillText(`Incident ID: TXD-${Math.floor(Math.random() * 90000) + 10000}`, 450, 250);
    ctx.fillText(`Status: ACTIVE`, 450, 268);
    
    // Location section
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('LOCATION INFORMATION:', 50, 320);
    ctx.font = '14px Arial';
    
    // Use location-aware highway for the image
    const highways = getLocalHighways(locationInfo);
    const selectedHighway = [...highways.interstates, ...highways.usRoutes][Math.floor(Math.random() * ([...highways.interstates, ...highways.usRoutes].length))];
    
    ctx.fillText(`Highway: ${selectedHighway}`, 60, 345);
    ctx.fillText(`Direction: ${['Northbound', 'Southbound', 'Eastbound', 'Westbound'][Math.floor(Math.random() * 4)]}`, 60, 365);
    ctx.fillText(`Mile Marker: ${Math.floor(Math.random() * 50) + 100}`, 60, 385);
    ctx.fillText(`City/Area: ${locationInfo.city}${locationInfo.state ? `, ${locationInfo.state}` : ''}`, 60, 405);
    
    // Incident details
    ctx.font = 'bold 16px Arial';
    ctx.fillText('INCIDENT TYPE:', 50, 445);
    ctx.font = '14px Arial';
    ctx.fillText(`Primary: ${trafficData?.type || 'Multi-vehicle collision'}`, 60, 470);
    ctx.fillText(`Severity: ${['Minor', 'Moderate', 'Major'][Math.floor(Math.random() * 3)]}`, 60, 490);
    ctx.fillText(`Vehicles Involved: ${Math.floor(Math.random() * 3) + 2}`, 60, 510);
    
    // Impact assessment
    ctx.font = 'bold 16px Arial';
    ctx.fillText('TRAFFIC IMPACT:', 50, 550);
    ctx.font = '14px Arial';
    ctx.fillText(`Lanes Blocked: ${Math.floor(Math.random() * 3) + 1} of ${Math.floor(Math.random() * 2) + 3}`, 60, 575);
    ctx.fillText(`Expected Duration: ${Math.floor(Math.random() * 3) + 2} hours`, 60, 595);
    ctx.fillText(`Alternate Route: Use frontage road or parallel highways`, 60, 615);
    
    // Emergency response
    ctx.font = 'bold 16px Arial';
    ctx.fillText('EMERGENCY RESPONSE:', 450, 445);
    ctx.font = '14px Arial';
    ctx.fillText('• State Troopers on scene', 460, 470);
    ctx.fillText('• Emergency medical services dispatched', 460, 490);
    ctx.fillText('• Tow trucks en route', 460, 510);
    ctx.fillText('• Traffic control established', 460, 530);
    
    // Advisory information
    ctx.font = 'bold 16px Arial';
    ctx.fillText('MOTORIST ADVISORY:', 450, 570);
    ctx.font = '14px Arial';
    ctx.fillText('• Expect significant delays', 460, 595);
    ctx.fillText('• Use extreme caution in area', 460, 615);
    ctx.fillText('• Follow flagman directions', 460, 635);
    
    // Footer with official info
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('This report is generated by TxDOT Traffic Management Center', 425, 730);
    ctx.fillText('For real-time traffic information, visit DriveTexas.org', 425, 742);
    
    return canvas.toDataURL('image/png');
  };

  const generateMedicalDocumentImage = (patientName: string, locationInfo: any, patientDateOfBirth?: string) => {
    console.log('generateMedicalDocumentImage called');
    console.log('patientName:', patientName);
    console.log('locationInfo:', locationInfo);
    console.log('patientDateOfBirth:', patientDateOfBirth);
    
    const canvas = document.createElement('canvas');
    canvas.width = 850;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Select consistent doctor name for entire document
    const doctorNames = [
      { full: 'Dr. Sarah Johnson', last: 'Johnson' },
      { full: 'Dr. Michael Smith', last: 'Smith' },
      { full: 'Dr. Emily Williams', last: 'Williams' },
      { full: 'Dr. David Brown', last: 'Brown' },
      { full: 'Dr. Lisa Davis', last: 'Davis' }
    ];
    const selectedDoctor = doctorNames[Math.floor(Math.random() * doctorNames.length)];
    
    // Generate realistic patient information
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    
    // Use provided name or generate realistic one
    let finalPatientName = patientName;
    if (!patientName || patientName === 'Emergency Medical Certificate' || patientName === 'Patient') {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      finalPatientName = `${firstName} ${lastName}`;
    }
    
    // Generate realistic patient details
    let dateOfBirth;
    if (patientDateOfBirth) {
      // Use provided date of birth
      dateOfBirth = new Date(patientDateOfBirth);
    } else {
      // Generate realistic age if not provided
      const birthYear = 1970 + Math.floor(Math.random() * 35); // Age 20-55
      const birthMonth = Math.floor(Math.random() * 12);
      const birthDay = Math.floor(Math.random() * 28) + 1;
      dateOfBirth = new Date(birthYear, birthMonth, birthDay);
    }
    
    const patientId = `P-${Math.floor(Math.random() * 900000) + 100000}`;
    const medicalRecordNumber = `MR-${Math.floor(Math.random() * 90000) + 10000}`;
    
    // Emergency contact information
    const emergencyContacts = [
      'Jane Doe (Spouse) - (214) 555-0123',
      'Robert Smith (Father) - (214) 555-0145', 
      'Maria Rodriguez (Sister) - (214) 555-0167',
      'Tom Johnson (Brother) - (214) 555-0189'
    ];
    const emergencyContact = emergencyContacts[Math.floor(Math.random() * emergencyContacts.length)];
    
    // Professional medical document background
    const gradient = ctx.createLinearGradient(0, 0, 0, 1100);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#fefefe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 850, 1100);
    
    // Medical letterhead with logo area
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(0, 0, 850, 120);
    
    // Medical symbol (cross)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(70, 35, 8, 50);
    ctx.fillRect(48, 55, 50, 8);
    
    // Main header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DALLAS URGENT CARE MEDICAL CENTER', 425, 45);
    ctx.font = '16px Arial';
    ctx.fillText('Certified Healthcare Providers • Est. 1995', 425, 70);
    ctx.font = '14px Arial';
    ctx.fillText('License #TX-UC-2024-447 • NPI: 1234567890', 425, 95);
    
    // Medical document header
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(50, 150, 750, 60);
    ctx.fillStyle = '#1565c0';
    ctx.strokeStyle = '#1565c0';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 150, 750, 60);
    
    ctx.fillStyle = '#1565c0';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MEDICAL EXCUSE CERTIFICATE', 425, 185);
    
    // Document body with border
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(50, 230, 750, 800);
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 230, 750, 800);
    
    // Official document header
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('OFFICIAL MEDICAL DOCUMENTATION', 70, 260);
    
    // Date and document info
    const now = new Date();
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.fillText(`Document Date: ${now.toLocaleDateString()}`, 70, 285);
    ctx.fillText(`Document Time: ${now.toLocaleTimeString()}`, 70, 302);
    ctx.fillText(`Certificate ID: MC-${Math.floor(Math.random() * 90000) + 10000}`, 500, 285);
    ctx.fillText(`Provider ID: DUC-${Math.floor(Math.random() * 9000) + 1000}`, 500, 302);
    
    // Horizontal divider
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 320);
    ctx.lineTo(780, 320);
    ctx.stroke();
    
    // Patient information section
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('PATIENT INFORMATION:', 70, 350);
    
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(70, 360, 710, 140);
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 360, 710, 140);
    
    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial';
    ctx.fillText(`Patient Name: ${finalPatientName}`, 90, 385);
    ctx.fillText(`Date of Birth: ${dateOfBirth.toLocaleDateString()}`, 90, 405);
    ctx.fillText(`Patient ID: ${patientId}`, 90, 425);
    ctx.fillText(`Date of Examination: ${now.toLocaleDateString()}`, 450, 385);
    ctx.fillText(`Time of Examination: ${now.toLocaleTimeString()}`, 450, 405);
    ctx.fillText(`Attending Physician: ${selectedDoctor.full}`, 450, 425);
    ctx.fillText(`Medical Record #: ${medicalRecordNumber}`, 90, 455);
    ctx.fillText(`Insurance Verified: Yes`, 450, 455);
    
    // Additional patient details
    ctx.fillText(`Emergency Contact: ${emergencyContact}`, 90, 475);
    
    // Medical findings section
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('CLINICAL FINDINGS:', 70, 540);
    
    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial';
    ctx.fillText('Following comprehensive medical examination, the following conditions were observed:', 90, 565);
    
    const conditions = [
      'Acute viral syndrome with associated symptoms',
      'Moderate to severe respiratory distress',
      'Elevated temperature and systemic inflammation',
      'Recommended bed rest and medical monitoring'
    ];
    
    conditions.forEach((condition, index) => {
      ctx.fillText(`• ${condition}`, 90, 590 + (index * 25));
    });
    
    // Medical recommendation section
    ctx.font = 'bold 16px Arial';
    ctx.fillText('MEDICAL RECOMMENDATIONS:', 70, 710);
    
    ctx.font = '14px Arial';
    ctx.fillText('Based on the clinical examination and current health status:', 90, 735);
    
    const recommendations = [
      'Patient is medically excused from work/school activities',
      `Recommended rest period: ${Math.floor(Math.random() * 3) + 1} to ${Math.floor(Math.random() * 3) + 4} days`,
      'Follow-up appointment scheduled if symptoms persist',
      'Return to normal activities when symptom-free for 24 hours'
    ];
    
    recommendations.forEach((rec, index) => {
      ctx.fillText(`• ${rec}`, 90, 760 + (index * 25));
    });
    
    // Provider certification section
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(70, 870, 710, 2);
    
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('PROVIDER CERTIFICATION:', 70, 900);
    
    ctx.font = '14px Arial';
    ctx.fillText('I hereby certify that the above patient was examined by me on the date stated', 90, 925);
    ctx.fillText('above and that the medical findings and recommendations are accurate.', 90, 945);
    
    // Physician signature - handwritten style
    // Draw handwritten signature
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Create signature path (cursive-style)
    ctx.beginPath();
    // First letter (large)
    ctx.moveTo(110, 965);
    ctx.bezierCurveTo(115, 955, 125, 960, 130, 970);
    ctx.bezierCurveTo(135, 980, 140, 975, 145, 965);
    
    // Middle part (flowing)
    ctx.moveTo(150, 970);
    ctx.bezierCurveTo(160, 965, 170, 975, 180, 970);
    ctx.bezierCurveTo(190, 965, 200, 980, 210, 970);
    ctx.bezierCurveTo(220, 960, 230, 975, 240, 970);
    
    // Last name initial (larger)
    ctx.moveTo(260, 960);
    ctx.bezierCurveTo(270, 950, 280, 965, 285, 975);
    ctx.bezierCurveTo(290, 985, 295, 970, 300, 960);
    
    // Final flourish
    ctx.moveTo(305, 970);
    ctx.bezierCurveTo(320, 965, 335, 980, 350, 975);
    ctx.bezierCurveTo(360, 970, 365, 965, 370, 970);
    
    ctx.stroke();
    
    // Add some signature dots/marks for authenticity
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(375, 968, 1, 0, 2 * Math.PI);
    ctx.fill();
    
    // Signature area
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 990);
    ctx.lineTo(400, 990);
    ctx.stroke();
    
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.fillText('Physician Signature', 90, 1005);
    ctx.fillText(`Date: ${now.toLocaleDateString()}`, 320, 1005);
    
    // Add typed doctor name below signature
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText(`${selectedDoctor.full}, MD`, 90, 1020);
    
    // Medical license info
    ctx.beginPath();
    ctx.moveTo(450, 990);
    ctx.lineTo(760, 990);
    ctx.stroke();
    
    ctx.fillText('Medical License Number', 450, 1005);
    ctx.fillText(`TX-${Math.floor(Math.random() * 90000) + 10000}`, 650, 1005);
    
    // Footer with contact info
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Dallas Urgent Care Medical Center • 123 Medical Plaza Dr. • Dallas, TX 75201', 425, 1090);
    ctx.fillText('Phone: (214) 555-CARE • Fax: (214) 555-0199 • www.dallasurgentcare.com', 425, 1105);
    
    console.log('Medical document image generated successfully');
    return canvas.toDataURL('image/png');
  };

  const downloadImageFile = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const generateMedicalProofWithPatientInfo = async () => {
    console.log('generateMedicalProofWithPatientInfo called');
    console.log('Patient name:', patientName);
    console.log('Patient DOB:', patientDateOfBirth);
    
    if (!patientName.trim()) {
      alert('Please enter your name');
      return;
    }

    setShowPatientInfoDialog(false);
    setIsGeneratingProof(true);
    
    // Ensure we're in the main app view
    setShowSettings(false);
    setShowShare(false);
    
    try {
      // Use a default location for medical certificates to avoid API issues
      const locationForImage = userLocation || {
        city: 'Dallas',
        state: 'TX',
        lat: 32.7767,
        lon: -96.7970,
        address: 'Dallas, TX'
      };

      console.log('Using location for medical certificate:', locationForImage);

      // Generate medical certificate with user's name
      const proofImage = await generateMedicalDocumentImage(patientName.trim(), locationForImage, patientDateOfBirth);
      
      console.log('Medical document image result:', proofImage ? 'Generated successfully' : 'Failed to generate');
      
      if (proofImage) {
        console.log('Setting generated proof with medical certificate');
        setGeneratedProof({
          type: 'Medical Certificate',
          content: 'Official medical documentation has been generated.',
          image: proofImage
        });
        
        // Show success message
        console.log('Medical certificate generated successfully');
      } else {
        console.error('Failed to generate medical certificate image');
        alert('Failed to generate medical certificate image. Please try again.');
      }
      
    } catch (error) {
      console.error('Error generating medical proof:', error);
      alert('Failed to generate medical certificate. Please try again.');
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const generateProof = async (type: 'weather' | 'traffic' | 'medical') => {
    console.log('generateProof called with type:', type, 'isPremium:', isPremium);
    console.log('showPatientInfoDialog state:', showPatientInfoDialog);
    
    if (!isPremium) {
      console.log('User is not premium, showing premium dialog');
      setShowPremium(true);
      return;
    }

    // For medical certificates, show patient info dialog first
    if (type === 'medical') {
      console.log('Showing patient info dialog for medical certificate');
      setShowPatientInfoDialog(true);
      return;
    }

    if (isGeneratingProof) return; // Prevent multiple simultaneous generations
    
    setIsGeneratingProof(true);
    
    // Ensure we're in the main app view, not in settings or other screens
    setShowSettings(false);
    setShowShare(false);
    setShowPremium(false);

    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const currentDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    // Use real location data if available, otherwise fallback to localized generic data
    const getLocationInfo = () => {
      if (userLocation && userLocation.city) {
        return {
          city: userLocation.city,
          state: userLocation.state || '',
          address: userLocation.address || `${userLocation.city}, ${userLocation.state || ''}`,
          neighborhood: userLocation.neighborhood || ''
        };
      }
      // Fallback to generic localized data
      const localizedCities = {
        en: ['Downtown', 'Midtown', 'North Side', 'South District', 'East End', 'West Hills', 'Central'],
        es: ['Centro', 'Zona Media', 'Lado Norte', 'Distrito Sur', 'Extremo Este', 'Colinas Oeste', 'Central'],
        fr: ['Centre-ville', 'Quartier Central', 'Côté Nord', 'District Sud', 'Extrémité Est', 'Collines Ouest', 'Central'],
        de: ['Innenstadt', 'Stadtmitte', 'Nordseite', 'Südbezirk', 'Ostende', 'Westhügel', 'Zentral'],
        it: ['Centro', 'Zona Centrale', 'Lato Nord', 'Distretto Sud', 'Estremo Est', 'Colline Ovest', 'Centrale'],
        pt: ['Centro', 'Zona Central', 'Lado Norte', 'Distrito Sul', 'Extremo Leste', 'Colinas Oeste', 'Central'],
        ru: ['Центр', 'Средний район', 'Северная сторона', 'Южный район', 'Восточный край', 'Западные холмы', 'Центральный'],
        ja: ['ダウンタウン', 'ミッドタウン', 'ノースサイド', '南地区', 'イーストエンド', 'ウェストヒルズ', 'セントラル']
      };
      
      const localizedStreets = {
        en: ['Main St', 'Oak Ave', 'First St', 'Park Rd', 'Cedar Blvd', 'Pine Ave', 'Maple Dr'],
        es: ['Calle Principal', 'Av. del Roble', 'Primera St', 'Rd. del Parque', 'Blvd. Cedro', 'Av. Pino', 'Dr. Arce'],
        fr: ['Rue Principale', 'Ave. du Chêne', 'Première Rue', 'Rd. du Parc', 'Blvd. Cèdre', 'Ave. Pin', 'Dr. Érable'],
        de: ['Hauptstraße', 'Eichen-Allee', 'Erste Straße', 'Park-Weg', 'Zedern-Boulevard', 'Kiefern-Allee', 'Ahorn-Dr.'],
        it: ['Via Principale', 'Viale Quercia', 'Prima Strada', 'Via Parco', 'Viale Cedro', 'Viale Pino', 'Via Acero'],
        pt: ['Rua Principal', 'Ave. do Carvalho', 'Primeira Rua', 'Est. do Parque', 'Blvd. Cedro', 'Ave. Pinho', 'Dr. Bordo'],
        ru: ['Главная ул.', 'Дубовый пр.', 'Первая ул.', 'Парковая дор.', 'Кедровый бул.', 'Сосновый пр.', 'Кленовый др.'],
        ja: ['メイン通り', 'オーク大通り', 'ファースト街', 'パーク通り', 'シダー大通り', 'パイン大通り', 'メープル通り']
      };
      
      const cities = localizedCities[selectedLanguage] || localizedCities['en'];
      const streets = localizedStreets[selectedLanguage] || localizedStreets['en'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomStreet = streets[Math.floor(Math.random() * streets.length)];
      
      return {
        city: randomCity,
        state: '',
        address: `${randomStreet}, ${randomCity}`,
        neighborhood: randomCity
      };
    };
    
    const locationInfo = getLocationInfo();
    // Keep these for backward compatibility with existing traffic/medical generators
    const randomCity = locationInfo.city;
    const randomStreet = locationInfo.address.split(',')[0] || 'Main St';
    
    // Official phone numbers for SMS format
    const officialNumbers = {
      weather: {
        en: ['(555) NWS-WARN', '67283 (NWS)', '+1-555-WEATHER'],
        es: ['(555) MET-ALAR', '62834 (METEO)', '+34-555-TIEMPO'],
        fr: ['(555) MET-ALER', '63836 (METEO)', '+33-555-METEO'],
        de: ['(555) WET-WARN', '93883 (WETTER)', '+49-555-WETTER'],
        it: ['(555) MET-ALAR', '63836 (METEO)', '+39-555-METEO'],
        pt: ['(555) MET-ALAR', '63836 (METEO)', '+351-555-TEMPO'],
        ru: ['(555) ПОГ-ПРЕД', '76476 (ПОГОДА)', '+7-555-ПОГОДА'],
        ja: ['(555) 天気-警報', '83654 (天気)', '+81-555-天気']
      },
      traffic: {
        en: ['DOT-ALERT', '368-2537', '+1-555-DOT-INFO'],
        es: ['DGT-ALERT', '348-2537', '+34-555-DGT-INFO'],
        fr: ['DDE-ALERT', '333-2537', '+33-555-DDE-INFO'],
        de: ['BAB-ALERT', '222-2537', '+49-555-BAB-INFO'],
        it: ['AUT-ALERT', '288-2537', '+39-555-AUT-INFO'],
        pt: ['EP-ALERT', '37-2537', '+351-555-EP-INFO'],
        ru: ['ГИБ-ALERT', '442-2537', '+7-555-ГИБДД'],
        ja: ['道路-警報', '368-2537', '+81-555-道路情報']
      },
      medical: {
        en: ['(555) 123-4567', '(555) 987-6543', '(555) 246-8135'],
        es: ['(555) 123-4567', '(555) 987-6543', '(555) 246-8135'],
        fr: ['(555) 123-4567', '(555) 987-6543', '(555) 246-8135'],
        de: ['(555) 123-4567', '(555) 987-6543', '(555) 246-8135'],
        it: ['(555) 123-4567', '(555) 987-6543', '(555) 246-8135'],
        pt: ['(555) 123-4567', '(555) 987-6543', '(555) 246-8135'],
        ru: ['(555) 123-4567', '(555) 987-6543', '(555) 246-8135'],
        ja: ['(555) 123-4567', '(555) 987-6543', '(555) 246-8135']
      }
    };
    
    const proofGenerators = {
      weather: () => {
        // Use real weather data if available, but enhance it for excuse generation
        const getWeatherCondition = () => {
          if (liveWeatherData) {
            // If weather is clear, we can still generate weather excuses by predicting upcoming weather or using nearby weather
            if (liveWeatherData.condition === 'Clear') {
              // For excuse purposes, generate a "developing weather situation"
              const developingConditions = [
                { type: 'Severe Thunderstorm', icon: '⛈️', severity: 'WARNING', details: 'Rapid storm development expected - conditions deteriorating quickly' },
                { type: 'Flash Flood Watch', icon: '🌊', severity: 'WATCH', details: 'Sudden weather change - flash flood conditions possible' },
                { type: 'High Wind Advisory', icon: '💨', severity: 'ADVISORY', details: 'Unexpected wind advisory issued - gusts up to 45 mph expected' },
                { type: 'Dense Fog Advisory', icon: '🌫️', severity: 'ADVISORY', details: 'Rapidly developing fog - visibility dropping to near zero' }
              ];
              return developingConditions[Math.floor(Math.random() * developingConditions.length)];
            }
            
            // Enhanced mapping for existing weather conditions
            return {
              type: liveWeatherData.condition === 'Thunderstorm' ? 'Severe Thunderstorm' :
                   liveWeatherData.condition === 'Rain' ? 'Heavy Rain' :
                   liveWeatherData.condition === 'Snow' ? 'Winter Storm' :
                   liveWeatherData.condition === 'Fog' ? 'Dense Fog' :
                   liveWeatherData.condition === 'Clouds' ? 'Severe Weather Developing' :
                   liveWeatherData.condition === 'Drizzle' ? 'Freezing Drizzle' : 'Severe Weather',
              icon: liveWeatherData.condition === 'Thunderstorm' ? '⛈️' :
                   liveWeatherData.condition === 'Rain' || liveWeatherData.condition === 'Drizzle' ? '🌧️' :
                   liveWeatherData.condition === 'Snow' ? '❄️' :
                   liveWeatherData.condition === 'Fog' ? '🌫️' :
                   liveWeatherData.condition === 'Clouds' ? '☁️' : '🌦️',
              severity: liveWeatherData.condition === 'Thunderstorm' ? 'WARNING' : 
                       (liveWeatherData.condition === 'Rain' || liveWeatherData.condition === 'Drizzle') ? 'WATCH' : 
                       liveWeatherData.condition === 'Snow' ? 'WARNING' : 
                       liveWeatherData.condition === 'Fog' ? 'ADVISORY' : 'WATCH',
              details: liveWeatherData.condition === 'Thunderstorm' ? 'Severe thunderstorms with damaging winds and heavy rain' :
                      (liveWeatherData.condition === 'Rain' || liveWeatherData.condition === 'Drizzle') ? 'Heavy rainfall creating hazardous travel conditions' :
                      liveWeatherData.condition === 'Snow' ? 'Heavy snow creating dangerous driving conditions' :
                      liveWeatherData.condition === 'Fog' ? 'Dense fog reducing visibility to less than 1/4 mile' :
                      liveWeatherData.condition === 'Clouds' ? 'Rapidly developing severe weather conditions' :
                      liveWeatherData.description || 'Severe weather conditions affecting travel'
            };
          }
          // Fallback to generic conditions
          const conditions = [
            { type: 'Severe Thunderstorm', icon: '⛈️', severity: 'WARNING', details: 'Hail up to 1 inch diameter, winds up to 70 mph' },
            { type: 'Flash Flood', icon: '🌊', severity: 'WATCH', details: 'Rainfall rates of 2-3 inches per hour expected' },
            { type: 'Ice Storm', icon: '🧊', severity: 'WARNING', details: 'Ice accumulation of 0.25 to 0.5 inches' },
            { type: 'Dense Fog', icon: '🌫️', severity: 'ADVISORY', details: 'Visibility reduced to less than 1/4 mile' },
            { type: 'High Wind', icon: '💨', severity: 'WARNING', details: 'Sustained winds of 40-50 mph, gusts up to 75 mph' }
          ];
          return conditions[Math.floor(Math.random() * conditions.length)];
        };
        
        const condition = getWeatherCondition();
        const temp = liveWeatherData ? liveWeatherData.temperature : Math.floor(Math.random() * 40) + 20;
        const alertId = `NWS${Math.floor(Math.random() * 9000) + 1000}`;
        
        // Location-aware weather office codes and state codes
        const getWeatherOfficeInfo = () => {
          const state = locationInfo?.state?.toLowerCase() || '';
          const city = locationInfo?.city?.toLowerCase() || '';
          
          // Dallas-Fort Worth area (including Coppell)
          if (city.includes('coppell') || city.includes('dallas') || city.includes('plano') || city.includes('irving')) {
            return {
              wfoCode: ['FWD', 'SHV', 'HGX'][Math.floor(Math.random() * 3)], // Dallas, Shreveport, Houston offices
              stateCode: 'TX'
            };
          }
          
          const regionalOffices = {
            texas: {
              wfoCode: ['FWD', 'HGX', 'EWX', 'MAF', 'LUB', 'AMA'],
              stateCode: 'TX'
            },
            california: {
              wfoCode: ['LOX', 'SGX', 'MTR', 'STO', 'HNX'],
              stateCode: 'CA'
            },
            'new york': {
              wfoCode: ['OKX', 'ALY', 'BGM', 'BUF'],
              stateCode: 'NY'
            },
            florida: {
              wfoCode: ['MFL', 'TBW', 'MLB', 'JAX', 'TAE'],
              stateCode: 'FL'
            },
            illinois: {
              wfoCode: ['LOT', 'ILX', 'DVN'],
              stateCode: 'IL'
            },
            default: {
              wfoCode: ['LOT', 'GRB', 'MKX', 'DVN', 'ARX'],
              stateCode: ['TX', 'CA', 'NY', 'FL', 'IL'][Math.floor(Math.random() * 5)]
            }
          };
          
          const officeInfo = (regionalOffices as any)[state] || regionalOffices['texas'] || regionalOffices['default'];
          return {
            wfoCode: officeInfo.wfoCode[Math.floor(Math.random() * officeInfo.wfoCode.length)],
            stateCode: officeInfo.stateCode
          };
        };
        
        const weatherOffice = getWeatherOfficeInfo();
        const wfoCode = weatherOffice.wfoCode;
        const ugcCode = `${weatherOffice.stateCode}C${String(Math.floor(Math.random() * 200) + 1).padStart(3, '0')}`;
        const vtecCode = `/O.NEW.K${wfoCode}.SV.W.${Math.floor(Math.random() * 9000) + 1000}.250919T${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}Z-250920T0600Z/`;
        
        return {
          type: 'National Weather Service Alert',
          content: `${condition.icon}  NATIONAL WEATHER SERVICE ${wfoCode.toUpperCase()} OFFICE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URGENT - IMMEDIATE BROADCAST REQUESTED
${condition.type} ${condition.severity} in effect until 6:00 AM ${new Date(now.getTime() + 24*60*60*1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VTEC: ${vtecCode}
UGC: ${ugcCode}
Alert ID: ${alertId}
Issued: ${currentTime} ${currentDate}

AFFECTED AREA: ${locationInfo.city}${locationInfo.state ? `, ${locationInfo.state}` : ''} County and surrounding areas
${userLocation ? `SPECIFIC LOCATION: ${locationInfo.address}` : ''}

SOURCE: Doppler radar and trained weather spotters

DETAILS: ${condition.details}

IMPACTS: 
★ Travel will be extremely difficult to impossible
★ Widespread power outages expected  
★ Emergency services may be limited or suspended
★ Property damage likely

PRECAUTIONARY/PREPAREDNESS ACTIONS:
Stay indoors and away from windows. Avoid all unnecessary travel.
If you must travel, keep a flashlight, food, water and warm clothing
in your vehicle. Monitor NOAA Weather Radio for updates.

This warning will be updated as conditions warrant.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUED BY: National Weather Service ${wfoCode.toUpperCase()} Office
METEOROLOGIST: ${['John Smith', 'Sarah Johnson', 'Michael Davis', 'Lisa Chen'][Math.floor(Math.random() * 4)]}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Conditions${liveWeatherData ? ' (REAL-TIME DATA)' : ''}:
Temperature: ${temp}°F
Barometric Pressure: ${(29.8 + Math.random() * 0.4).toFixed(2)} inHg  
Wind: ${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]} ${liveWeatherData ? liveWeatherData.windSpeed : Math.floor(Math.random() * 25) + 10} mph
Humidity: ${liveWeatherData ? liveWeatherData.humidity : Math.floor(Math.random() * 40) + 60}%
${liveWeatherData && liveWeatherData.visibility ? `Visibility: ${liveWeatherData.visibility.toFixed(1)} miles` : ''}

$$`
        };
      },
      
      traffic: () => {
        // Use real traffic data if available
        const getTrafficInfo = () => {
          if (liveTrafficData) {
            return {
              type: liveTrafficData.type,
              location: liveTrafficData.location,
              description: liveTrafficData.description,
              delay: liveTrafficData.delay,
              distance: liveTrafficData.distance,
              severity: liveTrafficData.type === 'accident' ? 'CRITICAL' : 
                       liveTrafficData.type === 'construction' ? 'MAJOR' : 'MODERATE',
              lanes: liveTrafficData.type === 'accident' ? 'Multiple lanes blocked' :
                    liveTrafficData.type === 'construction' ? '2 of 3 lanes closed' : 'Right shoulder blocked'
            };
          }
          // Fallback to generic incidents - much more variety
          const incidents = [
            { type: 'Multi-vehicle collision', severity: 'MAJOR', lanes: '3 of 4 lanes blocked' },
            { type: 'Jackknifed semi-truck', severity: 'CRITICAL', lanes: 'All lanes blocked' },
            { type: 'Vehicle fire', severity: 'MAJOR', lanes: '2 of 3 lanes blocked' },
            { type: 'Police investigation', severity: 'MODERATE', lanes: 'Right shoulder blocked' },
            { type: 'Emergency road repairs', severity: 'MAJOR', lanes: 'Left 2 lanes closed' },
            { type: 'Overturned vehicle', severity: 'MAJOR', lanes: 'Left lane blocked' },
            { type: 'Hazmat spill cleanup', severity: 'CRITICAL', lanes: 'All northbound lanes closed' },
            { type: 'Construction zone accident', severity: 'MAJOR', lanes: '2 of 3 lanes blocked' },
            { type: 'Disabled vehicle', severity: 'MINOR', lanes: 'Right shoulder blocked' },
            { type: 'Emergency medical response', severity: 'MODERATE', lanes: 'Center lanes blocked' },
            { type: 'Bridge maintenance', severity: 'MAJOR', lanes: 'Reduced to single lane' },
            { type: 'Weather-related incident', severity: 'MODERATE', lanes: 'Multiple lanes affected' },
            { type: 'Traffic signal malfunction', severity: 'MINOR', lanes: 'Intersection blocked' },
            { type: 'Utility line work', severity: 'MODERATE', lanes: 'Right 2 lanes closed' },
            { type: 'Vehicle breakdown', severity: 'MINOR', lanes: 'Left shoulder blocked' },
            { type: 'Debris in roadway', severity: 'MODERATE', lanes: 'Center lane blocked' },
            { type: 'Emergency vehicle response', severity: 'MODERATE', lanes: 'Left lane blocked' },
            { type: 'Road surface repairs', severity: 'MAJOR', lanes: 'Right 2 lanes closed' },
            { type: 'Stalled commercial vehicle', severity: 'MODERATE', lanes: 'Right lane blocked' },
            { type: 'Traffic enforcement stop', severity: 'MINOR', lanes: 'Shoulder activity' }
          ];
          const incident = incidents[Math.floor(Math.random() * incidents.length)];
          return {
            type: incident.type,
            location: `${randomStreet} / ${randomCity}`,
            description: `${incident.type} causing major delays`,
            delay: `${Math.floor(Math.random() * 90) + 30} minutes`,
            distance: `${(Math.random() * 2 + 0.5).toFixed(1)} miles from current location`,
            severity: incident.severity,
            lanes: incident.lanes
          };
        };
        
        const trafficInfo = getTrafficInfo();
        const delayTime = parseInt(trafficInfo.delay) || Math.floor(Math.random() * 90) + 30;
        const incidentId = `TRF-${Math.floor(Math.random() * 90000) + 10000}`;
        const mileMarker = Math.floor(Math.random() * 50) + 10;
        
        return {
          type: 'State DOT Traffic Management Center',
          content: `🚗 TRAFFIC INCIDENT REPORT

Incident ID: ${incidentId}
Location: ${liveTrafficData ? trafficInfo.location : `${(() => {
  const highways = getLocalHighways(locationInfo);
  const allHighways = [...highways.interstates, ...highways.usRoutes];
  const selectedHighway = allHighways[Math.floor(Math.random() * allHighways.length)];
  return selectedHighway;
})()} ${Math.random() > 0.5 ? 'North' : 'South'}bound`}
${!liveTrafficData ? `Mile Marker: ${mileMarker}` : ''}
${liveTrafficData ? `Distance: ${trafficInfo.distance}` : `Near: ${randomStreet} / ${randomCity} Exit`}

INCIDENT TYPE: ${trafficInfo.type}
SEVERITY LEVEL: ${trafficInfo.severity}
LANES AFFECTED: ${trafficInfo.lanes}

REPORTED: ${currentTime}
EST. CLEARANCE: ${new Date(now.getTime() + delayTime * 60000).toLocaleTimeString()}
${liveTrafficData ? `REAL-TIME STATUS: Active incident with live monitoring` : ''}

CURRENT CONDITIONS:
${liveTrafficData ? `• ${trafficInfo.description}` : ''}
• Traffic backed up ${Math.floor(delayTime / 10)} miles
• Average delay: ${trafficInfo.delay}
• Alternative routes experiencing heavy volume
• Emergency responders on scene

ALTERNATE ROUTES:
• ${(() => {
  const highways = getLocalHighways(locationInfo);
  const altRoute = highways.usRoutes[Math.floor(Math.random() * highways.usRoutes.length)];
  return altRoute;
})()} (add 25-30 minutes)
• ${randomStreet} surface streets (add 35-45 minutes)

⚠️ AVOID AREA - SEEK ALTERNATE ROUTE ⚠️

Updates available at: DOT511.gov
Last Updated: ${currentTime}
Next Update: ${new Date(now.getTime() + 15 * 60000).toLocaleTimeString()}`
        };
      },
      
      medical: () => {
        const symptoms = [
          { condition: 'acute gastroenteritis', symptoms: 'nausea, vomiting, and abdominal cramping', duration: '24-48 hours' },
          { condition: 'severe migraine with aura', symptoms: 'intense headache, visual disturbances, and photophobia', duration: '12-24 hours' },
          { condition: 'acute lower back strain', symptoms: 'severe lumbar pain and muscle spasms', duration: '2-3 days' },
          { condition: 'viral upper respiratory infection', symptoms: 'fever, congestion, and productive cough', duration: '3-5 days' },
          { condition: 'acute allergic reaction', symptoms: 'widespread urticaria and respiratory irritation', duration: '24-48 hours' },
          { condition: 'acute sinusitis', symptoms: 'severe facial pain, nasal congestion, and headache', duration: '3-5 days' },
          { condition: 'food poisoning', symptoms: 'severe nausea, diarrhea, and dehydration', duration: '24-72 hours' },
          { condition: 'acute bronchitis', symptoms: 'persistent cough, chest tightness, and fatigue', duration: '3-7 days' },
          { condition: 'vertigo and balance disorder', symptoms: 'severe dizziness, nausea, and spatial disorientation', duration: '1-2 days' },
          { condition: 'acute stress reaction', symptoms: 'anxiety, insomnia, and physical exhaustion', duration: '2-4 days' }
        ];
        
        // Sometimes generate multiple related conditions (premium feature)
        const shouldGenerateMultiple = Math.random() < 0.3; // 30% chance for multiple conditions
        const selectedSymptoms = shouldGenerateMultiple 
          ? [symptoms[Math.floor(Math.random() * symptoms.length)], symptoms[Math.floor(Math.random() * symptoms.length)]]
          : [symptoms[Math.floor(Math.random() * symptoms.length)]];
        
        const primarySymptom = selectedSymptoms[0];
        const doctorNames = ['Dr. Sarah Johnson, MD', 'Dr. Michael Chen, MD', 'Dr. Lisa Rodriguez, MD', 'Dr. James Wilson, MD', 'Dr. Amanda Foster, MD', 'Dr. Robert Kim, MD'];
        const doctor = doctorNames[Math.floor(Math.random() * doctorNames.length)];
        const clinics = ['Family Health Center', 'Urgent Care Plus', 'Premier Medical Group', 'Community Health Clinic', 'Advanced Care Medical Center', 'Regional Health Associates'];
        const clinic = clinics[Math.floor(Math.random() * clinics.length)];
        const licenseNum = `MD${Math.floor(Math.random() * 90000) + 10000}`;
        
        // Create comprehensive symptoms list
        const allSymptoms = selectedSymptoms.map(s => s.symptoms).join(', with secondary ');
        const allConditions = selectedSymptoms.map(s => s.condition).join(' complicated by ');
        const maxDuration = Math.max(...selectedSymptoms.map(s => {
          const days = s.duration.includes('24') ? 1 : 
                      s.duration.includes('2-3') ? 2.5 : 
                      s.duration.includes('3-5') ? 4 : 
                      s.duration.includes('3-7') ? 5 : 
                      s.duration.includes('2-4') ? 3 : 2;
          return days;
        }));
        
        const durationText = maxDuration <= 1 ? '24-48 hours' : 
                           maxDuration <= 2.5 ? '2-3 days' : 
                           maxDuration <= 4 ? '3-5 days' : 
                           maxDuration <= 5 ? '5-7 days' : '3-5 days';
        
        return {
          type: 'Official Medical Certificate',
          content: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                 ${clinic.toUpperCase()}                 ┃
┃              COMPREHENSIVE MEDICAL services              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${Math.floor(Math.random() * 9000) + 1000} Medical Center Drive, Suite ${Math.floor(Math.random() * 500) + 100}
${randomCity}, ${['NY', 'CA', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'][Math.floor(Math.random() * 10)]} ${Math.floor(Math.random() * 90000) + 10000}
Phone: (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}
Fax: (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              MEDICAL EXCUSE / WORK RESTRICTION
              Document Control #: MC${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 9000) + 1000}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Patient Name: [PATIENT NAME]
Date of Birth: [MM/DD/YYYY]  
Medical Record #: MR${Math.floor(Math.random() * 900000) + 100000}
Date of Service: ${currentDate}
Time of Consultation: ${currentTime}

ATTENDING PHYSICIAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${doctor}
Medical License: ${licenseNum}
Board Certification: Internal Medicine
DEA Registration: B${doctor.split(' ')[1].substring(0,1)}${Math.floor(Math.random() * 9000000) + 1000000}

CLINICAL DOCUMENTATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Chief Complaint: ${allSymptoms}

History of Present Illness:
Patient presents with acute onset of ${allSymptoms} beginning 
approximately ${Math.floor(Math.random() * 12) + 6} hours prior to evaluation.
Symptoms have been progressively worsening and interfering with 
normal daily activities and work performance.
${selectedSymptoms.length > 1 ? '\nComplications noted due to multiple concurrent conditions requiring\nextended observation and comprehensive treatment approach.' : ''}

Physical Examination:
- Vital Signs: Stable, slight elevation in temperature
- General: Patient appears uncomfortable but alert and oriented
- Findings consistent with ${allConditions}
${selectedSymptoms.length > 1 ? '- Multiple systems involved requiring careful monitoring' : ''}

ASSESSMENT & DIAGNOSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Diagnosis: ${allConditions}
ICD-10-CM Code: ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10)}${selectedSymptoms.length > 1 ? `, ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10)}` : ''}

TREATMENT PLAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Symptomatic supportive care as outlined
• Complete rest and adequate hydration
• Restriction from work-related activities
• Follow-up appointment scheduled if symptoms persist
• Return if condition deteriorates or new symptoms develop
${selectedSymptoms.length > 1 ? '• Multidisciplinary approach for complex presentation\n• Extended monitoring period recommended' : ''}

WORK/ACTIVITY RESTRICTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Due to the ${selectedSymptoms.length > 1 ? 'complex nature of multiple conditions' : 'contagious nature'} and severity of symptoms, patient is 
medically restricted from work/school activities for ${durationText}.

This medical restriction is necessary to:
☐ Prevent transmission to coworkers/students
☐ Allow adequate recovery time
☐ Prevent worsening of current condition
☐ Maintain public health standards
${selectedSymptoms.length > 1 ? '☐ Manage complex multi-system involvement' : ''}

RETURN TO WORK AUTHORIZATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Patient may return to normal activities on: 
${new Date(now.getTime() + maxDuration * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}

This document serves as official medical verification for the 
period of ${durationText} from date of service.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHYSICIAN SIGNATURE & VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ELECTRONIC SIGNATURE VERIFIED]        Date: ${currentDate}
${doctor}                               Time: ${currentTime}
${clinic}
Medical License: ${licenseNum}

This certificate is issued in compliance with state medical practice
guidelines and HIPAA privacy regulations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENTIAL MEDICAL INFORMATION - PROTECTED HEALTH INFORMATION
This document contains privileged and confidential medical information.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        };
      }
    };

    const proof = (() => {
      const localizedTexts = {
        weather: {
          en: { service: 'NATIONAL WEATHER SERVICE', alert: 'SEVERE WEATHER ALERT', urgent: 'URGENT - IMMEDIATE BROADCAST REQUESTED', details: 'Severe weather conditions affecting travel and safety. Widespread power outages and travel disruptions expected. Stay indoors and monitor weather updates.' },
          es: { service: 'SERVICIO METEOROLÓGICO NACIONAL', alert: 'ALERTA METEOROLÓGICA SEVERA', urgent: 'URGENTE - TRANSMISIÓN INMEDIATA REQUERIDA', details: 'Condiciones meteorológicas severas que afectan viajes y seguridad. Cortes de energía y disrupciones de viaje esperados. Permanezca en interiores y monitoree actualizaciones meteorológicas.' },
          fr: { service: 'SERVICE MÉTÉOROLOGIQUE NATIONAL', alert: 'ALERTE MÉTÉO SÉVÈRE', urgent: 'URGENT - DIFFUSION IMMÉDIATE DEMANDÉE', details: 'Conditions météorologiques sévères affectant les déplacements et la sécurité. Pannes de courant et perturbations de voyage attendues. Restez à l\'intérieur et surveillez les mises à jour météo.' },
          de: { service: 'NATIONALER WETTERDIENST', alert: 'SCHWERE WETTERWARNUNG', urgent: 'DRINGEND - SOFORTIGE ÜBERTRAGUNG ANGEFORDERT', details: 'Schwere Wetterbedingungen beeinträchtigen Reisen und Sicherheit. Weitreichende Stromausfälle und Reiseunterbrechungen erwartet. Bleiben Sie drinnen und überwachen Sie Wetterupdates.' },
          it: { service: 'SERVIZIO METEOROLOGICO NAZIONALE', alert: 'ALLERTA METEO SEVERA', urgent: 'URGENTE - TRASMISSIONE IMMEDIATA RICHIESTA', details: 'Condizioni meteorologiche severe che influenzano viaggi e sicurezza. Blackout diffusi e interruzioni di viaggio previsti. Rimanete al chiuso e monitorate aggiornamenti meteo.' },
          pt: { service: 'SERVIÇO METEOROLÓGICO NACIONAL', alert: 'ALERTA METEOROLÓGICO SEVERO', urgent: 'URGENTE - TRANSMISSÃO IMEDIATA SOLICITADA', details: 'Condições meteorológicas severas afetando viagens e segurança. Cortes de energia e interrupções de viagem esperados. Permaneça em casa e monitore atualizações meteorológicas.' },
          ru: { service: 'НАЦИОНАЛЬНАЯ МЕТЕОСЛУЖБА', alert: 'СЕРЬЁЗНОЕ МЕТЕОПРЕДУПРЕЖДЕНИЕ', urgent: 'СРОЧНО - ТРЕБУЕТСЯ НЕМЕДЛЕННАЯ ПЕРЕДАЧА', details: 'Суровые погодные условия влияют на перемещения и безопасность. Ожидаются массовые отключения электроэнергии и нарушения движения. Оставайтесь дома и следите за обновлениями погоды.' },
          ja: { service: '国立気象サービス', alert: '重大気象警報', urgent: '緊急 - 即座の放送を要請', details: '移動と安全に影響する悪天候。広範囲の停電と交通の混乱が予想されます。屋内にとどまり、気象情報を監視してください。' }
        },
        traffic: {
          en: { report: 'TRAFFIC INCIDENT REPORT', conditions: 'Severe traffic delays - seek alternate route', avoid: '⚠️ AVOID AREA - SEEK ALTERNATE ROUTE ⚠️' },
          es: { report: 'REPORTE DE INCIDENTE DE TRÁFICO', conditions: 'Retrasos severos de tráfico - busque ruta alternativa', avoid: '⚠️ EVITE EL ÁREA - BUSQUE RUTA ALTERNATIVA ⚠️' },
          fr: { report: 'RAPPORT D\'INCIDENT DE CIRCULATION', conditions: 'Retards de circulation sévères - cherchez route alternative', avoid: '⚠️ ÉVITER LA ZONE - CHERCHER ROUTE ALTERNATIVE ⚠️' },
          de: { report: 'VERKEHRSUNFALL-BERICHT', conditions: 'Schwere Verkehrsbehinderungen - alternative Route suchen', avoid: '⚠️ BEREICH MEIDEN - ALTERNATIVE ROUTE SUCHEN ⚠️' },
          it: { report: 'RAPPORTO INCIDENTE STRADALE', conditions: 'Gravi ritardi del traffico - cercare percorso alternativo', avoid: '⚠️ EVITARE AREA - CERCARE PERCORSO ALTERNATIVO ⚠️' },
          pt: { report: 'RELATÓRIO DE INCIDENTE DE TRÂNSITO', conditions: 'Atrasos severos no trânsito - procure rota alternativa', avoid: '⚠️ EVITE A ÁREA - PROCURE ROTA ALTERNATIVA ⚠️' },
          ru: { report: 'ОТЧЕТ О ДОРОЖНОМ ПРОИСШЕСТВИИ', conditions: 'Серьезные задержки движения - ищите альтернативный маршрут', avoid: '⚠️ ИЗБЕГАЙТЕ ОБЛАСТЬ - ИЩИТЕ АЛЬТЕРНАТИВНЫЙ МАРШРУТ ⚠️' },
          ja: { report: '交通事故報告書', conditions: '深刻な交通渋滞 - 代替ルートを探してください', avoid: '⚠️ エリアを回避 - 代替ルートを探してください ⚠️' }
        },
        medical: {
          en: { certificate: 'MEDICAL EXCUSE CERTIFICATE', restriction: 'Patient is medically restricted from work/school activities', due: 'Due to acute medical condition requiring rest and recovery', verification: 'This document serves as official medical verification' },
          es: { certificate: 'CERTIFICADO DE EXCUSA MÉDICA', restriction: 'El paciente está médicamente restringido de actividades laborales/escolares', due: 'Debido a condición médica aguda que requiere descanso y recuperación', verification: 'Este documento sirve como verificación médica oficial' },
          fr: { certificate: 'CERTIFICAT D\'EXCUSE MÉDICALE', restriction: 'Le patient est médicalement restreint des activités professionnelles/scolaires', due: 'En raison d\'une condition médicale aiguë nécessitant repos et récupération', verification: 'Ce document sert de vérification médicale officielle' },
          de: { certificate: 'ÄRZTLICHES ENTSCHULDIGUNGSZEUGNIS', restriction: 'Patient ist medizinisch von Arbeits-/Schulaktivitäten eingeschränkt', due: 'Aufgrund akuter medizinischer Erkrankung, die Ruhe und Genesung erfordert', verification: 'Dieses Dokument dient als offizielle medizinische Bestätigung' },
          it: { certificate: 'CERTIFICATO DI SCUSA MEDICA', restriction: 'Il paziente è medicalmente limitato dalle attività lavorative/scolastiche', due: 'A causa di condizione medica acuta che richiede riposo e recupero', verification: 'Questo documento serve come verifica medica ufficiale' },
          pt: { certificate: 'CERTIFICADO DE ESCUSA MÉDICA', restriction: 'O paciente está medicamente restrito de atividades de trabalho/escola', due: 'Devido à condição médica aguda requerendo descanso e recuperação', verification: 'Este documento serve como verificação médica oficial' },
          ru: { certificate: 'СПРАВКА О МЕДИЦИНСКОМ ОСВОБОЖДЕНИИ', restriction: 'Пациент медицински ограничен в работе/учебной деятельности', due: 'Из-за острого медицинского состояния, требующего отдыха и восстановления', verification: 'Этот документ служит официальным медицинским подтверждением' },
          ja: { certificate: '医療証明書', restriction: '患者は医学的に職場・学校活動が制限されています', due: '休息と回復が必要な急性疾患のため', verification: 'この文書は公式な医療証明として機能します' }
        }
      };

      // Type assertion to handle the complex union types
      const currentLangTexts: any = localizedTexts[type][selectedLanguage] || localizedTexts[type]['en'];
      const t: any = translations[selectedLanguage] || translations['en'];
      
      const alertId = Math.floor(Math.random() * 9000) + 1000;
      const duration = Math.floor(Math.random() * 90) + 30; // 30-120 minutes for traffic, or days for medical
      
      if (type === 'weather') {
        if (proofFormat === 'sms') {
          const phoneNumbers = officialNumbers.weather[selectedLanguage] || officialNumbers.weather['en'];
          const phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const displayPhoneNumber = userPhoneNumber || '(555) 123-4567';
          
          return {
            type: (t.weather || 'Weather') + ' SMS Alert',
            content: `📱 Message to: ${displayPhoneNumber}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${phoneNumber}                   ${timestamp}

🌩️ ${currentLangTexts.service} ALERT

${currentLangTexts.details}

${t.affectedArea || 'Area'}: ${locationInfo.city}${locationInfo.state ? `, ${locationInfo.state}` : ''}

${currentLangTexts.urgent}

Reply STOP to opt out.

                                    Delivered ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
          };
        } else {
          return {
            type: (t.weather || 'Weather') + ' Alert',
            content: `⛈️ ${currentLangTexts.service}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${currentLangTexts.urgent}
${currentLangTexts.alert} - ${new Date(now.getTime() + 24*60*60*1000).toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${t.alertId || 'Alert ID'}: WS${alertId}
${t.issued || 'Issued'}: ${currentTime} ${currentDate}

${t.affectedArea || 'AFFECTED AREA'}: ${locationInfo.city}${locationInfo.state ? `, ${locationInfo.state}` : ''} ${t.area || 'County and surrounding areas'}

${currentLangTexts.details}

${currentLangTexts.service} ${t.office || 'Office'}`
          };
        }
      } else if (type === 'traffic') {
        if (proofFormat === 'sms') {
          const phoneNumbers = officialNumbers.traffic[selectedLanguage] || officialNumbers.traffic['en'];
          const phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const displayPhoneNumber = userPhoneNumber || '(555) 123-4567';
          
          return {
            type: (t.traffic || 'Traffic') + ' SMS Alert',
            content: `📱 Message to: ${displayPhoneNumber}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${phoneNumber}                   ${timestamp}

🚨 TRAFFIC ALERT

${getRandomIncidentDescription(selectedLanguage)}

Location: ${(() => {
  const highways = getLocalHighways(locationInfo);
  const allHighways = [...highways.interstates, ...highways.usRoutes];
  const selectedHighway = allHighways[Math.floor(Math.random() * allHighways.length)];
  return selectedHighway;
})()} ${Math.random() > 0.5 ? (t.north || 'North') : (t.south || 'South')}bound
${randomStreet} / ${randomCity}

${t.delay || 'Delay'}: ${duration} ${t.minutes || 'min'}

${currentLangTexts.avoid}

Reply STOP to opt out.

                                    Delivered ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
          };
        } else {
          return {
            type: (t.traffic || 'Traffic') + ' Report',
            content: `🚨 ${currentLangTexts.report}

${t.incidentId || 'Incident ID'}: TR${alertId}
${t.location || 'Location'}: ${(() => {
  const highways = getLocalHighways(locationInfo);
  const allHighways = [...highways.interstates, ...highways.usRoutes];
  const selectedHighway = allHighways[Math.floor(Math.random() * allHighways.length)];
  return selectedHighway;
})()} ${Math.random() > 0.5 ? (t.north || 'North') : (t.south || 'South')}bound
${randomStreet} / ${randomCity} ${t.exit || 'Exit'}

${getRandomIncidentDescription(selectedLanguage)}

${t.reported || 'REPORTED'}: ${currentTime}
${t.clearance || 'EST. CLEARANCE'}: ${new Date(now.getTime() + duration * 60000).toLocaleTimeString()}

${currentLangTexts.conditions}
• ${t.delay || 'Average delay'}: ${duration} ${t.minutes || 'minutes'}

${currentLangTexts.avoid}`
          };
        }
      } else { // medical
        // Localized doctor names
        const localizedDoctors = {
          en: ['Dr. Sarah Johnson, MD', 'Dr. Michael Chen, MD', 'Dr. Lisa Rodriguez, MD', 'Dr. James Wilson, MD'],
          es: ['Dr. María García, MD', 'Dr. Carlos López, MD', 'Dr. Ana Martínez, MD', 'Dr. José Rodríguez, MD'],
          fr: ['Dr. Marie Dubois, MD', 'Dr. Pierre Martin, MD', 'Dr. Sophie Leroy, MD', 'Dr. Jean Moreau, MD'],
          de: ['Dr. Anna Müller, MD', 'Dr. Klaus Schmidt, MD', 'Dr. Eva Wagner, MD', 'Dr. Hans Fischer, MD'],
          it: ['Dr. Giulia Rossi, MD', 'Dr. Marco Bianchi, MD', 'Dr. Francesca Ferrari, MD', 'Dr. Alessandro Romano, MD'],
          pt: ['Dr. Ana Silva, MD', 'Dr. João Santos, MD', 'Dr. Maria Oliveira, MD', 'Dr. Carlos Pereira, MD'],
          ru: ['Д-р Анна Петрова, MD', 'Д-р Алексей Смирнов, MD', 'Д-р Елена Попова, MD', 'Д-р Дмитрий Волков, MD'],
          ja: ['田中医師, MD', '佐藤医師, MD', '鈴木医師, MD', '高橋医師, MD']
        };

        // Localized clinic names
        const localizedClinics = {
          en: ['Family Health Center', 'Urgent Care Plus', 'Premier Medical Group', 'Community Health Clinic'],
          es: ['Centro de Salud Familiar', 'Atención Urgente Plus', 'Grupo Médico Premier', 'Clínica de Salud Comunitaria'],
          fr: ['Centre de Santé Familial', 'Soins Urgents Plus', 'Groupe Médical Premier', 'Clinique de Santé Communautaire'],
          de: ['Familien-Gesundheitszentrum', 'Notfall-Versorgung Plus', 'Premier Medizinische Gruppe', 'Gemeinschafts-Gesundheitsklinik'],
          it: ['Centro Salute Famiglia', 'Pronto Soccorso Plus', 'Gruppo Medico Premier', 'Clinica Salute Comunitaria'],
          pt: ['Centro de Saúde Familiar', 'Atendimento Urgente Plus', 'Grupo Médico Premier', 'Clínica de Saúde Comunitária'],
          ru: ['Семейный Медицинский Центр', 'Неотложная Помощь Плюс', 'Премьер Медицинская Группа', 'Общественная Клиника'],
          ja: ['ファミリー健康センター', 'アージェント・ケア・プラス', 'プレミア医療グループ', 'コミュニティ健康クリニック']
        };

        const doctorNames = localizedDoctors[selectedLanguage] || localizedDoctors['en'];
        const clinics = localizedClinics[selectedLanguage] || localizedClinics['en'];
        const doctor = doctorNames[Math.floor(Math.random() * doctorNames.length)];
        const clinic = clinics[Math.floor(Math.random() * clinics.length)];
        
        // Use the same detailed symptoms as the comprehensive medical certificate
        const symptoms = [
          { condition: 'acute gastroenteritis', symptoms: 'nausea, vomiting, and abdominal cramping', duration: '24-48 hours' },
          { condition: 'severe migraine with aura', symptoms: 'intense headache, visual disturbances, and photophobia', duration: '12-24 hours' },
          { condition: 'acute lower back strain', symptoms: 'severe lumbar pain and muscle spasms', duration: '2-3 days' },
          { condition: 'viral upper respiratory infection', symptoms: 'fever, congestion, and productive cough', duration: '3-5 days' },
          { condition: 'acute allergic reaction', symptoms: 'widespread urticaria and respiratory irritation', duration: '24-48 hours' },
          { condition: 'acute sinusitis', symptoms: 'severe facial pain, nasal congestion, and headache', duration: '3-5 days' },
          { condition: 'food poisoning', symptoms: 'severe nausea, diarrhea, and dehydration', duration: '24-72 hours' },
          { condition: 'acute bronchitis', symptoms: 'persistent cough, chest tightness, and fatigue', duration: '3-7 days' },
          { condition: 'vertigo and balance disorder', symptoms: 'severe dizziness, nausea, and spatial disorientation', duration: '1-2 days' },
          { condition: 'acute stress reaction', symptoms: 'anxiety, insomnia, and physical exhaustion', duration: '2-4 days' }
        ];
        
        const selectedSymptom = symptoms[Math.floor(Math.random() * symptoms.length)];
        const durationDays = selectedSymptom.duration.includes('24') ? 1 : 
                           selectedSymptom.duration.includes('2-3') ? 2 : 
                           selectedSymptom.duration.includes('3-5') ? 4 : 
                           selectedSymptom.duration.includes('3-7') ? 5 : 
                           selectedSymptom.duration.includes('2-4') ? 3 : 2;
        
        if (proofFormat === 'sms') {
          const phoneNumbers = officialNumbers.medical[selectedLanguage] || officialNumbers.medical['en'];
          const phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const displayPhoneNumber = userPhoneNumber || '(555) 123-4567';
          
          return {
            type: (t.medical || 'Medical') + ' SMS Notification',
            content: `📱 Message to: ${displayPhoneNumber}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${phoneNumber}                   ${timestamp}

🏥 ${clinic}

${t.patientInfo || 'Patient'}: [PATIENT NAME]
${t.physician || 'Doctor'}: ${doctor}
${t.serviceDate || 'Visit'}: ${currentDate}

Diagnosis: ${selectedSymptom.condition}
Symptoms: ${selectedSymptom.symptoms}

${currentLangTexts.due} ${durationDays} ${durationDays === 1 ? (t.day || 'day') : (t.days || 'days')}.

${t.returnDate || 'Return'}: ${new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toLocaleDateString()}

${currentLangTexts.verification}

Reply STOP to opt out.

                                    Delivered ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
          };
        } else if (proofFormat === 'email') {
          // Professional email format for medical excuse
          const emailSubject = {
            en: 'Medical Excuse Documentation - Patient Restriction Notice',
            es: 'Documentación de Excusa Médica - Aviso de Restricción del Paciente',
            fr: 'Documentation d\'Excuse Médicale - Avis de Restriction Patient',
            de: 'Medizinische Entschuldigung - Patientenbeschränkungshinweis',
            it: 'Documentazione Scusa Medica - Avviso Restrizione Paziente',
            pt: 'Documentação de Escusa Médica - Aviso de Restrição do Paciente',
            ru: 'Медицинская Справка - Уведомление об Ограничении Пациента',
            ja: '医療証明書 - 患者制限通知'
          };

          const fromEmail = {
            en: 'medical.records@',
            es: 'registros.medicos@',
            fr: 'dossiers.medicaux@',
            de: 'medizinische.aufzeichnungen@',
            it: 'cartelle.cliniche@',
            pt: 'registros.medicos@',
            ru: 'medkarty@',
            ja: 'medical.records@'
          };

          const clinicDomain = clinic.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + '.com';
          const fromEmailAddress = (fromEmail[selectedLanguage] || fromEmail['en']) + clinicDomain;
          
          return {
            type: (t.medical || 'Medical') + ' Email Documentation',
            content: `📧 Email Message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From: ${fromEmailAddress}
To: [RECIPIENT EMAIL]
Subject: ${emailSubject[selectedLanguage] || emailSubject['en']}
Date: ${currentDate} ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear Employer/Administrator,

This email serves as official medical documentation regarding one of your employees/students.

🏥 MEDICAL FACILITY INFORMATION:
${clinic.toUpperCase()}
${t.medicalServices || 'COMPREHENSIVE MEDICAL SERVICES'}

👨‍⚕️ ATTENDING PHYSICIAN:
${doctor}
${t.license || 'Medical License'}: MD${Math.floor(Math.random() * 90000) + 10000}

📋 PATIENT DETAILS:
${t.patient || 'Patient'}: [PATIENT NAME]
${t.serviceDate || 'Date of Service'}: ${currentDate}
${t.time || 'Examination Time'}: ${currentTime}
${t.documentId || 'Reference #'}: MC${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${alertId}

🩺 CLINICAL ASSESSMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Diagnosis: ${selectedSymptom.condition}
Chief Complaint: ${selectedSymptom.symptoms}
Recommended Treatment Duration: ${selectedSymptom.duration}

⚕️ MEDICAL RECOMMENDATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Based on our clinical evaluation, the patient has been diagnosed with ${selectedSymptom.condition} presenting with ${selectedSymptom.symptoms}. 

For optimal recovery and to prevent complications, I am recommending that the patient be excused from work/school activities for ${durationDays} ${durationDays === 1 ? (t.day || 'day') : (t.days || 'days')}.

📅 ${t.returnDate || 'Patient may return to normal activities on'}:
${new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toLocaleDateString()}

This medical recommendation is made in accordance with standard medical practices and in the best interest of the patient's health and recovery.

If you require any additional documentation or have questions regarding this medical excuse, please do not hesitate to contact our office.

Sincerely,

${doctor}
${clinic}

📞 Office: (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}
📧 Email: ${fromEmailAddress}

CONFIDENTIALITY NOTICE: This email contains privileged and confidential information intended solely for the use of the addressee. If you are not the intended recipient, please notify the sender and delete this message.

${currentLangTexts.verification}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
          };
        } else {
          // Traditional document/certificate format
          return {
            type: (t.medical || 'Medical') + ' Certificate',
            content: `🏥 ${currentLangTexts.certificate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${clinic.toUpperCase()}
${t.medicalServices || 'COMPREHENSIVE MEDICAL SERVICES'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${t.documentId || 'Document #'}: MC${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${alertId}

${t.patientInfo || 'PATIENT INFORMATION'}:
${t.patient || 'Patient'}: [PATIENT NAME]
${t.serviceDate || 'Date of Service'}: ${currentDate}
${t.time || 'Time'}: ${currentTime}

${t.physician || 'ATTENDING PHYSICIAN'}:
${doctor}
${t.license || 'Medical License'}: MD${Math.floor(Math.random() * 90000) + 10000}

CLINICAL ASSESSMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Diagnosis: ${selectedSymptom.condition}
Chief Complaint: ${selectedSymptom.symptoms}
Treatment Duration: ${selectedSymptom.duration}

WORK/SCHOOL RESTRICTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Due to ${selectedSymptom.condition} presenting with ${selectedSymptom.symptoms}, 
patient is medically restricted from work/school activities for ${durationDays} ${durationDays === 1 ? (t.day || 'day') : (t.days || 'days')}.

${t.returnDate || 'Patient may return to normal activities on'}:
${new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toLocaleDateString()}

${currentLangTexts.verification}

${doctor}
${clinic}
${t.date || 'Date'}: ${currentDate}`
          };
        }
      }
    })();
    console.log('Generated proof:', proof);
    
    // Generate image for premium users
    let proofImage = null;
    if (isPremium && type) {
      try {
        console.log('Generating image for premium user, type:', type);
        
        const locationForImage = userLocation || { city: randomCity, state: '', address: randomStreet };
        const weatherDataForImage = liveWeatherData || { 
          temperature: Math.floor(Math.random() * 40) + 20, 
          condition: 'Thunderstorm',
          description: 'Severe weather conditions',
          windSpeed: Math.floor(Math.random() * 25) + 10,
          humidity: Math.floor(Math.random() * 40) + 60
        };
        const trafficDataForImage = liveTrafficData || {
          location: `${randomStreet} / ${randomCity}`,
          type: 'Multi-vehicle collision',
          description: 'Major traffic incident',
          delay: `${Math.floor(Math.random() * 90) + 30} minutes`
        };

        if (type === 'weather') {
          const alertInfo = {
            severity: weatherDataForImage.condition === 'Thunderstorm' ? 'WARNING' : 'WATCH',
            type: weatherDataForImage.condition,
            issued: currentTime,
            expires: new Date(now.getTime() + 24*60*60*1000).toLocaleTimeString()
          };
          proofImage = await generateWeatherAlertImage(weatherDataForImage, locationForImage, alertInfo);
        } else if (type === 'traffic') {
          proofImage = await generateTrafficReportImage(trafficDataForImage, locationForImage);
        } else if (type === 'medical') {
          // Medical certificates now handled by separate patient info dialog
          console.log('Medical certificate generation should be handled by patient info dialog');
        }
        
        console.log('Image generated successfully:', proofImage ? 'Yes' : 'No');
      } catch (error) {
        console.error('Error generating proof image:', error);
      }
    }
    
    // Add image to proof object
    const proofWithImage = {
      ...proof,
      image: proofImage || undefined
    };
    
    setGeneratedProof(proofWithImage);
    setShowProofGenerator(true);
    setIsGeneratingProof(false);
    console.log('State updated - showProofGenerator should be true');
  };

  const unlockPremium = () => {
    // In a real app, this would integrate with payment processing
    setIsPremium(true);
    setShowPremium(false);
    
    // Set to premium tier by default when unlocking premium
    setSubscriptionTier('premium');
    const premiumConfig = subscriptionTiers['premium'];
    setSubscriptionData(prev => ({
      ...prev,
      tier: 'premium',
      features: premiumConfig.features,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }));
    
    // Save all premium status and data
    safeLocalStorage.setItem('isPremium', 'true');
    safeLocalStorage.setItem('subscriptionTier', 'premium');
    
    // Hide ads for premium users
    setShowAd(false);
    setAdDismissed(true);
    
    console.log('Premium features unlocked successfully!');
  };

  const togglePremium = (checked: boolean) => {
    setIsPremium(checked);
    safeLocalStorage.setItem('isPremium', checked.toString());
  };

  // Load history and favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = safeLocalStorage.getItem('excuseHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setExcuseHistory(parsedHistory);
      }

      const savedFavorites = safeLocalStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }

      const savedRatings = safeLocalStorage.getItem('excuseRatings');
      if (savedRatings) {
        const parsedRatings = JSON.parse(savedRatings);
        // Convert timestamp strings back to Date objects
        const ratingsWithDates = Object.fromEntries(
          Object.entries(parsedRatings).map(([excuse, data]: [string, any]) => [
            excuse,
            { ...data, timestamp: new Date(data.timestamp) }
          ])
        );
        setExcuseRatings(ratingsWithDates);
      }

      const savedPremiumStatus = safeLocalStorage.getItem('isPremium');
      if (savedPremiumStatus === 'true') {
        setIsPremium(true);
      }

      const savedCustomExcuses = safeLocalStorage.getItem('customExcuses');
      if (savedCustomExcuses) {
        setCustomExcuses(JSON.parse(savedCustomExcuses));
      }

      // Load analytics data
      const savedUsageStats = safeLocalStorage.getItem('usageStats');
      if (savedUsageStats) {
        setUsageStats(JSON.parse(savedUsageStats));
      }

      const savedExcuseAnalytics = safeLocalStorage.getItem('excuseAnalytics');
      if (savedExcuseAnalytics) {
        const parsedAnalytics = JSON.parse(savedExcuseAnalytics);
        // Convert date strings back to Date objects
        const analyticsWithDates = Object.fromEntries(
          Object.entries(parsedAnalytics).map(([excuse, data]: [string, any]) => [
            excuse,
            { ...data, lastUsed: new Date(data.lastUsed) }
          ])
        );
        setExcuseAnalytics(analyticsWithDates);
      }

      const savedAbTestGroups = safeLocalStorage.getItem('abTestGroups');
      if (savedAbTestGroups) {
        setAbTestGroups(JSON.parse(savedAbTestGroups));
      } else {
        // Initialize A/B testing on first load
        initializeABTest();
      }
      
      // Load subscription data
      const savedSubscriptionData = safeLocalStorage.getItem('subscriptionData');
      if (savedSubscriptionData) {
        const parsedSubData = JSON.parse(savedSubscriptionData);
        // Convert date strings back to Date objects
        setSubscriptionData({
          ...parsedSubData,
          startDate: new Date(parsedSubData.startDate),
          expiryDate: parsedSubData.expiryDate ? new Date(parsedSubData.expiryDate) : undefined,
          usage: {
            ...parsedSubData.usage,
            lastReset: new Date(parsedSubData.usage.lastReset)
          }
        });
      }
      
      const savedSubscriptionTier = safeLocalStorage.getItem('subscriptionTier');
      if (savedSubscriptionTier && ['free', 'pro', 'premium'].includes(savedSubscriptionTier)) {
        setSubscriptionTier(savedSubscriptionTier as 'free' | 'pro' | 'premium');
        
        // Automatically set premium status for Pro and Premium tiers
        if (savedSubscriptionTier === 'pro' || savedSubscriptionTier === 'premium') {
          setIsPremium(true);
        }
      }
      
      // Load language preference
      const savedLanguage = safeLocalStorage.getItem('selectedLanguage');
      if (savedLanguage && ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja'].includes(savedLanguage)) {
        setSelectedLanguage(savedLanguage as 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ja');
      }
      
      // Load phone number preference
      const savedPhoneNumber = safeLocalStorage.getItem('userPhoneNumber');
      if (savedPhoneNumber) {
        setUserPhoneNumber(savedPhoneNumber);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      safeLocalStorage.setItem('excuseHistory', JSON.stringify(excuseHistory));
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  }, [excuseHistory]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      safeLocalStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  // Save ratings to localStorage whenever it changes
  useEffect(() => {
    try {
      safeLocalStorage.setItem('excuseRatings', JSON.stringify(excuseRatings));
    } catch (error) {
      console.error('Error saving ratings to localStorage:', error);
    }
  }, [excuseRatings]);

  // Save custom excuses to localStorage whenever it changes
  useEffect(() => {
    try {
      safeLocalStorage.setItem('customExcuses', JSON.stringify(customExcuses));
    } catch (error) {
      console.error('Error saving custom excuses to localStorage:', error);
    }
  }, [customExcuses]);

  // Save usage statistics to localStorage whenever it changes
  useEffect(() => {
    try {
      safeLocalStorage.setItem('usageStats', JSON.stringify(usageStats));
    } catch (error) {
      console.error('Error saving usage stats to localStorage:', error);
    }
  }, [usageStats]);

  // Save excuse analytics to localStorage whenever it changes
  useEffect(() => {
    try {
      safeLocalStorage.setItem('excuseAnalytics', JSON.stringify(excuseAnalytics));
    } catch (error) {
      console.error('Error saving excuse analytics to localStorage:', error);
    }
  }, [excuseAnalytics]);

  // Save A/B test groups to localStorage whenever it changes
  useEffect(() => {
    try {
      safeLocalStorage.setItem('abTestGroups', JSON.stringify(abTestGroups));
    } catch (error) {
      console.error('Error saving A/B test groups to localStorage:', error);
    }
  }, [abTestGroups]);

  // Save subscription data to localStorage whenever it changes
  useEffect(() => {
    try {
      safeLocalStorage.setItem('subscriptionData', JSON.stringify(subscriptionData));
      safeLocalStorage.setItem('subscriptionTier', subscriptionTier);
    } catch (error) {
      console.error('Error saving subscription data to localStorage:', error);
    }
  }, [subscriptionData, subscriptionTier]);

  // Save language selection to localStorage
  useEffect(() => {
    try {
      safeLocalStorage.setItem('selectedLanguage', selectedLanguage);
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  }, [selectedLanguage]);

  // Save phone number to localStorage
  useEffect(() => {
    try {
      safeLocalStorage.setItem('userPhoneNumber', userPhoneNumber);
    } catch (error) {
      console.error('Error saving phone number to localStorage:', error);
    }
  }, [userPhoneNumber]);

  // Pick random excuse for daily widget - updates when language changes
  useEffect(() => {
    const allExcuses = Object.values(sampleExcuses).flatMap(category => 
      Object.values(category).flatMap(toneArray => toneArray)
    );
    const randomExcuse = allExcuses[Math.floor(Math.random() * allExcuses.length)];
    setDailyExcuse(randomExcuse);
  }, [selectedLanguage]); // Removed sampleExcuses to prevent infinite loop

  // Onboarding screen for first-time users
  if (onboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-6 text-center">
            <h1 className="text-3xl font-bold mb-2">{t.welcomeTitle}</h1>
            <p className="text-gray-600">{t.welcomeDescription}</p>

            {/* Language Selector */}
            <div className="mb-4">
              <label htmlFor="onboarding-language-select" className="block mb-2 text-sm font-medium text-gray-700">{t.chooseLanguageLabel}</label>
              <Select onValueChange={(val: 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ja') => setSelectedLanguage(val)} value={selectedLanguage}>
                <SelectTrigger id="onboarding-language-select" aria-label="Choose language for excuses" className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent role="listbox" aria-label="Language options">
                  {Object.entries(availableLanguages).map(([code, lang]) => (
                    <SelectItem key={code} value={code} role="option">
                      {lang.flag} {lang.nativeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <h2 className="text-lg font-semibold mb-4">{t.chooseStyleTitle}</h2>
            <div className="grid grid-cols-1 gap-3 mt-6">
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" onClick={() => { setTone("funny"); setOnboarding(false); }}>
                {t.funnyStyle}
              </Button>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { setTone("professional"); setOnboarding(false); }}>
                {t.professionalStyle}
              </Button>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => { setTone("believable"); setOnboarding(false); }}>
                {t.believableStyle}
              </Button>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white" onClick={() => { setTone("dramatic"); setOnboarding(false); }}>
                {t.dramaticStyle}
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-500 flex items-center justify-center space-x-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Change style anytime in settings</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Settings/Profile screen
  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Settings className="w-5 h-5" /> <span>Settings & Profile</span>
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">🎭 Favorite Excuses</h3>
                {favorites.length > 0 ? (
                  <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto">
                    {favorites.map((fav, index) => (
                      <li key={index}>{fav}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No favorites saved yet.</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center space-x-1">
                    <History className="w-4 h-4" /> <span>Recent History</span>
                  </h3>
                  {excuseHistory.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setExcuseHistory([])}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {excuseHistory.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {excuseHistory.slice(0, 10).map((entry, index) => (
                      <div key={index} className="text-xs p-2 bg-gray-50 rounded border">
                        <p className="text-gray-800 font-medium mb-1">{entry.excuse}</p>
                        <div className="flex justify-between text-gray-500">
                          <span>{entry.situation} • {entry.tone}</span>
                          <span>{entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No excuses generated yet.</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" /> <span>Rating Analytics</span>
                  </h3>
                </div>
                {(() => {
                  const stats = getRatingStats();
                  const topRated = getTopRatedExcuses();
                  
                  if (stats.totalRatings > 0) {
                    return (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 bg-green-50 rounded border">
                            <div className="text-green-600 font-semibold">{stats.upCount}</div>
                            <div className="text-gray-600">👍 Good</div>
                          </div>
                          <div className="p-2 bg-red-50 rounded border">
                            <div className="text-red-600 font-semibold">{stats.downCount}</div>
                            <div className="text-gray-600">👎 Poor</div>
                          </div>
                          <div className="p-2 bg-blue-50 rounded border">
                            <div className="text-blue-600 font-semibold">{stats.percentage}%</div>
                            <div className="text-gray-600">Success</div>
                          </div>
                        </div>
                        
                        {topRated.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">🏆 Top Rated</h4>
                            <div className="space-y-1">
                              {topRated.slice(0, 3).map((excuse, index) => (
                                <div key={index} className="text-xs p-2 bg-green-50 rounded border">
                                  <span className="text-green-600 mr-1">#{index + 1}</span>
                                  <span className="text-gray-700">{excuse}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <p className="text-sm text-gray-500">Start rating excuses to see analytics!</p>
                    );
                  }
                })()}
              </div>

              <div>
                <h3 className="font-semibold mb-2">👑 Subscription</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Current Plan: {isPremium ? (
                        <span className="text-yellow-600 font-semibold">✨ Premium</span>
                      ) : (
                        <span>Free</span>
                      )}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Premium</span>
                      <Switch 
                        checked={isPremium} 
                        onCheckedChange={togglePremium}
                      />
                    </div>
                  </div>
                  {isPremium ? (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        🎉 You have access to all premium features!
                      </p>
                      <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                        <li>• Enhanced excuse categories</li>
                        <li>• Weather, traffic & medical proofs</li>
                        <li>• Priority customer support</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700">
                        💡 Upgrade to unlock premium features:
                      </p>
                      <ul className="text-xs text-gray-600 mt-2 space-y-1">
                        <li>• More excuse categories</li>
                        <li>• Proof generators</li>
                        <li>• Advanced analytics</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4" onClick={() => setShowSettings(false)}>⬅️ Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper functions for beta feedback
  const getLanguageName = (langCode: string): string => {
    const languageNames = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French', 
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese'
    };
    return languageNames[langCode as keyof typeof languageNames] || 'English';
  };

  const getCurrentStyleName = (): string => {
    const styleNames = {
      'funny': 'Sneaky & Funny',
      'professional': 'Smooth & Professional',
      'believable': 'Realistic & Believable',
      'dramatic': 'Dramatic & Theatrical'
    };
    return styleNames[tone as keyof typeof styleNames] || tone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Main Excuses, Excuses! App */}
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold">🎭 {t.appTitle}</h1>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowBetaFeedback(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                title="Give beta feedback"
              >
                <TestTube className="w-4 h-4" />
                <span className="hidden sm:inline ml-1 text-xs">Beta</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Daily Excuse Widget */}
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-xl text-center">
            <h3 className="font-semibold flex items-center justify-center space-x-2 text-yellow-800">
              <Calendar className="w-4 h-4" /> <span>{t.dailyExcuseTitle}</span>
            </h3>
            <p className="text-sm text-gray-700 mt-2 mb-2">{dailyExcuse}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-white hover:bg-gray-50 border-gray-300 shadow-sm" 
              onClick={() => copyToClipboard(dailyExcuse)}
            >
              {copied ? <Check className="w-3 h-3 text-green-500 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? t.copied : t.copy}
            </Button>
          </div>

          <p className="text-gray-600 text-center mt-4">{t.pickInstructions}</p>
          {excuseHistory.length > 0 && (
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>🎯 {excuseHistory.length} excuse{excuseHistory.length !== 1 ? 's' : ''} generated</p>
              {(() => {
                const stats = getRatingStats();
                return stats.totalRatings > 0 ? (
                  <p>📊 {stats.percentage}% {t.successRate} ({stats.upCount}👍 {stats.downCount}👎)</p>
                ) : null;
              })()}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="situation-select" className="block mb-1 text-sm font-medium">{t.situation}</label>
              <Select onValueChange={(val) => setSituation(val)} value={situation}>
                <SelectTrigger id="situation-select" aria-label="Choose a situation for your excuse">
                  <SelectValue placeholder={t.situationPlaceholder} />
                </SelectTrigger>
                <SelectContent role="listbox" aria-label="Situation options">
                  <SelectItem value="work" role="option">{t.situations.work}</SelectItem>
                  <SelectItem value="school" role="option">{t.situations.school}</SelectItem>
                  <SelectItem value="date" role="option">{t.situations.date}</SelectItem>
                  <SelectItem value="family" role="option">{t.situations.family}</SelectItem>
                  <SelectItem value="social" role="option">{t.situations.social}</SelectItem>
                  <SelectItem value="exercise">{t.situations.exercise}</SelectItem>
                  <SelectItem value="weather">{t.situations.weather}</SelectItem>
                  <SelectItem value="traffic">{t.situations.traffic}</SelectItem>
                  <SelectItem value="medical">{t.situations.medical}</SelectItem>
                  {isPremium && (
                    <>
                      <SelectItem value="emergency">{t.situations.emergency}</SelectItem>
                      <SelectItem value="travel">{t.situations.travel}</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="tone-select" className="block mb-1 text-sm font-medium">{t.tone}</label>
              <Select onValueChange={(val) => setTone(val)} value={tone}>
                <SelectTrigger id="tone-select" aria-label="Choose the tone for your excuse">
                  <SelectValue placeholder={t.tonePlaceholder} />
                </SelectTrigger>
                <SelectContent role="listbox" aria-label="Tone options">
                  <SelectItem value="funny" role="option">{t.tones.funny}</SelectItem>
                  <SelectItem value="professional" role="option">{t.tones.professional}</SelectItem>
                  <SelectItem value="believable" role="option">{t.tones.believable}</SelectItem>
                  <SelectItem value="dramatic" role="option">{t.tones.dramatic}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Live Location & Weather Controls */}
            <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-green-800">🌍 Live Location Data</span>
                  {userLocation && (
                    <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded max-w-xs">
                      <div className="font-medium">📍 Current Location</div>
                      <div className="text-xs opacity-90 truncate">
                        {userLocation.address || 
                         `${userLocation.city || 'Unknown City'}${userLocation.state ? `, ${userLocation.state}` : ''}` ||
                         `${userLocation.lat.toFixed(3)}, ${userLocation.lon.toFixed(3)}`}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setUseRealData(!useRealData)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    useRealData && userLocation
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  disabled={!userLocation}
                >
                  {useRealData && userLocation ? 'ON' : 'OFF'}
                </button>
              </div>
              
              {!userLocation ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    💡 Share your location for ultra-realistic weather and traffic excuses!
                  </p>
                  <button
                    onClick={requestLocation}
                    disabled={isLoadingLocation || locationPermission === 'denied'}
                    className={`w-full py-2 px-3 rounded font-medium text-sm transition-colors ${
                      isLoadingLocation
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : locationPermission === 'denied'
                        ? 'bg-red-100 text-red-600 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isLoadingLocation ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                        Getting Location...
                      </>
                    ) : locationPermission === 'denied' ? (
                      '❌ Location Access Denied'
                    ) : (
                      '📍 Share My Location'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Weather:</span>
                    <span className="font-medium text-blue-600">
                      {liveWeatherData ? `${liveWeatherData.condition} ${liveWeatherData.temperature}°F` : 'Loading...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Traffic:</span>
                    <span className="font-medium text-orange-600">
                      {liveTrafficData ? `${liveTrafficData.type} delays` : 'Loading...'}
                    </span>
                  </div>
                  {useRealData && (
                    <div className="text-xs text-green-600 font-medium text-center">
                      ✅ Using real conditions for authentic excuses!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Format Selection - Available to All Users */}
            <div className="mt-3 p-2 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Proof Format:</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setProofFormat('document')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      proofFormat === 'document' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    📄 Document
                  </button>
                  <button
                    onClick={() => setProofFormat('email')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      proofFormat === 'email' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    📧 Email
                  </button>
                  <button
                    onClick={() => setProofFormat('sms')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      proofFormat === 'sms' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    📱 SMS
                  </button>
                </div>
              </div>
              
              {/* Phone Number Input - Only show for SMS format */}
              {proofFormat === 'sms' && (
                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Your Phone Number (for SMS recipient):
                  </label>
                  <input
                    type="tel"
                    value={userPhoneNumber}
                    onChange={(e) => setUserPhoneNumber(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    maxLength={20}
                  />
                </div>
              )}
              
              {/* Email Address Input - Show for Email format with better styling */}
              {proofFormat === 'email' && (
                <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                  <label className="block text-sm font-semibold text-green-800 mb-2">
                    📧 Send To Email Address:
                  </label>
                  <input
                    type="email"
                    value={userEmailAddress}
                    onChange={(e) => setUserEmailAddress(e.target.value)}
                    placeholder="boss@company.com or hr@company.com"
                    className="w-full px-3 py-2 text-sm border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                    autoFocus
                  />
                  <p className="text-xs text-green-600 mt-1">
                    💡 This will open your email app with the proof ready to send!
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={isPremium} 
                onCheckedChange={isPremium ? () => {} : () => setShowPremium(true)} 
                disabled={!isPremium}
              />
              <span className="text-sm">Add Proof {!isPremium && '(Premium)'}</span>
              {isPremium && (
                <div className="flex space-x-1 ml-2">
                  <Button variant="ghost" size="sm" onClick={() => generateProof('weather')}>
                    <Cloud className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => generateProof('traffic')}>
                    <MapPin className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    console.log('Medical certificate button clicked (small)');
                    generateProof('medical');
                  }}>
                    <FileText className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            <Button 
              className="w-full flex items-center justify-center space-x-2" 
              onClick={() => {
                console.log('Generate button clicked on mobile/desktop');
                generateExcuse();
              }}
              disabled={isGenerating}
              aria-label={isGenerating ? t.generating : t.generateAriaLabel}
              aria-describedby="excuse-help-text"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" aria-hidden="true"></div>
                  <span>{t.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>{t.generateExcuse}</span>
                </>
              )}
            </Button>
            
            <p id="excuse-help-text" className="sr-only">
              {t.generateAriaDescription}
            </p>

            {/* New Feature Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-2" role="group" aria-label="Additional features">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs py-2 px-1 sm:px-2" 
                onClick={() => {
                  if (!checkSubscriptionLimits('custom')) {
                    setShowSubscription(true);
                    return;
                  }
                  setShowCustomExcuse(true);
                }}
                aria-label="Add your own custom excuse"
              >
                <span className="hidden sm:inline" aria-hidden="true">✍️ </span>{t.custom}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs py-2 px-1 sm:px-2" 
                onClick={() => {
                  if (!checkSubscriptionLimits('template')) {
                    setShowSubscription(true);
                    return;
                  }
                  setShowTemplates(true);
                }}
                aria-label="Use customizable excuse templates"
              >
                <span className="hidden sm:inline" aria-hidden="true">📝 </span>{t.templates}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs py-2 px-1 sm:px-2" 
                onClick={() => {
                  if (!hasFeature('analytics')) {
                    setShowSubscription(true);
                    return;
                  }
                  setShowAnalytics(true);
                }}
                aria-label="View usage analytics and statistics"
              >
                <span className="hidden sm:inline" aria-hidden="true">📊 </span>{t.analytics}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs py-2 px-1 sm:px-2" 
                onClick={() => {
                  if (!hasFeature('exportFeatures')) {
                    setShowSubscription(true);
                    return;
                  }
                  setShowExport(true);
                }}
                aria-label="Export your favorites and history"
              >
                <span className="hidden sm:inline" aria-hidden="true">📤 </span>{t.export}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs py-2 px-1 sm:px-2 ${
                  subscriptionTier === 'premium' 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
                    : subscriptionTier === 'pro' 
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300'
                      : ''
                }`}
                onClick={() => setShowSubscription(true)}
                aria-label="Manage subscription and billing"
              >
                {subscriptionTier === 'premium' && <Crown className="w-3 h-3 text-yellow-500 hidden sm:inline mr-1" />}
                {subscriptionTier === 'pro' && <Sparkles className="w-3 h-3 text-purple-500 hidden sm:inline mr-1" />}
                <span className="sm:hidden">💳</span>
                <span className="hidden sm:inline capitalize">{subscriptionTier}</span>
              </Button>
            </div>

            {/* Subscription Status Display */}
            <div className="mt-3 p-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Today's Usage:</span>
                <span className="font-medium">
                  {subscriptionData.usage.excusesToday}/{subscriptionData.features.dailyExcuseLimit === -1 ? '∞' : subscriptionData.features.dailyExcuseLimit} excuses
                </span>
              </div>
            </div>

            {/* Banner Ad for Free Users */}
            {shouldShowBannerAd() && !adDismissed && (
              <div className="mt-3 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-300 relative">
                <button 
                  onClick={dismissAd}
                  className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 font-bold"
                  aria-label="Dismiss ad"
                >
                  ×
                </button>
                <div className="text-center space-y-2">
                  <div className="text-xs text-gray-600 font-medium">Advertisement</div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm font-semibold text-blue-600 mb-1">🚀 Excuses, Excuses! Pro</div>
                    <div className="text-xs text-gray-700 mb-2">Generate unlimited excuses with our professional AI assistant!</div>
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Professional Tone</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Weather Proof</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Analytics</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSubscription(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Remove Ads - Upgrade Now! →
                  </button>
                </div>
              </div>
            )}

            {(hasFeature('proofGeneration') && subscriptionTier !== 'free') && (
              <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">✨ Premium Tools</h4>
                <p className="text-xs text-gray-600 mb-2">Current excuse count: {isPremium ? '240+' : '96'} available</p>
                
                {/* Format Toggle */}
                <div className="mb-3 flex items-center space-x-4">
                  <span className="text-xs font-medium text-gray-700">Format:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setProofFormat('document')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        proofFormat === 'document' 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      📄 Document
                    </button>
                    <button
                      onClick={() => setProofFormat('email')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        proofFormat === 'email' 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      📧 Email
                    </button>
                    <button
                      onClick={() => setProofFormat('sms')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        proofFormat === 'sms' 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      📱 SMS
                    </button>
                  </div>
                </div>
                
                {/* Phone Number Input - Only show for SMS format */}
                {proofFormat === 'sms' && (
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Your Phone Number (for SMS recipient):
                    </label>
                    <input
                      type="tel"
                      value={userPhoneNumber}
                      onChange={(e) => setUserPhoneNumber(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      maxLength={20}
                    />
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs" 
                    onClick={() => generateProof('weather')}
                    disabled={isGeneratingProof}
                  >
                    {isGeneratingProof ? '⏳' : '🌧️'} {t.weather}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs" 
                    onClick={() => generateProof('traffic')}
                    disabled={isGeneratingProof}
                  >
                    {isGeneratingProof ? '⏳' : '🚗'} {t.traffic}  
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs" 
                    onClick={() => {
                      console.log('Medical certificate button clicked (large)');
                      generateProof('medical');
                    }}
                    disabled={isGeneratingProof}
                  >
                    {isGeneratingProof ? '⏳' : '🏥'} {t.medical}
                  </Button>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-700">{t.generatingExcuse}</p>
                    <p className="text-xs text-blue-600">{t.craftingStory}</p>
                  </div>
                </div>
              </div>
            )}

            {excuse && !isGenerating && (
              <div 
                className="mt-4 p-4 bg-gray-100 rounded-xl border text-center text-gray-800 opacity-100 scale-100 animate-in fade-in-50 duration-500"
                role="region"
                aria-label="Generated excuse"
                aria-live="polite"
              >
                <p className="font-medium mb-3" id="generated-excuse">{excuse}</p>
                <div className="flex justify-center space-x-2 mb-3" role="group" aria-label="Excuse actions">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-1" 
                    onClick={saveFavorite}
                    aria-label="Save this excuse to your favorites"
                  >
                    <Star className="w-4 h-4 text-yellow-500" aria-hidden="true" /> <span>Save</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-1" 
                    onClick={() => copyToClipboard(excuse)}
                    aria-label={copied ? "Excuse copied to clipboard" : t.copyAriaLabel}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" aria-hidden="true" /> : <Copy className="w-4 h-4 text-blue-500" aria-hidden="true" />} 
                    <span>{copied ? t.copied : "Copy"}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={() => setShowShare(true)}>
                    <Share2 className="w-4 h-4 text-purple-500" /> <span>{t.share}</span>
                  </Button>
                </div>
                <div className="flex justify-center space-x-2 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500 self-center">{t.rateThis}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`flex items-center space-x-1 ${currentExcuseRated === 'up' || getExcuseRating(excuse) === 'up' ? 'text-green-600' : 'text-gray-400'}`}
                    onClick={() => rateExcuse(excuse, 'up')}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs">{currentExcuseRated === 'up' ? t.thanks : t.good}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`flex items-center space-x-1 ${currentExcuseRated === 'down' || getExcuseRating(excuse) === 'down' ? 'text-red-600' : 'text-gray-400'}`}
                    onClick={() => rateExcuse(excuse, 'down')}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-xs">{currentExcuseRated === 'down' ? t.noted : t.bad}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Proof Generator Screen */}
      {showProofGenerator && generatedProof && (
        <Card className="w-full max-w-md shadow-xl rounded-2xl border-2 border-green-400">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center space-x-2 text-green-600">
              <Camera className="w-5 h-5" /> <span>{generatedProof.type} Generated</span>
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm whitespace-pre-line max-h-96 overflow-y-auto text-gray-800">
              {generatedProof.content || 'No content generated'}
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                💡 <strong>Pro Tip:</strong> Use &quot;Send as SMS&quot; to open your phone&apos;s messaging app with the proof ready to send, or copy/screenshot for other uses!
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white" 
                onClick={() => copyToClipboard(generatedProof.content)}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? t.copied : t.copyProof}
              </Button>
              
              {/* SMS Send Button - Show for all proofs but highlight for SMS format */}
              <Button 
                variant={proofFormat === 'sms' ? "default" : "outline"} 
                className={`w-full ${proofFormat === 'sms' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
                onClick={() => sendAsSMS(generatedProof.content, userPhoneNumber || undefined)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                📱 Send as SMS
              </Button>
              
              {/* Email Send Button - Show for all proofs but highlight for Email format */}
              <Button 
                variant={proofFormat === 'email' ? "default" : "outline"} 
                className={`w-full ${proofFormat === 'email' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
                onClick={() => sendAsEmail(generatedProof.content, userEmailAddress || 'employer@company.com')}
                disabled={emailSending}
              >
                {emailSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Opening Email...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    📧 Open Email App
                  </>
                )}
              </Button>
              
              {/* Quick Email Button - Always works, no email required */}
              {proofFormat !== 'email' && (
                <Button 
                  variant="outline" 
                  className="w-full border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => {
                    const subject = 'Medical Excuse Documentation';
                    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(generatedProof.content)}`;
                    window.location.href = mailtoUrl;
                    alert('📧 Email app should open now! Add your employer\'s email address in the "To" field.');
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  ✉️ Quick Email
                </Button>
              )}
              
              {/* Copy for Email Button - Backup option */}
              <Button 
                variant="outline" 
                className="w-full border-green-300 text-green-700 hover:bg-green-50"
                onClick={() => {
                  navigator.clipboard.writeText(generatedProof.content);
                  alert('📋 Copied! Now:\n1. Open your email\n2. Paste the proof (Ctrl+V)\n3. Send to your employer');
                }}
              >
                📋 Copy for Email
              </Button>

              {/* Premium Image Download Buttons */}
              {generatedProof.image && (
                <>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800 font-medium mb-2">
                      🎨 <strong>Premium Visual Proof:</strong> Download the official document image for maximum believability!
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white" 
                    onClick={() => {
                      if (generatedProof.image) {
                        downloadImageFile(generatedProof.image, `${generatedProof.type.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`);
                      }
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    📸 Download Visual Proof
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    onClick={() => {
                      if (generatedProof.image) {
                        // Open image in new tab for sharing
                        const newWindow = window.open();
                        if (newWindow) {
                          newWindow.document.write(`
                            <html>
                              <head><title>${generatedProof.type}</title></head>
                              <body style="margin:0;padding:20px;background:#f0f0f0;">
                                <img src="${generatedProof.image}" style="max-width:100%;height:auto;border:1px solid #ccc;box-shadow:0 4px 8px rgba(0,0,0,0.1);">
                                <p style="margin-top:10px;font-family:Arial,sans-serif;color:#666;font-size:14px;">Right-click the image above to save or share</p>
                              </body>
                            </html>
                          `);
                        }
                      }
                    }}
                  >
                    <Share className="w-4 h-4 mr-2" />
                    👁️ View & Share Image
                  </Button>
                </>
              )}
              
              <Button variant="outline" className="w-full" onClick={() => setShowProofGenerator(false)}>
                ⬅️ Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Screen */}
      {showPremium && (
        <Card className="w-full max-w-md shadow-xl rounded-2xl border-2 border-yellow-400">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center space-x-2 text-yellow-600">
              <Crown className="w-5 h-5" /> <span>Unlock Premium</span>
            </h2>
            <p className="text-gray-600">Get realistic proof generators, unlimited excuses, and advanced features.</p>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">✨ Premium Features:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <Cloud className="w-4 h-4 text-blue-500" />
                  <span>Fake weather alerts & screenshots</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>Traffic jam reports & maps</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  <span>Doctor's note templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Unlimited excuse categories</span>
                </li>
                <li className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span>Advanced analytics & insights</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                🎉 <strong>Launch Special:</strong> Get lifetime access for just $9.99 (normally $4.99/month)
              </p>
            </div>

            <div className="space-y-2">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" onClick={unlockPremium}>
                🚀 Unlock Premium - $9.99
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setShowPremium(false)}>
                Maybe Later
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Information Dialog */}
      {showPatientInfoDialog && (
        <Card className="w-full max-w-md shadow-xl rounded-2xl border-2 border-blue-400">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center space-x-2 text-blue-600">
              <FileText className="w-5 h-5" /> <span>Medical Certificate</span>
            </h2>
            <p className="text-gray-600">Please provide your information for the medical certificate.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth (Optional)
                </label>
                <input
                  type="date"
                  value={patientDateOfBirth}
                  onChange={(e) => setPatientDateOfBirth(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                📋 <strong>Note:</strong> This information will be used to create a realistic medical certificate document.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
                onClick={generateMedicalProofWithPatientInfo}
                disabled={!patientName.trim()}
              >
                🏥 Generate Medical Certificate
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setShowPatientInfoDialog(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Screen */}
      {showShare && excuse && (
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-center">Share Your Excuse</h2>
            <div className="p-3 bg-gray-50 rounded-lg border text-center">
              <p className="text-sm font-medium text-gray-800">"{excuse}"</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-600">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="flex items-center space-x-2 text-sm" onClick={() => copyToClipboard(excuse)}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} 
                  <span>{copied ? t.copied : t.copy}</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2 text-sm" onClick={() => shareViaSMS(excuse)}>
                  <MessageCircle className="w-4 h-4" /> <span>SMS</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2 text-sm" onClick={() => shareViaEmail(excuse)}>
                  <Mail className="w-4 h-4" /> <span>Email</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2 text-sm" onClick={() => shareViaWhatsApp(excuse)}>
                  <MessageCircle className="w-4 h-4 text-green-600" /> <span>WhatsApp</span>
                </Button>
              </div>

              <h3 className="text-sm font-medium text-gray-600 pt-2">Social Media</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="flex items-center space-x-2 text-sm" onClick={() => shareViaTwitter(excuse)}>
                  <Twitter className="w-4 h-4 text-blue-500" /> <span>Twitter</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2 text-sm" onClick={() => shareViaFacebook(excuse)}>
                  <Facebook className="w-4 h-4 text-blue-600" /> <span>Facebook</span>
                </Button>
              </div>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <>
                  <h3 className="text-sm font-medium text-gray-600 pt-2">System Share</h3>
                  <Button variant="outline" className="w-full flex items-center justify-center space-x-2 text-sm" onClick={() => shareNative(excuse)}>
                    <Share2 className="w-4 h-4" /> <span>More Apps...</span>
                  </Button>
                </>
              )}
            </div>

            <Button variant="ghost" className="w-full mt-4" onClick={() => setShowShare(false)}>
              ⬅️ Back
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Custom Excuse Modal */}
      {showCustomExcuse && (
        <Card className="w-full max-w-md mx-4 sm:mx-auto shadow-xl rounded-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">✍️ Add Custom Excuse</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Situation</label>
                <Select onValueChange={setCustomSituation} value={customSituation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">💼 Work</SelectItem>
                    <SelectItem value="school">🎓 School</SelectItem>
                    <SelectItem value="date">💕 Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Tone</label>
                <Select onValueChange={setCustomTone} value={customTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funny">😂 Funny</SelectItem>
                    <SelectItem value="professional">💼 Professional</SelectItem>
                    <SelectItem value="believable">✅ Believable</SelectItem>
                    <SelectItem value="dramatic">🎭 Dramatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Your Custom Excuse</label>
                <textarea 
                  value={newCustomExcuse}
                  onChange={(e) => setNewCustomExcuse(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                  placeholder="Enter your creative excuse here..."
                />
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1" onClick={addCustomExcuse} disabled={!newCustomExcuse.trim()}>
                  Add Excuse
                </Button>
                <Button variant="outline" onClick={() => setShowCustomExcuse(false)}>
                  Cancel
                </Button>
              </div>
            </div>

            {/* Display existing custom excuses */}
            {Object.keys(customExcuses).length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Your Custom Excuses</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {Object.entries(customExcuses).map(([situation, tones]) => 
                    Object.entries(tones).map(([tone, excuses]) => 
                      excuses.map((excuse, index) => (
                        <div key={`${situation}-${tone}-${index}`} className="p-2 bg-gray-50 rounded text-sm flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">{situation} • {tone}</div>
                            <div>{excuse}</div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteCustomExcuse(excuse, situation, tone)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <Card className="w-full max-w-2xl shadow-xl rounded-2xl max-h-[80vh] overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">📝 Excuse Templates</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Situation</label>
                  <Select onValueChange={(val) => setSituation(val)} value={situation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">💼 Work</SelectItem>
                      <SelectItem value="school">🎓 School</SelectItem>
                      <SelectItem value="date">💕 Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Tone</label>
                  <Select onValueChange={(val) => setTone(val)} value={tone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funny">😂 Funny</SelectItem>
                      <SelectItem value="professional">💼 Professional</SelectItem>
                      <SelectItem value="believable">✅ Believable</SelectItem>
                      <SelectItem value="dramatic">🎭 Dramatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {(excuseTemplates[situation as keyof typeof excuseTemplates]?.[tone as keyof typeof excuseTemplates['work']] || []).map((template: string, index: number) => (
                  <div key={index} className="mb-4 p-3 border border-gray-200 rounded-lg">
                    <div className="text-sm mb-2">{template}</div>
                    <div className="flex space-x-2 mb-2">
                      {(template.match(/{([^}]+)}/g) || []).map((placeholder: string, pIndex: number) => {
                        const key = placeholder.slice(1, -1);
                        return (
                          <input
                            key={pIndex}
                            type="text"
                            placeholder={key.replace(/_/g, ' ')}
                            className="flex-1 p-1 text-xs border border-gray-300 rounded"
                            value={templateValues[key] || ''}
                            onChange={(e) => setTemplateValues(prev => ({...prev, [key]: e.target.value}))}
                          />
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded mb-2">
                      Preview: {generateFromTemplate(template)}
                    </div>
                    <Button size="sm" onClick={() => fillTemplate(template)} className="text-xs">
                      Use This Template
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={() => setShowTemplates(false)}>
              ⬅️ Back
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Export Modal */}
      {showExport && (
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">📤 Export Your Data</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Export Favorites ({favorites.length} items)</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportFavorites('txt')} disabled={favorites.length === 0}>
                    📄 TXT
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportFavorites('json')} disabled={favorites.length === 0}>
                    📋 JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportFavorites('csv')} disabled={favorites.length === 0}>
                    📊 CSV
                  </Button>
                </div>
                {favorites.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">No favorites to export. Save some excuses first!</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Export History ({excuseHistory.length} items)</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportHistory('txt')} disabled={excuseHistory.length === 0}>
                    📄 TXT
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportHistory('json')} disabled={excuseHistory.length === 0}>
                    📋 JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportHistory('csv')} disabled={excuseHistory.length === 0}>
                    📊 CSV
                  </Button>
                </div>
                {excuseHistory.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">No history to export. Generate some excuses first!</p>
                )}
              </div>

              <div className="p-3 bg-blue-50 rounded-lg text-xs">
                <strong>File Formats:</strong><br/>
                • TXT: Simple text format<br/>
                • JSON: Structured data with timestamps<br/>
                • CSV: Spreadsheet-compatible format
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={() => setShowExport(false)}>
              ⬅️ Back
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <Card className="w-full max-w-3xl mx-4 sm:mx-auto shadow-xl rounded-2xl max-h-[85vh] overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">📊 Usage Analytics & Insights</h2>
            
            <div className="max-h-96 overflow-y-auto space-y-6">
              {/* Usage Statistics */}
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-3">📈 Usage Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{usageStats.totalGenerations}</div>
                    <div className="text-sm text-gray-600">Total Excuses Generated</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.keys(usageStats.situationCounts).length > 0 ? getMostPopularSituation() : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Most Popular Situation</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Object.keys(usageStats.toneCounts).length > 0 ? getMostPopularTone() : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Most Popular Tone</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {getRatingStats().percentage}%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Situation Breakdown */}
              {Object.keys(usageStats.situationCounts).length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3">🎯 Situation Breakdown</h3>
                  <div className="space-y-2">
                    {Object.entries(usageStats.situationCounts)
                      .sort(([,a], [,b]) => b - a)
                      .map(([situation, count]) => (
                        <div key={situation} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="capitalize font-medium">{situation}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(count / usageStats.totalGenerations) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold">{count}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Top Performing Excuses */}
              {Object.keys(excuseAnalytics).length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3">🏆 Top Performing Excuses</h3>
                  <div className="space-y-2">
                    {getTopPerformingExcuses().slice(0, 5).map((data, index) => (
                      <div key={index} className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                        <div className="text-sm font-medium mb-1">{data.excuse}</div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{data.situation} • {data.tone}</span>
                          <div className="flex space-x-3">
                            <span>Generated: {data.timesGenerated}x</span>
                            <span>Rating: {Math.round(data.averageRating * 100)}%</span>
                            <span>Effectiveness: {Math.round(data.effectiveness * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {getTopPerformingExcuses().length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Start rating excuses to see performance analytics!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Underused Combinations */}
              {usageStats.totalGenerations > 5 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3">💡 Suggestions</h3>
                  <div className="space-y-2">
                    {getLeastPopularCombinations().slice(0, 3).map((item, index) => (
                      <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium">Try {item.combo.replace('-', ' + ')} combinations</span>
                            <div className="text-xs text-gray-600">Only used {item.count} times</div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => {
                              const [newSituation, newTone] = item.combo.split('-');
                              setSituation(newSituation);
                              setTone(newTone);
                              setShowAnalytics(false);
                            }}
                          >
                            Try Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* A/B Test Results */}
              {Object.keys(abTestGroups).length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3">🧪 A/B Test Results</h3>
                  {Object.entries(abTestGroups).map(([testId, testData]) => (
                    <div key={testId} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium mb-2">Excuse Effectiveness Test</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {testData.results.A.generations > 0 
                              ? Math.round((testData.results.A.positiveRatings / testData.results.A.ratings) * 100) || 0
                              : 0}%
                          </div>
                          <div className="text-xs text-gray-600">Variant A Success Rate</div>
                          <div className="text-xs text-gray-500">{testData.results.A.generations} generations</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {testData.results.B.generations > 0 
                              ? Math.round((testData.results.B.positiveRatings / testData.results.B.ratings) * 100) || 0
                              : 0}%
                          </div>
                          <div className="text-xs text-gray-600">Variant B Success Rate</div>
                          <div className="text-xs text-gray-500">{testData.results.B.generations} generations</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 text-center">
                        You're in group {testData.userGroup}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {usageStats.totalGenerations === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Yet</h3>
                  <p className="text-sm text-gray-500">Generate some excuses to see your analytics!</p>
                </div>
              )}
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={() => setShowAnalytics(false)}>
              ⬅️ Back
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Interstitial Ad Modal for Free Users */}
      {showAd && adType === 'interstitial' && subscriptionTier === 'free' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAd(false)}>
          <Card className="w-full max-w-md mx-4 shadow-xl rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-between items-start">
                <div className="text-xs text-gray-500">Advertisement</div>
                <button 
                  onClick={() => setShowAd(false)}
                  className="text-gray-500 hover:text-gray-700 font-bold text-lg"
                  aria-label="Close ad"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-lg font-bold text-gray-800 mb-2">Need Better Excuses?</div>
                <div className="text-sm text-gray-600 mb-3">
                  Upgrade to Pro and get access to professional-grade excuses, weather reports, and unlimited generations!
                </div>
                <div className="flex justify-center space-x-2 text-xs mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">No Ads</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">50/day</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Analytics</span>
                </div>
                <Button 
                  onClick={() => {
                    setShowAd(false);
                    setShowSubscription(true);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Upgrade to Pro - $4.99/month
                </Button>
              </div>
              
              <div className="text-xs text-gray-400">
                <button 
                  onClick={() => setShowAd(false)}
                  className="text-gray-500 hover:text-gray-700 underline"
                >
                  Continue with Free (with ads)
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscription && (
        <Card className="w-full max-w-4xl shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
              <p className="text-gray-700">Unlock premium features and unlimited excuse generation</p>
            </div>

            {/* Current Usage Display */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Current Usage ({subscriptionTiers[subscriptionTier].name})</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-blue-700">{getRemainingUsage().excuses}</div>
                  <div className="text-gray-600">Excuses</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-700">{getRemainingUsage().customExcuses}</div>
                  <div className="text-gray-600">Custom Excuses</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-700">{getRemainingUsage().templates}</div>
                  <div className="text-gray-600">Templates</div>
                </div>
              </div>
            </div>

            {/* Subscription Tiers */}
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(subscriptionTiers).map(([tier, config]) => (
                <div key={tier} className={`relative p-6 rounded-2xl border-2 transition-all duration-200 ${
                  subscriptionTier === tier 
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                    : tier === 'pro' 
                      ? 'border-purple-300 bg-purple-50 hover:border-purple-400' 
                      : tier === 'premium'
                        ? 'border-yellow-300 bg-yellow-50 hover:border-yellow-400'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  {tier === 'premium' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold flex items-center justify-center space-x-2">
                        <span>{config.name}</span>
                        {tier === 'premium' && <Crown className="w-5 h-5 text-yellow-500" />}
                        {tier === 'pro' && <Sparkles className="w-5 h-5 text-purple-500" />}
                      </h3>
                      <div className="text-3xl font-bold text-gray-900">
                        {config.price}
                        {tier !== 'free' && <span className="text-sm font-normal text-gray-600">/month</span>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {config.featureList.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-left text-gray-800">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      {subscriptionTier === tier ? (
                        <Button disabled className="w-full bg-gray-200 text-gray-600 cursor-not-allowed font-medium">
                          Current Plan
                        </Button>
                      ) : tier === 'free' ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setSubscriptionTier('free');
                            setSubscriptionData(prev => ({
                              ...prev,
                              tier: 'free',
                              features: config.features,
                            }));
                            setShowSubscription(false);
                          }}
                        >
                          Downgrade to Free
                        </Button>
                      ) : (
                        <Button 
                          className={`w-full ${
                            tier === 'premium' 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600' 
                              : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700'
                          } text-white`}
                          onClick={() => upgradeSubscription(tier as 'pro' | 'premium')}
                        >
                          {subscriptionTier === 'free' ? 'Upgrade' : tier === 'premium' ? 'Upgrade to Premium' : 'Switch'} 
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Comparison */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Feature Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-gray-800 font-semibold">Feature</th>
                      <th className="text-center py-2 text-gray-800 font-semibold">Free</th>
                      <th className="text-center py-2 text-gray-800 font-semibold">Pro</th>
                      <th className="text-center py-2 text-gray-800 font-semibold">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b">
                      <td className="py-2 text-gray-700">Daily Excuses</td>
                      <td className="text-center text-gray-700">10</td>
                      <td className="text-center text-gray-700">50</td>
                      <td className="text-center text-gray-700">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-700">Custom Excuses</td>
                      <td className="text-center text-gray-700">5</td>
                      <td className="text-center text-gray-700">25</td>
                      <td className="text-center text-gray-700">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-700">Templates</td>
                      <td className="text-center text-gray-700">2</td>
                      <td className="text-center text-gray-700">10</td>
                      <td className="text-center text-gray-700">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-700">Proof Generator</td>
                      <td className="text-center">❌</td>
                      <td className="text-center">✅</td>
                      <td className="text-center">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-700">Analytics</td>
                      <td className="text-center">❌</td>
                      <td className="text-center">✅</td>
                      <td className="text-center text-gray-700">✅ + A/B Testing</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-700">Export Features</td>
                      <td className="text-center">❌</td>
                      <td className="text-center">✅</td>
                      <td className="text-center text-gray-700">✅ Multiple Formats</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowSubscription(false)}
                className="px-6"
              >
                ⬅️ Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Beta Feedback Form */}
      <BetaFeedbackForm 
        isOpen={showBetaFeedback}
        onClose={() => setShowBetaFeedback(false)}
        currentLanguage={selectedLanguage}
        currentStyle={getCurrentStyleName()}
      />
    </div>
  );
}
