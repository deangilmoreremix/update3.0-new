import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { ArrowRight, Brain, CheckCircle, Clock, Download, FileText, Lightbulb, Mic, Square, Target, TrendingUp, Users } from 'lucide-react';
import { aiCalendarService } from '../../services/aiCalendarService';
import { useToast } from '../../hooks/use-toast';

interface MeetingAssistantProps {
  appointmentId: string;
  appointment: {
    title: string;
    type: string;
    attendees: Array<{ name: string; email: string }>;
    startTime: string;
    endTime: string;
    description?: string;
  };
  contactData?: unknown;
  dealData?: unknown;
  onClose?: () => void;
}

interface AISuggestion {
  id: string;
  type: 'talking_point' | 'question' | 'objection_response' | 'follow_up';
  content: string;
  relevance: number;
  context: string;
}

export const AIMeetingAssistant: React.FC<MeetingAssistantProps> = ({
  appointmentId,
  appointment,
  contactData,
  dealData,
  onClose
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [meetingPrep, setMeetingPrep] = useState<any>(null);
  const [isLoadingPrep, setIsLoadingPrep] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [meetingPhase, setMeetingPhase] = useState<'prep' | 'active' | 'wrap-up'>('prep');
  const [transcript, setTranscript] = useState('');
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [meetingInsights, setMeetingInsights] = useState<any>(null);
  
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as unknown).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: unknown) => {
        const interimTranscript = '';;
        const finalTranscript = '';;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setLiveTranscript(finalTranscript + interimTranscript);
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          analyzeTranscriptForSuggestions(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: unknown) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: "There was an issue with speech recognition. Please try again.",
          variant: "destructive"
        });
      };
    }

    // Load meeting preparation on mount
    loadMeetingPrep();
  }, []);

  const loadMeetingPrep = async () => {
    setIsLoadingPrep(true);
    try {
      const prep = await aiCalendarService.generateMeetingPrep(
        appointment,
        contactData,
        dealData
      );
      setMeetingPrep(prep);
      
      // Generate initial suggestions
      const initialSuggestions: AISuggestion[] = prep.talkingPoints.map((point: string, index: number) => ({
        id: `prep-${index}`,
        type: 'talking_point' as const,
        content: point,
        relevance: 90,
        context: 'Pre-meeting preparation'
      }));
      
      setAiSuggestions(initialSuggestions);
    } catch (error) {
      console.error('Error loading meeting prep:', error);
      toast({
        title: "AI Preparation Error",
        description: "Failed to generate meeting preparation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPrep(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // Here you could upload the blob to your server for processing
        console.log('Recording stopped, blob created:', blob);
      };
      
      mediaRecorderRef.current.start();
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      setIsRecording(true);
      setMeetingPhase('active');
      
      toast({
        title: "Recording Started",
        description: "AI meeting assistant is now active and listening.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check your microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsRecording(false);
    setMeetingPhase('wrap-up');
    
    toast({
      title: "Recording Stopped",
      description: "Generating meeting summary and action items...",
    });
    
    // Generate meeting summary
    generateMeetingSummary();
  };

  const analyzeTranscriptForSuggestions = async (newTranscript: string) => {
    // Simple keyword-based suggestions (in production, you'd use AI here)
    const keywords = newTranscript.toLowerCase();
    const suggestions: AISuggestion[] = [];
    
    if (keywords.includes('price') || keywords.includes('cost')) {
      suggestions.push({
        id: 'price-objection',
        type: 'objection_response',
        content: 'Emphasize ROI and value proposition. Show concrete examples of savings.',
        relevance: 95,
        context: 'Price objection detected'
      });
    }
    
    if (keywords.includes('competitor') || keywords.includes('alternative')) {
      suggestions.push({
        id: 'competitor-response',
        type: 'objection_response',
        content: 'Highlight unique differentiators and customer success stories.',
        relevance: 90,
        context: 'Competitor mention detected'
      });
    }
    
    if (keywords.includes('timeline') || keywords.includes('when')) {
      suggestions.push({
        id: 'timeline-question',
        type: 'question',
        content: 'Ask about their ideal implementation timeline and key milestones.',
        relevance: 85,
        context: 'Timeline discussion'
      });
    }
    
    if (suggestions.length > 0) {
      setAiSuggestions(prev => [...prev, ...suggestions]);
    }
  };

  const generateMeetingSummary = async () => {
    setIsAnalyzing(true);
    try {
      const outcome = await aiCalendarService.analyzeMeetingOutcome(
        appointmentId,
        meetingNotes,
        transcript
      );
      
      setMeetingInsights(outcome);
      setActionItems(outcome.actionItems);
      
      toast({
        title: "Meeting Analysis Complete",
        description: `Generated ${outcome.actionItems.length} action items and ${outcome.nextSteps.length} next steps.`,
      });
    } catch (error) {
      console.error('Error generating meeting summary:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    setMeetingNotes(prev => prev + `\n\n${suggestion.content}`);
    toast({
      title: "Suggestion Applied",
      description: "Added to meeting notes.",
    });
  };

  const exportMeetingData = () => {
    const data = {
      appointment,
      transcript,
      meetingNotes,
      actionItems,
      insights: meetingInsights,
      suggestions: aiSuggestions
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-${appointmentId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto p-6">
      {/* Meeting Control Panel */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Meeting Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={meetingPhase === 'prep' ? 'default' : 'secondary'}>
              {meetingPhase === 'prep' ? 'Preparation' : meetingPhase === 'active' ? 'Recording' : 'Wrap-up'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Meeting Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{appointment.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(appointment.startTime).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {appointment.attendees.length} attendees
              </div>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center gap-3">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className="flex-1"
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
            
            <Button
              onClick={exportMeetingData}
              variant="outline"
              size="lg"
              disabled={meetingPhase === 'prep'}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Live Transcript */}
          {isRecording && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Live Transcript</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
                {liveTranscript || "Listening..."}
              </div>
            </div>
          )}

          {/* Meeting Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Meeting Notes</label>
            <Textarea
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              placeholder="Add your meeting notes here..."
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions & Insights */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            AI Suggestions & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meetingPhase === 'prep' && meetingPrep && (
            <div className="space-y-4">
              {/* Meeting Agenda */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Meeting Agenda
                </h3>
                <div className="space-y-2">
                  {meetingPrep.agenda.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{index + 1}.</span>
                      <span className="text-gray-900 dark:text-gray-100">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Talking Points */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Key Talking Points
                </h3>
                <div className="space-y-2">
                  {meetingPrep.talkingPoints.map((point: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-900 dark:text-gray-100">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {meetingPhase === 'active' && (
            <div className="space-y-4">
              {/* Real-time Suggestions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Real-time Suggestions
                </h3>
                <div className="space-y-3">
                  {aiSuggestions.slice(-3).map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {suggestion.type.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {suggestion.relevance}% relevance
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {suggestion.content}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {suggestion.context}
                          </p>
                        </div>
                        <Button
                          onClick={() => applySuggestion(suggestion)}
                          size="sm"
                          variant="outline"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {meetingPhase === 'wrap-up' && meetingInsights && (
            <div className="space-y-4">
              {/* Meeting Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Meeting Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(meetingInsights.sentiment.score * 100)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sentiment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {meetingInsights.dealProgression.likelihood}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Deal Progression</div>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Action Items
                </h3>
                <div className="space-y-2">
                  {actionItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-900 dark:text-gray-100">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Next Steps
                </h3>
                <div className="space-y-2">
                  {meetingInsights.nextSteps.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-purple-500 mt-1">•</span>
                      <span className="text-gray-900 dark:text-gray-100">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Import ArrowRight icon

export default AIMeetingAssistant;