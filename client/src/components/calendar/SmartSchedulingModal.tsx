import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar } from '../ui/avatar';
import { Calendar, Brain, Sparkles, Target, AlertCircle, CheckCircle, Mic, Loader2 } from 'lucide-react';
import { aiCalendarService } from '../../services/aiCalendarService';
import { useToast } from '../../hooks/use-toast';
import { useAppointmentStore } from '../../store/appointmentStore';

interface SmartSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: {
    contactId?: string;
    contactName?: string;
    contactEmail?: string;
    dealId?: string;
    suggestedTitle?: string;
  };
}

interface TimeSlot {
  time: Date;
  score: number;
  reasoning: string;
  conflicts: string[];
}

export const SmartSchedulingModal: React.FC<SmartSchedulingModalProps> = ({
  isOpen,
  onClose,
  prefilledData
}) => {
  const [step, setStep] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [schedulingIntent, setSchedulingIntent] = useState<any>(null);
  const [suggestedTimes, setSuggestedTimes] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const { toast } = useToast();
  const { createAppointment, appointments } = useAppointmentStore();

  // Form data
  const [formData, setFormData] = useState({
    title: prefilledData?.suggestedTitle || '',
    type: 'meeting' as 'meeting' | 'call' | 'demo' | 'other',
    duration: 30,
    attendees: prefilledData?.contactEmail ? [prefilledData.contactEmail] : [],
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    location: '',
    agenda: [] as string[]
  });

  useEffect(() => {
    if (prefilledData) {
      setFormData(prev => ({
        ...prev,
        title: prefilledData.suggestedTitle || prev.title,
        attendees: prefilledData.contactEmail ? [prefilledData.contactEmail] : prev.attendees
      }));
    }
  }, [prefilledData]);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as unknown).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak your scheduling request naturally.",
        });
      };

      recognition.onresult = (event: unknown) => {
        const transcript = event.results[0][0].transcript;
        setNaturalLanguageInput(transcript);
        setIsListening(false);
        processNaturalLanguage(transcript);
      };

      recognition.onerror = (event: unknown) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Please try typing your request instead.",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Speech Recognition Not Available",
        description: "Please type your scheduling request.",
        variant: "destructive"
      });
    }
  };

  const processNaturalLanguage = async (input: string) => {
    setIsProcessing(true);
    try {
      const intent = await aiCalendarService.parseSchedulingIntent(input);
      setSchedulingIntent(intent);
      
      // Update form data with AI insights
      setFormData(prev => ({
        ...prev,
        title: intent.title || prev.title,
        type: intent.type || prev.type,
        duration: intent.duration || prev.duration,
        attendees: intent.attendees.length > 0 ? intent.attendees : prev.attendees,
        description: intent.description || prev.description,
        priority: intent.urgency as 'low' | 'medium' | 'high' || prev.priority
      }));

      // Generate time suggestions
      const timeOptions = await aiCalendarService.generateMeetingOptions(
        intent,
        Object.values(appointments)
      );
      setSuggestedTimes(timeOptions);
      
      setStep(2);
      
      toast({
        title: "AI Analysis Complete",
        description: `Generated ${timeOptions.length} optimal time suggestions.`,
      });
    } catch (error) {
      console.error('Error processing natural language:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualScheduling = () => {
    setStep(2);
  };

  const createAppointmentFromSelection = async () => {
    if (!selectedTime) return;

    setIsCreating(true);
    try {
      const appointmentData = {
        title: formData.title,
        description: formData.description,
        startTime: selectedTime.time.toISOString(),
        endTime: new Date(selectedTime.time.getTime() + formData.duration * 60000).toISOString(),
        attendees: formData.attendees,
        type: formData.type,
        status: 'scheduled' as const,
        contactId: prefilledData?.contactId,
        dealId: prefilledData?.dealId
      };

      await createAppointment(appointmentData);
      
      toast({
        title: "Appointment Created",
        description: `Successfully scheduled "${formData.title}" for ${selectedTime.time.toLocaleString()}.`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Creation Error",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getTimeSlotColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-300 text-green-800';
    if (score >= 70) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-red-100 border-red-300 text-red-800';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 70) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI-Powered Smart Scheduling
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Natural Language Input */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Natural Language Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Describe your meeting request</Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={naturalLanguageInput}
                      onChange={(e) => setNaturalLanguageInput(e.target.value)}
                      placeholder="e.g., 'Schedule a product demo with TechCorp next Tuesday at 2 PM for 45 minutes'"
                      className="flex-1"
                      rows={3}
                    />
                    <Button
                      onClick={startListening}
                      variant="outline"
                      size="sm"
                      className="px-3"
                      disabled={isListening}
                    >
                      {isListening ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => processNaturalLanguage(naturalLanguageInput)}
                    disabled={!naturalLanguageInput.trim() || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        AI Schedule
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleManualScheduling}
                    variant="outline"
                  >
                    Manual Entry
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Schedule a product demo with Sarah Johnson next Monday at 3 PM",
                    "Book a 30-minute discovery call with TechCorp this week",
                    "Set up a contract review meeting for Friday afternoon",
                    "Schedule a follow-up call with the CEO tomorrow morning"
                  ].map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left h-auto p-3 whitespace-normal"
                      onClick={() => {
                        setNaturalLanguageInput(example);
                        processNaturalLanguage(example);
                      }}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* AI Intent Summary */}
            {schedulingIntent && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    AI Understanding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Meeting Type</Label>
                      <Badge variant="outline" className="mt-1">
                        {schedulingIntent.type}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Duration</Label>
                      <p className="text-sm">{schedulingIntent.duration} minutes</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <Badge variant={schedulingIntent.urgency === 'high' ? 'destructive' : 'secondary'}>
                        {schedulingIntent.urgency}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Attendees</Label>
                      <p className="text-sm">{schedulingIntent.attendees.length} people</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter meeting title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Meeting Type</Label>
                <Select value={formData.type} onValueChange={(value: unknown) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  placeholder="30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value: unknown) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add meeting description or agenda"
                rows={3}
              />
            </div>

            {/* AI Time Suggestions */}
            {suggestedTimes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    AI-Recommended Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestedTimes.map((timeSlot, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedTime?.time === timeSlot.time
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTime(timeSlot)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getScoreIcon(timeSlot.score)}
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {timeSlot.time.toLocaleDateString()} at {timeSlot.time.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {timeSlot.reasoning}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getTimeSlotColor(timeSlot.score)}>
                              {timeSlot.score}% optimal
                            </Badge>
                            {timeSlot.conflicts.length > 0 && (
                              <Badge variant="destructive">
                                {timeSlot.conflicts.length} conflicts
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
              >
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={onClose}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createAppointmentFromSelection}
                  disabled={!selectedTime || isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Create Appointment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SmartSchedulingModal;