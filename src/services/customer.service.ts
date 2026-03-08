import { customerRepository } from '../repositories/customer.repository';

export const customerService = {
  createCustomer: async (data: any) => customerRepository.create(data),

  getAllCustomers: async (outletId?: number) =>
    customerRepository.findAll(outletId),

  getCustomerById: async (id: number) => customerRepository.findById(id),

  updateCustomer: async (id: number, data: any) =>
    customerRepository.update(id, data),

  deleteCustomer: async (id: number) => customerRepository.delete(id),
};
