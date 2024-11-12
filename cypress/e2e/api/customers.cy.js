describe('EngageSphere API - GET /customers', () => {
  const CUSTOMERS_API_URL = `${Cypress.env('API_URL')}/customers`

  context('Successful scenarios', () => {
    it('verifies structure of default customer list response', () => {
      cy.request('GET', `${CUSTOMERS_API_URL}`).then((response) => {
        const { status, body: { customers, pageInfo } } = response

        expect(status).to.eq(200)
        expect(customers).to.be.an('array')
        expect(pageInfo).to.be.an('object')

        customers.forEach((customer) => {
          expect(customer).to.have.all.keys('id', 'name', 'employees', 'contactInfo', 'size', 'industry', 'address')
        })

        expect(pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers')
      })
    })

    it('fetches customers with specific page and validates current page in pageInfo', () => {
      cy.request('GET', `${CUSTOMERS_API_URL}?page=2`).then((response) => {
        const { body: { pageInfo: { currentPage } } } = response
        expect(currentPage).to.eq(2)
      })
    })

    it('limits customer records per page and verifies response length', () => {
      cy.request('GET', `${CUSTOMERS_API_URL}?limit=5`).then((response) => {
        const { body: { customers } } = response
        expect(customers).to.have.length(5)
      })
    })

    it('fetches customers filtered by size and validates size of each customer', () => {
      cy.request('GET', `${CUSTOMERS_API_URL}?size=Medium`).then((response) => {
        const { body: { customers } } = response
        customers.forEach(({ size }) => {
          expect(size).to.eq('Medium')
        })
      })
    })

    it('fetches customers filtered by industry and validates industry of each customer', () => {
      cy.request('GET', `${CUSTOMERS_API_URL}?industry=Technology`).then((response) => {
        const { body: { customers } } = response
        customers.forEach(({ industry }) => {
          expect(industry).to.eq('Technology')
        })
      })
    })

    it('fetches customers on specific page with limit and verifies structure and length', () => {
      cy.request('GET', `${CUSTOMERS_API_URL}?page=3&limit=3`).then((response) => {
        const { status, body: { customers, pageInfo: { currentPage } } } = response

        expect(status).to.eq(200)
        expect(customers).to.be.an('array').with.lengthOf(3)
        expect(currentPage).to.eq(3)

        customers.forEach((customer) => {
          expect(customer).to.have.all.keys('id', 'name', 'employees', 'contactInfo', 'size', 'industry', 'address')
        })
      })
    })
  })

  context('Error scenarios', () => {
    it('validates error response structure and message for invalid page parameter', () => {
      cy.request({
        method: 'GET',
        url: `${CUSTOMERS_API_URL}?page=-1`,
        failOnStatusCode: false
      }).then((response) => {
        const { status, body: { error } } = response
        expect(status).to.eq(400)
        expect(error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('validates error response structure and message for invalid limit parameter', () => {
      cy.request({
        method: 'GET',
        url: `${CUSTOMERS_API_URL}?limit=-5`,
        failOnStatusCode: false
      }).then((response) => {
        const { status, body: { error } } = response
        expect(status).to.eq(400)
        expect(error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('validates error response structure and message for page parameter equal to zero', () => {
      cy.request({
        method: 'GET',
        url: `${CUSTOMERS_API_URL}?page=0`,
        failOnStatusCode: false
      }).then((response) => {
        const { status, body: { error } } = response
        expect(status).to.eq(400)
        expect(error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('validates error response structure and message for limit parameter equal to zero', () => {
      cy.request({
        method: 'GET',
        url: `${CUSTOMERS_API_URL}?limit=0`,
        failOnStatusCode: false
      }).then((response) => {
        const { status, body: { error } } = response
        expect(status).to.eq(400)
        expect(error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('validates error response structure and message for unsupported size parameter', () => {
      cy.request({
        method: 'GET',
        url: `${CUSTOMERS_API_URL}?size=InvalidSize`,
        failOnStatusCode: false
      }).then((response) => {
        const { status, body: { error } } = response
        expect(status).to.eq(400)
        expect(error).to.eq('Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.')
      })
    })

    it('validates error response structure and message for invalid industry parameter', () => {
      cy.request({
        method: 'GET',
        url: `${CUSTOMERS_API_URL}?industry=UnknownIndustry`,
        failOnStatusCode: false
      }).then((response) => {
        const { status, body: { error } } = response
        expect(status).to.eq(400)
        expect(error).to.eq('Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.')
      })
    })
  })
})
