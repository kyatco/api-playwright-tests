@heroku
Feature: E2E
As a tester
  I want to create a booking
  So that I can verify the API stores booking information correctly

  @createtoken
  Scenario: Create Token
    When I send a "POST" request to "/auth" with headers:
      | Content-Type | application/json |
    When I send a "POST" request to "/auth" with body:
      | email    | admin       |
      | password | password123 |
    Then the response status should be 200

  @createbook
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

  @getbook
  Scenario: Get a specific booking by ID
    When I send a "GET" request to "/booking/{booking.id}"
    Then the response status should be 200
    And the response should match schema:
      | firstname             | string  |
      | lastname              | string  |
      | totalprice            | number  |
      | depositpaid           | boolean |
      | bookingdates          | object  |
      | bookingdates.checkin  | string  |
      | bookingdates.checkout | string  |
      | additionalneeds       | string  |
    And the response should match data:
      | booking.firstname       | Jim       |
      | booking.lastname        | Brown     |
      | booking.totalprice      |       111 |
      | booking.depositpaid     | true      |
      | booking.additionalneeds | Breakfast |

  @updatebook
  Scenario: Update Booking
    When I send a "PUT" request to "/booking/{booking.id}" with body:
      """
      {
        "firstname": "James1",
        "lastname": "Brown",
        "totalprice": 112,
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
      | firstname             | string  |
      | lastname              | string  |
      | totalprice            | number  |
      | depositpaid           | boolean |
      | bookingdates          | object  |
      | bookingdates.checkin  | string  |
      | bookingdates.checkout | string  |
      | additionalneeds       | string  |
    And the response should match data:
      | firstname       | James1    |
      | lastname        | Brown     |
      | totalprice      |       112 |
      | depositpaid     | true      |
      | additionalneeds | Breakfast |

  @patchbooking
  Scenario: Partial Update
    When I send a "PATCH" request to "/booking/{booking.id}" with body:
      """
      {
        "firstname" : "James",
        "lastname" : "Brown1"
      }
      """
    Then the response status should be 200
    And the response should match schema:
      | firstname | string |
      | lastname  | string |
    And the response should match data:
      | firstname | James  |
      | lastname  | Brown1 |

  @deletebooking
  Scenario: Delete a booking successfully
    When I send a "DELETE" request to "/booking/{booking.id}" with body:
      """
      {}
      """
    Then the response status should be 201
    When I send a "GET" request to "/booking/{booking.id}"
    Then the response status should be 404
