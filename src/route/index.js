// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count // Генеруємо унікальний id для товару
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    // console.log('Searching for product with id:', id)
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    // Фільтруємо товари, щоб вилучити той, з яким порівнюємо id
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    // Відсортовуємо за допомогою Math.random() та перемашаємо масив
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    // Повертаємо перші 3 елементи з перемішаного масиву
    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [{ id: 2, text: 'Топ продажів' }],
  17000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ...`,
  [{ id: 1, text: 'Готовий до відправки' }],
  113109,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email
    this.delivery = data.delivery

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice

    this.amount = data.amount
    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    // Оновлення об'єкту product після успішної покупки
    newPurchase.product.amount -= newPurchase.amount

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse().map((purchase) => ({
      id: purchase.id,
      product: purchase.product.title,
      totalPrice: purchase.totalPrice,
      bonus: Purchase.calcBonusAmount(purchase.totalPrice),
    }))
  }

  static getById = (id) => {
    return this.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email
      if (data.delivery) purchase.delivery = data.delivery

      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}
Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNTSO', 0.5)
Promocode.add('SALE25', 0.75)

// =============================================================================

// router.get Створює нам один ентпоїнт
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',

    data: {
      products: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 100000) // Генеруємо id, якщо він не був переданий
    this.createDate = () => {
      this.date = new Date().toISOString()
    }
  }

  // Метод для отримання списку створених товарів
  static getList = () => this.#list

  checkId = (id) => this.id === id

  // Метод для додавання товару до списку
  static add = (product) => {
    this.#list.push(product)
  }

  // Метод для отримання товару за ID
  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)
  }

  // Метод для оновлення товару за ID

  static deleteById(id) {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
    }
  }
}
class User {
  static #List = []

  static add = (user) => {
    this.#List.push(user)
  }

  static getList = () => this.#List

  static getById = (id) =>
    this.#List.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#List.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#List.splice(index, 1)

      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = this.getById(id)
    const { name } = data

    if (product) {
      if (name) {
        product.name = name
      }

      const user = this.getById(id)

      if (user) {
        this.update(user, data)

        return true
      } else {
        return false
      }
    }
  }
  static update = (name, { product }) => {
    if (name) {
      product.name = name
    }
  }
}
// =================================================================

// =================================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})
//====================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: 'Товар успішно додано',
    // static update = (user, { email }) => {
    //   if (email) {
    //     user.email = email
    //   }
    // }
  })
})

// =================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('sueccess-info', {
    style: 'sueccess-info',
    info: 'Користувач створений',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/purchase-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  const list = Product.getList()

  console.log(list)
  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// =================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  console.log(product)

  if (product) {
    return res.render('product-edit', {
      style: 'product-edit',

      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('alert', {
      style: 'alert',
      info: 'Продукту за таким ID не знадено',
    })
  }
})

router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  const product = Product.updateById(
    Number(id),
    name,
    price,
    description,
  )

  console.log(id)
  console.log(product)

  if (product) {
    res.render('alert', {
      style: 'alert',
      info: 'Інформація про товар оновлена',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Сталася помилка',
    })
  }
})

router.get('/product-delete', function (req, res) {
  router.get('/user-delete', function (req, res) {
    const { id } = req.query

    User.deleteById(Number(id))
    res.render('alert', {
      style: 'alert',
      info: 'Товар видалений',
    })
  })

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',

      data: {
        link: `/purchase-product?id=${id}`,
        title: 'Помилка',
        info: 'Некоректна кількість товару',
      },
    })
  }
  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',

      data: {
        link: `/purchase-product?id=${id}`,
        title: 'Помилка',
        info: 'Такої кількості товару немає в намявнсисті',
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: product.price,
        },
        {
          text: 'Вартість доставки',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      amount,
      bonus,
      deliveryPrice: Purchase.DELIVERY_PRICE,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',

      data: {
        link: '/purchase-list',
        title: 'Помилка',
        info: 'Товар не знайдено',
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        link: '/purchase-list',
        title: 'Помилка',
        info: 'Товару немає в потрібній кількості',
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',

      data: {
        link: '/purchase-list',
        title: 'Помилка',
        info: 'Некорректні данні',
      },
    })
  }

  if ((!firstname, !lastname, !email, !phone)) {
    return res.render('alert', {
      style: 'alert',

      data: {
        link: '/purchase-list',
        title: "Заповніть обов'язкові поля",
        info: 'Некорректні данні',
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',

    data: {
      link: '/purchase-list',
      title: 'Успішне виконання дії',
      info: 'Замовлення створене',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/purchase-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  // console.log(bonus)

  const list = Purchase.getList()
  console.log('purchase-list:', list)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',
    component: ['heading', 'purchase-item', 'divider'],
    title: 'Мої замовлення',

    data: {
      purchases: {
        list,
      },
      // bonus, // Отримати bonusAmount з параметрів URL
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)
  // res.render генерує нам HTML сторінку

  const purchase = Purchase.getById(id)

  console.log(purchase)

  if (purchase) {
    res.render('purchase-info', {
      style: 'purchase-info',
      data: {
        id: purchase.id,
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        phone: purchase.phone,
        email: purchase.email,
        product: purchase.product.title,
        comment: purchase.comment,
        productPrice: purchase.productPrice,
        totalPrice: purchase.totalPrice,
        delivery: purchase.delivery,
        bonus: purchase.bonus,
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      data: {
        link: '/purchase-list',
        title: 'Замовлення не знайдено',
        info: 'Помилка',
      },
    })
  }
  // ↑↑ сюди вводимо JSON дані
})

// =======================================================================

// router.get Створює нам один ентпоїнт
router.get('/purchase-change', function (req, res) {
  const id = Number(req.query.id)
  // Отримуємо дані покупки за допомогою getById
  const purchase = Purchase.getById(id)

  if (purchase) {
    res.render('purchase-change', {
      style: 'purchase-change',
      data: {
        id: purchase.id,
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        phone: purchase.phone,
        email: purchase.email,
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      data: {
        link: '/purchase-list',
        title: 'Замовлення не знайдено',
        info: 'Помилка',
      },
    })
  }
})

// Оновлення даних покупки за допомогою POST-запиту
router.post('/purchase-change', function (req, res) {
  const id = Number(req.body.id) // Отримуємо ID з форми
  // Отримуємо нові дані з форми
  const { firstname, lastname, phone, email } = req.body

  // Викликаємо метод updateById для оновлення даних покупки
  const updated = Purchase.updateById(id, {
    firstname,
    lastname,
    phone,
    email,
  })

  if (updated) {
    // Якщо дані успішно оновлено, перенаправляємо користувача на сторінку із списком покупок або іншу потрібну сторінку
    res.redirect('/purchase-list')
  } else {
    // Якщо не вдалося знайти покупку за ID, виводимо повідомлення про помилку
    res.render('alert', {
      style: 'alert',
      data: {
        link: '/purchase-list',
        title: 'Помилка',
        info: 'Покупку не вдалося оновити',
      },
    })
  }
})
// Підключаємо роутер до бек-енду
module.exports = router
