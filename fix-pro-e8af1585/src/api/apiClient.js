// Simple API client replacement for Base44
// Using localStorage for data persistence in this demo

class APIClient {
  constructor() {
    this.storagePrefix = 'logistics_app_';
    this.initializeData();
  }

  // Initialize default data if not exists
  initializeData() {
    this.initializeCustomers();
    this.initializeOrders();
    this.initializeConversations();
    this.initializeMessages();
    this.initializeDeliveries();
    this.initializeCargoItems();
    this.initializeSettings();
  }

  initializeCustomers() {
    const storageKey = this.storagePrefix + 'customers';
    if (!localStorage.getItem(storageKey)) {
      const sampleCustomers = [
        {
          id: '1',
          name: 'חברת ABC בע"מ',
          email: 'contact@abc.co.il',
          phone: '03-1234567',
          address: 'רחוב הרצל 123, תל אביב',
          created_date: '2024-01-15T10:00:00Z'
        },
        {
          id: '2', 
          name: 'חברת XYZ בע"מ',
          email: 'info@xyz.co.il',
          phone: '02-9876543',
          address: 'רחוב בן גוריון 456, ירושלים',
          created_date: '2024-01-10T14:30:00Z'
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(sampleCustomers));
    }
  }

  initializeOrders() {
    const storageKey = this.storagePrefix + 'orders';
    if (!localStorage.getItem(storageKey)) {
      const sampleOrders = [
        {
          id: '1',
          customer_id: '1',
          order_number: 'ORD-001',
          status: 'pending',
          total_amount: 5000,
          created_date: '2024-01-20T08:00:00Z'
        },
        {
          id: '2',
          customer_id: '2', 
          order_number: 'ORD-002',
          status: 'completed',
          total_amount: 3500,
          created_date: '2024-01-18T11:15:00Z'
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(sampleOrders));
    }
  }

  initializeConversations() {
    const storageKey = this.storagePrefix + 'conversations';
    if (!localStorage.getItem(storageKey)) {
      const sampleConversations = [
        {
          id: '1',
          name: 'דיון עם ABC',
          customer_id: '1',
          last_message_time: '2024-01-21T15:30:00Z',
          unread_count: 2
        },
        {
          id: '2',
          name: 'דיון עם XYZ',
          customer_id: '2',
          last_message_time: '2024-01-20T12:45:00Z',
          unread_count: 0
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(sampleConversations));
    }
  }

  initializeMessages() {
    const storageKey = this.storagePrefix + 'messages';
    if (!localStorage.getItem(storageKey)) {
      const sampleMessages = [
        {
          id: '1',
          conversation_id: '1',
          sender_name: 'לקוח ABC',
          content: 'שלום, אני מעוניין לבדוק את סטטוס ההזמנה',
          timestamp: '2024-01-21T15:25:00Z'
        },
        {
          id: '2',
          conversation_id: '1', 
          sender_name: 'אתה',
          content: 'שלום! ההזמנה שלך בטיפול ותישלח מחר',
          timestamp: '2024-01-21T15:30:00Z'
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(sampleMessages));
    }
  }

  initializeDeliveries() {
    const storageKey = this.storagePrefix + 'deliveries';
    if (!localStorage.getItem(storageKey)) {
      const sampleDeliveries = [
        {
          id: '1',
          customer_id: '1',
          delivery_number: 'TRIP-001',
          status: 'completed',
          origin: 'רחוב הרצל 15, תל אביב',
          destination: 'רחוב בן גוריון 30, רמת גן',
          created_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          vehicle_name: 'טויוטה קורולה',
          driver_name: 'יוני לוי'
        },
        {
          id: '2',
          customer_id: '2',
          delivery_number: 'TRIP-002',
          status: 'in_transit',
          origin: 'דיזנגוף סנטר, תל אביב',
          destination: 'קניון מלחה, ירושלים',
          created_date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          vehicle_name: 'סקודה אוקטביה',
          driver_name: 'יוני לוי'
        },
        {
          id: '3',
          customer_id: '1',
          delivery_number: 'TRIP-003',
          status: 'completed',
          origin: 'נמל התעופה בן גוריון',
          destination: 'מלון הילטון, תל אביב',
          created_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          vehicle_name: 'מרצדס E-Class',
          driver_name: 'יוני לוי'
        },
        {
          id: '4',
          customer_id: '2',
          delivery_number: 'TRIP-004',
          status: 'pending',
          origin: 'תחנה מרכזית חדשה, תל אביב',
          destination: 'קריון, קרית ביאליק',
          created_date: new Date().toISOString(),
          vehicle_name: 'טויוטה קורולה',
          driver_name: 'יוני לוי'
        },
        {
          id: '5',
          customer_id: '1',
          delivery_number: 'TRIP-005',
          status: 'completed',
          origin: 'עזריאלי, תל אביב',
          destination: 'ביג פאשן, אשדוד',
          created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          vehicle_name: 'סקודה אוקטביה',
          driver_name: 'יוני לוי'
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(sampleDeliveries));
    }
  }

  initializeCargoItems() {
    const storageKey = this.storagePrefix + 'cargo_items';
    if (!localStorage.getItem(storageKey)) {
      const sampleCargoItems = [
        {
          id: '1',
          delivery_id: '1',
          name: 'חבילה A',
          weight: 2.5,
          dimensions: '30x20x15',
          status: 'loaded'
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(sampleCargoItems));
    }
  }

  initializeSettings() {
    const storageKey = this.storagePrefix + 'settings';
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify([]));
    }

    // Initialize user data
    if (!localStorage.getItem(this.storagePrefix + 'user')) {
      localStorage.setItem(this.storagePrefix + 'user', JSON.stringify({
        id: '1',
        full_name: 'משתמש ראשי',
        email: 'user@example.com',
        phone: '050-1234567',
        company: 'החברה שלי',
        address: 'כתובת לדוגמה',
        bio: 'תיאור המשתמש'
      }));
    }
  }

  // Generic CRUD operations
  async list(entityType, sortBy = null) {
    const data = JSON.parse(localStorage.getItem(this.storagePrefix + entityType) || '[]');
    if (sortBy) {
      return this.sortData(data, sortBy);
    }
    return data;
  }

  async create(entityType, data) {
    const existingData = JSON.parse(localStorage.getItem(this.storagePrefix + entityType) || '[]');
    const newItem = {
      ...data,
      id: Date.now().toString(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    existingData.push(newItem);
    localStorage.setItem(this.storagePrefix + entityType, JSON.stringify(existingData));
    return newItem;
  }

  async update(entityType, id, data) {
    const existingData = JSON.parse(localStorage.getItem(this.storagePrefix + entityType) || '[]');
    const index = existingData.findIndex(item => item.id === id);
    if (index !== -1) {
      existingData[index] = {
        ...existingData[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      localStorage.setItem(this.storagePrefix + entityType, JSON.stringify(existingData));
      return existingData[index];
    }
    throw new Error('Item not found');
  }

  async delete(entityType, id) {
    const existingData = JSON.parse(localStorage.getItem(this.storagePrefix + entityType) || '[]');
    const filteredData = existingData.filter(item => item.id !== id);
    localStorage.setItem(this.storagePrefix + entityType, JSON.stringify(filteredData));
    return true;
  }

  async filter(entityType, filters, sortBy = null) {
    let data = JSON.parse(localStorage.getItem(this.storagePrefix + entityType) || '[]');
    
    // Apply filters
    if (filters) {
      Object.keys(filters).forEach(key => {
        data = data.filter(item => item[key] === filters[key]);
      });
    }

    if (sortBy) {
      data = this.sortData(data, sortBy);
    }

    return data;
  }

  // User authentication mock
  async updateMyUserData(userData) {
    const currentUser = JSON.parse(localStorage.getItem(this.storagePrefix + 'user') || '{}');
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem(this.storagePrefix + 'user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  async getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.storagePrefix + 'user') || '{}');
  }

  // Helper method for sorting
  sortData(data, sortBy) {
    const isDescending = sortBy.startsWith('-');
    const field = isDescending ? sortBy.substring(1) : sortBy;
    
    return [...data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      
      // Handle dates
      if (field.includes('date') || field.includes('time')) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (aVal < bVal) return isDescending ? 1 : -1;
      if (aVal > bVal) return isDescending ? -1 : 1;
      return 0;
    });
  }
}

export const apiClient = new APIClient();