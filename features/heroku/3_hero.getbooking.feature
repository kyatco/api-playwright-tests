@getbook1
Feature: Booking - Get specific booking

  Scenario: Get a specific booking by ID
    When I send a "GET" request to "/booking/2"
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
      | booking.firstname       | Mark      |
      | booking.lastname        | Brown     |
      | booking.totalprice      |       890 |
      | booking.depositpaid     | false     |
      | booking.additionalneeds | Breakfast |
