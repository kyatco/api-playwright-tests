Feature: Products API

  Scenario: Get all products list
    When I send a GET request to "/productsList"
    Then the response status should be 200
    And the response should contain "products"
