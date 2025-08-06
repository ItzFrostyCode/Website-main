/* ==================== EMAIL CONFIGURATION ==================== */
// EmailJS Configuration
// IMPORTANT: Replace these with your actual EmailJS credentials
const EMAIL_CONFIG = {
    SERVICE_ID: 'your_service_id',      // Replace with your EmailJS Service ID
    TEMPLATE_ID: 'your_template_id',    // Replace with your EmailJS Template ID
    PUBLIC_KEY: 'your_public_key'      // Replace with your EmailJS Public Key
};

// Initialize EmailJS when the script loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
});

/* ==================== EMAIL SENDING FUNCTION ==================== */
async function sendContactEmail(formData) {
    try {
        // Prepare template parameters for EmailJS
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            to_email: 'itzjoshuawayman@gmail.com',
            subject: `New ${formData.subject} Inquiry`,
            message: formData.message,
            project_category: formData.subject,
            budget: formData.budget,
            timeline: formData.timeline,
            newsletter_signup: formData.newsletter ? 'Yes' : 'No',
            form_date: new Date().toLocaleDateString(),
            form_time: new Date().toLocaleTimeString()
        };

        // Send email using EmailJS
        const response = await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            EMAIL_CONFIG.TEMPLATE_ID,
            templateParams
        );

        console.log('Email sent successfully:', response);
        return { success: true, response };

    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error };
    }
}

/* ==================== EMAILJS SETUP INSTRUCTIONS ==================== */
/*
TO SET UP EMAILJS:

1. Go to https://www.emailjs.com/ and create a free account
2. Add your Gmail service:
   - Go to "Email Services" in your EmailJS dashboard
   - Click "Add New Service" 
   - Select "Gmail"
   - Connect your Gmail account (itzjoshuawayman@gmail.com)
   - Note down your Service ID

3. Create an email template:
   - Go to "Email Templates" in your EmailJS dashboard
   - Click "Create New Template"
   - Use this template structure:

   Subject: {{subject}}
   
   From: {{from_name}} <{{from_email}}>
   
   Project Details:
   - Category: {{project_category}}
   - Budget: {{budget}}
   - Timeline: {{timeline}}
   - Newsletter: {{newsletter_signup}}
   
   Message:
   {{message}}
   
   ---
   Sent on {{form_date}} at {{form_time}}

4. Get your Public Key:
   - Go to "Account" > "General" 
   - Copy your Public Key

5. Update the EMAIL_CONFIG object above with your actual:
   - SERVICE_ID (from step 2)
   - TEMPLATE_ID (from step 3)
   - PUBLIC_KEY (from step 4)

6. Test the form to make sure emails are being sent to itzjoshuawayman@gmail.com
*/
