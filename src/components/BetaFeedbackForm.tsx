import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MessageCircle, Star, Bug, Lightbulb, X } from 'lucide-react';

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
    { value: 'general', label: 'General Feedback', icon: MessageCircle },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'usability', label: 'Usability Issue', icon: Star }
  ];

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your feedback has been submitted successfully. We appreciate your help in making Excuses, Excuses! better!
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
            <h2 className="text-2xl font-bold">🧪 Beta Feedback</h2>
            <p className="text-gray-600 mt-1">Help us improve Excuses, Excuses!</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div className="space-y-2">
              <Label>Feedback Type</Label>
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
              <Label>Overall Rating</Label>
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
              <Label>Email (Optional - for follow-up)</Label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                placeholder="Brief summary of your feedback"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            {/* Detailed Message */}
            <div className="space-y-2">
              <Label>Detailed Feedback *</Label>
              <Textarea
                placeholder={
                  formData.type === 'bug' ? 
                    "Please describe the bug you encountered. What happened? What did you expect to happen?" :
                  formData.type === 'feature' ?
                    "What feature would you like to see added? How would it improve your experience?" :
                  formData.type === 'usability' ?
                    "What part of the app was confusing or difficult to use? How could it be improved?" :
                    "Share your thoughts, suggestions, or general feedback about the app..."
                }
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                required
              />
            </div>

            {/* Bug Reproduction Steps */}
            {formData.type === 'bug' && (
              <div className="space-y-2">
                <Label>Steps to Reproduce</Label>
                <Textarea
                  placeholder="1. Click on...&#10;2. Select...&#10;3. Notice that..."
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
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};