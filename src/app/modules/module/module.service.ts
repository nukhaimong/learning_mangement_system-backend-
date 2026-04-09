import status from 'http-status';
import AppError from '../../errorHelpers/appError.js';
import { prisma } from '../../lib/prisma.js';
import {
  ICreateModulePayload,
  IInsertModulePayload,
} from './module.inteface.js';
import { IRequestUser } from '../../interfaces/requestUser.interface.js';
import { Prisma } from '@prisma/client/extension.js';

const createModule = async (
  user: IRequestUser,
  payload: ICreateModulePayload,
) => {
  const courseExist = await prisma.course.findUnique({
    where: { id: payload.course_id },
    include: {
      instructor: {
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!courseExist) {
    throw new AppError(status.NOT_FOUND, 'Course not found for this module');
  }

  if (user.user_id !== courseExist.instructor.user.id) {
    throw new AppError(
      status.UNAUTHORIZED,
      'You can only create your course module',
    );
  }

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const lastModule = await tx.module.findFirst({
      where: {
        course_id: payload.course_id,
      },
      orderBy: {
        order_index: 'desc',
      },
    });

    const nextIndex = (lastModule?.order_index ?? 0) + 100;

    return await tx.module.create({
      data: {
        ...payload,
        order_index: nextIndex,
      },
    });
  });
};

const getModulesByCourseId = async (course_id: string) => {
  return await prisma.module.findMany({
    where: { course_id },
    orderBy: {
      order_index: 'asc',
    },
  });
};

const insertModule = async (
  user: IRequestUser,
  payload: IInsertModulePayload,
  module_id: string,
) => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const moduleExist = await tx.module.findUnique({
      where: { id: module_id },
    });

    if (!moduleExist) {
      throw new AppError(status.NOT_FOUND, 'Module not found');
    }

    const courseExist = await tx.course.findUnique({
      where: { id: moduleExist.course_id },
      include: {
        instructor: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!courseExist) {
      throw new AppError(status.NOT_FOUND, 'Course not found for this module');
    }

    if (user.user_id !== courseExist.instructor.user.id) {
      throw new AppError(
        status.UNAUTHORIZED,
        'You can only insert your course module',
      );
    }

    const nextModule = await tx.module.findFirst({
      where: {
        course_id: moduleExist.course_id,
        order_index: {
          gt: moduleExist.order_index,
        },
      },
      orderBy: {
        order_index: 'asc',
      },
    });

    const insertModuleIndex = nextModule
      ? (moduleExist.order_index + nextModule.order_index) / 2
      : moduleExist.order_index + 100;

    return await tx.module.create({
      data: {
        ...payload,
        course_id: moduleExist.course_id,
        order_index: insertModuleIndex,
      },
    });
  });
};

const updateModule = async (
  user: IRequestUser,
  title: string,
  module_id: string,
) => {
  const moduleExist = await prisma.module.findUnique({
    where: { id: module_id },
    include: {
      course: {
        include: {
          instructor: {
            include: {
              user: {
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  if (!moduleExist) {
    throw new AppError(status.NOT_FOUND, 'Module not found');
  }

  if (user.user_id !== moduleExist.course.instructor.user.id) {
    throw new AppError(
      status.UNAUTHORIZED,
      'You can only update your course module',
    );
  }

  return await prisma.module.update({
    where: {
      id: module_id,
    },
    data: {
      title: title,
    },
  });
};

const deleteModule = async (user: IRequestUser, module_id: string) => {
  const moduleExist = await prisma.module.findUnique({
    where: { id: module_id },
    include: {
      course: {
        include: {
          instructor: {
            include: {
              user: {
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  if (!moduleExist) {
    throw new AppError(status.NOT_FOUND, 'Module not found');
  }

  if (user.user_id !== moduleExist.course.instructor.user.id) {
    throw new AppError(
      status.UNAUTHORIZED,
      'You can only delete your course module',
    );
  }

  return await prisma.module.delete({
    where: { id: module_id },
  });
};

export const ModuleService = {
  createModule,
  insertModule,
  updateModule,
  deleteModule,
  getModulesByCourseId,
};
