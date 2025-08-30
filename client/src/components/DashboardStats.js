import React from 'react';

const DashboardStats = ({ stats }) => {
  console.log('DashboardStats received stats:', stats);
  
  if (!stats) {
    console.log('No stats data available');
    return null;
  }

  const statCards = [
    {
      title: 'Total Questions',
      value: stats.totalQuestions || 0,
      icon: '📚',
      color: 'blue',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Answered Questions',
      value: stats.answeredQuestions || 0,
      icon: '✅',
      color: 'green',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Pending Questions',
      value: stats.pendingQuestions || 0,
      icon: '⏳',
      color: 'orange',
      trend: '-5%',
      trendUp: false,
      // For pending questions, negative trend (low) is good, so we'll show it as positive
      showTrendAsPositive: true
    },
    {
      title: 'Answer Rate',
      value: `${stats.answerRate || 0}%`,
      icon: '📊',
      color: 'purple',
      trend: '+3%',
      trendUp: true
    }
  ];

  return (
    <div className="stats-section">
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className={`stat-card stat-card-${stat.color}`}>
            <div className="stat-header">
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className={`stat-trend ${stat.showTrendAsPositive ? 'trend-up' : (stat.trendUp ? 'trend-up' : 'trend-down')}`}>
                {stat.trend}
              </div>
            </div>
            
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.title}</div>
            </div>
            
            <div className="stat-footer">
              <div className={`trend-indicator ${stat.showTrendAsPositive ? 'trend-up' : (stat.trendUp ? 'trend-up' : 'trend-down')}`}>
                {stat.showTrendAsPositive ? '↘' : (stat.trendUp ? '↗' : '↘')}
              </div>
              <span>vs last month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;

