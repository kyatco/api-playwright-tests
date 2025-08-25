Feature: Products API
# API 1

  @api1
  Scenario: Get all products list
    When I send a "GET" request to "/productsList"
    Then the response status should be 200
    And the response should contain "products"
  # API 2

  @api2
  Scenario: POST To All Products List should return 405
    When I send a "POST" request to "/api/productsList"
    Then the response status should be 405
    And the response should contain message "This request method is not supported."
  # API 3

  Scenario: Get All Brands List should return 200
    When I send a "GET" request to "/api/brandsList"
    Then the response status should be 200
    And the response should contain "brands"
  # API 4

  Scenario: PUT To All Brands List should return 405
    When I send a "PUT" request to "/api/brandsList"
    Then the response status should be 405
    And the response should contain message "This request method is not supported."
  # API 5

  Scenario Outline: POST To Search Product should return 200 with results
    When I send a "POST" request to "/api/searchProduct" with body:
      | search_product | <term> |
    Then the response status should be 200
    And the response should contain "products"

    Examples:
      | term   |
      | top    |
      | tshirt |
      | jean   |
  # API 6

  Scenario: POST To Search Product without search_product parameter should return 400
    When I send a POST request to "/api/searchProduct" with body:
      | dummy | test |
    Then the response status should be 400
    And the response should contain message "Bad request, search_product parameter is missing in POST request."
  # API 7

  Scenario: POST To Verify Login with valid details should return 200
    When I send a "POST" request to "/api/verifyLogin" with body:
      | email    | test@example.com |
      | password |           123456 |
    Then the response status should be 200
    And the response should contain message "User exists!"
  # API 8

  Scenario: POST To Verify Login without email should return 400
    When I send a "POST" request to "/api/verifyLogin" with body:
      | password | 123456 |
    Then the response status should be 400
    And the response should contain message "Bad request, email or password parameter is missing in POST request."
  # API 9

  Scenario: DELETE To Verify Login should return 405
    When I send a "DELETE" request to "/api/verifyLogin"
    Then the response status should be 405
    And the response should contain message "This request method is not supported."
  # API 10

  Scenario: POST To Verify Login with invalid details should return 404
    When I send a "POST" request to "/api/verifyLogin" with body:
      | email    | wrong@example.com |
      | password | wrongpass         |
    Then the response status should be 404
    And the response should contain message "User not found!"
  # API 11

  Scenario: POST To Create/Register User Account should return 201
    When I send a "POST" request to "/api/createAccount" with body:
      | name          | John          |
      | email         | john@test.com |
      | password      |        123456 |
      | title         | Mr            |
      | birth_date    |            01 |
      | birth_month   |            01 |
      | birth_year    |          1990 |
      | firstname     | John          |
      | lastname      | Doe           |
      | company       | TestCo        |
      | address1      | Street 1      |
      | address2      | Apt 101       |
      | country       | USA           |
      | zipcode       |         12345 |
      | state         | NY            |
      | city          | New York      |
      | mobile_number |    1234567890 |
    Then the response status should be 201
    And the response should contain message "User created!"
  # API 12

  Scenario: DELETE User Account should return 200
    When I send a "DELETE" request to "/api/deleteAccount" with body:
      | email    | john@test.com |
      | password |        123456 |
    Then the response status should be 200
    And the response should contain message "Account deleted!"
  # API 13

  Scenario: PUT To Update User Account should return 200
    When I send a "PUT" request to "/api/updateAccount" with body:
      | name     | John Updated  |
      | email    | john@test.com |
      | password |        123456 |
      | city     | LA            |
    Then the response status should be 200
    And the response should contain message "User updated!"
  # API 14

  Scenario: GET user account detail by email should return 200
    When I send a "GET" request to "/api/getUserDetailByEmail?email=john@test.com"
    Then the response status should be 200
    And the response should contain "user"
