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

interface Symptom {
  category: string;
  keywords: string[];
  response: string;
  severity: 'low' | 'medium' | 'high';
  relatedConditions: string[];
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '👋 Hello! I\'m your AI health assistant. Please describe all your symptoms in detail so I can provide the most appropriate advice. 💊' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [symptomHistory, setSymptomHistory] = useState<string[]>([]);
  const [symptomContext, setSymptomContext] = useState<Record<string, number>>({});

  const symptoms: Symptom[] = [
    {
      category: 'Respiratory',
      keywords: ['cold', 'flu', 'sick', 'illness', 'sniffle', 'sneeze', 'congestion', 'nasal', 'respiratory', 'cough', 'throat', 'sore', 'hoarse', 'voice', 'phlegm', 'mucus', 'bronchitis', 'asthma', 'wheeze', 'breath', 'lung', 'airway', 'bronchial', 'pneumonia', 'tuberculosis', 'copd', 'emphysema', 'shortness', 'dyspnea', 'hypoxia'],
      response: '🌬️ Based on your respiratory symptoms, I recommend: 1) Rest and stay hydrated 💧, 2) Use a humidifier 🌫️, 3) Take over-the-counter medications as needed 💊, 4) Monitor your breathing - if you experience severe difficulty breathing, seek emergency care immediately 🚑',
      severity: 'medium',
      relatedConditions: ['Common Cold', 'Influenza', 'Bronchitis', 'Asthma', 'Pneumonia']
    },
    {
      category: 'Cardiovascular',
      keywords: ['chest', 'heart', 'palpitation', 'pressure', 'pain', 'tightness', 'dizzy', 'lightheaded', 'faint', 'syncope', 'blood pressure', 'hypertension', 'hypotension', 'arrhythmia', 'tachycardia', 'bradycardia', 'angina', 'myocardial', 'infarction'],
      response: '❤️ For cardiovascular symptoms: 1) Sit down and rest immediately 🪑, 2) Monitor your heart rate and blood pressure if possible 📊, 3) If experiencing chest pain or pressure, call emergency services 🚨, 4) Avoid strenuous activity until evaluated by a healthcare provider 👨‍⚕️',
      severity: 'high',
      relatedConditions: ['Hypertension', 'Arrhythmia', 'Angina', 'Heart Attack', 'Heart Failure']
    },
    {
      category: 'Neurological',
      keywords: ['headache', 'migraine', 'dizzy', 'vertigo', 'balance', 'coordination', 'numbness', 'tingling', 'weakness', 'paralysis', 'seizure', 'convulsion', 'stroke', 'tia', 'transient ischemic attack', 'memory', 'confusion', 'disorientation', 'consciousness'],
      response: '🧠 For neurological symptoms: 1) Note the time of symptom onset ⏰, 2) If experiencing sudden severe headache, weakness, or speech difficulties, call emergency services immediately 🚨, 3) Avoid driving or operating machinery 🚗, 4) Keep a symptom diary for your healthcare provider 📝',
      severity: 'high',
      relatedConditions: ['Migraine', 'Stroke', 'TIA', 'Seizure Disorder', 'Peripheral Neuropathy']
    },
    {
      category: 'Gastrointestinal',
      keywords: ['stomach', 'nausea', 'vomit', 'upset', 'belly', 'abdomen', 'indigestion', 'gastro', 'diarrhea', 'constipation', 'bowel', 'digest', 'gut', 'stool', 'movement', 'gastrointestinal', 'ulcer', 'gastritis', 'gastroenteritis', 'appendicitis', 'gallbladder', 'pancreas', 'liver', 'hepatitis'],
      response: '🤢 For gastrointestinal issues: 1) Stay hydrated with clear fluids 💧, 2) Follow the BRAT diet (bananas, rice, applesauce, toast) 🍌🍚🍎🍞, 3) Avoid dairy and fatty foods 🚫, 4) If symptoms include severe pain, persistent vomiting, or blood, seek medical attention 👨‍⚕️',
      severity: 'medium',
      relatedConditions: ['Gastritis', 'Gastroenteritis', 'Irritable Bowel Syndrome', 'Ulcer', 'Appendicitis']
    },
    {
      category: 'Endocrine',
      keywords: ['diabetes', 'blood sugar', 'glucose', 'insulin', 'thyroid', 'hormone', 'metabolism', 'weight', 'appetite', 'thirst', 'urination', 'fatigue', 'energy', 'adrenal', 'pituitary', 'parathyroid', 'hypoglycemia', 'hyperglycemia'],
      response: '⚖️ For endocrine symptoms: 1) Monitor blood sugar levels if diabetic 📊, 2) Stay hydrated and maintain regular meal schedule 🍽️, 3) Keep emergency glucose tablets or juice nearby 🍬, 4) If experiencing severe symptoms or blood sugar extremes, seek immediate medical attention 🚨',
      severity: 'high',
      relatedConditions: ['Diabetes', 'Thyroid Disorders', 'Adrenal Insufficiency', 'Metabolic Syndrome', 'Hypoglycemia']
    },
    {
      category: 'Musculoskeletal',
      keywords: ['joint', 'muscle', 'bone', 'back', 'neck', 'shoulder', 'knee', 'hip', 'arthritis', 'rheumatoid', 'osteoarthritis', 'sprain', 'strain', 'fracture', 'injury', 'swelling', 'stiffness', 'mobility', 'range of motion'],
      response: '💪 For musculoskeletal issues: 1) Rest the affected area 🛌, 2) Apply ice for acute injuries or heat for chronic pain ❄️, 3) Use over-the-counter pain relievers as needed 💊, 4) If pain is severe, persistent, or accompanied by swelling or deformity, seek medical evaluation 👨‍⚕️',
      severity: 'medium',
      relatedConditions: ['Osteoarthritis', 'Rheumatoid Arthritis', 'Tendonitis', 'Bursitis', 'Osteoporosis']
    },
    {
      category: 'Mental Health',
      keywords: ['anxiety', 'stress', 'worry', 'nervous', 'panic', 'tense', 'overwhelm', 'mental', 'depression', 'sad', 'down', 'mood', 'hopeless', 'worthless', 'emotional', 'bipolar', 'mania', 'depression', 'psychosis', 'hallucination', 'delusion', 'suicidal', 'self-harm'],
      response: '🧘 For mental health concerns: 1) Practice deep breathing and relaxation techniques 🌬️, 2) Maintain a regular routine 📅, 3) Stay connected with supportive people 👥, 4) If you have thoughts of self-harm or symptoms are severely affecting your daily life, seek immediate professional help 🆘',
      severity: 'high',
      relatedConditions: ['Anxiety Disorder', 'Depression', 'Bipolar Disorder', 'PTSD', 'Schizophrenia']
    }
  ];

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const words = lowerMessage.split(/\s+/);
    
    setSymptomHistory(prev => [...prev, lowerMessage]);
    
    const newContext = { ...symptomContext };
    words.forEach(word => {
      newContext[word] = (newContext[word] || 0) + 1;
    });
    setSymptomContext(newContext);

    const matchingCategories = symptoms.filter(symptom => {
      const matches = symptom.keywords.some(keyword =>
        words.some(word =>
          word.includes(keyword) ||
          keyword.includes(word) ||
          (word.length > 3 && keyword.length > 3 &&
           (word.startsWith(keyword) || keyword.startsWith(word)))
        )
      );
      
      return matches && (symptom.severity === 'high' || 
        (symptom.severity === 'medium' && !symptoms.some(s => s.severity === 'high' && s.keywords.some(k => words.some(w => w.includes(k))))));
    });

    if (matchingCategories.length > 0) {
      const combinedResponse = matchingCategories
        .map(symptom => {
          const conditions = symptom.relatedConditions.join(', ');
          return `For ${symptom.category} symptoms (${symptom.severity} severity):\n${symptom.response}\n\nRelated conditions to consider: ${conditions}`;
        })
        .join('\n\n');

      return `I understand you're experiencing multiple symptoms. Here's my comprehensive advice:\n\n${combinedResponse}\n\nRemember to monitor your symptoms and seek immediate medical attention if they worsen or if you experience any severe symptoms.`;
    }

    return 'I understand your concern. Could you please describe your symptoms in more detail? This will help me provide more specific and helpful advice.';
  };

  const handleSendMessage = () => {
    if (userInput.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsTyping(true);

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
                  Analyzing your symptoms...
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Describe your symptoms in detail..."
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
}
}