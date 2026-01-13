
import React from 'react';
import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'coffee-shop',
    title: 'Ordering Coffee',
    icon: '☕',
    description: 'Practice ordering your favorite drink and pastries at a local café.',
    systemInstruction: 'You are a friendly barista in a busy cafe. Greet the customer and take their order in the target language. Keep the conversation natural and light.'
  },
  {
    id: 'job-interview',
    title: 'Job Interview',
    icon: '💼',
    description: 'Roleplay a professional interview for your dream job.',
    systemInstruction: 'You are a hiring manager at a tech company. Ask professional questions about the candidate\'s experience and motivations in the target language.'
  },
  {
    id: 'airport',
    title: 'At the Airport',
    icon: '✈️',
    description: 'Navigate check-in, security, and boarding gates.',
    systemInstruction: 'You are an airport staff member. Help the traveler with their check-in process and answer questions about their flight in the target language.'
  },
  {
    id: 'social-mixer',
    title: 'Social Mixer',
    icon: '🎉',
    description: 'Make small talk and meet new people at a social gathering.',
    systemInstruction: 'You are an outgoing guest at a party. Strike up a conversation with the user, ask about their hobbies and interests in the target language.'
  },
  {
    id: 'doctor',
    title: 'Doctor\'s Visit',
    icon: '🏥',
    description: 'Explain symptoms and understand medical advice.',
    systemInstruction: 'You are a professional doctor. Ask the patient about their symptoms and provide health advice in the target language.'
  }
];
