Feature: Product List Page

  Background:
    Given I am logged in as "standard_user"

  Scenario: Opening PDP page by clicking product name
    When I click on a random product name
    Then I should be on the product detail page for that product

  Scenario: Adding product to cart
    When I add a random product to the cart
    Then the product button should change to "Remove"
    And the shopping cart badge should show "1"

  Scenario: Removing product from cart
    When I add a random product to the cart
    And I click "Remove" on that product
    Then the product button should change to "Add to cart"
    And the shopping cart badge should not be visible

  Scenario: Default sort option
    Then the default sort option should be "Name (A to Z)"

  Scenario: Sort by price low to high
    When I sort products by "Price (low to high)"
    Then the products should be sorted by price ascending
