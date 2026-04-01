import { Category } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';

const createCategory = async (payload: Category) => {
  return await prisma.category.create({
    data: payload,
  });
};

const getAllCategory = async () => {
  return await prisma.category.findMany();
};

const getCategoryById = async (category_id: string) => {
  return await prisma.category.findUniqueOrThrow({
    where: { id: category_id },
    include: { courses: true },
  });
};

const updateCategory = async (title: string, category_id: string) => {
  return await prisma.category.update({
    where: { id: category_id },
    data: {
      title,
    },
  });
};

const deleteCategory = async (category_id: string) => {
  return await prisma.category.delete({
    where: { id: category_id },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
