import { createLogger } from 'better-auth';
import { Role } from '../../generated/prisma/enums';
import { prisma } from '../lib/prisma';
import { auth } from '../lib/auth';
import { envVars } from '../../config/env';

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findFirst({
      where: { role: Role.Super_admin },
    });
    if (isSuperAdminExist) {
      console.log('Super admin already exists. skipping seeding super admin');
      return;
    }

    const superAdminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.SUPER_ADMIN_EMAIL,
        password: envVars.SUPER_ADMIN_PASSWORD,
        name: 'Super Admin',
        role: Role.Super_admin,
      },
    });
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: superAdminUser.user.id,
        },
        data: {
          emailVerified: true,
        },
      });
      await tx.admin.create({
        data: {
          user_id: superAdminUser.user.id,
          name: superAdminUser.user.name,
          email: envVars.SUPER_ADMIN_EMAIL,
        },
      });
    });

    const superAdmin = await prisma.admin.findFirst({
      where: {
        email: envVars.SUPER_ADMIN_EMAIL,
      },
      include: {
        user: true,
      },
    });
    console.log('Super Admin Created ', superAdmin);
  } catch (error) {
    console.log('Error seeding super admin ', error);
    await prisma.user.delete({
      where: { email: envVars.SUPER_ADMIN_EMAIL },
    });
  }
};
