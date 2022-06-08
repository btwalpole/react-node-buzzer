# react-node-buzzer
<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="">
    <img src="client/public/quizLogo.jpg" alt="Logo" width="200" height="200">
  </a>
  <h3 align="center">A Multiplayer Quiz Buzzer</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

In 2021 I decided I wanted to host a quiz for my friends. A little tired of playing the same games every time we all got together, I thought it would be fun to switch it up (mostly I think I just wanted the opportunity to channel the cheery disdain of Jeremy Paxman).

While hosting a [University Challenge](https://en.wikipedia.org/wiki/University_Challenge) style quiz for my friends, I bought one little reception bell 🛎️ for each team. I found it was a lot trickier than expected to tell who buzzed in first, leading to a lot of aggrieved competitors!

To provide an impartial (and more accurate!) judge, I made a multiplayer buzzer system using:

* [React.js](https://reactjs.org/)
* [Node JS](https://nodejs.org/en/)
* [Socket.io](https://socket.io/)

This is not a revolutionary idea! But having made some simple React applications before, I thought this would be a great project to teach myself Node JS and WebSockets.

<!-- USAGE EXAMPLES -->
## How It Works

### Key Features

* Buzzer state in sync for all users in a given room
* Session persistence on page reload
* Responsive, mobile first design

### User Journey

A user should start with a prompt to enter their name. Once submitted, they are routed to a screen providing the option to either host their own game or join an existing one. This is all rendered with React. 

On trying to create or join a game, an attempt is made to connect to the Socket.io server which acts as a source of truth for the state of all users and the games they're in. If successful, you should be sent to the buzzer screen. On buzzing, all users in the same game will be alerted to who buzzed first and the buzzer will be disabled until the game admin (the user who created the game) re-enables it.

When successfully creating or joining a game, a unique session ID will be saved in local storage in the browser. The username and room associated with this session ID on the server side. This means that if, for example, the user's device is locked, they can refresh the page and rejoin the room, ensuring the room state is correct. It's important in particular that the buzz button is in the same state for all users in a given room.

<p align="right">(<a href="#top">back to top</a>)</p>

## Reflections and Lessons Learned

### Persisting Sessions

Main learning points:

* How to save and retrieve data in local storage.
* The value of more extensive planning, and of writing things down!
* The value of testing!

When first using this app with my friends, I hadn't considered what happens between buzzes! I was using the buzzer for the 'starter for 10' type questions, so often there would be at least several minutes between each time the app is needed. In this time people might navigate away from it, either in the browser or to another app, or put their phones away entirely. It pretty quickly became clear that people had disconnected from the room and needed to rejoin, and when they did the buzzer was not in the same state as everyone elses! In a rush a to just get an MVP up and running I hadn't done any testing!

To solve these issues I realised I needed to persist the user's session. It seems you can choose between local storage, session storage or cookies. Given local storage is persisted across all tabs I decided local storage made more sense than session storage, since I don't really see a use case where a user wants to be in more than one room at once.

I considered using cookies but local storage seemed simpler to implement. The (Socket.io docs)[ https://socket.io/get-started/] have some great resources for this. Their example of using localStorage uses Vue rather than React but the same principles apply.

I quickly realised there was a lot to consider when implementing this:

* Does the user already have a session ID saved in localStorage? 
* Does the server have any reference for that ID?
* Is there even a room associated with that ID?
* When is the best time to actually initiate the connection to the server?

Clearly there are a lot of different scenarios to consider and I found it extremely useful to write this down - with actual pen and paper! This helped me to spot some gaps in the logic I was missing and some situations I hadn't covered.

In thinking through this I realised how much simpler it would be to have just one enter username screen, so the username is captured before we connect. Previously I had the two places where a username might be entered:

* Click Create Game -> Enter Name -> Join created Game, 
* Click Join Game -> Enter Name -> Join game. 

Handling both these scenarios was significantly more omplicated on server and frontend.

Something I also had not considered was handling the disconnect events. For example, when a user refreshes and I check whether a user with their name is already in the room, I would find a duplicate entry of course - it was their previous session! Initially I added a parameter reJoin: false for example to say to let them replace the previous user if it was indeed them but I realised I wouldn't have to worry about that if I simply updated the state of the room upon disconnection! It feels obvious now but I didn't think about this until I started writing things down.

### Handling page navigation

### Managing communication and state across client and server


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

The only prerequisite is to have npm installed on your machine.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

To run this locally, clone the repo, install the dependencies and start up the react app and node server respectively:

1. Clone the repo
   ```sh
   git clone https://github.com/btwalpole/react-node-buzzer.git
   ```
3. Install client side dependencies
   ```sh
   cd client
   npm install
   npm start
   ```
3. Install server side dependencies
   ```sh
   cd server
   npm install
   npm start
   ```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [ ] Provide ability to leave the current room and/or reset your name
- [ ] Improve accessibility
- [ ] Consider using a Context provider for the socket instance

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Email - btm.walpole@gmail.com

[LinkedIn](www.linkedin.com/in/ben-walpole-64a63310a)

Project Link: [https://github.com/btwalpole/react-node-buzzer](https://github.com/btwalpole/react-node-buzzer)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Some awesome resources that have helped me on this project:

* [Josh W Comeau - Building a Magical 3D Button](https://www.joshwcomeau.com/animation/3d-button/)
* [Lies Game](https://liesgame.com/)
* [README Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#top">back to top</a>)</p>

