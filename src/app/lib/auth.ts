import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma.js';
import { envVars } from '../../config/env.js';
import { emailOTP } from 'better-auth/plugins';
import { sendEmail } from '../utils/email.js';
import AppError from '../errorHelpers/appError.js';
import status from 'http-status';
import { Role, UserStatus } from '../../generated/prisma/index.js';

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [envVars.FRONTEND_URL as string],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    },
  },
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: Role.Learner,
      },
      status: {
        type: 'string',
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      isDeleted: {
        type: 'boolean',
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: 'date',
        required: false,
        defaultValue: null,
      },
    },
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'email-verification') {
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (!user) {
            console.error(
              `User with ${email} is not found. Cannot send verification OTP`,
            );
            throw new AppError(
              status.NOT_FOUND,
              "user doesn't exist with this email",
            );
          }
          if (user && user.role === Role.Super_admin) {
            console.log(
              `User with email ${email} is a super admin. Skipping sending OTP`,
            );
            return;
          }
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: 'Verify your email',
              templateName: 'otp',
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === 'forget-password') {
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (!user) {
            throw new AppError(
              status.NOT_FOUND,
              "user doesn't exist with this email",
            );
          }
          sendEmail({
            to: email,
            subject: 'Password reset OTP',
            templateName: 'otp',
            templateData: {
              name: user.name,
              otp,
            },
          });
        }
      },
      expiresIn: 5 * 60,
      otpLength: 6,
    }),
  ],
  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: 'none',
          secure: true,
          httpOnly: true,
          path: '/',
        },
      },
      sessionToken: {
        attributes: {
          sameSite: 'none',
          secure: true,
          httpOnly: true,
          path: '/',
        },
      },
    },
  },
});
