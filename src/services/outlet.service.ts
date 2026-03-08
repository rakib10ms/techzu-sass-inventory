import { outletRepository } from '../repositories/outlet.repository';

export const outletService = {
  createOutlet: async (data: any) => outletRepository.create(data),

  getAllOutlets: async () => outletRepository.findAll(),

  getOutletById: async (id: number) => outletRepository.findById(id),

  updateOutlet: async (id: number, data: any) =>
    outletRepository.update(id, data),

  deleteOutlet: async (id: number) => outletRepository.delete(id),
};
