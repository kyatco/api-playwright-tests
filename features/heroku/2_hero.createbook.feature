@createbook1
Feature: Booking API - Create Booking
  As a tester
  I want to create a booking
  So that I can verify the API stores booking information correctly

  Scenario: Create a new booking with valid data
    When I send a "POST" request to "/booking" with body:
      """
      {
        "firstname": "Jim",
        "lastname": "Brown",
        "totalprice": 111,
        "depositpaid": true,
        "bookingdates": {
          "checkin": "2018-01-01",
          "checkout": "2019-01-01"
        },
        "additionalneeds": "Breakfast"
      }
      """
    Then the response status should be 200
    And the response should match schema:
      | bookingid                     | number  |
      | booking.firstname             | string  |
      | booking.lastname              | string  |
      | booking.totalprice            | number  |
      | booking.depositpaid           | boolean |
      | booking.bookingdates          | object  |
      | booking.bookingdates.checkin  | string  |
      | booking.bookingdates.checkout | string  |
      | booking.additionalneeds       | string  |
    And the response should match data:
      | booking.firstname       | Jim       |
      | booking.lastname        | Brown     |
      | booking.totalprice      |       111 |
      | booking.depositpaid     | true      |
      | booking.additionalneeds | Breakfast |
