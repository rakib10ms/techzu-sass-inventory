import { roleRepository } from '../repositories/role.repository';

export const roleService = {
  createRole: async (data: any) => {
    return await roleRepository.create(data);
  },

  getAllRoles: async () => {
    return await roleRepository.findAll();
  },

  getRoleById: async (id: number) => {
    const role = await roleRepository.findById(id);
    if (!role) throw new Error('Role not found');
    return role;
  },

  updateRole: async (id: number, data: any) => {
    return await roleRepository.update(id, data);
  },

  deleteRole: async (id: number) => {
    return await roleRepository.delete(id);
  },
};
