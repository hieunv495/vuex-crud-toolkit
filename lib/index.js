'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');

var getErrorText = function (e) {
    if (e.response && e.response.data && e.response.data.message) {
        return e.response.data.message;
    }
    else {
        return "Lỗi không xác định";
    }
};

var RESET = "RESET";
var UPDATE_TRASH_MODE = "SET_TRASH_MODE";
var UPDATE_FILTER = "UPDATE_FILTER";
var UPDATE_PAGE = "UPDATE_PAGE";
var UPDATE_LIMIT = "UPDATE_LIMIT";
var FETCH_START = "FETCH_START";
var FETCH_SUCCESS = "FETCH_SUCCESS";
var FETCH_FAILURE = "FETCH_FAILURE";
var lastRequestId = 0;
var generateRequestId = function () { return ++lastRequestId; };
var buildDashboardStore = function (_a, _b) {
    var _c;
    var apis = _a.apis, defaultFilter = _a.defaultFilter, defaultPage = _a.defaultPage, defaultLimit = _a.defaultLimit;
    var _d = _b === void 0 ? {
        state: function () { return ({}); },
        mutations: {},
        actions: {},
    } : _b, extraState = _d.state, extraMutations = _d.mutations, extraActions = _d.actions;
    var getList = apis.getList, trashGetList = apis.trashGetList, count = apis.count, trashCount = apis.trashCount;
    var getDefaultState = function () { return ({
        requestId: 0,
        loading: false,
        error: null,
        success: false,
        items: [],
        limit: defaultLimit,
        page: defaultPage,
        total: 0,
        filter: defaultFilter,
        trashMode: false,
        status: {
            normalTotal: 0,
            trashTotal: 0,
        },
    }); };
    var mutations = (_c = {},
        _c[RESET] = function (state) {
            Object.assign(state, getDefaultState());
        },
        _c[UPDATE_TRASH_MODE] = function (state, mode) {
            if (mode !== state.trashMode) {
                state.filter = defaultFilter;
                state.page = defaultPage;
            }
            state.trashMode = mode;
        },
        _c[UPDATE_FILTER] = function (state, filter) {
            state.filter = filter;
            state.page = defaultPage;
        },
        _c[UPDATE_PAGE] = function (state, page) {
            state.page = page;
        },
        _c[UPDATE_LIMIT] = function (state, limit) {
            state.limit = limit;
            state.page = defaultPage;
        },
        _c[FETCH_START] = function (state, _a) {
            var requestId = _a.requestId;
            state.requestId = requestId;
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        _c[FETCH_SUCCESS] = function (state, _a) {
            var requestId = _a.requestId, items = _a.items, total = _a.total, status = _a.status;
            if (requestId === state.requestId) {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.items = items;
                state.total = total;
                state.status = status;
            }
        },
        _c[FETCH_FAILURE] = function (state, _a) {
            var requestId = _a.requestId, error = _a.error;
            if (requestId === state.requestId) {
                state.loading = false;
                state.error = error;
                state.success = false;
            }
        },
        _c);
    var actions = {
        updateTrashMode: function (_a, mode) {
            var commit = _a.commit, dispatch = _a.dispatch;
            commit(UPDATE_TRASH_MODE, mode);
            dispatch("fetch");
        },
        updateFilter: function (_a, filter) {
            var commit = _a.commit, dispatch = _a.dispatch;
            commit(UPDATE_FILTER, filter);
            dispatch("fetch");
        },
        updatePage: function (_a, page) {
            var commit = _a.commit, dispatch = _a.dispatch;
            commit(UPDATE_PAGE, page);
            dispatch("fetch");
        },
        updateLimit: function (_a, limit) {
            var commit = _a.commit, dispatch = _a.dispatch;
            commit(UPDATE_LIMIT, limit);
            dispatch("fetch");
        },
        fetch: function (_a) {
            var commit = _a.commit, state = _a.state;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var trashMode, getItemsApi, countApi, filter, limit, page, requestId, getItemsPromise, getTotalPromise, getNormalTotalPromise, getTrashTotalPromise, _b, items, total, normalTotal, trashTotal, e_1, errorMessage;
                return tslib.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            trashMode = state.trashMode;
                            getItemsApi = trashMode ? trashGetList : getList;
                            countApi = trashMode ? trashCount : count;
                            filter = state.filter, limit = state.limit, page = state.page;
                            requestId = generateRequestId();
                            commit(FETCH_START, { requestId: requestId, page: page });
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            getItemsPromise = getItemsApi(tslib.__assign(tslib.__assign({}, filter), { limit: limit, offset: (page - 1) * limit }));
                            getTotalPromise = countApi(tslib.__assign(tslib.__assign({}, filter), { limit: limit, offset: (page - 1) * limit }));
                            getNormalTotalPromise = count();
                            getTrashTotalPromise = trashCount();
                            return [4 /*yield*/, Promise.all([
                                    getItemsPromise,
                                    getTotalPromise,
                                    getNormalTotalPromise,
                                    getTrashTotalPromise,
                                ])];
                        case 2:
                            _b = _c.sent(), items = _b[0], total = _b[1], normalTotal = _b[2], trashTotal = _b[3];
                            commit(FETCH_SUCCESS, {
                                requestId: requestId,
                                items: items,
                                total: total,
                                status: { normalTotal: normalTotal, trashTotal: trashTotal },
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _c.sent();
                            console.log(e_1);
                            errorMessage = getErrorText(e_1);
                            commit(FETCH_FAILURE, { requestId: requestId, error: errorMessage });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    };
    return {
        namespaced: true,
        state: function () { return (tslib.__assign(tslib.__assign({}, getDefaultState()), extraState())); },
        mutations: tslib.__assign(tslib.__assign({}, mutations), extraMutations),
        actions: tslib.__assign(tslib.__assign({}, actions), extraActions),
    };
};

var OPEN = "OPEN";
var CLOSE = "CLOSE";
var FETCH_START$1 = "FETCH_START";
var FETCH_SUCCESS$1 = "FETCH_SUCCESS";
var FETCH_FAILURE$1 = "FETCH_FAILURE";
var UPDATE_START = "UPDATE_START";
var UPDATE_SUCCESS = "UPDATE_SUCCESS";
var UPDATE_FAILURE = "UPDATE_FAILURE";
var buildUpdateStore = function (_a, _b) {
    var _c;
    var appName = _a.appName, apis = _a.apis, redirectOnSuccess = _a.redirectOnSuccess, reloadDashboardOnSuccess = _a.reloadDashboardOnSuccess, showNotificationOnSuccess = _a.showNotificationOnSuccess;
    var _d = _b === void 0 ? {
        state: function () { return ({}); },
        getters: {},
        mutations: {},
        actions: {},
    } : _b, extraState = _d.state, extraGetters = _d.getters, extraMutations = _d.mutations, extraActions = _d.actions;
    var getOneApi = apis.getOne, updateApi = apis.update;
    var getDefaultState = function () { return ({
        visible: false,
        id: null,
        inputData: null,
        fetchLoading: false,
        fetchError: null,
        fetchSuccess: false,
        fetchedData: null,
        updateLoading: false,
        updateError: null,
        updateSuccess: false,
        submittedData: null,
        resultData: null,
    }); };
    var mutations = (_c = {},
        _c[OPEN] = function (state, _a) {
            var id = _a.id, data = _a.data;
            state.visible = true;
            state.id = id;
            state.inputData = JSON.parse(JSON.stringify(data));
        },
        _c[CLOSE] = function (state) {
            Object.assign(state, getDefaultState());
        },
        _c[FETCH_START$1] = function (state) {
            state.fetchLoading = true;
            state.fetchError = null;
            state.fetchSuccess = false;
        },
        _c[FETCH_SUCCESS$1] = function (state, fetchedData) {
            state.fetchLoading = false;
            state.fetchError = null;
            state.fetchSuccess = true;
            state.fetchedData = fetchedData;
        },
        _c[FETCH_FAILURE$1] = function (state, error) {
            state.fetchLoading = false;
            state.fetchError = error;
            state.fetchSuccess = false;
        },
        _c[UPDATE_START] = function (state, submittedData) {
            state.updateLoading = true;
            state.updateError = null;
            state.updateSuccess = false;
            state.submittedData = JSON.parse(JSON.stringify(submittedData));
        },
        _c[UPDATE_SUCCESS] = function (state, resultData) {
            state.updateLoading = false;
            state.updateError = null;
            state.updateSuccess = true;
            state.resultData = resultData;
        },
        _c[UPDATE_FAILURE] = function (state, error) {
            state.updateLoading = false;
            state.updateError = error;
            state.updateSuccess = false;
        },
        _c);
    var actions = {
        open: function (_a, _b) {
            var commit = _a.commit, dispatch = _a.dispatch;
            var id = _b.id, data = _b.data;
            commit(OPEN, { id: id, data: data });
            dispatch("fetch");
        },
        close: function (_a) {
            var commit = _a.commit;
            commit(CLOSE);
        },
        fetch: function (_a) {
            var state = _a.state, commit = _a.commit;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var id, resultData, error_1;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            id = state.id;
                            if (!id)
                                return [2 /*return*/];
                            commit(FETCH_START$1);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, getOneApi(id)];
                        case 2:
                            resultData = _b.sent();
                            commit(FETCH_SUCCESS$1, resultData);
                            return [2 /*return*/, resultData];
                        case 3:
                            error_1 = _b.sent();
                            commit(FETCH_FAILURE$1, { message: getErrorText(error_1), error: error_1 });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        update: function (context, submittedData) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var state, commit, dispatch, id, resultData, error_2;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            state = context.state, commit = context.commit, dispatch = context.dispatch;
                            id = state.id;
                            if (!id)
                                return [2 /*return*/];
                            commit(UPDATE_START, submittedData);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, updateApi(id, submittedData)];
                        case 2:
                            resultData = _a.sent();
                            commit(UPDATE_SUCCESS, resultData);
                            if (showNotificationOnSuccess) {
                                dispatch(appName + "/Notification/showSuccess", "Cập nhật thành công", {
                                    root: true,
                                });
                            }
                            if (reloadDashboardOnSuccess) {
                                dispatch(appName + "/Dashboard/fetch", null, { root: true });
                            }
                            if (redirectOnSuccess === "DASHBOARD") {
                                dispatch("close");
                            }
                            if (redirectOnSuccess === "DETAIL") {
                                dispatch(appName + "/DetailPage/open", { id: id, data: resultData }, { root: true });
                                dispatch("close");
                            }
                            if (typeof redirectOnSuccess === "function") {
                                redirectOnSuccess(context, resultData);
                            }
                            return [2 /*return*/, resultData];
                        case 3:
                            error_2 = _a.sent();
                            commit(UPDATE_FAILURE, { message: getErrorText(error_2), error: error_2 });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    };
    return {
        namespaced: true,
        state: function () { return (tslib.__assign(tslib.__assign({}, getDefaultState()), extraState())); },
        getters: tslib.__assign({}, extraGetters),
        mutations: tslib.__assign(tslib.__assign({}, mutations), extraMutations),
        actions: tslib.__assign(tslib.__assign({}, actions), extraActions),
    };
};

var OPEN$1 = "OPEN";
var CLOSE$1 = "CLOSE";
var CREATE_START = "CREATE_START";
var CREATE_SUCCESS = "CREATE_SUCCESS";
var CREATE_FAILURE = "CREATE_FAILURE";
var buildCreateStore = function (_a, _b) {
    var _c;
    var appName = _a.appName, apis = _a.apis, _d = _a.getEntityId, getEntityId = _d === void 0 ? function (item) { return item.id; } : _d, redirectOnSuccess = _a.redirectOnSuccess, reloadDashboardOnSuccess = _a.reloadDashboardOnSuccess, showNotificationOnSuccess = _a.showNotificationOnSuccess;
    var _e = _b === void 0 ? {
        state: function () { return ({}); },
        getters: {},
        mutations: {},
        actions: {},
    } : _b, extraState = _e.state, extraGetters = _e.getters, extraMutations = _e.mutations, extraActions = _e.actions;
    var createApi = apis.create;
    var getDefaultState = function () { return ({
        visible: false,
        loading: false,
        error: null,
        success: false,
        submittedData: null,
        resultData: null,
    }); };
    var mutations = (_c = {},
        _c[OPEN$1] = function (state) {
            state.visible = true;
        },
        _c[CLOSE$1] = function (state) {
            Object.assign(state, getDefaultState());
        },
        _c[CREATE_START] = function (state, submittedData) {
            state.loading = true;
            state.error = null;
            state.success = false;
            state.submittedData = JSON.parse(JSON.stringify(submittedData));
        },
        _c[CREATE_SUCCESS] = function (state, data) {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.resultData = data;
        },
        _c[CREATE_FAILURE] = function (state, error) {
            state.loading = false;
            state.error = error;
            state.success = false;
        },
        _c);
    var actions = {
        open: function (_a) {
            var commit = _a.commit;
            commit(OPEN$1);
        },
        close: function (_a) {
            var commit = _a.commit;
            commit(CLOSE$1);
        },
        create: function (context, submittedData) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var commit, dispatch, resultData, id, error_1;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            commit = context.commit, dispatch = context.dispatch;
                            commit(CREATE_START, submittedData);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, createApi(submittedData)];
                        case 2:
                            resultData = _a.sent();
                            id = getEntityId(resultData);
                            commit(CREATE_SUCCESS, resultData);
                            if (showNotificationOnSuccess) {
                                dispatch(appName + "/Notification/showSuccess", "Tạo mới thành công", {
                                    root: true,
                                });
                            }
                            if (reloadDashboardOnSuccess) {
                                dispatch(appName + "/Dashboard/updatePage", 1, { root: true });
                            }
                            if (redirectOnSuccess === "DASHBOARD") {
                                dispatch("close");
                            }
                            if (redirectOnSuccess === "DETAIL") {
                                dispatch(appName + "/DetailPage/open", { id: id, data: resultData }, { root: true });
                                dispatch("close");
                            }
                            if (redirectOnSuccess === "UPDATE") {
                                dispatch(appName + "/UpdatePage/open", { id: id, data: resultData }, { root: true });
                                dispatch("close");
                            }
                            if (typeof redirectOnSuccess === "function") {
                                redirectOnSuccess(context, resultData);
                            }
                            return [2 /*return*/, resultData];
                        case 3:
                            error_1 = _a.sent();
                            commit(CREATE_FAILURE, { message: getErrorText(error_1), error: error_1 });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    };
    return {
        namespaced: true,
        state: function () { return (tslib.__assign(tslib.__assign({}, getDefaultState()), extraState())); },
        getters: tslib.__assign({}, extraGetters),
        mutations: tslib.__assign(tslib.__assign({}, mutations), extraMutations),
        actions: tslib.__assign(tslib.__assign({}, actions), extraActions),
    };
};

var OPEN$2 = "OPEN";
var CLOSE$2 = "RESET";
var FETCH_START$2 = "FETCH_START";
var FETCH_SUCCESS$2 = "FETCH_SUCCESS";
var FETCH_FAILURE$2 = "FETCH_FAILURE";
var lastRequestId$1 = 0;
var generateRequestId$1 = function () { return ++lastRequestId$1; };
var buildDetailStore = function (_a, _b) {
    var _c;
    var appName = _a.appName, apis = _a.apis;
    var _d = _b === void 0 ? {
        state: function () { return ({}); },
        getters: {},
        mutations: {},
        actions: {},
    } : _b, extraState = _d.state, extraGetters = _d.getters, extraMutations = _d.mutations, extraActions = _d.actions;
    var getOneApi = apis.getOne;
    var getDefaultState = function () { return ({
        visible: false,
        requestId: 0,
        id: null,
        loading: false,
        error: null,
        success: false,
        inputData: null,
        fetchedData: null,
    }); };
    var mutations = (_c = {},
        _c[OPEN$2] = function (state, _a) {
            var id = _a.id, data = _a.data;
            state.visible = true;
            state.id = id;
            state.inputData = data;
        },
        _c[CLOSE$2] = function (state) {
            Object.assign(state, getDefaultState());
        },
        _c[FETCH_START$2] = function (state, _a) {
            var requestId = _a.requestId;
            state.requestId = requestId;
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        _c[FETCH_SUCCESS$2] = function (state, _a) {
            var requestId = _a.requestId, data = _a.data;
            if (requestId === state.requestId) {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.fetchedData = data;
            }
        },
        _c[FETCH_FAILURE$2] = function (state, _a) {
            var requestId = _a.requestId, error = _a.error;
            if (requestId === state.requestId) {
                state.loading = false;
                state.error = error;
                state.success = false;
            }
        },
        _c);
    var actions = {
        open: function (_a, _b) {
            var commit = _a.commit, dispatch = _a.dispatch;
            var id = _b.id, data = _b.data;
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_c) {
                    commit(OPEN$2, { id: id, data: data });
                    dispatch("fetch");
                    return [2 /*return*/];
                });
            });
        },
        close: function (_a) {
            var commit = _a.commit;
            return tslib.__awaiter(this, void 0, void 0, function () {
                return tslib.__generator(this, function (_b) {
                    commit(CLOSE$2);
                    return [2 /*return*/];
                });
            });
        },
        fetch: function (_a) {
            var state = _a.state, commit = _a.commit;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var requestId, id, fetchedData, error_1, message;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            requestId = generateRequestId$1();
                            commit(FETCH_START$2, { requestId: requestId });
                            id = state.id;
                            if (!id)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, getOneApi(id)];
                        case 2:
                            fetchedData = _b.sent();
                            commit(FETCH_SUCCESS$2, { requestId: requestId, data: fetchedData });
                            return [2 /*return*/, fetchedData];
                        case 3:
                            error_1 = _b.sent();
                            message = getErrorText(error_1);
                            commit(FETCH_FAILURE$2, {
                                requestId: requestId,
                                id: id,
                                error: { message: message, error: error_1 },
                            });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    };
    return {
        namespaced: true,
        state: function () { return (tslib.__assign(tslib.__assign({}, getDefaultState()), extraState())); },
        getters: tslib.__assign({}, extraGetters),
        mutations: tslib.__assign(tslib.__assign({}, mutations), extraMutations),
        actions: tslib.__assign(tslib.__assign({}, actions), extraActions),
    };
};

var CLOSE$3 = "CLOSE";
var OPEN$3 = "OPEN";
var REMOVE_START = "REMOVE_START";
var REMOVE_SUCCESS = "REMOVE_SUCCESS";
var REMOVE_FAILURE = "REMOVE_FAILURE";
var buildRemoveStore = function (_a, _b) {
    var _c;
    var appName = _a.appName, apis = _a.apis;
    var _d = _b === void 0 ? {
        state: function () { return ({}); },
        getters: {},
        mutations: {},
        actions: {},
    } : _b, extraState = _d.state, extraGetters = _d.getters, extraMutations = _d.mutations, extraActions = _d.actions;
    var removeApi = apis.remove;
    var getDefaultState = function () { return ({
        visible: false,
        id: null,
        inputData: null,
        loading: false,
        error: null,
        success: false,
    }); };
    var getters = {};
    var mutations = (_c = {},
        _c[OPEN$3] = function (state, _a) {
            var id = _a.id, data = _a.data;
            state.visible = true;
            state.id = id;
            state.inputData = data;
        },
        _c[CLOSE$3] = function (state) {
            Object.assign(state, getDefaultState());
        },
        _c[REMOVE_START] = function (state) {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        _c[REMOVE_SUCCESS] = function (state) {
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        _c[REMOVE_FAILURE] = function (state, error) {
            state.loading = false;
            state.error = error;
            state.success = false;
        },
        _c);
    var actions = {
        open: function (_a, _b) {
            var commit = _a.commit;
            var id = _b.id, data = _b.data;
            commit(OPEN$3, { id: id, data: data });
        },
        close: function (_a) {
            var commit = _a.commit;
            commit(CLOSE$3);
        },
        remove: function (_a) {
            var state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var id, error_1, message;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            commit(REMOVE_START);
                            id = state.id;
                            if (!id)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, removeApi(id)];
                        case 2:
                            _b.sent();
                            commit(REMOVE_SUCCESS);
                            dispatch("close");
                            dispatch(appName + "/Dashboard/fetch", null, { root: true });
                            dispatch(appName + "/Notification/showSuccess", "Xóa thành công", {
                                root: true,
                            });
                            return [2 /*return*/, { success: true }];
                        case 3:
                            error_1 = _b.sent();
                            message = getErrorText(error_1);
                            commit(REMOVE_FAILURE, { message: message, error: error_1 });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    };
    return {
        namespaced: true,
        state: function () { return (tslib.__assign(tslib.__assign({}, getDefaultState()), extraState())); },
        getters: tslib.__assign(tslib.__assign({}, getters), extraGetters),
        mutations: tslib.__assign(tslib.__assign({}, mutations), extraMutations),
        actions: tslib.__assign(tslib.__assign({}, actions), extraActions),
    };
};

var CLOSE$4 = "CLOSE";
var OPEN$4 = "OPEN";
var RESTORE_START = "RESTORE_START";
var RESTORE_SUCCESS = "RESTORE_SUCCESS";
var RESTORE_FAILURE = "RESTORE_FAILURE";
var buildRestoreStore = function (_a, _b) {
    var _c;
    var appName = _a.appName, apis = _a.apis;
    var _d = _b === void 0 ? {
        state: function () { return ({}); },
        getters: {},
        mutations: {},
        actions: {},
    } : _b, extraState = _d.state, extraGetters = _d.getters, extraMutations = _d.mutations, extraActions = _d.actions;
    var restoreApi = apis.trashRestore;
    var getDefaultState = function () { return ({
        visible: false,
        id: null,
        inputData: null,
        loading: false,
        error: null,
        success: false,
    }); };
    var getters = {};
    var mutations = (_c = {},
        _c[OPEN$4] = function (state, _a) {
            var id = _a.id, data = _a.data;
            state.visible = true;
            state.id = id;
            state.inputData = data;
        },
        _c[CLOSE$4] = function (state) {
            Object.assign(state, getDefaultState());
        },
        _c[RESTORE_START] = function (state) {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        _c[RESTORE_SUCCESS] = function (state) {
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        _c[RESTORE_FAILURE] = function (state, error) {
            state.loading = false;
            state.error = error;
            state.success = false;
        },
        _c);
    var actions = {
        open: function (_a, _b) {
            var commit = _a.commit;
            var id = _b.id, data = _b.data;
            commit(OPEN$4, { id: id, data: data });
        },
        close: function (_a) {
            var commit = _a.commit;
            commit(CLOSE$4);
        },
        restore: function (_a) {
            var state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var id, error_1, message;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            commit(RESTORE_START);
                            id = state.id;
                            if (!id)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, restoreApi(id)];
                        case 2:
                            _b.sent();
                            commit(RESTORE_SUCCESS);
                            dispatch("close");
                            dispatch(appName + "/Dashboard/fetch", null, { root: true });
                            dispatch(appName + "/Notification/showSuccess", "Khôi phục thành công", {
                                root: true,
                            });
                            return [2 /*return*/, { success: true }];
                        case 3:
                            error_1 = _b.sent();
                            message = getErrorText(error_1);
                            commit(RESTORE_FAILURE, { message: message, error: error_1 });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    };
    return {
        namespaced: true,
        state: function () { return (tslib.__assign(tslib.__assign({}, getDefaultState()), extraState())); },
        getters: tslib.__assign(tslib.__assign({}, getters), extraGetters),
        mutations: tslib.__assign(tslib.__assign({}, mutations), extraMutations),
        actions: tslib.__assign(tslib.__assign({}, actions), extraActions),
    };
};

var CLOSE$5 = "CLOSE";
var OPEN$5 = "OPEN";
var PURGE_START = "PURGE_START";
var PURGE_SUCCESS = "PURGE_SUCCESS";
var PURGE_FAILURE = "PURGE_FAILURE";
var buildPurgeStore = function (_a, _b) {
    var _c;
    var appName = _a.appName, apis = _a.apis;
    var _d = _b === void 0 ? {
        state: function () { return ({}); },
        getters: {},
        mutations: {},
        actions: {},
    } : _b, extraState = _d.state, extraGetters = _d.getters, extraMutations = _d.mutations, extraActions = _d.actions;
    var purgeApi = apis.trashPurge;
    var getDefaultState = function () { return ({
        visible: false,
        id: null,
        inputData: null,
        loading: false,
        error: null,
        success: false,
    }); };
    var getters = {};
    var mutations = (_c = {},
        _c[OPEN$5] = function (state, _a) {
            var id = _a.id, data = _a.data;
            state.visible = true;
            state.id = id;
            state.inputData = data;
        },
        _c[CLOSE$5] = function (state) {
            Object.assign(state, getDefaultState());
        },
        _c[PURGE_START] = function (state) {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        _c[PURGE_SUCCESS] = function (state) {
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        _c[PURGE_FAILURE] = function (state, error) {
            state.loading = false;
            state.error = error;
            state.success = false;
        },
        _c);
    var actions = {
        open: function (_a, _b) {
            var commit = _a.commit;
            var id = _b.id, data = _b.data;
            commit(OPEN$5, { id: id, data: data });
        },
        close: function (_a) {
            var commit = _a.commit;
            commit(CLOSE$5);
        },
        purge: function (_a) {
            var state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var id, error_1, message;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            commit(PURGE_START);
                            id = state.id;
                            if (!id)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, purgeApi(id)];
                        case 2:
                            _b.sent();
                            commit(PURGE_SUCCESS);
                            dispatch("close");
                            dispatch(appName + "/Dashboard/fetch", null, { root: true });
                            dispatch(appName + "/Notification/showSuccess", "Dọn dẹp thành công", {
                                root: true,
                            });
                            return [2 /*return*/, { success: true }];
                        case 3:
                            error_1 = _b.sent();
                            message = getErrorText(error_1);
                            commit(PURGE_FAILURE, { message: message, error: error_1 });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    };
    return {
        namespaced: true,
        state: function () { return (tslib.__assign(tslib.__assign({}, getDefaultState()), extraState())); },
        getters: tslib.__assign(tslib.__assign({}, getters), extraGetters),
        mutations: tslib.__assign(tslib.__assign({}, mutations), extraMutations),
        actions: tslib.__assign(tslib.__assign({}, actions), extraActions),
    };
};

var CLOSE$6 = "CLOSE";
var OPEN$6 = "OPEN";
var EMPTY_START = "REQUEST_START";
var EMPTY_SUCCESS = "REQUEST_SUCCESS";
var EMPTY_FAILURE = "REQUEST_FAILURE";
var buildTrashEmptyStore = function (_a, _b) {
    var _c;
    var appName = _a.appName, apis = _a.apis;
    var _d = _b === void 0 ? {
        state: function () { return ({}); },
        getters: {},
        mutations: {},
        actions: {},
    } : _b, extraState = _d.state, extraGetters = _d.getters, extraMutations = _d.mutations, extraActions = _d.actions;
    var emptyApi = apis.trashEmpty;
    var getDefaultState = function () { return ({
        visible: false,
        loading: false,
        error: null,
        success: false,
    }); };
    var getters = {};
    var mutations = (_c = {},
        _c[OPEN$6] = function (state) {
            state.visible = true;
        },
        _c[CLOSE$6] = function (state) {
            Object.assign(state, getDefaultState());
        },
        _c[EMPTY_START] = function (state) {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        _c[EMPTY_SUCCESS] = function (state) {
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        _c[EMPTY_FAILURE] = function (state, error) {
            state.loading = false;
            state.error = error;
            state.success = false;
        },
        _c);
    var actions = {
        open: function (_a) {
            var commit = _a.commit;
            commit(OPEN$6);
        },
        close: function (_a) {
            var commit = _a.commit;
            commit(CLOSE$6);
        },
        empty: function (_a) {
            var state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var error_1, message;
                return tslib.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            commit(EMPTY_START);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, emptyApi()];
                        case 2:
                            _b.sent();
                            commit(EMPTY_SUCCESS);
                            dispatch("close");
                            dispatch(appName + "/Dashboard/fetch", null, { root: true });
                            dispatch(appName + "/Notification/showSuccess", "Dọn dẹp thành công", {
                                root: true,
                            });
                            return [2 /*return*/, { success: true }];
                        case 3:
                            error_1 = _b.sent();
                            message = getErrorText(error_1);
                            commit(EMPTY_FAILURE, { message: message, error: error_1 });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    };
    return {
        namespaced: true,
        state: function () { return (tslib.__assign(tslib.__assign({}, getDefaultState()), extraState())); },
        getters: tslib.__assign(tslib.__assign({}, getters), extraGetters),
        mutations: tslib.__assign(tslib.__assign({}, mutations), extraMutations),
        actions: tslib.__assign(tslib.__assign({}, actions), extraActions),
    };
};

var _a;
var SHOW_SUCCESS = "SHOW_SUCCESS";
var HIDE_SUCCESS = "HIDE_SUCCESS";
var SHOW_ERROR = "SHOW_ERROR";
var HIDE_ERROR = "HIDE_ERROR";
var state = function () { return ({
    success: {
        visible: false,
        message: null,
    },
    error: {
        visible: false,
        message: null,
    },
}); };
var mutations = (_a = {},
    _a[SHOW_SUCCESS] = function (state, message) {
        state.success.visible = true;
        state.success.message = message;
    },
    _a[HIDE_SUCCESS] = function (state) {
        state.success.visible = false;
    },
    _a[SHOW_ERROR] = function (state, message) {
        state.error.visible = true;
        state.error.message = message;
    },
    _a[HIDE_ERROR] = function (state) {
        state.error.visible = false;
    },
    _a);
var actions = {
    showSuccess: function (_a, message) {
        var commit = _a.commit;
        commit(SHOW_SUCCESS, message);
    },
    hideSuccess: function (_a) {
        var commit = _a.commit;
        commit(HIDE_SUCCESS);
    },
    showError: function (_a, message) {
        var commit = _a.commit;
        commit(SHOW_ERROR, message);
    },
    hideError: function (_a) {
        var commit = _a.commit;
        commit(HIDE_ERROR);
    },
};
var notificationStore = {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
};

var buildCRUDStore = function (_a, _b) {
    var appName = _a.appName, apis = _a.apis, _c = _a.getEntityId, getEntityId = _c === void 0 ? function (item) { return item.id; } : _c, dashboardConfig = _a.dashboardConfig, createConfig = _a.createConfig, updateConfig = _a.updateConfig;
    var _d = _b === void 0 ? {
        state: function () { return ({}); },
        getters: {},
        mutations: {},
        actions: {},
    } : _b, extraState = _d.state, extraGetters = _d.getters, extraMutations = _d.mutations, extraActions = _d.actions;
    var defaultFilter = dashboardConfig.defaultFilter, defaultPage = dashboardConfig.defaultPage, defaultLimit = dashboardConfig.defaultLimit;
    var state = function () { return ({}); };
    var mutations = {};
    var actions = {
        init: function (_a) {
            var commit = _a.commit, dispatch = _a.dispatch;
            dispatch("Dashboard/fetch");
        },
    };
    var dashboardStore = buildDashboardStore({
        apis: apis,
        defaultFilter: defaultFilter,
        defaultPage: defaultPage,
        defaultLimit: defaultLimit,
    });
    var detailStore = buildDetailStore({
        appName: appName,
        apis: apis,
    });
    var createStore = buildCreateStore(tslib.__assign({ appName: appName,
        apis: apis,
        getEntityId: getEntityId }, createConfig));
    var updateStore = buildUpdateStore(tslib.__assign({ appName: appName,
        apis: apis }, updateConfig));
    var removeStore = buildRemoveStore({
        appName: appName,
        apis: apis,
    });
    var restoreStore = buildRestoreStore({
        appName: appName,
        apis: apis,
    });
    var purgeStore = buildPurgeStore({
        appName: appName,
        apis: apis,
    });
    var trashEmptyStore = buildTrashEmptyStore({
        appName: appName,
        apis: apis,
    });
    return {
        namespaced: true,
        state: function () { return (tslib.__assign(tslib.__assign({}, state()), extraState())); },
        getters: tslib.__assign({}, extraGetters),
        mutations: tslib.__assign(tslib.__assign({}, mutations), extraMutations),
        actions: tslib.__assign(tslib.__assign({}, actions), extraActions),
        modules: {
            Notification: notificationStore,
            Dashboard: dashboardStore,
            DetailPage: detailStore,
            CreatePage: createStore,
            UpdatePage: updateStore,
            ConfirmRemove: removeStore,
            ConfirmRestore: restoreStore,
            ConfirmPurge: purgeStore,
            ConfirmTrashEmpty: trashEmptyStore,
        },
    };
};

exports.buildCRUDStore = buildCRUDStore;
//# sourceMappingURL=index.js.map
