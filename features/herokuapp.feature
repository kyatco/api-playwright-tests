@heroku
Feature: API testing in heroku

  @h1
  Scenario: Create Token
    When I send a "POST" request to "/auth" with body:
      | email    | admin       |
      | password | password123 |
    Then the response status should be 200
