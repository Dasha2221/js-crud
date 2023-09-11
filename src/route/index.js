// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

class Product {
  #list = []

  constructor(id, name, price, description) {
    this.id =
      id || Math.floor(Math.random() * 90000) + 10000 // Генеруємо id, якщо він не був переданий
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description

    this.#list.push(this)
  }

  // Метод для отримання списку створених товарів
  static getList() {
    return this.#list
  }

  // Метод для додавання товару до списку
  static add(product) {
    this.#list.push(product)
  }

  // Метод для отримання товару за ID
  static getById(id) {
    return this.#list.find((product) => product.id === id)
  }

  // Метод для оновлення товару за ID
  static updateById(id, data) {
    const product = this.getById(id)
    if (product) {
      if (data.price !== undefined)
        product.price = data.price
      if (data.name !== undefined) product.name = data.name
      if (data.description !== undefined)
        product.description = data.description
    }
  }

  // Метод для видалення товару за ID
  static deleteById(id) {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
    }
  }
}

// =================================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
  })
})

// =================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('sueccess-info', {
    style: 'sueccess-info',
    info: 'Користувач видалений',
  })
})

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('sueccess-info', {
    style: 'sueccess-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Сталася помилка',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
