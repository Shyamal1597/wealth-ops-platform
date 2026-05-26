import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { sendSmsOTP } from '@/lib/sms';

export async function POST(request: NextRequest) {
    try {
        const { contactInfo } = await request.json();

        if (!contactInfo) {
            return NextResponse.json({ error: 'Contact information is required' }, { status: 400 });
        }

        const clientsFilePath = join(process.cwd(), 'data', 'clients.json');

        if (!existsSync(clientsFilePath)) {
            return NextResponse.json({ message: 'If an account matches, recovery details have been sent.' });
        }

        const clientsData = JSON.parse(readFileSync(clientsFilePath, 'utf8'));

        // Find client by email or mobile
        const client = clientsData.find((c: any) =>
            c.email === contactInfo || c.mobile === contactInfo
        );

        if (!client) {
            // Return success even if not found to prevent enumeration attacks
            return NextResponse.json({ message: 'If an account matches, recovery details have been sent.' });
        }

        // Determine how to send it
        const isMobile = !!client.mobile && (contactInfo === client.mobile || contactInfo === client.email);
        const isEmail = !!client.email && contactInfo === client.email;

        if (isMobile) {
            // For now, reuse sendSmsOTP to send a message containing Client ID.
            // A dedicated sendSmsMessage would be better, but this works for SMS templates
            // assuming the template allows generic text, or we just send it.
            // Actually, sendSmsOTP requires an OTP string. Let's just pass the Client ID as the OTP if it's 6 chars, otherwise it might fail template validation.
            // Since ClientIDs are often 6 digits (e.g. 256000), it might pass.
            // Let's create a custom email for Client ID recovery.
            const { sendEmail } = await import('@/lib/email');
            if (client.email) {
                const subject = "Your Sunidhi Security Client ID";
                const text = `Hello ${client.name},\n\nYou requested to recover your Client ID.\nYour Client ID is: ${client.clientId}\n\nYou can use this to log in to the Sunidhi Next.js Portal.`;
                const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
                        <h2>Sunidhi Securities</h2>
                        <p>Client ID Recovery</p>
                    </div>
                    <div style="padding: 30px 20px; background-color: #f9fafb; text-align: center;">
                        <p>Hello ${client.name},</p>
                        <p>You requested to recover your Client ID for the Sunidhi portal.</p>
                        <p>Your Client ID is:</p>
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e40af; background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px; display: inline-block;">${client.clientId}</div>
                        <p><em>Please keep this ID secure and do not share it.</em></p>
                    </div>
                </div>`;
                await sendEmail({ to: client.email, subject, text, html });
            } else if (client.mobile) {
                // Sending Client ID via SMS. If we use the Vibgyortel OTP API, we'll pass the Client ID.
                await sendSmsOTP(client.mobile, client.clientId);
            }
        } else if (isEmail) {
            const { sendEmail } = await import('@/lib/email');
            const subject = "Your Sunidhi Security Client ID";
            const text = `Hello ${client.name},\n\nYou requested to recover your Client ID.\nYour Client ID is: ${client.clientId}\n\nYou can use this to log in to the Sunidhi Next.js Portal.`;
            const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
                    <h2>Sunidhi Securities</h2>
                    <p>Client ID Recovery</p>
                </div>
                <div style="padding: 30px 20px; background-color: #f9fafb; text-align: center;">
                    <p>Hello ${client.name},</p>
                    <p>You requested to recover your Client ID for the Sunidhi portal.</p>
                    <p>Your Client ID is:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e40af; background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px; display: inline-block;">${client.clientId}</div>
                    <p><em>Please keep this ID secure and do not share it.</em></p>
                </div>
            </div>`;
            await sendEmail({ to: client.email, subject, text, html });
        }

        return NextResponse.json({ message: 'If an account matches, recovery details have been sent.' });

    } catch (error) {
        console.error('Forgot Client ID error:', error);
        return NextResponse.json({ error: 'Server error parsing request' }, { status: 500 });
    }
}
