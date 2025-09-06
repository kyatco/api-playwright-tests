@createtoken1
Feature: API testing in heroku

  @h1
  Scenario: Create Token
    When I send a "POST" request to "/auth" with headers:
      | Content-Type | application/json |
    When I send a "POST" request to "/auth" with body:
      | email    | admin       |
      | password | password123 |
    Then the response status should be 200
  # @h2
  # Scenario: Booking - GetBookingIds All Ids
  #   When I send a "GET" request to "/booking"
  #   Then the response status should be 200
  #   Then the response should match schema:
  #     | bookingid | number |
  #   When I send a "GET" request to "/booking?firstname=sally&lastname=brown"
  #   Then the response status should be 200
  #   Then the response should match schema:
  #     | bookingid | number |
