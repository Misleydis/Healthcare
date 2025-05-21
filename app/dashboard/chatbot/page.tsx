"use client"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Message {
  sender: "user" | "bot"
  text: string
}

interface Symptom {
  category: string
  keywords: string[]
  response: string
  severity: "low" | "medium" | "high"
  relatedConditions: string[]
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hello! I'm your AI health assistant. Please describe all your symptoms in detail so I can provide the most appropriate advice. 💊",
    },
  ])
  const [userInput, setUserInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [symptomHistory, setSymptomHistory] = useState<string[]>([])
  const [symptomContext, setSymptomContext] = useState<Record<string, number>>({})

  const symptoms: Symptom[] = [
    {
      category: "Respiratory",
      keywords: [
        "cold",
        "flu",
        "sick",
        "illness",
        "sniffle",
        "sneeze",
        "congestion",
        "nasal",
        "respiratory",
        "cough",
        "throat",
        "sore",
        "hoarse",
        "voice",
        "phlegm",
        "mucus",
        "bronchitis",
        "asthma",
        "wheeze",
        "breath",
        "lung",
        "airway",
        "bronchial",
        "pneumonia",
        "tuberculosis",
        "copd",
        "emphysema",
        "shortness",
        "dyspnea",
        "hypoxia",
      ],
      response:
        "🌬️ Based on your respiratory symptoms, I recommend: 1) Rest and stay hydrated 💧, 2) Use a humidifier 🌫️, 3) Take over-the-counter medications as needed 💊, 4) Monitor your breathing - if you experience severe difficulty breathing, seek emergency care immediately 🚑",
      severity: "medium",
      relatedConditions: ["Common Cold", "Influenza", "Bronchitis", "Asthma", "Pneumonia"],
    },
    {
      category: "Cardiovascular",
      keywords: [
        "chest",
        "heart",
        "palpitation",
        "pressure",
        "pain",
        "tightness",
        "dizzy",
        "lightheaded",
        "faint",
        "syncope",
        "blood pressure",
        "hypertension",
        "hypotension",
        "arrhythmia",
        "tachycardia",
        "bradycardia",
        "angina",
        "myocardial",
        "infarction",
      ],
      response:
        "❤️ For cardiovascular symptoms: 1) Sit down and rest immediately 🪑, 2) Monitor your heart rate and blood pressure if possible 📊, 3) If experiencing chest pain or pressure, call emergency services 🚨, 4) Avoid strenuous activity until evaluated by a healthcare provider 👨‍⚕️",
      severity: "high",
      relatedConditions: ["Hypertension", "Arrhythmia", "Angina", "Heart Attack", "Heart Failure"],
    },
    {
      category: "Neurological",
      keywords: [
        "headache",
        "migraine",
        "dizzy",
        "vertigo",
        "balance",
        "coordination",
        "numbness",
        "tingling",
        "weakness",
        "paralysis",
        "seizure",
        "convulsion",
        "stroke",
        "tia",
        "transient ischemic attack",
        "memory",
        "confusion",
        "disorientation",
        "consciousness",
      ],
      response:
        "🧠 For neurological symptoms: 1) Note the time of symptom onset ⏰, 2) If experiencing sudden severe headache, weakness, or speech difficulties, call emergency services immediately 🚨, 3) Avoid driving or operating machinery 🚗, 4) Keep a symptom diary for your healthcare provider 📝",
      severity: "high",
      relatedConditions: ["Migraine", "Stroke", "TIA", "Seizure Disorder", "Peripheral Neuropathy"],
    },
    {
      category: "Gastrointestinal",
      keywords: [
        "stomach",
        "nausea",
        "vomit",
        "upset",
        "belly",
        "abdomen",
        "indigestion",
        "gastro",
        "diarrhea",
        "constipation",
        "bowel",
        "digest",
        "gut",
        "stool",
        "movement",
        "gastrointestinal",
        "ulcer",
        "gastritis",
        "gastroenteritis",
        "appendicitis",
        "gallbladder",
        "pancreas",
        "liver",
        "hepatitis",
      ],
      response:
        "🤢 For gastrointestinal issues: 1) Stay hydrated with clear fluids 💧, 2) Follow the BRAT diet (bananas, rice, applesauce, toast) 🍌🍚🍎🍞, 3) Avoid dairy and fatty foods 🚫, 4) If symptoms include severe pain, persistent vomiting, or blood, seek medical attention 👨‍⚕️",
      severity: "medium",
      relatedConditions: ["Gastritis", "Gastroenteritis", "Irritable Bowel Syndrome", "Ulcer", "Appendicitis"],
    },
    {
      category: "Endocrine",
      keywords: [
        "diabetes",
        "blood sugar",
        "glucose",
        "insulin",
        "thyroid",
        "hormone",
        "metabolism",
        "weight",
        "appetite",
        "thirst",
        "urination",
        "fatigue",
        "energy",
        "adrenal",
        "pituitary",
        "parathyroid",
        "hypoglycemia",
        "hyperglycemia",
      ],
      response:
        "⚖️ For endocrine symptoms: 1) Monitor blood sugar levels if diabetic 📊, 2) Stay hydrated and maintain regular meal schedule 🍽️, 3) Keep emergency glucose tablets or juice nearby 🍬, 4) If experiencing severe symptoms or blood sugar extremes, seek immediate medical attention 🚨",
      severity: "high",
      relatedConditions: [
        "Diabetes",
        "Thyroid Disorders",
        "Adrenal Insufficiency",
        "Metabolic Syndrome",
        "Hypoglycemia",
      ],
    },
    {
      category: "Musculoskeletal",
      keywords: [
        "joint",
        "muscle",
        "bone",
        "back",
        "neck",
        "shoulder",
        "knee",
        "hip",
        "arthritis",
        "rheumatoid",
        "osteoarthritis",
        "sprain",
        "strain",
        "fracture",
        "injury",
        "swelling",
        "stiffness",
        "mobility",
        "range of motion",
      ],
      response:
        "💪 For musculoskeletal issues: 1) Rest the affected area 🛌, 2) Apply ice for acute injuries or heat for chronic pain ❄️, 3) Use over-the-counter pain relievers as needed 💊, 4) If pain is severe, persistent, or accompanied by swelling or deformity, seek medical evaluation 👨‍⚕️",
      severity: "medium",
      relatedConditions: ["Osteoarthritis", "Rheumatoid Arthritis", "Tendonitis", "Bursitis", "Osteoporosis"],
    },
    {
      category: "Mental Health",
      keywords: [
        "anxiety",
        "stress",
        "worry",
        "nervous",
        "panic",
        "tense",
        "overwhelm",
        "mental",
        "depression",
        "sad",
        "down",
        "mood",
        "hopeless",
        "worthless",
        "emotional",
        "bipolar",
        "mania",
        "depression",
        "psychosis",
        "hallucination",
        "delusion",
        "suicidal",
        "self-harm",
      ],
      response:
        "🧘 For mental health concerns: 1) Practice deep breathing and relaxation techniques 🌬️, 2) Maintain a regular routine 📅, 3) Stay connected with supportive people 👥, 4) If you have thoughts of self-harm or symptoms are severely affecting your daily life, seek immediate professional help 🆘",
      severity: "high",
      relatedConditions: ["Anxiety Disorder", "Depression", "Bipolar Disorder", "PTSD", "Schizophrenia"],
    },
  ]

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .map((word) => {
        const synonyms: Record<string, string> = {
          fever: "temperature",
          temperature: "temperature",
          sore: "pain",
          hurt: "pain",
          vomiting: "vomit",
          nauseated: "nausea",
          tired: "fatigue",
          exhausted: "fatigue",
          anxious: "anxiety",
          breathless: "breath",
        }
        return synonyms[word] || word
      })
  }

  const detectEmotion = (text: string): "neutral" | "concerned" => {
    const concernWords = ["worried", "scared", "panic", "urgent", "bad", "worse", "emergency"]
    const normalized = normalizeText(text)
    return normalized.some((word) => concernWords.includes(word)) ? "concerned" : "neutral"
  }

  const getSymptomMatches = (inputWords: string[], symptom: Symptom) => {
    let score = 0
    for (const word of inputWords) {
      for (const keyword of symptom.keywords) {
        if (word.includes(keyword) || keyword.includes(word)) {
          score++
        }
      }
    }
    return score
  }
  const getBotResponse = (userMessage: string): string => {
    const inputWords = normalizeText(userMessage)
    setSymptomHistory((prev) => [...prev, userMessage.toLowerCase()])

    const contextUpdate = { ...symptomContext }
    inputWords.forEach((word) => {
      contextUpdate[word] = (contextUpdate[word] || 0) + 1
    })
    setSymptomContext(contextUpdate)

    const contextWords = Object.keys(contextUpdate)

    const matchedSymptoms = symptoms
      .map((symptom) => ({
        ...symptom,
        matchScore: getSymptomMatches(contextWords, symptom),
      }))
      .filter((s) => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore || (b.severity === "high" ? 1 : -1))

    if (matchedSymptoms.length === 0) {
      return '🤔 I couldn\'t quite catch any specific symptoms. Could you try rephrasing or giving more detail? For example: "I have a sore throat and feel tired."'
    }

    const primary = matchedSymptoms.slice(0, 3)
    const compiledResponse = primary
      .map((symptom, index) => {
        const recommendations = symptom.response.split(",").map((rec, i) => `${i + 1}. ${rec.trim()}`)
        return (
          `📌 ${index + 1}. ${symptom.category} (Severity: ${symptom.severity.toUpperCase()})\n\n` +
          `Recommendations:\n${recommendations.join("\n")}\n\n` +
          `Possible related conditions: ${symptom.relatedConditions.join(", ")}\n`
        )
      })
      .join("\n")

    const emotion = detectEmotion(userMessage)
    const reassurance =
      emotion === "concerned" ? "\n\n🙌 I'm here to help. You're not alone, and I'll do my best to guide you." : ""

    return `🩺 Based on what you've shared:\n\n${compiledResponse}\n\n💡 If anything worsens or feels severe, please consult a healthcare professional immediately.${reassurance}`
  }

  const handleSendMessage = () => {
    if (userInput.trim() === "") return

    const newMessages = [...messages, { sender: "user", text: userInput }]
    setMessages(newMessages)
    setUserInput("")
    setIsTyping(true)

    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: getBotResponse(userInput) }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl shadow-md">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="flex items-center">
            <span className="mr-2 text-blue-500">🩺</span>
            Health Chatbot Assistant
          </CardTitle>
          <p className="text-sm text-gray-500">Describe your symptoms for personalized health recommendations</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="h-96 overflow-y-auto border p-4 rounded-md bg-slate-50">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.sender === "bot" ? "text-left" : "text-right"}`}>
                <div
                  className={`inline-block p-3 rounded-lg max-w-[85%] ${
                    message.sender === "bot" ? "bg-white border border-blue-100 shadow-sm" : "bg-blue-500 text-white"
                  }`}
                >
                  {message.sender === "bot" ? (
                    <div className="whitespace-pre-line">
                      {message.text.split("\n\n").map((paragraph, i) => {
                        // Handle lists with emoji bullets
                        if (paragraph.includes("📌") || paragraph.includes("💡") || paragraph.includes("🩺")) {
                          return (
                            <div key={i} className="mb-2">
                              {paragraph.split("\n").map((line, j) => {
                                // Style headers differently
                                if (line.startsWith("📌") || line.startsWith("💡") || line.startsWith("🩺")) {
                                  return (
                                    <p key={j} className="font-medium text-blue-700 mb-1">
                                      {line}
                                    </p>
                                  )
                                }
                                // Style recommendations
                                else if (line.match(/^\d+\.\s/)) {
                                  return (
                                    <p key={j} className="pl-4 mb-1 text-gray-700">
                                      {line}
                                    </p>
                                  )
                                }
                                // Style related conditions
                                else if (line.includes("Possible related conditions:")) {
                                  return (
                                    <p key={j} className="mt-1 text-sm text-gray-600">
                                      <span className="font-medium">Possible related conditions:</span>
                                      {line.replace("Possible related conditions:", "")}
                                    </p>
                                  )
                                }
                                // Style severity
                                else if (line.includes("Severity:")) {
                                  const severity = line.includes("HIGH")
                                    ? "text-red-600"
                                    : line.includes("MEDIUM")
                                      ? "text-orange-600"
                                      : "text-green-600"
                                  return (
                                    <p key={j} className="mb-1">
                                      {line.split("(Severity:")[0]}(
                                      <span className={`font-medium ${severity}`}>
                                        Severity: {line.split("Severity:")[1]}
                                      </span>
                                      )
                                    </p>
                                  )
                                }
                                // Default paragraph styling
                                return (
                                  <p key={j} className="mb-1">
                                    {line}
                                  </p>
                                )
                              })}
                            </div>
                          )
                        }
                        // Handle regular paragraphs
                        return (
                          <p key={i} className="mb-2">
                            {paragraph}
                          </p>
                        )
                      })}
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
                <div className={`text-xs mt-1 text-gray-500 ${message.sender === "bot" ? "text-left" : "text-right"}`}>
                  {message.sender === "bot" ? "AI Health Assistant" : "You"}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-white border border-blue-100 shadow-sm">
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs mt-1 text-gray-500">AI Health Assistant</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Input
              type="text"
              placeholder="Describe your symptoms in detail..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 border-gray-300"
            />
            <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
