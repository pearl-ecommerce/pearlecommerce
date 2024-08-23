const allRoles = {
  user: ['getProducts', 'searchProducts', 'manageProducts', 'getUsers', 'manageSellers', 'getStores', 'manageSellers', 'manageUsers',
    'manageCategories', 'getCategories', 'manageCategories', 'managePayments', 'getPayments', 'managePayments',
    'manageOrder','getOrders','manageSellers','verify-and-create-order'
  ],
  admin: [],
  seller: []
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
