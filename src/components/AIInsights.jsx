import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, TrendingUp, TrendingDown, DollarSign, Target, Lightbulb } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { AI_API_END_POINT } from '@/utils/endpoints';

const AIInsights = () => {
    const [insights, setInsights] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('insights');

    const fetchInsights = async () => {
        if (insights) return;
        setLoading(true);
        try {
            const response = await axios.get(`${AI_API_END_POINT}/insights`, {
                withCredentials: true
            });
            setInsights(response.data.insights);
        } catch (error) {
            console.error('Error fetching insights:', error);
            toast.error('Failed to fetch AI insights');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalysis = async () => {
        if (analysis) return;
        setLoading(true);
        try {
            const response = await axios.get(`${AI_API_END_POINT}/analysis`, {
                withCredentials: true
            });
            setAnalysis(response.data.analysis);
        } catch (error) {
            console.error('Error fetching analysis:', error);
            toast.error('Failed to fetch AI analysis');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
        if (!insights) fetchInsights();
    }, []);

    const getRiskColor = (riskLevel) => {
        switch (riskLevel?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend?.toLowerCase()) {
            case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />;
            case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-500" />;
            default: return <TrendingUp className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold">AI Financial Insights</h2>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant={activeTab === 'insights' ? 'default' : 'outline'}
                        onClick={() => {
                            setActiveTab('insights');
                            if (!insights) fetchInsights();
                        }}
                    >
                        Quick Insights
                    </Button>
                    <Button
                        variant={activeTab === 'analysis' ? 'default' : 'outline'}
                        onClick={() => {
                            setActiveTab('analysis');
                            if (!analysis) fetchAnalysis();
                        }}
                    >
                        Detailed Analysis
                    </Button>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            )}

            {activeTab === 'insights' && insights && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2">
                                {/* <DollarSign className="w-5 h-5 text-green-600" /> */}
                                <span>Total Spent</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                ${insights.totalSpent || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                <span>Top Category</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold">
                                {insights.topCategory || 'N/A'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                <span>Average Transaction</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                ${insights.averageTransaction || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5" />
                                <span>Spending Trend</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                {getTrendIcon(insights.spendingTrend)}
                                <span className="capitalize">{insights.spendingTrend || 'stable'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2">
                                <Lightbulb className="w-5 h-5 text-yellow-600" />
                                <span>Quick Tip</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                {insights.quickTip || 'Track your expenses regularly to identify spending patterns'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Risk Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge className={getRiskColor(insights.riskLevel)}>
                                {insights.riskLevel || 'low'}
                            </Badge>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'analysis' && analysis && (
                <Card>
                    <CardHeader>
                        <CardTitle>AI Financial Analysis</CardTitle>
                        <CardDescription>
                            Personalized financial advice based on your spending patterns
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none">
                            <div 
                                className="whitespace-pre-wrap text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ 
                                    __html: analysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {!loading && !insights && activeTab === 'insights' && (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-gray-500">
                            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No expenses found. Add some expenses to get AI insights!</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {!loading && !analysis && activeTab === 'analysis' && (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-gray-500">
                            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No expenses found. Add some expenses to get AI analysis!</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AIInsights; 