### Dashboard-Demo app

This is a demo of a of Dashboard app using React. The demo has a React frontend and a ([mock](https://mswjs.io/)) backend that similates a backend on the server. In the demo, you're the Admin of a company. You can browse through the employees, their roles, manage different projects, tasks, etc. The tables can be searched and you can change the order using drag 'n drop which is persistent even when you refresh the browser. You can assign employees to tasks, create, delete or update all the records. The only difference is that the data isn't stored somewhere remotely but in the browser's *localStorage*. However, the React frontend would work exactly the same if it were connected to a real backend, such as a Django project by changing the `url` of the api it connects to. It only lacks authentication (for now).

### Rapid development using two related modules
The Dashboard-Demo app also demonstrates the use of, and can be used to develop these two `npm` modules:
- [`@jasperoosthoek/react-toolbox`](https://github.com/jasperoosthoek/react-toolbox): A library of UX components based on [`react-bootstrap`](https://react-bootstrap.github.io/)
- [`@jasperoosthoek/zustand-crud-registry`](https://github.com/jasperoosthoek/zustand-crud-registry): A entity store based on [`zustand`](https://zustand.docs.pmnd.rs/getting-started/introduction) that interacts directly with a standard CRUD api using [`axios`](https://axios-http.com/docs/intro), for instance a (`ModelViewSet`)[https://www.django-rest-framework.org/api-guide/viewsets/] in the [Django REST framework](https://www.django-rest-framework.org/)

These two modules provide a platform for rapid development of React components that need to manage different types of data.

### Installation

Then install the node modules:


```bash
npm install
```

### Development server

```bash
npm run dev
```

### Development without backend mocking enabled

```bash
npm run dev:no-mocks
```
