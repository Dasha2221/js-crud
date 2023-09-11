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
      return true
    } else {
      return false
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
  })
})

// =================================================================

router.get('/product-list', function (req, res) {
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
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: 'Товар видалений',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
