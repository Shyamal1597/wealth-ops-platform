/**
 * SMS OTP Utility — Vibgyortel API
 * Sends transactional SMS via the Vibgyortel HTTP API for client OTP verification.
 */

interface SmsResponse {
    success: boolean;
    error?: string;
    messageId?: string;
}

/**
 * Send an OTP via SMS using the Vibgyortel API.
 * DLT template: "Dear customer, This is your otp for Sunidhi web login : " {OTP} ". Sunidhi Sec"
 */
export async function sendSmsOTP(mobile: string, otp: string): Promise<SmsResponse> {
    const apiKey = process.env.SMS_API_KEY;
    const senderId = process.env.SMS_SENDER_ID || 'SSFLBO';
    const dltEntityId = process.env.SMS_DLT_ENTITY_ID || '';
    const dltTemplateId = process.env.SMS_DLT_TEMPLATE_ID || '';

    if (!apiKey) {
        console.error('SMS_API_KEY is not configured');
        return { success: false, error: 'SMS service not configured' };
    }

    // Normalize mobile number — remove +91, spaces, leading 0
    let normalizedMobile = mobile.replace(/[\s\-\+]/g, '');
    if (normalizedMobile.startsWith('91') && normalizedMobile.length === 12) {
        normalizedMobile = normalizedMobile.substring(2);
    }
    if (normalizedMobile.startsWith('0')) {
        normalizedMobile = normalizedMobile.substring(1);
    }

    if (normalizedMobile.length !== 10) {
        return { success: false, error: 'Invalid mobile number format' };
    }

    // Must match the exact DLT-approved template
    const message = `Dear customer, This is your otp for Sunidhi web login : " ${otp} ". Sunidhi Sec`;

    const params = new URLSearchParams({
        apikey: apiKey,
        mobiles: normalizedMobile,
        sms: message,
        senderid: senderId,
        ...(dltEntityId && { 'dlt-entity-id': dltEntityId }),
        ...(dltTemplateId && { 'dlt-template-id': dltTemplateId }),
    });

    const url = `https://apps.vibgyortel.in/client/api/sendmessage?${params.toString()}`;

    try {
        console.log(`[SMS] Sending OTP to ${normalizedMobile.substring(0, 3)}****${normalizedMobile.substring(7)}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        const text = await response.text();
        console.log('[SMS] API response:', text);

        // Try parsing as JSON
        try {
            const data = JSON.parse(text);
            const errorCode = data?.status?.['error-code'];

            if (errorCode === '000') {
                // Success
                const messageId = data?.['sms-response-details']?.[0]?.['sent-sms-details']?.[0]?.['message-id'];
                return { success: true, messageId };
            } else {
                const errorDesc = data?.status?.['error-description'] || 'SMS sending failed';
                console.error('[SMS] API error:', errorDesc);
                return { success: false, error: errorDesc };
            }
        } catch {
            // If response is not JSON, check if it contains success indicators
            if (text.includes('000') || text.toLowerCase().includes('success')) {
                return { success: true };
            }
            console.error('[SMS] Unexpected response format:', text);
            return { success: false, error: 'Unexpected SMS API response' };
        }
    } catch (error) {
        console.error('[SMS] Network error:', error);
        return { success: false, error: 'Failed to connect to SMS service' };
    }
}

/**
 * Mask a phone number for display, e.g. 9834584706 → 983****706
 */
export function maskPhone(mobile: string): string {
    let normalized = mobile.replace(/[\s\-\+]/g, '');
    if (normalized.startsWith('91') && normalized.length === 12) {
        normalized = normalized.substring(2);
    }
    if (normalized.length >= 10) {
        return normalized.substring(0, 3) + '****' + normalized.substring(7);
    }
    return normalized.substring(0, 2) + '****';
}
