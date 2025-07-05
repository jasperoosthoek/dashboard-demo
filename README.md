### Dashboard-Demo app

This is a demo of a of Dashboard app using React. The demo has a React frontend and a ([mock](https://mswjs.io/)) backend that similates a backend on the server. In the demo, you're the Admin of a company. You can browse through the employees, their roles, manage different projects, tasks, etc. The tables can be searched and you can change the order using drag 'n drop which is persistent even when you refresh the browser. You can assign employees to tasks, create, delete or update all the records. The only difference is that the data isn't stored somewhere remotely but in the browser's *localStorage*. However, the React frontend would work exactly the same if it were connected to a real backend, such as a Django project by changing the `url` of the api it connects to. It only lacks authentication (for now).

### Rapid development using two related modules
The Dashboard-Demo app also demonstrates the use of, and can be used to develop these two `npm` modules:
- [`@jasperoosthoek/react-toolbox`](https://github.com/jasperoosthoek/react-toolbox): A library of UX components based on [`react-bootstrap`](https://react-bootstrap.github.io/)
- [`@jasperoosthoek/zustand-crud-registry`](https://github.com/jasperoosthoek/zustand-crud-registry): A entity store based on [`zustand`](https://zustand.docs.pmnd.rs/getting-started/introduction) that interacts directly with a standard CRUD api using [`axios`](https://axios-http.com/docs/intro), for instance a (`ModelViewSet`)[https://www.django-rest-framework.org/api-guide/viewsets/] in the [Django REST framework](https://www.django-rest-framework.org/)

These two modules provide a platform for rapid development of React components that need to manage different types of data. Say you would also like to manage quotations that you need to get from a backend? With a few lines of code you set up a complete *CRUD* which stands for *Create*, *Retrieve*, *Update* and *Delete*. The data record is retrieved from the backend is stored in a Zustand store.

First, a Zustand store registry needs to be created based key name and Typescript type of the entity it serves:

```typescript
import { createStoreRegistry } from "@jasperoosthoek/zustand-crud-registry";

export type Note = {
  id: number;
  order: number;
  name: content;
  // More fields
};
export type Role = { /* some fields */ };

export const getOrCreateStore = createStoreRegistry<{
  roles: Role;
  notes: Note;
  // More entities
}>();
```

Note that the `createStoreRegistry` can only appear **once** in the codebase. If it appears more than once, more Zustand store registries are created that do not interact. This function only creates a store registry internally where any number of Zustand stores are kept. However, Typescript only allows the `getOrCreateStore` to be called with a `'roles'` and `'notes'` input parameter and will provide a fully typed store based on the types provided to `createStoreRegistry`. To get an actual store, `getOrCreateStore` needs to be executed.

A *CRUD* store is created by providing the `key` string and `config` object. Based on the `config` object, the desired actions (getList, update etc) can be provided. It also provides a convenient and optional `state` object that can be used everywhere in the application. And, custom actions can be created. Every store can hold their own `axios` instance in case there is a difference in authentication between endpoints.

```typescript
import Axios, { type Method } from "axios";

const axios = Axios.create({ baseURL: '/api' }); // Provide your own baseUrl here

// Standard crud with all operations
export const rolesStore = getOrCreateStore(
  'roles',
  {
    axios,
    actions: {
      getList: true, // Will use generic config for getList
      create: true,  // Each action can be completely customized
      get: true,
      update: true,
      delete: true,
    },
    onError: toastOnError, // Provide your error handler here
    route: '/roles',
  }
)

// More complicated crud store that also has state and a custum action
export const notesStore = getOrCreateStore(
  'notes',
  {
    axios,
    actions: {
      getList: {
        method: 'post', // For some reason we need a post here
        route: ({ id }: Note) => `/other-route/${id}`,
      },
      create: true, // Standard config
      delete: true,
    },
    state: {
      fooBar: 'some value' as string | null,
      otherValue: 42,
    },
    customActions: {
      // Custom move function to handle api call of, for instance, drag and drop. To handle a response
      // and trigger an update, a custom hook is needed: see bolow
      move: { 
        route: ({ id }: Note) => '/notes/' + id + '/move',
        method: 'put',
      }
    },
  },
  onError: toastOnError,
)
```

In fact, the above is all the boilerplate you need to provide two complete *CRUD* operations, store date, update the store automatically and provide reactive hooks that can be used inside the components. Note that the `getOrCreateStore` will only create the store once and will need to be provided by an inline constant for the Typescript types to work.

In fact, the boilerplate can be reduced even more by defining a `defaultConfig` object and using it to define all stores:

```typescript
const defaultConfig = {
  axios,
  actions: {
    getList: true,
    create: true,
    get: true,
    update: true,
    delete: true,
  },
  onError: toastOnError,
};
export const rolesStore = getOrCreateStore('roles', { ...defaultConfig, route: '/roles'});
// Some other store, just provide employee: Employees to createStoreRegistry.
export const employeeStore = getOrCreateStore('employees', { ...defaultConfig, route: '/employees'});
```

Using a `useCrud` hook you get your data inside any react component and you can manipulate it:

``` typescript
import { useCrud } from "@jasperoosthoek/zustand-crud-registry";

const NotesList = () => {
  const notes = useCrud(notesStore);
  useEffect(() => {
    notes.getList();
  }, []);

  const { foobar } = notes.state; // Will be 'some value' on page load
  
  const setFooBar = (value: number) => notes.setState({ otherValue: value }); // Will only set otherValue, not fooBar

  // notes.update is not allowed by typescript as update is not set in the config object of notesStore above
  return (
    notes.list
      ? notes.list.map((note: None) => {
          /* Return your React code here*/
          <NoteItem note={note} />
        })
      : <Spinner />
        // Still waiting for data or an error has occurred:
        // Get this information from notes.list.isLoading & notes.list.error
  )
}
```

Loading state and error handling is provided to all functions out of the box, furthermore it is reactive and will trigger a render if it changes:

```typescript
const NoteItem = (note: Note) => {
  const notes = useCrud(notesStore);

  console.log(notes.delete.isLoading, notes.delete.error, notes.delete.id)
  
  return (
    <div className="note-item">
      {note.name}
      <DeleteIcon
        onClick={() => notes.delete(note)}
        isLoading={
          notes.delete.isLoading // Some note is being deleted
          && notes.delete.id === note.id // Make sure it's this particular note
        }
      />
    </div>
  );
}
```

In the above example the delete function performs an api call to the backend and triggers `isLoading === true`. When the item is succesfully deleted, it is deleted from the Zustand store and all React components are immediately updated. The same goes for the `create` and `update` functions. The items are automatically created in the store or updated.

The `zustand-crud-registry` also allows for custom actions, in this case the `move` action that moved the object in the backend by modifying the `order` field. Using the `Django REST framework`, this can be done by using the [`django-ordered-model`](https://github.com/django-ordered-model/django-ordered-model). In fact, the application uses the same `above` and `below` functions as the aforementioned Django app. The custom actions don't have any dedicated action they perform to the store. However, this can be done by creating a dedicated hook. 

Apart from `useCrud` which supplies all the *CRUD* operations, there is also a `useStore` hook which exposes all the functions and data of the store. These two hooks can be used to create dedicated more complicated hooks where, for instance handle the backend response of the non standard *move* operation which is triggered after drag 'n drop. In this case the backend returns a list of `id` and `order` values instead of the full object because nothing more is needed:

```typescript
type MoveRolesResponse = { id: number, order: number }[]

// This would work as well: Partial<Role>[]
```

Here the `useRoles` hook is generated that is the single hook that can be used by all React component. It gets the list on the first render when it is empty and can be used in more than one component without triggering more than one api operation. The `roles.move()` function is triggered somewhere in the component. But by setting up the `roles.move.onResponse` function like in the following example, the `roles.move` function finds the `onResponse` function attached to itself and execute it with the api response data. In fact, all actions such as `getList`, `update` etc provide this functionality.

```typescript
import { useCrud, useStore } from "@jasperoosthoek/zustand-crud-registry";

const useRoles: () => {
  const roles = useCrud(rolesStore);

  // roles.state and roles.setState will trigger a typescript error because roles don't have state
  // object in the config of rolesStore.

  useEffect(() => {
    if (!roles.list) {
      roles.getList(); // Only get list after the first render and when the list is empty
    }
  }, [])

  const { patchList } = useStore(rolesStore);
  roles.move.onResponse = (list: MoveRolesResponse) => patchList(list)
  return roles
}, 
```

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
