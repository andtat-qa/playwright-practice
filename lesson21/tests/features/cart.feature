Feature: Cart Page

  Background:
    Given I am logged in as "standard_user"

  Scenario: Check empty cart page
    When I open the shopping cart
    Then I should be on the cart page
    And I should see the "Your Cart" title
    And the cart should be empty
    And the shopping cart badge should not be visible

  Scenario: Check cart page with items
    When I add a random product to the cart
    And I open the shopping cart
    Then I should be on the cart page
    And the cart should contain 1 item
    And the shopping cart badge should show "1"

  Scenario: Removing items from cart
    When I add a random product to the cart
    And I open the shopping cart
    And I remove the item from the cart
    Then the cart item should not be visible
    And the shopping cart badge should not be visible

  Scenario: Proceed to Checkout page
    When I add a random product to the cart
    And I open the shopping cart
    And I click the checkout button
    Then I should be on the checkout information page
    And I should see the "Checkout: Your Information" title

  Scenario: Check Continue Shopping button
    When I open the shopping cart
    And I click the continue shopping button
    Then I should be redirected to the inventory page
    And I should see the "Products" title
