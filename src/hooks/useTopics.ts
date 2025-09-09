import { useState, useEffect } from 'react';
import { Topic } from '../types';

// Mock initial topics data
const initialTopics: Topic[] = [
  {
    id: '1',
    title: 'Machine Learning Applications in Healthcare Diagnostics',
    description: 'This research explores the application of deep learning algorithms in medical image analysis for early disease detection, focusing on breast cancer screening using mammography data.',
    keywords: ['Machine Learning', 'Healthcare', 'Deep Learning', 'Medical Imaging', 'Cancer Detection'],
    domain: 'Computer Science',
    methodology: 'Experimental Research',
    objectives: 'To develop an AI system for accurate breast cancer detection',
    expected_outcomes: 'Improved diagnostic accuracy and reduced false positives',
    student_id: 'CS2024001',
    guide_id: 'guide_1',
    status: 'approved',
    submitted_at: '2024-01-15T10:00:00Z',
    approved_at: '2024-01-20T14:30:00Z',
    similarity_score: 15,
    ethics_approval_required: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    title: 'Sustainable Energy Management in Smart Cities',
    description: 'Investigation of renewable energy integration and optimization techniques for urban environments using IoT sensors and predictive analytics.',
    keywords: ['Smart Cities', 'Renewable Energy', 'IoT', 'Sustainability', 'Urban Planning'],
    domain: 'Environmental Engineering',
    methodology: 'Mixed Methods Research',
    objectives: 'To optimize energy consumption in urban areas',
    expected_outcomes: 'Reduced carbon footprint and improved energy efficiency',
    student_id: 'EE2024002',
    status: 'in_progress',
    submitted_at: '2024-02-01T09:15:00Z',
    similarity_score: 25,
    ethics_approval_required: false,
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-15T11:20:00Z',
  },
  {
    id: '3',
    title: 'Blockchain-based Supply Chain Management',
    description: 'Development of a decentralized system for tracking and verifying supply chain operations using blockchain technology to enhance transparency and reduce fraud.',
    keywords: ['Blockchain', 'Supply Chain', 'Transparency', 'Decentralization', 'Smart Contracts'],
    domain: 'Computer Science',
    methodology: 'Design Science Research',
    objectives: 'To create a transparent and secure supply chain system',
    expected_outcomes: 'Enhanced traceability and reduced supply chain fraud',
    student_id: 'CS2024003',
    status: 'under_review',
    submitted_at: '2024-02-10T16:45:00Z',
    similarity_score: 45,
    ethics_approval_required: false,
    created_at: '2024-02-10T16:45:00Z',
    updated_at: '2024-02-12T13:10:00Z',
  },
  {
    id: '4',
    title: 'Mental Health Assessment Using Natural Language Processing',
    description: 'Developing NLP models to analyze social media posts and identify early indicators of mental health issues for timely intervention.',
    keywords: ['NLP', 'Mental Health', 'Social Media Analysis', 'Psychology', 'AI Ethics'],
    domain: 'Psychology',
    methodology: 'Quantitative Research',
    objectives: 'To develop early detection systems for mental health issues',
    expected_outcomes: 'Better mental health support and early intervention',
    student_id: 'PSY2024001',
    status: 'submitted',
    submitted_at: '2024-02-20T11:30:00Z',
    similarity_score: 35,
    ethics_approval_required: true,
    created_at: '2024-02-20T11:30:00Z',
    updated_at: '2024-02-20T11:30:00Z',
  },
];

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>(() => {
    // Load topics from localStorage on initialization
    const savedTopics = localStorage.getItem('pg_dissertation_topics');
    if (savedTopics) {
      try {
        return JSON.parse(savedTopics);
      } catch (error) {
        console.error('Error parsing saved topics:', error);
        return initialTopics;
      }
    }
    return initialTopics;
  });

  // Save topics to localStorage whenever topics change
  useEffect(() => {
    localStorage.setItem('pg_dissertation_topics', JSON.stringify(topics));
  }, [topics]);

  const addTopic = (topicData: Partial<Topic>) => {
    const newTopic: Topic = {
      id: `topic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: topicData.title || '',
      description: topicData.description || '',
      keywords: topicData.keywords || [],
      domain: topicData.domain || '',
      methodology: topicData.methodology || '',
      objectives: topicData.objectives || '',
      expected_outcomes: topicData.expected_outcomes || '',
      student_id: topicData.student_id || 'current_student',
      guide_id: topicData.guide_id,
      co_guide_id: topicData.co_guide_id,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      similarity_score: Math.floor(Math.random() * 30) + 10, // Mock similarity check
      ethics_approval_required: topicData.ethics_approval_required || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...topicData,
    };

    setTopics(prevTopics => [...prevTopics, newTopic]);
    return newTopic;
  };

  const updateTopic = (topicId: string, updates: Partial<Topic>) => {
    setTopics(prevTopics =>
      prevTopics.map(topic =>
        topic.id === topicId
          ? { ...topic, ...updates, updated_at: new Date().toISOString() }
          : topic
      )
    );
  };

  const deleteTopic = (topicId: string) => {
    setTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicId));
  };

  const getTopicsByStudent = (studentId: string) => {
    return topics.filter(topic => topic.student_id === studentId);
  };

  const getTopicsByGuide = (guideId: string) => {
    return topics.filter(topic => topic.guide_id === guideId || topic.co_guide_id === guideId);
  };

  const getTopicsByStatus = (status: string) => {
    return topics.filter(topic => topic.status === status);
  };

  return {
    topics,
    addTopic,
    updateTopic,
    deleteTopic,
    getTopicsByStudent,
    getTopicsByGuide,
    getTopicsByStatus,
  };
};