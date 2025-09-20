import { FeedbackData } from './BetaFeedbackForm';

export type { FeedbackData };

export class FeedbackManager {
  private static STORAGE_KEY = 'betaFeedback';

  // Get all feedback from localStorage
  static getAllFeedback(): FeedbackData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading feedback data:', error);
      return [];
    }
  }

  // Add new feedback
  static addFeedback(feedback: FeedbackData): void {
    try {
      const existing = this.getAllFeedback();
      existing.push(feedback);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Error saving feedback data:', error);
    }
  }

  // Get feedback statistics
  static getFeedbackStats() {
    const feedback = this.getAllFeedback();
    
    const total = feedback.length;
    const averageRating = total > 0 ? 
      feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / total : 0;

    const typeBreakdown = feedback.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const languageBreakdown = feedback.reduce((acc, f) => {
      acc[f.language] = (acc[f.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentFeedback = feedback
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return {
      total,
      averageRating: Math.round(averageRating * 10) / 10,
      typeBreakdown,
      languageBreakdown,
      recentFeedback
    };
  }

  // Export feedback as CSV
  static exportToCSV(): string {
    const feedback = this.getAllFeedback();
    
    if (feedback.length === 0) {
      return 'No feedback data to export';
    }

    const headers = [
      'ID',
      'Timestamp', 
      'Type',
      'Rating',
      'Email',
      'Subject',
      'Message',
      'Language',
      'Excuse Style',
      'User Agent',
      'URL',
      'Reproduction Steps'
    ];

    const csvContent = [
      headers.join(','),
      ...feedback.map(f => [
        f.id,
        f.timestamp,
        f.type,
        f.rating || '',
        f.email || '',
        `"${(f.subject || '').replace(/"/g, '""')}"`,
        `"${(f.message || '').replace(/"/g, '""')}"`,
        f.language,
        f.excuseStyle || '',
        `"${f.userAgent.replace(/"/g, '""')}"`,
        f.url,
        `"${(f.reproductionSteps || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Export feedback as JSON
  static exportToJSON(): string {
    const feedback = this.getAllFeedback();
    return JSON.stringify(feedback, null, 2);
  }

  // Download feedback data
  static downloadFeedback(format: 'csv' | 'json' = 'csv'): void {
    const content = format === 'csv' ? this.exportToCSV() : this.exportToJSON();
    const blob = new Blob([content], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `excuses-excuses-feedback-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Clear all feedback (for testing)
  static clearAllFeedback(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get feedback by type
  static getFeedbackByType(type: FeedbackData['type']): FeedbackData[] {
    return this.getAllFeedback().filter(f => f.type === type);
  }

  // Get feedback by rating range
  static getFeedbackByRating(minRating: number, maxRating: number): FeedbackData[] {
    return this.getAllFeedback().filter(f => 
      (f.rating || 0) >= minRating && (f.rating || 0) <= maxRating
    );
  }

  // Get recent feedback (last N days)
  static getRecentFeedback(days: number = 7): FeedbackData[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.getAllFeedback().filter(f => 
      new Date(f.timestamp) >= cutoffDate
    );
  }
}