Feature: Login

  Background:
    Given I open the login page

  Scenario Outline: Successful login with different users
    When I enter "<username>" and "<password>"
    And I click the login button
    Then I should be redirected to the inventory page
    And I should see the "Products" title

    Examples:
      | username                | password     |
      | standard_user           | secret_sauce |
      | problem_user            | secret_sauce |
      | performance_glitch_user | secret_sauce |
      | error_user              | secret_sauce |
      | visual_user             | secret_sauce |

  Scenario: Login without username
    When I enter password "secret_sauce"
    And I click the login button
    Then I should see the error message "Epic sadface: Username is required"

  Scenario: Login without password
    When I enter username "standard_user"
    And I click the login button
    Then I should see the error message "Epic sadface: Password is required"

  Scenario: Login without valid credentials
    When I enter invalid username and password
    And I click the login button
    Then I should see the error message "Epic sadface: Username and password do not match any user in this service"
