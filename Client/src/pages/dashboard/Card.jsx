import { useState, useEffect } from 'react';
import { CreditCard, Plus, Eye, EyeOff, Copy, Lock, Unlock, Trash2, Calendar, Shield, Zap, Gift, CheckCircle2, Clock, XCircle } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import useUserStore from "@/stores/userStore";

const Card = () => {
  const [activeTab, setActiveTab] = useState('my-cards'); // 'my-cards' or 'apply'
  const [cards, setCards] = useState([]);
  const [showCardNumber, setShowCardNumber] = useState({});
  const [showCVV, setShowCVV] = useState({});
  const [applicationData, setApplicationData] = useState({
    cardType: 'virtual',
    purpose: '',
    monthlySpending: '',
    employmentStatus: '',
    annualIncome: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const user = useUserStore((state) => state.user);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate fetching user's cards
    const mockCards = [
      {
        id: 1,
        type: 'virtual',
        status: 'active',
        cardNumber: '4532123456789012',
        expiryDate: '12/27',
        cvv: '123',
        holderName: `${user?.user?.firstName} ${user?.user?.lastName}`,
        issueDate: '2024-01-15',
        balance: 1500.00,
        creditLimit: 5000.00,
        brand: 'Visa'
      },
      {
        id: 2,
        type: 'physical',
        status: 'pending',
        cardNumber: '5555444433332222',
        expiryDate: '03/28',
        cvv: '456',
        holderName: `${user?.user?.firstName} ${user?.user?.lastName}`,
        issueDate: '2024-02-20',
        balance: 0.00,
        creditLimit: 3000.00,
        brand: 'Mastercard'
      }
    ];
    setCards(mockCards);
  }, [user]);

  const cardTypes = [
    {
      id: 'virtual',
      name: 'Virtual Card',
      description: 'Perfect for online shopping and digital payments',
      features: ['Instant approval', 'No physical delivery', 'Enhanced security'],
      icon: Shield,
      color: 'bg-blue-500'
    },
    {
      id: 'physical',
      name: 'Physical Card',
      description: 'Traditional card for in-store and online purchases',
      features: ['7-10 days delivery', 'Worldwide acceptance', 'ATM withdrawals'],
      icon: CreditCard,
      color: 'bg-purple-500'
    },
    {
      id: 'premium',
      name: 'Premium Card',
      description: 'Exclusive benefits and higher limits',
      features: ['Premium rewards', 'Travel insurance', 'Concierge service'],
      icon: Gift,
      color: 'bg-gold-500'
    }
  ];

  const toggleCardNumber = (cardId) => {
    setShowCardNumber(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const toggleCVV = (cardId) => {
    setShowCVV(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const formatCardNumber = (number, show = false) => {
    if (show) {
      return number.replace(/(.{4})/g, '$1 ').trim();
    }
    return '**** **** **** ' + number.slice(-4);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'blocked':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return CheckCircle2;
      case 'pending':
        return Clock;
      case 'blocked':
        return XCircle;
      default:
        return Clock;
    }
  };

  const handleApplicationSubmit = (e) => {
    // Validate required fields
    if (!applicationData.purpose || !applicationData.monthlySpending || 
        !applicationData.employmentStatus || !applicationData.annualIncome) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newCard = {
        id: Date.now(),
        type: applicationData.cardType,
        status: 'pending',
        cardNumber: '4532' + Math.random().toString().slice(2, 14),
        expiryDate: '12/29',
        cvv: Math.floor(Math.random() * 900 + 100).toString(),
        holderName: `${user?.user?.firstName} ${user?.user?.lastName}`,
        issueDate: new Date().toISOString().split('T')[0],
        balance: 0.00,
        creditLimit: applicationData.cardType === 'premium' ? 10000 : 5000,
        brand: 'Visa'
      };

      setCards(prev => [...prev, newCard]);
      setApplicationData({
        cardType: 'virtual',
        purpose: '',
        monthlySpending: '',
        employmentStatus: '',
        annualIncome: ''
      });
      setActiveTab('my-cards');
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <>
      <div className="font-voyage min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Card Management</h1>
            <p className="text-gray-600 mt-1">Manage your cards and apply for new ones</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('my-cards')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'my-cards'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Cards ({cards.length})
              </button>
              <button
                onClick={() => setActiveTab('apply')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'apply'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Apply for Card
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'my-cards' ? (
            <div>
              {cards.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No cards yet</h3>
                  <p className="text-gray-500 mb-6">Apply for your first card to get started</p>
                  <button
                    onClick={() => setActiveTab('apply')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Apply for Card
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {cards.map((card) => {
                    const StatusIcon = getStatusIcon(card.status);
                    return (
                      <div
                        key={card.id}
                        className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 text-white shadow-xl"
                      >
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-6 h-6" />
                            <span className="font-medium capitalize">{card.type} Card</span>
                          </div>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span className="capitalize">{card.status}</span>
                          </div>
                        </div>

                        {/* Card Number */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-300">Card Number</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleCardNumber(card.id)}
                                className="text-gray-300 hover:text-white transition-colors"
                              >
                                {showCardNumber[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => copyToClipboard(card.cardNumber, 'Card number')}
                                className="text-gray-300 hover:text-white transition-colors"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-lg font-mono">
                            {formatCardNumber(card.cardNumber, showCardNumber[card.id])}
                          </p>
                        </div>

                        {/* Card Details */}
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm text-gray-300">Cardholder</p>
                            <p className="font-medium">{card.holderName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-300">Expires</p>
                            <p className="font-medium">{card.expiryDate}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-300">CVV</span>
                              <button
                                onClick={() => toggleCVV(card.id)}
                                className="text-gray-300 hover:text-white transition-colors"
                              >
                                {showCVV[card.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                            <p className="font-medium font-mono">
                              {showCVV[card.id] ? card.cvv : '***'}
                            </p>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-600">
                          <div>
                            <p className="text-sm text-gray-300">Available Balance</p>
                            <p className="text-xl font-bold">${card.balance.toFixed(2)}</p>
                          </div>
                          <div className="flex space-x-2">
                            {card.status === 'active' && (
                              <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                                <Lock className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // Application Form
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for a New Card</h2>

                {/* Card Type Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Card Type</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {cardTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <div
                          key={type.id}
                          onClick={() => setApplicationData(prev => ({ ...prev, cardType: type.id }))}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                            applicationData.cardType === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${type.color}`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{type.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                          <ul className="space-y-1">
                            {type.features.map((feature, index) => (
                              <li key={index} className="text-xs text-gray-500 flex items-center">
                                <CheckCircle2 className="w-3 h-3 text-green-500 mr-1" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Application Form */}
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Purpose
                      </label>
                      <select
                        value={applicationData.purpose}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, purpose: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select purpose</option>
                        <option value="online-shopping">Online Shopping</option>
                        <option value="business">Business Expenses</option>
                        <option value="travel">Travel</option>
                        <option value="daily-expenses">Daily Expenses</option>
                        <option value="emergency">Emergency Fund</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Monthly Spending
                      </label>
                      <select
                        value={applicationData.monthlySpending}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, monthlySpending: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select range</option>
                        <option value="0-500">$0 - $500</option>
                        <option value="500-1000">$500 - $1,000</option>
                        <option value="1000-2500">$1,000 - $2,500</option>
                        <option value="2500-5000">$2,500 - $5,000</option>
                        <option value="5000+">$5,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Status
                      </label>
                      <select
                        value={applicationData.employmentStatus}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, employmentStatus: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select status</option>
                        <option value="employed">Employed</option>
                        <option value="self-employed">Self Employed</option>
                        <option value="student">Student</option>
                        <option value="retired">Retired</option>
                        <option value="unemployed">Unemployed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Income
                      </label>
                      <select
                        value={applicationData.annualIncome}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, annualIncome: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select range</option>
                        <option value="0-25000">Under $25,000</option>
                        <option value="25000-50000">$25,000 - $50,000</option>
                        <option value="50000-75000">$50,000 - $75,000</option>
                        <option value="75000-100000">$75,000 - $100,000</option>
                        <option value="100000+">$100,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab('my-cards')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplicationSubmit}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Copy Success Toast */}
        {copySuccess && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {copySuccess}
          </div>
        )}
      </div>

      <BottomNavigation />
    </>
  );
};

export default Card;