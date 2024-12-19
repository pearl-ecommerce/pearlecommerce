const allRoles = {
  user: ['getProducts', 'searchProducts', 'manageProducts', 'getUsers', 'manageSellers', 'getStores', 'manageSellers', 'manageUsers',
    'manageCategories', 'getCategories', 'managePayments', 'getPayments', 'managePayments',
    'manageOrder', 'getOrders', 'manageSellers', 'verify-and-create-order',
    'become-seller', 'follow', 'unfollow', 'followers', 'userProducts', 'adminlogin',
    'manageBundle', 'getBundles', 'removebundle','allgetBundles',
    'managePricing', 'getPricing',
    'manageDiscount','getCarts','getDiscount','addDiscountToUser','activate','deactivate','fetchAnalyticsData'
  ],
  admin: ['manageSellers', 'adminlogin', 'adminuser', 'profile', 'logout', 'manageUsers', 'getUsers', 'activate', 'deactivate',
    'manageCart','getCarts','removecart', 'managePricing','getPricing','manageDiscount','getCarts',"userProducts",'manageProducts',
    'getProducts', 'searchProducts', 'manageProducts', 'getUsers', 'manageSellers', 'getStores', 'manageSellers', 'manageUsers',
    'manageCategories', 'getCategories', 'managePayments', 'getPayments', 'managePayments',
    'manageOrder', 'getOrders', 'manageSellers', 'verify-and-create-order',
    'become-seller', 'follow', 'unfollow', 'followers', 'userProducts', 'adminlogin',
    'manageCart', 'getCarts', 'removecart', 'managePricing', 'getPricing',
    'manageDiscount', 'getCarts', 'getDiscount', 'addDiscountToUser',
        'manageBundle', 'getBundles', 'removebundle','allgetBundles','activate','deactivate','fetchAnalyticsData'

  ],
  seller: ['getProducts', 'searchProducts', 'manageProducts', 'getUsers', 'manageSellers', 'getStores', 'manageSellers', 'manageUsers',
    'manageCategories', 'getCategories', 'managePayments', 'getPayments', 'managePayments',
    'manageOrder', 'getOrders', 'manageSellers', 'verify-and-create-order',
    'become-seller', 'follow', 'unfollow', 'followers', 'userProducts', 'adminlogin',
    'manageCart','getCarts','removecart','managePricing','getPricing','manageDiscount','getCarts','getDiscount','addDiscountToUser','manageBundle', 'getBundles', 'removebundle','allgetBundles','activate','deactivate','fetchAnalyticsData'

  ]
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
