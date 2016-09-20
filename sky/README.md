nowtv-applicant-remote-exercise
===============================

Welcome to the pairing exercise for NOWTV applicants.

The high level goal of the test is to build a simple yet special register form, where the user has to specify:
* His favourite colour.
* His e-mail address.

If the data model is correct, the user will be redirected to a different view, receiving proper feedback otherwise.


### Guidance

* Having good test coverage is really important to us.
* Please explain any of the decisions you take, including discussing the architecture and direction of your solution.
It is very important that you communicate your ideas as you work.

* You are not necessarily expected to finish the exercise. It is much more important for us to see your working, thought and communication processes



### Acceptance criteria
1. The user will be able to submit the data to the backend
    * Endpoint: `/rest/register`
    * Request type: `POST`
    * Expected data format: `{ colour: '<typed colour>', email: '<typed email>' }`
    * The flow will redirect to the `/thanks` view (ThanksCtrl doesn't need to do anything)
<br/><br/>

2. The UI of the register form will need to be updated to look like the mockup at `/frontend/src/app/register/register.mockup.jpeg`.

    * Use coloured squares instead of a text field to select a colour by clicking on it
    * Only one colour should be selected at a time
     * The content is aligned to the middle, both vertically and horizontally
<br/><br/>

3. The user will receive error feedback whenever the specified e-mail address fits with any of the following scenarios:
    * It's empty.
    * It's not a valid e-mail address.
<br/><br/>

4. Whenever a colour is selected:
    * It will be surrounded with a red border colour.
    * The border colour of the e-mail input field will be the same as the selected colour.
<br/><br/>

5. The backend is hardcoded to reject the following email address: `foo@bar.com` with a 403 error response code (see `/backend/server.js`)
    * In this scenario the user will receive a message alerting him to the error.
<br/><br/>


### How to start

1. Start the execution server via the npm script. The targeted view is expected to be at `http://localhost:3000/register`.

2. Run the karma tests inside IntelliJ's Run tab (they are already configured)



