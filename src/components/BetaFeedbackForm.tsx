import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MessageCircle, Star, Bug, Lightbulb, X } from 'lucide-react';

// Translations for the beta feedback form
const feedbackTranslations = {
  en: {
    title: "🧪 Beta Feedback",
    subtitle: "Help us improve Excuses, Excuses!",
    feedbackType: "Feedback Type",
    general: "General Feedback",
    bug: "Bug Report", 
    feature: "Feature Request",
    usability: "Usability Issue",
    rating: "Overall Rating",
    ratingLabel: "How would you rate your experience?",
    email: "Email (Optional)",
    emailPlaceholder: "your@email.com",
    subject: "Subject",
    subjectPlaceholder: "Brief summary of your feedback",
    message: "Message",
    messagePlaceholder: "Please share your thoughts, suggestions, or describe any issues you've encountered...",
    reproductionSteps: "Steps to Reproduce (For Bugs)",
    reproductionPlaceholder: "1. First I did...\n2. Then I clicked...\n3. Finally I saw...",
    submitButton: "Submit Feedback",
    cancelButton: "Cancel",
    submitting: "Submitting...",
    thankYou: "Thank you for your feedback!",
    error: "Error submitting feedback. Please try again."
  },
  es: {
    title: "🧪 Comentarios Beta",
    subtitle: "¡Ayúdanos a mejorar Excusas, Excusas!",
    feedbackType: "Tipo de Comentario",
    general: "Comentario General",
    bug: "Reporte de Error",
    feature: "Solicitud de Función",
    usability: "Problema de Usabilidad",
    rating: "Calificación General",
    ratingLabel: "¿Cómo calificarías tu experiencia?",
    email: "Correo (Opcional)",
    emailPlaceholder: "tu@correo.com",
    subject: "Asunto",
    subjectPlaceholder: "Resumen breve de tu comentario",
    message: "Mensaje",
    messagePlaceholder: "Por favor comparte tus pensamientos, sugerencias o describe cualquier problema que hayas encontrado...",
    reproductionSteps: "Pasos para Reproducir (Para Errores)",
    reproductionPlaceholder: "1. Primero hice...\n2. Luego hice clic en...\n3. Finalmente vi...",
    submitButton: "Enviar Comentarios",
    cancelButton: "Cancelar",
    submitting: "Enviando...",
    thankYou: "¡Gracias por tus comentarios!",
    error: "Error al enviar comentarios. Inténtalo de nuevo."
  },
  fr: {
    title: "🧪 Commentaires Bêta",
    subtitle: "Aidez-nous à améliorer Excuses, Excuses!",
    feedbackType: "Type de Commentaire",
    general: "Commentaire Général",
    bug: "Rapport de Bug",
    feature: "Demande de Fonctionnalité",
    usability: "Problème d'Utilisabilité",
    rating: "Note Globale",
    ratingLabel: "Comment évalueriez-vous votre expérience?",
    email: "Email (Optionnel)",
    emailPlaceholder: "votre@email.com",
    subject: "Sujet",
    subjectPlaceholder: "Résumé de votre commentaire",
    message: "Message",
    messagePlaceholder: "Partagez vos pensées, suggestions ou décrivez les problèmes rencontrés...",
    reproductionSteps: "Étapes de Reproduction (Pour les Bugs)",
    reproductionPlaceholder: "1. D'abord j'ai...\n2. Puis j'ai cliqué...\n3. Finalement j'ai vu...",
    submitButton: "Envoyer Commentaires",
    cancelButton: "Annuler",
    submitting: "Envoi en cours...",
    thankYou: "Merci pour vos commentaires!",
    error: "Erreur lors de l'envoi. Veuillez réessayer."
  },
  de: {
    title: "🧪 Beta-Feedback",
    subtitle: "Helfen Sie uns, Excuses, Excuses zu verbessern!",
    feedbackType: "Feedback-Typ",
    general: "Allgemeines Feedback",
    bug: "Fehlerbericht",
    feature: "Funktionsanfrage",
    usability: "Benutzerfreundlichkeitsproblem",
    rating: "Gesamtbewertung",
    ratingLabel: "Wie würden Sie Ihre Erfahrung bewerten?",
    email: "E-Mail (Optional)",
    emailPlaceholder: "ihre@email.com",
    subject: "Betreff",
    subjectPlaceholder: "Kurze Zusammenfassung Ihres Feedbacks",
    message: "Nachricht",
    messagePlaceholder: "Teilen Sie Ihre Gedanken, Vorschläge mit oder beschreiben Sie Probleme...",
    reproductionSteps: "Reproduktionsschritte (Für Fehler)",
    reproductionPlaceholder: "1. Zuerst habe ich...\n2. Dann habe ich geklickt...\n3. Schließlich sah ich...",
    submitButton: "Feedback Senden",
    cancelButton: "Abbrechen",
    submitting: "Wird gesendet...",
    thankYou: "Vielen Dank für Ihr Feedback!",
    error: "Fehler beim Senden. Bitte versuchen Sie es erneut."
  },
  it: {
    title: "🧪 Feedback Beta",
    subtitle: "Aiutaci a migliorare Excuses, Excuses!",
    feedbackType: "Tipo di Feedback",
    general: "Feedback Generale",
    bug: "Segnalazione Bug",
    feature: "Richiesta Funzionalità",
    usability: "Problema di Usabilità",
    rating: "Valutazione Complessiva",
    ratingLabel: "Come valuteresti la tua esperienza?",
    email: "Email (Opzionale)",
    emailPlaceholder: "tua@email.com",
    subject: "Oggetto",
    subjectPlaceholder: "Riassunto del tuo feedback",
    message: "Messaggio",
    messagePlaceholder: "Condividi i tuoi pensieri, suggerimenti o descrivi problemi riscontrati...",
    reproductionSteps: "Passaggi per Riprodurre (Per Bug)",
    reproductionPlaceholder: "1. Prima ho...\n2. Poi ho cliccato...\n3. Infine ho visto...",
    submitButton: "Invia Feedback",
    cancelButton: "Annulla",
    submitting: "Invio in corso...",
    thankYou: "Grazie per il tuo feedback!",
    error: "Errore nell'invio. Riprova."
  },
  pt: {
    title: "🧪 Feedback Beta",
    subtitle: "Ajude-nos a melhorar Excuses, Excuses!",
    feedbackType: "Tipo de Feedback",
    general: "Feedback Geral",
    bug: "Relatório de Bug",
    feature: "Solicitação de Recurso",
    usability: "Problema de Usabilidade",
    rating: "Avaliação Geral",
    ratingLabel: "Como você avaliaria sua experiência?",
    email: "Email (Opcional)",
    emailPlaceholder: "seu@email.com",
    subject: "Assunto",
    subjectPlaceholder: "Resumo do seu feedback",
    message: "Mensagem",
    messagePlaceholder: "Compartilhe seus pensamentos, sugestões ou descreva problemas encontrados...",
    reproductionSteps: "Passos para Reproduzir (Para Bugs)",
    reproductionPlaceholder: "1. Primeiro eu...\n2. Depois cliquei em...\n3. Finalmente vi...",
    submitButton: "Enviar Feedback",
    cancelButton: "Cancelar",
    submitting: "Enviando...",
    thankYou: "Obrigado pelo seu feedback!",
    error: "Erro ao enviar. Tente novamente."
  },
  ru: {
    title: "🧪 Бета Отзыв",
    subtitle: "Помогите нам улучшить Excuses, Excuses!",
    feedbackType: "Тип Отзыва",
    general: "Общий Отзыв",
    bug: "Отчет об Ошибке",
    feature: "Запрос Функции",
    usability: "Проблема Юзабилити",
    rating: "Общая Оценка",
    ratingLabel: "Как бы вы оценили свой опыт?",
    email: "Email (Необязательно)",
    emailPlaceholder: "ваш@email.com",
    subject: "Тема",
    subjectPlaceholder: "Краткое описание вашего отзыва",
    message: "Сообщение",
    messagePlaceholder: "Поделитесь мыслями, предложениями или опишите проблемы...",
    reproductionSteps: "Шаги Воспроизведения (Для Ошибок)",
    reproductionPlaceholder: "1. Сначала я...\n2. Затем нажал...\n3. В итоге увидел...",
    submitButton: "Отправить Отзыв",
    cancelButton: "Отмена",
    submitting: "Отправка...",
    thankYou: "Спасибо за ваш отзыв!",
    error: "Ошибка при отправке. Попробуйте снова."
  },
  ja: {
    title: "🧪 ベータフィードバック",
    subtitle: "Excuses, Excuses!の改善にご協力ください！",
    feedbackType: "フィードバックの種類",
    general: "一般的なフィードバック",
    bug: "バグ報告",
    feature: "機能リクエスト",
    usability: "ユーザビリティの問題",
    rating: "総合評価",
    ratingLabel: "あなたの体験をどのように評価しますか？",
    email: "メール（任意）",
    emailPlaceholder: "your@email.com",
    subject: "件名",
    subjectPlaceholder: "フィードバックの要約",
    message: "メッセージ",
    messagePlaceholder: "ご意見、提案、または遭遇した問題について教えてください...",
    reproductionSteps: "再現手順（バグの場合）",
    reproductionPlaceholder: "1. 最初に...\n2. 次にクリックして...\n3. 最終的に見た...",
    submitButton: "フィードバックを送信",
    cancelButton: "キャンセル",
    submitting: "送信中...",
    thankYou: "フィードバックありがとうございます！",
    error: "送信エラー。もう一度お試しください。"
  }
};

export interface FeedbackData {
  id: string;
  timestamp: string;
  type: 'general' | 'bug' | 'feature' | 'usability';
  rating: number;
  email?: string;
  subject: string;
  message: string;
  userAgent: string;
  url: string;
  language: string;
  excuseStyle?: string;
  reproductionSteps?: string;
}

interface BetaFeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  currentStyle?: string;
}

export const BetaFeedbackForm: React.FC<BetaFeedbackFormProps> = ({ 
  isOpen, 
  onClose, 
  currentLanguage, 
  currentStyle 
}) => {
  // Convert language name to language code
  const getLanguageCode = (langName: string): keyof typeof feedbackTranslations => {
    // If it's already a language code, return it directly
    if (langName.length === 2 && feedbackTranslations[langName as keyof typeof feedbackTranslations]) {
      return langName as keyof typeof feedbackTranslations;
    }
    
    // Otherwise map full language names to codes
    const langMap: { [key: string]: keyof typeof feedbackTranslations } = {
      'English': 'en',
      'Spanish': 'es', 
      'Español': 'es',
      'French': 'fr',
      'Français': 'fr',
      'German': 'de',
      'Deutsch': 'de',
      'Italian': 'it',
      'Italiano': 'it',
      'Portuguese': 'pt',
      'Português': 'pt',
      'Russian': 'ru',
      'Русский': 'ru',
      'Japanese': 'ja',
      '日本語': 'ja'
    };
    return langMap[langName] || 'en';
  };

  const langCode = getLanguageCode(currentLanguage);
  const t = feedbackTranslations[langCode] || feedbackTranslations.en;
  const [formData, setFormData] = useState<{
    type: 'general' | 'bug' | 'feature' | 'usability';
    rating: number;
    email: string;
    subject: string;
    message: string;
    reproductionSteps: string;
  }>({
    type: 'general',
    rating: 0,
    email: '',
    subject: '',
    message: '',
    reproductionSteps: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: formData.type,
      rating: formData.rating,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      userAgent: navigator.userAgent,
      url: window.location.href,
      language: currentLanguage,
      excuseStyle: currentStyle,
      reproductionSteps: formData.reproductionSteps
    };

    // Store feedback in localStorage (for beta testing)
    const existingFeedback = localStorage.getItem('betaFeedback');
    const feedbackArray = existingFeedback ? JSON.parse(existingFeedback) : [];
    feedbackArray.push(feedbackData);
    localStorage.setItem('betaFeedback', JSON.stringify(feedbackArray));

    // Simulate API submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Auto-close after success
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setFormData({
        type: 'general',
        rating: 0,
        email: '',
        subject: '',
        message: '',
        reproductionSteps: ''
      });
    }, 2000);
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 hover:scale-110 transition-transform ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const feedbackTypes = [
    { value: 'general', label: t.general, icon: MessageCircle },
    { value: 'bug', label: t.bug, icon: Bug },
    { value: 'feature', label: t.feature, icon: Lightbulb },
    { value: 'usability', label: t.usability, icon: Star }
  ];

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">{t.thankYou}</h3>
            <p className="text-gray-600">
              {t.thankYou}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t.title}</h2>
            <p className="text-gray-600 mt-1">{t.subtitle}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div className="space-y-2">
              <Label>{t.feedbackType}</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Overall Rating */}
            <div className="space-y-2">
              <Label>{t.rating}</Label>
              <div className="flex items-center gap-3">
                <StarRating 
                  rating={formData.rating} 
                  onRatingChange={(rating) => setFormData({...formData, rating})} 
                />
                <span className="text-sm text-gray-500">
                  {formData.rating === 0 ? 'No rating' : 
                   formData.rating <= 2 ? 'Poor' :
                   formData.rating <= 3 ? 'Fair' :
                   formData.rating <= 4 ? 'Good' : 'Excellent'}
                </span>
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="space-y-2">
              <Label>{t.email}</Label>
              <Input
                type="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label>{t.subject} *</Label>
              <Input
                placeholder={t.subjectPlaceholder}
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            {/* Detailed Message */}
            <div className="space-y-2">
              <Label>{t.message} *</Label>
              <Textarea
                placeholder={t.messagePlaceholder}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                required
              />
            </div>

            {/* Bug Reproduction Steps */}
            {formData.type === 'bug' && (
              <div className="space-y-2">
                <Label>{t.reproductionSteps}</Label>
                <Textarea
                  placeholder={t.reproductionPlaceholder}
                  value={formData.reproductionSteps}
                  onChange={(e) => setFormData({...formData, reproductionSteps: e.target.value})}
                  rows={3}
                />
              </div>
            )}

            {/* Context Info */}
            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
              <p><strong>Context:</strong> Language: {currentLanguage}{currentStyle && `, Style: ${currentStyle}`}</p>
              <p><strong>URL:</strong> {window.location.href}</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting || !formData.subject || !formData.message}>
                {isSubmitting ? t.submitting : t.submitButton}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                {t.cancelButton}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};