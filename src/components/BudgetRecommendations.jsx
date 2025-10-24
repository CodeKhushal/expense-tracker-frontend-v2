import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calculator, Target, TrendingUp, PiggyBank, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { AI_API_END_POINT } from '@/utils/endpoints';

const BudgetRecommendations = () => {
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);

    const getRecommendations = async () => {
        if (!monthlyIncome || monthlyIncome <= 0) {
            toast.error('Please enter a valid monthly income');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${AI_API_END_POINT}/budget-recommendations`, {
                monthlyIncome: parseFloat(monthlyIncome)
            }, {
                withCredentials: true
            });
            setRecommendations(response.data.recommendations);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            toast.error('Failed to get budget recommendations');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Calculator className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Budget Recommendations</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Get Personalized Budget Plan</CardTitle>
                    <CardDescription>
                        Enter your monthly income to receive AI-powered budget recommendations
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="monthlyIncome">Monthly Income</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="monthlyIncome"
                                type="number"
                                placeholder="Enter your monthly income"
                                value={monthlyIncome}
                                onChange={(e) => setMonthlyIncome(e.target.value)}
                                className="flex-1"
                            />
                            <Button 
                                onClick={getRecommendations}
                                disabled={loading || !monthlyIncome}
                            >
                                {loading ? 'Analyzing...' : 'Get Recommendations'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {recommendations && (
                <div className="space-y-6">
                    {/* Budget Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Target className="w-5 h-5 text-green-600" />
                                <span>Recommended Budget Allocation</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {formatCurrency(recommendations.recommendedBudget.needs)}
                                    </div>
                                    <div className="text-sm text-gray-600">Needs (50%)</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Housing, food, utilities, transportation
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(recommendations.recommendedBudget.wants)}
                                    </div>
                                    <div className="text-sm text-gray-600">Wants (30%)</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Entertainment, dining out, shopping
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {formatCurrency(recommendations.recommendedBudget.savings)}
                                    </div>
                                    <div className="text-sm text-gray-600">Savings (20%)</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Emergency fund, investments, debt payoff
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Current vs Recommended */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                                <span>Current vs Recommended Spending</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Current Monthly Spending:</span>
                                    <span className="font-semibold">
                                        {formatCurrency(recommendations.currentSpending)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Monthly Income:</span>
                                    <span className="font-semibold text-green-600">
                                        {formatCurrency(recommendations.monthlyIncome)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Recommended Savings:</span>
                                    <span className="font-semibold text-purple-600">
                                        {formatCurrency(recommendations.savingsTarget)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Emergency Fund Target:</span>
                                    <span className="font-semibold text-blue-600">
                                        {formatCurrency(recommendations.emergencyFundTarget)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Limits */}
                    {Object.keys(recommendations.categoryLimits).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Category Spending Limits</CardTitle>
                                <CardDescription>
                                    Suggested monthly limits for each spending category
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(recommendations.categoryLimits).map(([category, limit]) => (
                                        <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="capitalize font-medium">{category}</span>
                                            <Badge variant="outline" className="font-semibold">
                                                {formatCurrency(limit)}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <PiggyBank className="w-5 h-5 text-green-600" />
                                <span>Money-Saving Recommendations</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recommendations.recommendations.map((recommendation, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm">{recommendation}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Warning if spending too much */}
                    {recommendations.currentSpending > recommendations.monthlyIncome * 0.9 && (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-orange-800">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span>High Spending Alert</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-orange-700">
                                    Your current spending is very high relative to your income. 
                                    Consider reviewing your expenses and implementing the recommendations above 
                                    to improve your financial health.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default BudgetRecommendations; 