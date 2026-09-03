import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendSmsOTP } from '@/lib/sms';
import { findClientById, updateClient, setOtp, getOtp, deleteOtp } from '@/lib/client-db';
import { generateOtp } from '@/lib/client-otp';

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

        const client = findClientById(clientId);

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

        const client = findClientById(clientId);

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Accumulated as the various update paths below run; written via a single
        // updateClient() call (or one per early-return point), instead of mutating
        // an in-memory array element the way the old JSON-file version did.
        const pendingUpdates: Record<string, unknown> = {};
        let updated = false;

        const mobileChanged = mobile !== undefined && mobile !== client.mobile;
        const emailChanged = email !== undefined && email !== client.email;
        const nameChanged = name !== undefined && name !== client.name && name.trim() !== '';

        if (mobileChanged && emailChanged) {
            return NextResponse.json({ error: 'Please update one contact method at a time for security verification.' }, { status: 400 });
        }

        if (nameChanged) {
            pendingUpdates.name = name.trim();
            updated = true;
        }

        // --- MOBILE UPDATE FLOW ---
        if (mobileChanged) {
            if (!otp) {
                // Generate and send OTP to new mobile
                const generatedOtp = generateOtp();
                const smsResult = await sendSmsOTP(mobile, generatedOtp);

                if (!smsResult.success) {
                    return NextResponse.json({ error: 'Failed to send OTP to the new mobile number' }, { status: 500 });
                }

                setOtp(`${clientId}_profile_update`, generatedOtp, Date.now() + 10 * 60 * 1000, { pendingMobile: mobile });
                if (updated) {
                    updateClient(clientId, pendingUpdates);
                }
                return NextResponse.json({ requiresOtpVerification: true, message: 'OTP sent to new mobile number' });
            } else {
                // Verify OTP
                const record = getOtp(`${clientId}_profile_update`);
                const pendingMobile = record?.extra?.pendingMobile;
                if (!record || record.otp !== otp || Date.now() > record.expiresAt || pendingMobile !== mobile) {
                    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
                }

                pendingUpdates.mobile = pendingMobile;
                updated = true;

                deleteOtp(`${clientId}_profile_update`);
            }
        }

        // --- EMAIL UPDATE FLOW ---
        if (emailChanged) {
            if (!otp) {
                // Generate and send OTP to new email
                const generatedOtp = generateOtp();

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

                setOtp(`${clientId}_profile_update`, generatedOtp, Date.now() + 10 * 60 * 1000, { pendingEmail: email });
                if (updated) {
                    updateClient(clientId, pendingUpdates);
                }
                return NextResponse.json({ requiresOtpVerification: true, message: 'Verification code sent to new email' });
            } else {
                // Verify OTP
                const record = getOtp(`${clientId}_profile_update`);
                const pendingEmail = record?.extra?.pendingEmail;
                if (!record || record.otp !== otp || Date.now() > record.expiresAt || pendingEmail !== email) {
                    return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
                }

                pendingUpdates.email = pendingEmail;
                updated = true;

                deleteOtp(`${clientId}_profile_update`);
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
            pendingUpdates.password = hashedPassword;
            updated = true;
        }

        if (!updated) {
            return NextResponse.json({ message: 'No changes detected' });
        }

        const savedClient = updateClient(clientId, pendingUpdates)!;

        return NextResponse.json({
            message: 'Profile updated successfully',
            clientId: savedClient.clientId,
            name: savedClient.name,
            email: savedClient.email || '',
            mobile: savedClient.mobile || '',
        });
    } catch (error) {
        console.error('Client profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
