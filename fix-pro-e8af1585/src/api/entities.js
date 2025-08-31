import { apiClient } from './apiClient';

// Entity classes that work with our local API client
class BaseEntity {
  constructor(entityType) {
    this.entityType = entityType;
  }

  async list(sortBy = null) {
    return await apiClient.list(this.entityType, sortBy);
  }

  async create(data) {
    return await apiClient.create(this.entityType, data);
  }

  async update(id, data) {
    return await apiClient.update(this.entityType, id, data);
  }

  async delete(id) {
    return await apiClient.delete(this.entityType, id);
  }

  async filter(filters, sortBy = null) {
    return await apiClient.filter(this.entityType, filters, sortBy);
  }
}

// User entity with special auth methods
class UserEntity {
  async updateMyUserData(userData) {
    return await apiClient.updateMyUserData(userData);
  }

  async getCurrentUser() {
    return await apiClient.getCurrentUser();
  }
}

// Export entity instances
export const Customer = new BaseEntity('customers');
export const Order = new BaseEntity('orders');
export const Message = new BaseEntity('messages');
export const Conversation = new BaseEntity('conversations');
export const Delivery = new BaseEntity('deliveries');
export const CargoItem = new BaseEntity('cargo_items');
export const Setting = new BaseEntity('settings');

// User auth entity
export const User = new UserEntity();