import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { FeedbackManager } from './FeedbackManager';
import type { FeedbackData } from './FeedbackManager';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Star,
  Calendar,
  Filter,
  RefreshCw,
  AlertCircle,
  X
} from 'lucide-react';

interface FeedbackAnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackAnalyticsDashboard: React.FC<FeedbackAnalyticsDashboardProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [stats, setStats] = useState<ReturnType<typeof FeedbackManager.getFeedbackStats>>();
  const [allFeedback, setAllFeedback] = useState<FeedbackData[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackData[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'general' | 'bug' | 'feature' | 'usability'>('all');
  const [filterRating, setFilterRating] = useState<'all' | '1-2' | '3' | '4-5'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  useEffect(() => {
    applyFilters();
  }, [allFeedback, filterType, filterRating, sortBy]);

  const refreshData = () => {
    const feedbackStats = FeedbackManager.getFeedbackStats();
    const feedback = FeedbackManager.getAllFeedback();
    setStats(feedbackStats);
    setAllFeedback(feedback);
  };

  const applyFilters = () => {
    let filtered = [...allFeedback];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(f => f.type === filterType);
    }

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(f => {
        const rating = f.rating || 0;
        switch (filterRating) {
          case '1-2': return rating >= 1 && rating <= 2;
          case '3': return rating === 3;
          case '4-5': return rating >= 4 && rating <= 5;
          default: return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredFeedback(filtered);
  };

  const handleExport = (format: 'csv' | 'json') => {
    FeedbackManager.downloadFeedback(format);
  };

  const clearAllFeedback = () => {
    if (confirm('Are you sure you want to clear all feedback data? This cannot be undone.')) {
      FeedbackManager.clearAllFeedback();
      refreshData();
    }
  };

  if (!isOpen) return null;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = "blue" 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ElementType;
    color?: string;
  }) => (
    <div className={`p-4 rounded-lg border bg-${color}-50 border-${color}-200`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-5 w-5 text-${color}-600`} />
        <h3 className="font-medium text-gray-700">{title}</h3>
      </div>
      <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <h2 className="text-2xl font-bold">📊 Beta Feedback Analytics</h2>
            <p className="text-gray-600">Comprehensive feedback analysis and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={refreshData} title="Refresh data">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              title="Total Feedback" 
              value={stats?.total || 0} 
              icon={MessageCircle}
              color="blue"
            />
            <StatCard 
              title="Average Rating" 
              value={stats?.averageRating ? `${stats.averageRating}/5` : 'N/A'} 
              icon={Star}
              color="yellow"
            />
            <StatCard 
              title="Bug Reports" 
              value={stats?.typeBreakdown.bug || 0} 
              icon={AlertCircle}
              color="red"
            />
            <StatCard 
              title="Feature Requests" 
              value={stats?.typeBreakdown.feature || 0} 
              icon={TrendingUp}
              color="green"
            />
          </div>

          {/* Feedback Breakdown Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Type Breakdown */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Feedback by Type</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats?.typeBreakdown || {}).map(([type, count]) => {
                    const total = stats?.total || 1;
                    const percentage = Math.round((count / total) * 100);
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            type === 'bug' ? 'bg-red-500' :
                            type === 'feature' ? 'bg-green-500' :
                            type === 'usability' ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`} />
                          <span className="capitalize">{type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 rounded-full ${
                            type === 'bug' ? 'bg-red-200' :
                            type === 'feature' ? 'bg-green-200' :
                            type === 'usability' ? 'bg-blue-200' :
                            'bg-purple-200'
                          }`} style={{width: `${Math.max(percentage, 5)}px`}}>
                            <div className={`h-full rounded-full ${
                              type === 'bug' ? 'bg-red-500' :
                              type === 'feature' ? 'bg-green-500' :
                              type === 'usability' ? 'bg-blue-500' :
                              'bg-purple-500'
                            }`} style={{width: `${percentage}%`}} />
                          </div>
                          <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Language Breakdown */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Feedback by Language</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats?.languageBreakdown || {}).map(([language, count]) => {
                    const total = stats?.total || 1;
                    const percentage = Math.round((count / total) * 100);
                    return (
                      <div key={language} className="flex items-center justify-between">
                        <span className="capitalize">{language}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-indigo-500 rounded-full" 
                              style={{width: `${percentage}%`}} 
                            />
                          </div>
                          <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export and Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={() => handleExport('csv')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => handleExport('json')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={clearAllFeedback} variant="destructive" size="sm">
              Clear All Data
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters:</span>
            </div>
            
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-1 border rounded"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="bug">Bug Reports</option>
              <option value="feature">Feature Requests</option>
              <option value="usability">Usability</option>
            </select>

            <select 
              value={filterRating} 
              onChange={(e) => setFilterRating(e.target.value as any)}
              className="px-3 py-1 border rounded"
            >
              <option value="all">All Ratings</option>
              <option value="1-2">1-2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4-5">4-5 Stars</option>
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border rounded"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">By Rating</option>
            </select>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              Feedback Items ({filteredFeedback.length})
            </h3>
            
            {filteredFeedback.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No feedback matches your filters.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredFeedback.map((feedback) => (
                  <Card key={feedback.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            feedback.type === 'bug' ? 'bg-red-100 text-red-700' :
                            feedback.type === 'feature' ? 'bg-green-100 text-green-700' :
                            feedback.type === 'usability' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {feedback.type}
                          </span>
                          {feedback.rating && (
                            <div className="flex">
                              {[1,2,3,4,5].map(star => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 ${
                                    star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(feedback.timestamp).toLocaleDateString()} {new Date(feedback.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <h4 className="font-medium mb-2">{feedback.subject}</h4>
                      <p className="text-sm text-gray-600 mb-2">{feedback.message}</p>
                      
                      {feedback.reproductionSteps && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <strong>Steps to reproduce:</strong>
                          <p className="mt-1">{feedback.reproductionSteps}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                        <span>Language: {feedback.language}</span>
                        {feedback.excuseStyle && <span>Style: {feedback.excuseStyle}</span>}
                        {feedback.email && <span>Contact: {feedback.email}</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};