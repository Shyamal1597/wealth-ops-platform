import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import bcrypt from 'bcryptjs';
import { sendSmsOTP } from '@/lib/sms';
import { join } from 'path';

interface ClientData {
    clientId: string;
    name: string;
    email?: string;
    mobile?: string;
    password?: string;
    accountStatus?: string;
    accountOpenDate?: string;
    requiresActivation?: boolean;
}

/**
 * GET /api/auth/client-profile?clientId=XXX
 * Returns the client's profile (excluding password hash).
 */
export async function GET(request: NextRequest) {
    try {
        const clientId = request.nextUrl.searchParams.get('clientId');

        if (!clientId) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        const clientsFilePath = join(process.cwd(), 'data', 'clients.json');

        if (!existsSync(clientsFilePath)) {
            return NextResponse.json({ error: 'Client data not found' }, { status: 404 });
        }

        const clientsData: ClientData[] = JSON.parse(readFileSync(clientsFilePath, 'utf8'));
        const client = clientsData.find((c) => c.clientId === clientId);

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Return profile without password hash
        return NextResponse.json({
            clientId: client.clientId,
            name: client.name,
            email: client.email || '',
            mobile: client.mobile || '',
            accountStatus: client.accountStatus || (client.requiresActivation ? 'pending' : 'active'),
            accountOpenDate: client.accountOpenDate || '',
        });
    } catch (error) {
        console.error('Client profile fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

/**
 * PUT /api/auth/client-profile
 * Updates allowed fields: email, mobile, password (requires currentPassword).
 */
export async function PUT(request: NextRequest) {
    try {
        const { clientId, email, mobile, name, otp, currentPassword, newPassword } = await request.json();

        if (!clientId) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        const clientsFilePath = join(process.cwd(), 'data', 'clients.json');

        if (!existsSync(clientsFilePath)) {
            return NextResponse.json({ error: 'Client data not found' }, { status: 404 });
        }

        const clientsData: ClientData[] = JSON.parse(readFileSync(clientsFilePath, 'utf8'));
        const clientIndex = clientsData.findIndex((c) => c.clientId === clientId);

        if (clientIndex === -1) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        const client = clientsData[clientIndex];
        let updated = false;

        const mobileChanged = mobile !== undefined && mobile !== client.mobile;
        const emailChanged = email !== undefined && email !== client.email;
        const nameChanged = name !== undefined && name !== client.name && name.trim() !== '';

        if (mobileChanged && emailChanged) {
            return NextResponse.json({ error: 'Please update one contact method at a time for security verification.' }, { status: 400 });
        }

        if (nameChanged) {
            clientsData[clientIndex].name = name.trim();
            updated = true;
        }

        // --- MOBILE UPDATE FLOW ---
        if (mobileChanged) {
            if (!otp) {
                // Generate and send OTP to new mobile
                const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
                const smsResult = await sendSmsOTP(mobile, generatedOtp);

                if (!smsResult.success) {
                    return NextResponse.json({ error: 'Failed to send OTP to the new mobile number' }, { status: 500 });
                }

                const otpsFilePath = join(process.cwd(), 'data', 'client-otps.json');
                let otpsData: Record<string, any> = {};
                if (existsSync(otpsFilePath)) {
                    try { otpsData = JSON.parse(readFileSync(otpsFilePath, 'utf8')); } catch (e) { }
                }

                otpsData[`${clientId}_profile_update`] = {
                    otp: generatedOtp,
                    expiresAt: Date.now() + 10 * 60 * 1000,
                    pendingMobile: mobile,
                };

                writeFileSync(otpsFilePath, JSON.stringify(otpsData, null, 2));
                if (updated) {
                    writeFileSync(clientsFilePath, JSON.stringify(clientsData, null, 2));
                }
                return NextResponse.json({ requiresOtpVerification: true, message: 'OTP sent to new mobile number' });
            } else {
                // Verify OTP
                const otpsFilePath = join(process.cwd(), 'data', 'client-otps.json');
                let otpsData: Record<string, any> = {};
                if (existsSync(otpsFilePath)) {
                    try { otpsData = JSON.parse(readFileSync(otpsFilePath, 'utf8')); } catch (e) { }
                }

                const record = otpsData[`${clientId}_profile_update`];
                if (!record || record.otp !== otp || Date.now() > record.expiresAt || record.pendingMobile !== mobile) {
                    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
                }

                clientsData[clientIndex].mobile = record.pendingMobile;
                updated = true;

                delete otpsData[`${clientId}_profile_update`];
                writeFileSync(otpsFilePath, JSON.stringify(otpsData, null, 2));
            }
        }

        // --- EMAIL UPDATE FLOW ---
        if (emailChanged) {
            if (!otp) {
                // Generate and send OTP to new email
                const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

                // Import sendEmail directly to reuse email template
                const { sendEmail } = await import('@/lib/email');

                const subject = "Verify your new Email Address - Sunidhi Securities";
                const text = `Hello ${client.name},\n\nYou requested to update your email address on the Sunidhi Next.js Portal.\nYour verification code is: ${generatedOtp}\n\nThis code will expire in 10 minutes.`;

                const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
                        <h2>Sunidhi Securities</h2>
                        <p>Verify Email Update</p>
                    </div>
                    <div style="padding: 30px 20px; background-color: #f9fafb; text-align: center;">
                        <p>Hello ${client.name},</p>
                        <p>To confirm your requested email change, please enter the following One-Time Password (OTP):</p>
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e40af; background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px; display: inline-block;">${generatedOtp}</div>
                        <p><em>This code is valid for 10 minutes.</em></p>
                    </div>
                </div>`;

                const emailResult = await sendEmail({ to: email, subject, text, html });

                if (!emailResult) {
                    return NextResponse.json({ error: 'Failed to send verification email. Please check your SMTP configuration.' }, { status: 500 });
                }

                const otpsFilePath = join(process.cwd(), 'data', 'client-otps.json');
                let otpsData: Record<string, any> = {};
                if (existsSync(otpsFilePath)) {
                    try { otpsData = JSON.parse(readFileSync(otpsFilePath, 'utf8')); } catch (e) { }
                }

                otpsData[`${clientId}_profile_update`] = {
                    otp: generatedOtp,
                    expiresAt: Date.now() + 10 * 60 * 1000,
                    pendingEmail: email,
                };

                writeFileSync(otpsFilePath, JSON.stringify(otpsData, null, 2));
                if (updated) {
                    writeFileSync(clientsFilePath, JSON.stringify(clientsData, null, 2));
                }
                return NextResponse.json({ requiresOtpVerification: true, message: 'Verification code sent to new email' });
            } else {
                // Verify OTP
                const otpsFilePath = join(process.cwd(), 'data', 'client-otps.json');
                let otpsData: Record<string, any> = {};
                if (existsSync(otpsFilePath)) {
                    try { otpsData = JSON.parse(readFileSync(otpsFilePath, 'utf8')); } catch (e) { }
                }

                const record = otpsData[`${clientId}_profile_update`];
                if (!record || record.otp !== otp || Date.now() > record.expiresAt || record.pendingEmail !== email) {
                    return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
                }

                clientsData[clientIndex].email = record.pendingEmail;
                updated = true;

                delete otpsData[`${clientId}_profile_update`];
                writeFileSync(otpsFilePath, JSON.stringify(otpsData, null, 2));
            }
        }

        // Update password (requires current password verification)
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { error: 'Current password is required to set a new password' },
                    { status: 400 }
                );
            }

            if (newPassword.length < 8) {
                return NextResponse.json(
                    { error: 'New password must be at least 8 characters' },
                    { status: 400 }
                );
            }

            if (!client.password) {
                return NextResponse.json(
                    { error: 'No existing password on record. Please contact support.' },
                    { status: 400 }
                );
            }

            const passwordMatch = await bcrypt.compare(currentPassword, client.password);
            if (!passwordMatch) {
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            clientsData[clientIndex].password = hashedPassword;
            updated = true;
        }

        if (!updated) {
            return NextResponse.json({ message: 'No changes detected' });
        }

        writeFileSync(clientsFilePath, JSON.stringify(clientsData, null, 2));

        return NextResponse.json({
            message: 'Profile updated successfully',
            clientId: client.clientId,
            name: client.name,
            email: clientsData[clientIndex].email || '',
            mobile: clientsData[clientIndex].mobile || '',
        });
    } catch (error) {
        console.error('Client profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
