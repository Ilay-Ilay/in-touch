# InTouch

A real-time chat application built with React, TypeScript, Node.js, Express, Socket.IO, and MongoDB.

## Features

- User authentication

- Real-time 1-to-1 messaging

- Online/offline presence

- Typing indicators

- Read/unread message status

- Infinite message pagination

- User search

- Chat search

- Responsive UI

- Image sharing

## Tech Stack

### Frontend

- React

- TypeScript

- Vite

- TanStack Query

- React Router

### Backend

- Node.js

- Express

- TypeScript

- Socket.IO

- Better Auth

### Database & Storage

- MongoDB

- MongoDB Atlas

## Architecture

The application is divided into two main parts:

- `client` — React frontend

- `server` — Express API and Socket.IO server

REST APIs are used for operations such as authentication, users, chats, and message history.

Socket.IO is used for real-time events such as:

- New messages

- Typing indicators

- Read receipts

- Online/offline presence
