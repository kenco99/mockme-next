"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSections, getTopics, createSession } from '@/app/utils/api';

interface Section {
    section_id: number;
    title: string;
    count: number;
}

interface Topic {
    topic_id: number;
    title: string;
    count: number;
}

const CreateSession: React.FC = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedSections, setSelectedSections] = useState<Section[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
    const [questionOption, setQuestionOption] = useState<'all' | 'incorrect' | 'manual'>('all');
    const [manualQuestionCount, setManualQuestionCount] = useState<number>(1);
    const [durationOption, setDurationOption] = useState<'unlimited' | 'manual'>('unlimited');
    const [hours, setHours] = useState<number>(1);
    const [minutes, setMinutes] = useState<number>(0);
    const [sectionSearchTerm, setSectionSearchTerm] = useState<string>('');
    const [topicSearchTerm, setTopicSearchTerm] = useState<string>('');
    const [showSectionDropdown, setShowSectionDropdown] = useState<boolean>(false);
    const [showTopicDropdown, setShowTopicDropdown] = useState<boolean>(false);
    const router = useRouter();
    const sectionRef = useRef<HTMLDivElement>(null);
    const topicRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSections();
        fetchTopics();

        const handleClickOutside = (event: MouseEvent) => {
            if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
                setShowSectionDropdown(false);
            }
            if (topicRef.current && !topicRef.current.contains(event.target as Node)) {
                setShowTopicDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchSections = async (search = '') => {
        try {
            const data = await getSections(search);
            setSections(data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const fetchTopics = async (search = '') => {
        try {
            const data = await getTopics(search);
            setTopics(data);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const handleSectionSelect = (section: Section) => {
        const isSelected = selectedSections.some(s => s.section_id === section.section_id);
        if (isSelected) {
            setSelectedSections(selectedSections.filter(s => s.section_id !== section.section_id));
        } else {
            setSelectedSections([...selectedSections, section]);
        }
    };

    const handleTopicSelect = (topic: Topic) => {
        const isSelected = selectedTopics.some(t => t.topic_id === topic.topic_id);
        if (isSelected) {
            setSelectedTopics(selectedTopics.filter(t => t.topic_id !== topic.topic_id));
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
    };

    const handleStart = async () => {
        try {
            const sessionData = {
                topic_ids: selectedTopics.map(topic => topic.topic_id),
                section_ids: selectedSections.map(section => section.section_id),
                number_of_questions: questionOption === 'manual' ? manualQuestionCount : null,
                duration_seconds: durationOption === 'manual' ? (hours * 3600 + minutes * 60) : null
            };

            const response = await createSession(sessionData);
            router.push(`/quiz?session_id=${response.session_id}`);
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-8">Configure Your Practice</h1>

            <div className="mb-6" ref={sectionRef}>
                <label className="block mb-2 font-semibold">Section</label>
                <div className="relative">
                    <div
                        className="w-full p-3 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
                        onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                    >
                        {selectedSections.length > 0
                            ? selectedSections.map(s => `${s.title} (${s.count})`).join(', ')
                            : 'Select'}
                        <span>▼</span>
                    </div>
                    {showSectionDropdown && (
                        <div className="absolute top-full left-0 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-b-md shadow-md z-10">
                            <input
                                type="text"
                                placeholder="Search sections"
                                value={sectionSearchTerm}
                                onChange={(e) => {
                                    setSectionSearchTerm(e.target.value);
                                    fetchSections(e.target.value);
                                }}
                                className="w-full p-2 border-b border-gray-300"
                            />
                            {sections.map(section => (
                                <div
                                    key={section.section_id}
                                    className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedSections.some(s => s.section_id === section.section_id) ? 'bg-gray-200' : ''}`}
                                    onClick={() => handleSectionSelect(section)}
                                >
                                    {section.title} ({section.count})
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-6" ref={topicRef}>
                <label className="block mb-2 font-semibold">Topic</label>
                <div className="relative">
                    <div
                        className="w-full p-3 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
                        onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                    >
                        {selectedTopics.length > 0
                            ? selectedTopics.map(t => `${t.title} (${t.count})`).join(', ')
                            : 'Select'}
                        <span>▼</span>
                    </div>
                    {showTopicDropdown && (
                        <div className="absolute top-full left-0 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-b-md shadow-md z-10">
                            <input
                                type="text"
                                placeholder="Search topics"
                                value={topicSearchTerm}
                                onChange={(e) => {
                                    setTopicSearchTerm(e.target.value);
                                    fetchTopics(e.target.value);
                                }}
                                className="w-full p-2 border-b border-gray-300"
                            />
                            {topics.map(topic => (
                                <div
                                    key={topic.topic_id}
                                    className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedTopics.some(t => t.topic_id === topic.topic_id) ? 'bg-gray-200' : ''}`}
                                    onClick={() => handleTopicSelect(topic)}
                                >
                                    {topic.title} ({topic.count})
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-semibold">Number of questions</label>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="all"
                            checked={questionOption === 'all'}
                            onChange={(e) => setQuestionOption(e.target.value as 'all' | 'incorrect' | 'manual')}
                            className="mr-2"
                        />
                        All Questions
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="incorrect"
                            checked={questionOption === 'incorrect'}
                            onChange={(e) => setQuestionOption(e.target.value as 'all' | 'incorrect' | 'manual')}
                            className="mr-2"
                        />
                        Questions answered incorrectly
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="manual"
                            checked={questionOption === 'manual'}
                            onChange={(e) => setQuestionOption(e.target.value as 'all' | 'incorrect' | 'manual')}
                            className="mr-2"
                        />
                        Choose manually
                    </label>
                </div>
                {questionOption === 'manual' && (
                    <input
                        type="number"
                        min={1}
                        value={manualQuestionCount}
                        onChange={(e) => setManualQuestionCount(parseInt(e.target.value))}
                        className="mt-2 p-2 w-20 border border-gray-300 rounded-md"
                    />
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-semibold">Duration</label>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="unlimited"
                            checked={durationOption === 'unlimited'}
                            onChange={(e) => setDurationOption(e.target.value as 'unlimited' | 'manual')}
                            className="mr-2"
                        />
                        Unlimited
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="manual"
                            checked={durationOption === 'manual'}
                            onChange={(e) => setDurationOption(e.target.value as 'unlimited' | 'manual')}
                            className="mr-2"
                        />
                        Set manually
                    </label>
                </div>
                {durationOption === 'manual' && (
                    <div className="flex items-center mt-2 space-x-2">
                        <input
                            type="number"
                            min={0}
                            value={hours}
                            onChange={(e) => setHours(parseInt(e.target.value))}
                            className="p-2 w-20 border border-gray-300 rounded-md"
                        />
                        <span>Hours</span>
                        <input
                            type="number"
                            min={0}
                            max={59}
                            value={minutes}
                            onChange={(e) => setMinutes(parseInt(e.target.value))}
                            className="p-2 w-20 border border-gray-300 rounded-md"
                        />
                        <span>Mins</span>
                    </div>
                )}
            </div>

            <button
                onClick={handleStart}
                className="w-full bg-black text-white p-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
            >
                Start
            </button>
        </div>
    );
};

export default CreateSession;
