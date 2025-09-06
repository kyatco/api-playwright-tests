@bookingid
Feature: Booking API - Get Booking IDs
  As a tester
  I want to fetch booking IDs
  So that I can verify the API returns valid booking data

  Scenario: Get all booking IDs
    When I send a "GET" request to "/booking"
    Then the response status should be 200
    And the response should match schema:
      | bookingid | number |

  Scenario: Get booking IDs filtered by firstname and lastname
    When I send a "GET" request to "/booking?firstname=Susan&lastname=Jones"
    Then the response status should be 200
    And the response should match schema:
      | bookingid | number |
  # Scenario: Get booking IDs filtered by checkin and checkout
  #   When I send a "GET" request to "/booking?checkin=2013-02-23&checkout=2014-10-23"
  #   Then the response status should be 200s
  #   And the response should match schema:
  #     | bookingid | number |
