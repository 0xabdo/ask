import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';

const Home = () => {
  const [stats, setStats] = useState({
    questions: 0,
    users: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          questions: Math.floor(1000 * progress),
          users: Math.floor(500 * progress),
          satisfaction: Math.floor(99 * progress)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setStats({
            questions: 1000,
            users: 500,
            satisfaction: 99
          });
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    };

    // Start animation after a small delay
    const timeout = setTimeout(animateStats, 500);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">⭐  كل سؤال له حل</span>
          </div>
          <h1 className="hero-title arabic-font arabic-bold">
            <span className="gradient-text">! جوابك</span>
          </h1>
          <p className="hero-description arabic-font arabic-book">
            منصة الأسئلة والأجوبة الحديثة - اطرح أسئلتك واحصل على إجابات من خبرائنا
          </p>
          <div className="hero-actions">
            <button 
              onClick={() => document.getElementById('question-form').scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-primary hero-btn"
            >
              <span className="arabic-font arabic-medium">ابدأ الآن</span>
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-outline hero-btn"
            >
              <span className="arabic-font arabic-medium">تعرف على المزيد</span>
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.questions}+</div>
              <div className="stat-label">أسئلة</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.users}+</div>
              <div className="stat-label">مستخدم</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.satisfaction}%</div>
              <div className="stat-label">رضا</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="arabic-font arabic-bold">مميزات جوابك</h2>
          <p className="features-subtitle arabic-font arabic-book">اكتشف ما يجعل منصتنا مميزة وفريدة من نوعها</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle blue-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
              </div>
              <h3 className="arabic-font arabic-medium">أسئلة ذكية</h3>
              <p className="arabic-font arabic-book">اطرح أسئلتك بأي لغة واحصل على إجابات دقيقة ومفصلة</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle green-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
              </div>
              <h3 className="arabic-font arabic-medium">إجابات سريعة</h3>
              <p className="arabic-font arabic-book">احصل على إجاباتك في أسرع وقت ممكن من خبرائنا المتخصصين</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle purple-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
              </div>
              <h3 className="arabic-font arabic-medium">خصوصية كاملة</h3>
              <p className="arabic-font arabic-book">أسئلتك محمية ومؤمنة مع ضمان الخصوصية التامة</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="arabic-font arabic-bold">كيف تعمل المنصة</h2>
          <p className="features-subtitle arabic-font arabic-book">خطوات بسيطة للحصول على إجاباتك</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="arabic-font arabic-medium">اطرح سؤالك</h3>
              <p className="arabic-font arabic-book">اكتب سؤالك بالتفصيل وأضف معلوماتك الأساسية</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="arabic-font arabic-medium">انتظر الإجابة</h3>
              <p className="arabic-font arabic-book">سيقوم خبراؤنا بمراجعة سؤالك والرد عليه</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="arabic-font arabic-medium">احصل على إجابتك</h3>
              <p className="arabic-font arabic-book">ستتلقى إجابة مفصلة ومفيدة عبر البريد الإلكتروني</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="container">
          <h2 className="arabic-font arabic-bold">الأسئلة الشائعة</h2>
          <p className="features-subtitle arabic-font arabic-book">إجابات على أكثر الأسئلة شيوعاً</p>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="arabic-font arabic-medium">كم من الوقت يستغرق الحصول على إجابة؟</h3>
              <p className="arabic-font arabic-book">نحاول الرد على جميع الأسئلة خلال 24-48 ساعة</p>
            </div>
            
            <div className="faq-item">
              <h3 className="arabic-font arabic-medium">هل يمكنني طرح أسئلة بأي لغة؟</h3>
              <p className="arabic-font arabic-book">نعم، يمكنك طرح أسئلتك بالعربية أو الإنجليزية</p>
            </div>
            
            <div className="faq-item">
              <h3 className="arabic-font arabic-medium">هل أسئلتي محمية؟</h3>
              <p className="arabic-font arabic-book">نعم، جميع أسئلتك محمية ومؤمنة بخصوصية تامة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <h2 className="arabic-font arabic-bold">تواصل معنا</h2>
          <p className="features-subtitle arabic-font arabic-book">لديك استفسار أو اقتراح؟ نحن هنا لمساعدتك</p>
          
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">
                <div className="icon-circle blue-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
              </div>
              <h3 className="arabic-font arabic-medium">البريد الإلكتروني</h3>
              <p className="arabic-font arabic-book">support@jawabak.com</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <div className="icon-circle green-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
              </div>
              <h3 className="arabic-font arabic-medium">أوقات العمل</h3>
              <p className="arabic-font arabic-book">24/7 - على مدار الساعة</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <div className="icon-circle purple-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
                  </svg>
                </div>
              </div>
              <h3 className="arabic-font arabic-medium">الموقع</h3>
              <p className="arabic-font arabic-book">متاح في جميع أنحاء العالم</p>
            </div>
          </div>
        </div>
      </section>

      {/* Question Form Section */}
      <section className="container" id="question-form">
        <div className="card">
          <h2 className="arabic-font arabic-bold" style={{ textAlign: 'center', marginBottom: '32px' }}>
            اطرح سؤالك الآن
          </h2>
          <QuestionForm />
        </div>
      </section>
    </div>
  );
};

export default Home;

