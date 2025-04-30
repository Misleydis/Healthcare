"use client"
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! I\'m your AI health assistant. I can help you with various health concerns. What symptoms are you experiencing?' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const words = lowerMessage.split(/\s+/);
    
    // Helper function to check for similar words
    const hasSimilarWord = (targetWords: string[]): boolean => {
      return words.some(word => 
        targetWords.some(target => 
          word.includes(target) || 
          target.includes(word) ||
          (word.length > 3 && target.length > 3 && 
           (word.startsWith(target) || target.startsWith(word)))
        )
      );
    };

    // Respiratory Issues
    if (hasSimilarWord(['cold', 'flu', 'sick', 'illness', 'sniffle', 'sneeze', 'congestion', 'nasal', 'respiratory'])) {
      return 'For cold or flu symptoms, I recommend: 1) Rest and stay hydrated, 2) Take over-the-counter medications like acetaminophen for fever, 3) Use a humidifier, 4) If symptoms persist beyond 10 days, please consult a doctor.';
    } else if (hasSimilarWord(['cough', 'throat', 'sore', 'hoarse', 'voice', 'phlegm', 'mucus', 'bronchitis'])) {
      return 'For cough or sore throat: 1) Drink warm liquids like tea with honey, 2) Use throat lozenges, 3) Try steam inhalation, 4) If symptoms include difficulty breathing or last more than a week, see a doctor.';
    } else if (hasSimilarWord(['asthma', 'wheeze', 'breath', 'lung', 'respiratory', 'airway', 'bronchial'])) {
      return 'For asthma symptoms: 1) Use your prescribed inhaler, 2) Stay in a clean, dust-free environment, 3) Avoid triggers, 4) If symptoms worsen or you experience severe breathing difficulty, seek emergency care.';

    // Fever and Infections
    } else if (hasSimilarWord(['fever', 'temperature', 'hot', 'chill', 'sweat', 'thermometer'])) {
      return 'For fever: 1) Stay hydrated, 2) Take acetaminophen or ibuprofen, 3) Rest, 4) If fever is above 103°F (39.4°C) or lasts more than 3 days, seek medical attention.';
    } else if (hasSimilarWord(['infection', 'bacterial', 'viral', 'germ', 'virus', 'bacteria', 'contagious', 'spread'])) {
      return 'For infections: 1) Complete any prescribed antibiotics, 2) Maintain good hygiene, 3) Rest and stay hydrated, 4) If symptoms worsen or you develop a high fever, contact your doctor.';

    // Pain and Headaches
    } else if (hasSimilarWord(['headache', 'migraine', 'head', 'temple', 'pressure', 'ache', 'pain', 'throb'])) {
      return 'For headaches: 1) Rest in a quiet, dark room, 2) Stay hydrated, 3) Take over-the-counter pain relievers, 4) If headaches are severe, frequent, or accompanied by vision changes, consult a doctor.';
    } else if (hasSimilarWord(['back', 'joint', 'muscle', 'ache', 'pain', 'stiff', 'sore', 'arthritis', 'spine'])) {
      return 'For back or joint pain: 1) Apply ice or heat, 2) Try gentle stretching, 3) Take over-the-counter pain relievers, 4) If pain is severe, persistent, or accompanied by swelling, see a doctor.';

    // Digestive Issues
    } else if (hasSimilarWord(['stomach', 'nausea', 'vomit', 'upset', 'belly', 'abdomen', 'indigestion', 'gastro'])) {
      return 'For stomach issues: 1) Stay hydrated with clear fluids, 2) Eat bland foods like toast or rice, 3) Avoid dairy and fatty foods, 4) If symptoms include severe pain, vomiting, or last more than 2 days, see a doctor.';
    } else if (hasSimilarWord(['diarrhea', 'constipation', 'bowel', 'digest', 'gut', 'stool', 'movement', 'gastrointestinal'])) {
      return 'For digestive issues: 1) Stay hydrated, 2) Eat fiber-rich foods for constipation, 3) Follow BRAT diet for diarrhea, 4) If symptoms are severe or include blood, seek medical attention.';

    // Allergies and Skin Issues
    } else if (hasSimilarWord(['allerg', 'rash', 'itch', 'hive', 'swell', 'red', 'irritation', 'sensitivity'])) {
      return 'For allergies or rashes: 1) Take antihistamines, 2) Use topical creams if needed, 3) Avoid known triggers, 4) If symptoms are severe or include difficulty breathing, seek immediate medical help.';
    } else if (hasSimilarWord(['eczema', 'psoriasis', 'dermatitis', 'skin', 'dry', 'flaky', 'scaly', 'dermatology'])) {
      return 'For skin conditions: 1) Use prescribed topical treatments, 2) Keep skin moisturized, 3) Avoid harsh soaps, 4) If symptoms worsen or spread, consult a dermatologist.';

    // Mental Health
    } else if (hasSimilarWord(['anxiety', 'stress', 'worry', 'nervous', 'panic', 'tense', 'overwhelm', 'mental'])) {
      return 'For anxiety or stress: 1) Practice deep breathing exercises, 2) Maintain a regular sleep schedule, 3) Consider meditation or yoga, 4) If symptoms are severe or affecting daily life, seek professional help.';
    } else if (hasSimilarWord(['depression', 'sad', 'down', 'mood', 'hopeless', 'worthless', 'mental', 'emotional'])) {
      return 'For depression: 1) Maintain a regular routine, 2) Stay connected with loved ones, 3) Get regular exercise, 4) If you have thoughts of self-harm, seek immediate professional help.';

    // Sleep Issues
    } else if (hasSimilarWord(['insomnia', 'sleep', 'tired', 'fatigue', 'rest', 'awake', 'night', 'drowsy'])) {
      return 'For sleep issues: 1) Maintain a regular sleep schedule, 2) Create a bedtime routine, 3) Avoid screens before bed, 4) If sleep problems persist, consult a healthcare provider.';

    // General Wellness
    } else if (hasSimilarWord(['exercise', 'fitness', 'workout', 'physical', 'activity', 'sport', 'gym', 'train'])) {
      return 'For exercise advice: 1) Start slowly and gradually increase intensity, 2) Stay hydrated, 3) Warm up and cool down, 4) If you have any medical conditions, consult your doctor before starting a new exercise routine.';
    } else if (hasSimilarWord(['diet', 'nutrition', 'food', 'eat', 'meal', 'healthy', 'weight', 'calorie'])) {
      return 'For nutrition advice: 1) Eat a balanced diet with fruits and vegetables, 2) Stay hydrated, 3) Limit processed foods, 4) For specific dietary needs, consult a nutritionist.';

    // Default Response
    } else {
      return 'I understand your concern. For specific medical advice, please consult with a healthcare professional. Remember, I can provide general information but cannot replace professional medical advice.';
    }
  };

  const handleSendMessage = () => {
    if (userInput.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsTyping(true);

    // Simulate bot thinking and typing
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: getBotResponse(userInput) },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Health Chatbot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-96 overflow-y-auto border p-4 rounded-md">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.sender === 'bot' ? 'text-left' : 'text-right'}`}>
                <span className={`inline-block p-2 rounded-md ${message.sender === 'bot' ? 'bg-blue-100' : 'bg-green-100'}`}>
                  {message.text}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="text-left">
                <span className="inline-block p-2 rounded-md bg-blue-100">
                  Typing...
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type your question..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}