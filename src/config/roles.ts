const allRoles = {
  user: ['getProducts', 'searchProducts', 'manageProducts', 'getUsers', 'manageSellers', 'getStores', 'manageSellers', 'manageUsers',
    'manageCategories', 'getCategories', 'managePayments', 'getPayments', 'managePayments',
    'manageOrder', 'getOrders', 'manageSellers', 'verify-and-create-order',
    'become-seller','follow','unfollow','followers','userProducts'
  ],
  admin: ['manageSellers'],
  seller: ['getProducts', 'searchProducts', 'manageProducts', 'getUsers', 'manageSellers', 'getStores', 'manageSellers', 'manageUsers',
    'manageCategories', 'getCategories', 'managePayments', 'getPayments', 'managePayments',
    'manageOrder', 'getOrders', 'manageSellers', 'verify-and-create-order',
    'become-seller','follow','unfollow','followers','userProducts'
  ]
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
