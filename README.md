# Vuex CRUD toolkit

# Install

```
npm install --save vuex-crud-toolkit
```

or

```
yarn add vuex-crud-toolkit
```

# Features

- Dashboard with filter, pagination, trash
- Create page
- Update page
- Detail page
- Confirm remove: move item to trash
- Confirm restore
- Confirm purge: purge item
- Confirm empty trash

# How to use

```js
// app.store.js
import { buildCRUDStore } from "vuex-crud-toolkit";

const APP_NAME = "Posts";

const apis = {
  getList: async (params) => {... ; return items};
  count: async (params) => {...; return { count}};
  getOne: async (id) => { ...; return data};
  create: async (data) => {...; return data};
  update: async (id, data) => {...; return data};
  remove: async (id) => {...};

  trashGetList: async (params) => {...; return items};
  trashCount: async (params) => {...; return {count}};
  trashRestore: async (id) => {...};
  trashPurge: async (id) => {...};
  trashEmpty: async () => {...};
}

const store = buildCRUDStore({
  appName: APP_NAME,
  apis,
  getEntityId: (item) => item._id,
  dashboardConfig: {
    defaultFilter: {
      q: "",
    },
    defaultLimit: 5,
    defaultPage: 1,
  },
  createConfig: {
    redirectOnSuccess: "UPDATE", // 'DASHBOARD' | 'DETAIL' | 'UPDATE' | null
    reloadDashboardOnSuccess: true,
    showNotificationOnSuccess: true,
  },
  updateConfig: {
    redirectOnSuccess: "DASHBOARD", // 'DASHBOARD' | 'DETAIL' | null
    reloadDashboardOnSuccess: true,
    showNotificationOnSuccess: true,
  },
});

export default store;
```

### Apis params

| Name           | Params                                    | Response          | Description          |
| -------------- | ----------------------------------------- | ----------------- | -------------------- |
| `getList`      | `any`                                     | `any[]`           | Get list items       |
| `count`        | `any`                                     | `{count: number}` | Count items          |
| `getOne`       | `string` &#124; `number`                  | `any`             | Get item data by id  |
| `create`       | `any`                                     | `any`             | Create new item      |
| `update`       | id: `string` &#124; `number`, data: `any` | `any`             | Update item by id    |
| `remove`       | `string` &#124; `number`                  | `any`             | Remove item to trash |
| `trashGetList` | `any`                                     | `any[]`           | Get list trash items |
| `trashCount`   | `any`                                     | `{count: number}` | Count trash items    |
| `trashRestore` | `string` &#124; `number`                  | `any`             | Restore item by id   |
| `trashPurge`   | `string` &#124; `number`                  | `any`             | Purge item by id     |
| `trashEmpty`   | `string` &#124;` number`                  | `any`             | Empty trash data     |

## Modules

This store will contain modules:

- Notification: success and error notification control
- Dashboard: list item with search, filter, pagination control
- DetailPage: detail page control
- CreatePage: create page control
- UpdatePage: update page control
- ConfirmRemove: confirm remove control
- ConfirmRestore: confirm restore control
- ConfirmPurge: confirm purge control
- ConfirmTrashEmpty: confirm trash empty control

## State

```typescript
type AppState = {
  Notification: {
    success: {
      visible: boolean; // default False: success notification visible control
      message: string | null; // default null: success notification message
    };
    error: {
      visible: boolean; //default False: error notification visible control
      message: string | null; // default null: success notification message
    };
  };
  Dashboard: {
    requestId: number; // last request id, increment, avoid response is not last response
    loading: boolean; // request loading
    error: null | { message: string }; // request error
    success: boolean; // === true if request success
    items: array; // list data
    limit: number; // pagination limit
    page: number; // pagination current page
    total: number; // total items found
    filter: any; // request filter, can update by user via UI
    trashMode: boolean; // === true if go to trash. Then .items is trash items
    status: {
      normalTotal: number; // count total item (available)
      trashTotal: number; // count total item in trash (deleted)
    };
  };
  DetailPage: {
    visible: boolean; // === true if you show detail page. Used to control show detail page
    requestId: number; // last request id
    id: null | number | string; // item id
    loading: boolean; // fetch item data loading
    error: null | { message: string }; // fetch item data error
    success: boolean; // fetch item data success
    inputData: null | any; // a part of data you can show before fetchedData crawled
    fetchedData: null | any; // data fetched
  };
  CreatePage: {
    visible: boolean; // === true if you show create page. Used to control show create page
    loading: boolean; // create requesting
    error: null | { message: string }; // create request error
    success: boolean; // create request success
    submittedData: null | any; // submitted data from UI form. Example: when you click button submit
    resultData: null | any; // response of create request
  };
  UpdatePage: {
    visible: boolean; // === true if you show update page. Used to control show update page

    id: null | string | number; // id of updated item
    inputData: null | any; // a part of data you can show before fetchedData crawled

    fetchLoading: boolean; // item data fetching
    fetchError: null | { message: string };
    fetchSuccess: boolean;
    fetchedData: null | any; // response after fetch success

    updateLoading: boolean; // update requesting
    updateError: null | { message: string };
    updateSuccess: boolean;
    submittedData: null | any; // submitted data from UI form. Example: when you click button submit
    resultData: null | any; // response after create success
  };
  ConfirmRemove: {
    visible: boolean; // === true if you show confirm remove dialog. Used to control show confirm remove dialog
    id: null | string | number; // id of removed item
    inputData: null | any; // a part of data you can show before fetchedData crawled
    loading: boolean; // remove requesting
    error: null | { message: string }; // remove error
    success: boolean; // remove success
  };
  ConfirmRestore: {
    visible: boolean; // === true if you show confirm restore dialog. Used to control show confirm restore dialog
    id: null | string | number; // a part of data you can show in UI
    inputData: null | any;
    loading: boolean;
    error: null | { message: string };
    success: boolean;
  };
  ConfirmPurge: {
    visible: boolean; //  === true if you show confirm purge dialog. Used to control show confirm purge dialog
    id: null | string | number;
    inputData: null | any;
    loading: boolean;
    error: null | { message: string };
    success: boolean;
  };
  ConfirmTrashEmpty: {
    visible: boolean; //  === true if you show confirm trash empty dialog. Used to control show confirm trash empty dialog
    loading: boolean;
    error: null | { message: string };
    success: boolean;
  };
};
```

# Module

## Dashboard

### State

```typescript
export interface DashboardState {
  requestId: number;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
  items: any[];
  limit: number;
  page: number;
  total: number;
  filter: any;
  trashMode: boolean;
  status: {
    normalTotal: number;
    trashTotal: number;
  };
}
```

### Actions

| Action                     | Params    | Descripiton                                          |
| -------------------------- | --------- | ---------------------------------------------------- |
| /Dashboard/fetch           |           | Fetch dashboard data                                 |
| /Dashboard/updateTrashMode | `boolean` | Update Trash Mode, true is trash and false is normal |
| /Dashboard/updateFilter    | `object`  | Update filter                                        |
| /Dashboard/updatePage      | `number`  | Update page                                          |
| /Dashboard/updateLimit     | `number`  | Update page size                                     |

## Notification

### State

```typescript
export interface NotificationState {
  success: {
    visible: boolean;
    message: null | string;
  };
  error: {
    visible: boolean;
    message: null | string;
  };
}
```

### Actions

| Action                    | Params   | Descripiton               |
| ------------------------- | -------- | ------------------------- |
| /Notification/showSuccess | `string` | Show success notification |
| /Notification/hideSuccess |          | Hide success Notification |
| /Notification/showError   | `string` | Show error notification   |
| /Notification/hideError   |          | Hide error notification   |
|                           |

## Detail page

### State

```typescript
export interface DetailState {
  visible: boolean;
  requestId: number;
  id: null | string | number;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
  inputData: null | any;
  fetchedData: null | any;
}
```

### Actions

| Action            | Params                    | Descripiton       |
| ----------------- | ------------------------- | ----------------- |
| /DetailPage/open  | `{id: string, data: any}` | Open detail page  |
| /DetailPage/close |                           | Close detail page |
| /DetailPage/fetch |                           | Fetch detail data |

## Create page

### State

```typescript
export interface CreateState {
  visible: boolean;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
  submittedData: null | any;
  resultData: null | any;
}
```

### Actions

| Action             | Params | Descripiton         |
| ------------------ | ------ | ------------------- |
| /CreatePage/open   |        | Open create page    |
| /CreatePage/close  |        | Close create page   |
| /CreatePage/create | any    | Send create request |

## Update page

### State

```typescript
export interface UpdateState {
  visible: boolean;

  id: null | string | number;
  inputData: null | any;

  fetchLoading: boolean;
  fetchError: null | { message: string };
  fetchSuccess: boolean;
  fetchedData: null | any;

  updateLoading: boolean;
  updateError: null | { message: string };
  updateSuccess: boolean;
  submittedData: null | any;
  resultData: null | any;
}
```

### Actions

| Action             | Params                    | Descripiton         |
| ------------------ | ------------------------- | ------------------- |
| /UpdatePage/open   | `{id: string, data: any}` | Open update page    |
| /UpdatePage/close  |                           | Close update page   |
| /UpdatePage/fetch  |                           | Send fetch request  |
| /UpdatePage/update | any                       | Send update request |

## Confirm remove

### State

```typescript
export interface RemoveState {
  visible: boolean;
  id: null | string | number;
  inputData: null | any;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
}
```

### Actions

| Action                | Params                    | Descripiton                 |
| --------------------- | ------------------------- | --------------------------- |
| /ConfirmRemove/open   | `{id: string, data: any}` | Open confirm remove dialog  |
| /ConfirmRemove/close  |                           | Close confirm remove dialog |
| /ConfirmRemove/remove |                           | Send remove request         |

## Confirm restore

### State

```typescript
export interface RestoreState {
  visible: boolean;
  id: null | string | number;
  inputData: null | any;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
}
```

### Actions

| Action                  | Params                    | Descripiton                  |
| ----------------------- | ------------------------- | ---------------------------- |
| /ConfirmRestore/open    | `{id: string, data: any}` | Open confirm restore dialog  |
| /ConfirmRestore/close   |                           | Close confirm restore dialog |
| /ConfirmRestore/restore |                           | Send restore request         |

## Confirm purge

### State

```typescript
export interface PurgeState {
  visible: boolean;
  id: null | string | number;
  inputData: null | any;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
}
```

### Actions

| Action                | Params                    | Descripiton                |
| --------------------- | ------------------------- | -------------------------- |
| /ConfirmPurge/open    | `{id: string, data: any}` | Open confirm purge dialog  |
| /ConfirmPurge/close   |                           | Close confirm purge dialog |
| /ConfirmPurge/restore |                           | Send purge request         |

## Confirm empty trash

### State

```typescript
export interface TrashEmptyState {
  visible: boolean;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
}
```

### Actions

| Action                   | Params | Descripiton                     |
| ------------------------ | ------ | ------------------------------- |
| /ConfirmTrashEmpty/open  |        | Open confirm empty trash dialog |
| /ConfirmTrashEmpty/close |        | Close confirm empty trsh dialog |
| /ConfirmTrashEmpty/empty |        | Send empty request              |

# Change log

## 1.0.0

First release
