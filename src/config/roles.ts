const allRoles = {
  user: ['getProducts', 'searchProducts', 'manageProducts', 'getUsers', 'manageSellers', 'getStores', 'manageSellers', 'manageUsers',
    'manageCategories', 'getCategories', 'managePayments', 'getPayments', 'managePayments',
    'manageOrder', 'getOrders', 'manageSellers', 'verify-and-create-order',
    'become-seller', 'follow', 'unfollow', 'followers', 'userProducts', 'adminlogin',
    'manageCart', 'getCarts', 'removecart',
    'managePricing', 'getPricing',
    'manageDiscount','getCarts'
  ],
  admin: ['manageSellers', 'adminlogin', 'adminuser', 'profile', 'logout', 'manageUsers', 'getUsers', 'activate', 'deactivate',
    'manageCart','getCarts','removecart', 'managePricing','getPricing','manageDiscount','getCarts'
  ],
  seller: ['getProducts', 'searchProducts', 'manageProducts', 'getUsers', 'manageSellers', 'getStores', 'manageSellers', 'manageUsers',
    'manageCategories', 'getCategories', 'managePayments', 'getPayments', 'managePayments',
    'manageOrder', 'getOrders', 'manageSellers', 'verify-and-create-order',
    'become-seller', 'follow', 'unfollow', 'followers', 'userProducts', 'adminlogin',
    'manageCart','getCarts','removecart','managePricing','getPricing','manageDiscount','getCarts'
  ]
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
