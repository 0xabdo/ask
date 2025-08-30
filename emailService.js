const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

const createAnswerEmailTemplate = (userName, userEmail, question, answer, questionDate, answerDate) => {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تم الرد على سؤالك</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .email-container {
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #007bff;
            }
            .header h1 {
                color: #007bff;
                margin: 0;
                font-size: 24px;
            }
            .content {
                margin-bottom: 30px;
            }
            .question-section, .answer-section {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-left: 4px solid #007bff;
            }
            .question-section {
                border-left-color: #28a745;
            }
            .answer-section {
                border-left-color: #007bff;
            }
            .label {
                font-weight: bold;
                color: #495057;
                margin-bottom: 8px;
                display: block;
            }
            .text {
                background: white;
                padding: 15px;
                border-radius: 5px;
                border: 1px solid #dee2e6;
                margin-bottom: 10px;
            }
            .meta {
                font-size: 14px;
                color: #6c757d;
                margin-top: 10px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #dee2e6;
                color: #6c757d;
                font-size: 14px;
            }
            .highlight {
                background: #fff3cd;
                padding: 10px;
                border-radius: 5px;
                border: 1px solid #ffeaa7;
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>تم الرد على سؤالك</h1>
                <p>Your question has been answered</p>
            </div>
            
            <div class="content">
                <p>مرحباً ${userName}،</p>
                <p>Hello ${userName},</p>
                
                <div class="highlight">
                    <strong>تم الرد على سؤالك من قبل فريق الدعم الفني</strong><br>
                    <strong>Your question has been answered by our support team</strong>
                </div>
                
                <div class="question-section">
                    <span class="label">سؤالك / Your Question:</span>
                    <div class="text">${question}</div>
                    <div class="meta">
                        <strong>تاريخ السؤال / Question Date:</strong> ${questionDate}<br>
                        <strong>البريد الإلكتروني / Email:</strong> ${userEmail}
                    </div>
                </div>
                
                <div class="answer-section">
                    <span class="label">الإجابة / Answer:</span>
                    <div class="text">${answer}</div>
                    <div class="meta">
                        <strong>تاريخ الإجابة / Answer Date:</strong> ${answerDate}
                    </div>
                </div>
                
                <p>
                    <strong>شكراً لك على استخدام منصتنا!</strong><br>
                    <strong>Thank you for using our platform!</strong>
                </p>
            </div>
            
            <div class="footer">
                <p>
                    إذا كان لديك أي أسئلة أخرى، لا تتردد في التواصل معنا.<br>
                    If you have any other questions, please don't hesitate to contact us.
                </p>
                <p>
                    <strong>مع تحيات فريق الدعم الفني</strong><br>
                    <strong>Best regards, Support Team</strong>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const sendAnswerNotification = async (userName, userEmail, question, answer, questionDate, answerDate) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'تم الرد على سؤالك - Your question has been answered',
      html: createAnswerEmailTemplate(userName, userEmail, question, answer, questionDate, answerDate)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendAnswerNotification };
