import { companyRepository } from '../repositories/company.repository';

export const companyService = {
  createCompany: async (data: any) => companyRepository.create(data),

  getAllCompanies: async () => companyRepository.findAll(),

  getCompanyById: async (id: number) => companyRepository.findById(id),

  updateCompany: async (id: number, data: any) =>
    companyRepository.update(id, data),

  deleteCompany: async (id: number) => companyRepository.delete(id),
};
