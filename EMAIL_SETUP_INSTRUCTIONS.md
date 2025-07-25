# Email Setup Instructions for Your Website

## Overview
Your website now has email functionality that will send form submissions directly to **itzjoshuawayman@gmail.com**. To make this work, you need to set up EmailJS (a free service).

## Step-by-Step Setup

### 1. Create EmailJS Account
- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Sign up for a free account
- Verify your email address

### 2. Add Gmail Service
- In your EmailJS dashboard, go to **"Email Services"**
- Click **"Add New Service"**
- Select **"Gmail"**
- Click **"Connect Account"** and sign in with **itzjoshuawayman@gmail.com**
- Copy the **Service ID** (you'll need this later)

### 3. Create Email Template
- Go to **"Email Templates"** in your dashboard
- Click **"Create New Template"**
- Use this template:

**Template Name:** `contact_form`

**Subject:** `{{subject}}`

**Content:**
```
New Contact Form Submission

From: {{from_name}} <{{from_email}}>
Project Category: {{project_category}}
Budget: {{budget}}
Timeline: {{timeline}}
Newsletter Signup: {{newsletter_signup}}

Message:
{{message}}

---
Submitted on {{form_date}} at {{form_time}}
```

- Save the template and copy the **Template ID**

### 4. Get Your Public Key
- Go to **"Account"** → **"General"**
- Copy your **Public Key**

### 5. Update Configuration
- Open the file: `public/creations/assets/js/email-config.js`
- Replace the placeholder values:

```javascript
const EMAIL_CONFIG = {
    SERVICE_ID: 'your_actual_service_id_here',
    TEMPLATE_ID: 'your_actual_template_id_here', 
    PUBLIC_KEY: 'your_actual_public_key_here'
};
```

### 6. Test the Setup
- Open your website
- Fill out the contact form
- Submit it
- Check **itzjoshuawayman@gmail.com** for the email

## Important Notes

- **Free Plan Limits:** EmailJS free plan allows 200 emails per month
- **No Backend Required:** This solution works entirely from the frontend
- **Secure:** Your Gmail credentials are handled by EmailJS, not stored in your code
- **Reliable:** EmailJS has high deliverability rates

## Troubleshooting

### If emails aren't being sent:
1. Check browser console for error messages
2. Verify all IDs are correct in `email-config.js`
3. Make sure Gmail service is properly connected
4. Check EmailJS dashboard for send logs

### If emails go to spam:
1. Add the sender email to your contacts
2. Mark EmailJS emails as "Not Spam"
3. Create a filter in Gmail for EmailJS emails

## Alternative Setup (if you prefer backend)

If you want a more robust solution with your own backend:
1. Set up a Node.js server with Express
2. Use Nodemailer with Gmail SMTP
3. Deploy to services like Vercel, Netlify, or Railway

Let me know if you need help with any of these steps!
